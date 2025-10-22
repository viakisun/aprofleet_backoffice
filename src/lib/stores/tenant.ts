import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface Tenant {
	id: string;
	name: string;
	subdomain: string;
	tier: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
	vehicleCount: number;
	activeVehicles: number;
	location: {
		latitude: number;
		longitude: number;
		address: string;
		city: string;
		state: string;
		country: string;
		postalCode: string;
	};
	settings: {
		operatingHours: {
			start: string;
			end: string;
		};
		maintenanceWindow: {
			day: string;
			time: string;
		};
		autoDispatch: boolean;
		chargingThreshold: number;
		speedLimit: number;
	};
	contract: {
		startDate: string;
		endDate: string;
		monthlyFee: number;
		status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
	};
	createdAt: string;
	updatedAt: string;
}

interface TenantState {
	current: Tenant | null;
	available: Tenant[];
	isLoading: boolean;
	error: string | null;
}

function createTenantStore() {
	const { subscribe, set, update } = writable<TenantState>({
		current: null,
		available: [],
		isLoading: false,
		error: null
	});

	// Load saved tenant from localStorage
	if (browser) {
		const savedTenantId = localStorage.getItem('selected_tenant');
		if (savedTenantId) {
			loadTenant(savedTenantId);
		}
	}

	async function loadAvailableTenants() {
		update(state => ({ ...state, isLoading: true, error: null }));

		// DEMO MODE - Mock tenants data
		const mockTenants: Tenant[] = [
			{
				id: 'tenant-001',
				name: 'Pine Valley Golf Club',
				subdomain: 'pinevalley',
				tier: 'ENTERPRISE',
				vehicleCount: 45,
				activeVehicles: 38,
				location: {
					latitude: 39.7837,
					longitude: -74.9669,
					address: '1 Clementon Rd',
					city: 'Pine Valley',
					state: 'NJ',
					country: 'USA',
					postalCode: '08021'
				},
				settings: {
					operatingHours: { start: '06:00', end: '20:00' },
					maintenanceWindow: { day: 'Tuesday', time: '03:00' },
					autoDispatch: true,
					chargingThreshold: 20,
					speedLimit: 25
				},
				contract: {
					startDate: '2023-01-01',
					endDate: '2025-12-31',
					monthlyFee: 12500,
					status: 'ACTIVE'
				},
				createdAt: '2023-01-01',
				updatedAt: '2024-01-15'
			},
			{
				id: 'tenant-002',
				name: 'Augusta National',
				subdomain: 'augusta',
				tier: 'ENTERPRISE',
				vehicleCount: 85,
				activeVehicles: 72,
				location: {
					latitude: 33.5031,
					longitude: -82.0203,
					address: '2604 Washington Rd',
					city: 'Augusta',
					state: 'GA',
					country: 'USA',
					postalCode: '30904'
				},
				settings: {
					operatingHours: { start: '07:00', end: '19:00' },
					maintenanceWindow: { day: 'Monday', time: '02:00' },
					autoDispatch: true,
					chargingThreshold: 25,
					speedLimit: 20
				},
				contract: {
					startDate: '2022-06-01',
					endDate: '2025-05-31',
					monthlyFee: 18500,
					status: 'ACTIVE'
				},
				createdAt: '2022-06-01',
				updatedAt: '2024-01-10'
			},
			{
				id: 'tenant-003',
				name: 'Pebble Beach',
				subdomain: 'pebblebeach',
				tier: 'PROFESSIONAL',
				vehicleCount: 35,
				activeVehicles: 28,
				location: {
					latitude: 36.5668,
					longitude: -121.9495,
					address: '1700 17 Mile Dr',
					city: 'Pebble Beach',
					state: 'CA',
					country: 'USA',
					postalCode: '93953'
				},
				settings: {
					operatingHours: { start: '06:30', end: '18:30' },
					maintenanceWindow: { day: 'Wednesday', time: '04:00' },
					autoDispatch: false,
					chargingThreshold: 15,
					speedLimit: 22
				},
				contract: {
					startDate: '2023-03-15',
					endDate: '2024-03-14',
					monthlyFee: 8500,
					status: 'ACTIVE'
				},
				createdAt: '2023-03-15',
				updatedAt: '2024-01-05'
			}
		];

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 300));

		update(state => ({
			...state,
			available: mockTenants,
			isLoading: false
		}));

		// Auto-select first tenant if none selected
		if (mockTenants.length > 0 && !get(tenant).current) {
			selectTenant(mockTenants[0].id);
		}
	}

	async function loadTenant(tenantId: string) {
		update(state => ({ ...state, isLoading: true, error: null }));

		try {
			const response = await fetch(`/api/tenants/${tenantId}`);
			if (response.ok) {
				const tenantData = await response.json();
				update(state => ({
					...state,
					current: tenantData,
					isLoading: false
				}));

				if (browser) {
					localStorage.setItem('selected_tenant', tenantId);
				}
			} else {
				throw new Error('Failed to load tenant');
			}
		} catch (error) {
			update(state => ({
				...state,
				isLoading: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			}));
		}
	}

	function selectTenant(tenantId: string) {
		const state = get(tenant);
		const selected = state.available.find(t => t.id === tenantId);

		if (selected) {
			update(s => ({ ...s, current: selected }));

			if (browser) {
				localStorage.setItem('selected_tenant', tenantId);
			}
		} else {
			loadTenant(tenantId);
		}
	}

	function clearTenant() {
		update(state => ({ ...state, current: null }));

		if (browser) {
			localStorage.removeItem('selected_tenant');
		}
	}

	async function updateTenantSettings(settings: Partial<Tenant['settings']>) {
		const state = get(tenant);
		if (!state.current) return;

		update(s => ({ ...s, isLoading: true, error: null }));

		try {
			const response = await fetch(`/api/tenants/${state.current.id}/settings`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(settings)
			});

			if (response.ok) {
				const updatedTenant = await response.json();
				update(s => ({
					...s,
					current: updatedTenant,
					isLoading: false
				}));
				return { success: true };
			} else {
				throw new Error('Failed to update settings');
			}
		} catch (error) {
			update(s => ({
				...s,
				isLoading: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			}));
			return { success: false, error };
		}
	}

	return {
		subscribe,
		loadAvailableTenants,
		selectTenant,
		clearTenant,
		updateTenantSettings
	};
}

export const tenant = createTenantStore();

// Derived store for tenant tier features
export const tenantFeatures = derived(
	tenant,
	$tenant => {
		if (!$tenant.current) return {
			maxVehicles: 0,
			hasAdvancedAnalytics: false,
			hasAPIAccess: false,
			hasPrioritySupport: false,
			hasCustomBranding: false
		};

		const tier = $tenant.current.tier;

		return {
			maxVehicles: tier === 'BASIC' ? 10 : tier === 'PROFESSIONAL' ? 50 : Infinity,
			hasAdvancedAnalytics: tier !== 'BASIC',
			hasAPIAccess: tier === 'ENTERPRISE',
			hasPrioritySupport: tier === 'ENTERPRISE',
			hasCustomBranding: tier === 'ENTERPRISE'
		};
	}
);

// Helper function to get store state
function get<T>(store: { subscribe: (run: (value: T) => void) => () => void }) {
	let value: T;
	store.subscribe(v => value = v)();
	return value;
}