import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type VehicleStatus = 'operating' | 'charging' | 'idle' | 'warning' | 'error' | 'maintenance';

export interface VehicleLocation {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
	timestamp: string;
}

export interface Vehicle {
	id: string;
	vin: string;
	model: string;
	year: number;
	status: VehicleStatus;
	location: VehicleLocation;
	battery: {
		level: number;
		range: number;
		isCharging: boolean;
		timeToFull?: number;
		voltage: number;
		temperature: number;
	};
	health: {
		overall: number;
		motor: number;
		battery: number;
		brakes: number;
		tires: number;
	};
	usage: {
		totalDistance: number;
		totalHours: number;
		tripsToday: number;
		distanceToday: number;
	};
	reservation: {
		id?: string;
		customerId?: string;
		startTime?: string;
		endTime?: string;
		status?: 'scheduled' | 'active' | 'completed';
	} | null;
	lastMaintenance: string;
	nextMaintenance: string;
	firmware: {
		version: string;
		lastUpdate: string;
		pendingUpdate?: string;
	};
	alerts: Array<{
		id: string;
		type: 'warning' | 'error' | 'info';
		message: string;
		timestamp: string;
		acknowledged: boolean;
	}>;
}

interface VehicleState {
	vehicles: Map<string, Vehicle>;
	selected: Vehicle | null;
	isLoading: boolean;
	error: string | null;
	lastUpdate: string | null;
	wsConnection: WebSocket | null;
	connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

function createVehicleStore() {
	const { subscribe, set, update } = writable<VehicleState>({
		vehicles: new Map(),
		selected: null,
		isLoading: false,
		error: null,
		lastUpdate: null,
		wsConnection: null,
		connectionStatus: 'disconnected'
	});

	let reconnectTimer: NodeJS.Timeout | null = null;
	let pingInterval: NodeJS.Timeout | null = null;

	async function loadVehicles(tenantId?: string) {
		update(state => ({ ...state, isLoading: true, error: null }));

		// DEMO MODE - Generate mock vehicles
		const statuses: VehicleStatus[] = ['operating', 'charging', 'idle', 'warning', 'error', 'maintenance'];
		const models = ['AP-2024', 'AP-2023', 'AP-2022 Pro', 'AP-2024 Elite'];

		const mockVehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => ({
			id: `vehicle-${i + 1}`,
			vin: `APGC${String(i + 1).padStart(8, '0')}`,
			model: models[Math.floor(Math.random() * models.length)],
			year: 2022 + Math.floor(Math.random() * 3),
			status: statuses[Math.floor(Math.random() * statuses.length)],
			location: {
				latitude: 39.7837 + (Math.random() - 0.5) * 0.01,
				longitude: -74.9669 + (Math.random() - 0.5) * 0.01,
				heading: Math.floor(Math.random() * 360),
				speed: Math.floor(Math.random() * 25),
				timestamp: new Date().toISOString()
			},
			battery: {
				level: Math.floor(Math.random() * 100),
				range: Math.floor(Math.random() * 50) + 10,
				isCharging: Math.random() > 0.8,
				timeToFull: Math.floor(Math.random() * 120),
				voltage: 48 + Math.random() * 4,
				temperature: 20 + Math.random() * 15
			},
			health: {
				overall: Math.floor(Math.random() * 20) + 80,
				motor: Math.floor(Math.random() * 20) + 80,
				battery: Math.floor(Math.random() * 20) + 80,
				brakes: Math.floor(Math.random() * 20) + 80,
				tires: Math.floor(Math.random() * 20) + 80
			},
			usage: {
				totalDistance: Math.floor(Math.random() * 10000) + 1000,
				totalHours: Math.floor(Math.random() * 2000) + 100,
				tripsToday: Math.floor(Math.random() * 15),
				distanceToday: Math.floor(Math.random() * 100)
			},
			reservation: Math.random() > 0.7 ? {
				id: `res-${Math.random().toString(36).substr(2, 9)}`,
				customerId: `cust-${Math.random().toString(36).substr(2, 9)}`,
				startTime: new Date().toISOString(),
				endTime: new Date(Date.now() + 3600000).toISOString(),
				status: 'active' as const
			} : null,
			lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
			nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
			firmware: {
				version: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
				lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
				pendingUpdate: Math.random() > 0.8 ? '1.5.0' : undefined
			},
			alerts: []
		}));

		// Add some alerts to random vehicles
		mockVehicles.forEach(vehicle => {
			if (vehicle.status === 'warning' || vehicle.status === 'error') {
				vehicle.alerts = [{
					id: `alert-${Math.random().toString(36).substr(2, 9)}`,
					type: vehicle.status === 'error' ? 'error' : 'warning',
					message: vehicle.status === 'error' ? 'Critical battery fault detected' : 'Low tire pressure',
					timestamp: new Date().toISOString(),
					acknowledged: false
				}];
			}
		});

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 500));

		const vehicleMap = new Map<string, Vehicle>();
		mockVehicles.forEach(vehicle => {
			vehicleMap.set(vehicle.id, vehicle);
		});

		update(state => ({
			...state,
			vehicles: vehicleMap,
			isLoading: false,
			lastUpdate: new Date().toISOString()
		}));
	}

	function connectWebSocket(tenantId: string) {
		if (!browser) return;

		// DEMO MODE - Simulate WebSocket connection
		// In production, replace with real WebSocket connection

		update(state => ({ ...state, connectionStatus: 'connecting' }));

		// Simulate connection delay
		setTimeout(() => {
			update(state => ({ ...state, connectionStatus: 'connected' }));

			// Simulate periodic updates to random vehicles
			setInterval(() => {
				const state = get(vehicle);
				const vehicleIds = Array.from(state.vehicles.keys());
				if (vehicleIds.length > 0) {
					const randomId = vehicleIds[Math.floor(Math.random() * vehicleIds.length)];
					const randomVehicle = state.vehicles.get(randomId);
					if (randomVehicle) {
						// Update location
						randomVehicle.location = {
							...randomVehicle.location,
							speed: Math.floor(Math.random() * 25),
							heading: Math.floor(Math.random() * 360),
							timestamp: new Date().toISOString()
						};
						// Update battery
						if (randomVehicle.battery.isCharging) {
							randomVehicle.battery.level = Math.min(100, randomVehicle.battery.level + 1);
						} else if (randomVehicle.status === 'operating') {
							randomVehicle.battery.level = Math.max(0, randomVehicle.battery.level - 1);
						}
						updateVehicle(randomVehicle);
					}
				}
			}, 5000);
		}, 1000);

		return;

		// Original WebSocket code (disabled for demo)
		/*
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws/vehicles?tenantId=${tenantId}`);

		*/
	}

	function disconnectWebSocket() {
		const state = get(vehicle);

		if (state.wsConnection) {
			state.wsConnection.close();
		}

		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}

		if (pingInterval) {
			clearInterval(pingInterval);
			pingInterval = null;
		}

		update(s => ({
			...s,
			wsConnection: null,
			connectionStatus: 'disconnected'
		}));
	}

	function handleWebSocketMessage(data: any) {
		switch (data.type) {
			case 'vehicle_update':
				updateVehicle(data.vehicle);
				break;
			case 'location_update':
				updateVehicleLocation(data.vehicleId, data.location);
				break;
			case 'status_update':
				updateVehicleStatus(data.vehicleId, data.status);
				break;
			case 'battery_update':
				updateVehicleBattery(data.vehicleId, data.battery);
				break;
			case 'alert':
				addVehicleAlert(data.vehicleId, data.alert);
				break;
			case 'bulk_update':
				data.vehicles.forEach((v: Vehicle) => updateVehicle(v));
				break;
		}

		// Update last update timestamp
		update(state => ({
			...state,
			lastUpdate: new Date().toISOString()
		}));
	}

	function updateVehicle(vehicleData: Vehicle) {
		update(state => {
			const vehicles = new Map(state.vehicles);
			vehicles.set(vehicleData.id, vehicleData);

			// Update selected if it's the same vehicle
			const selected = state.selected?.id === vehicleData.id ? vehicleData : state.selected;

			return { ...state, vehicles, selected };
		});
	}

	function updateVehicleLocation(vehicleId: string, location: VehicleLocation) {
		update(state => {
			const vehicles = new Map(state.vehicles);
			const vehicle = vehicles.get(vehicleId);

			if (vehicle) {
				vehicle.location = location;
				vehicles.set(vehicleId, vehicle);

				// Update selected if it's the same vehicle
				const selected = state.selected?.id === vehicleId ? vehicle : state.selected;

				return { ...state, vehicles, selected };
			}

			return state;
		});
	}

	function updateVehicleStatus(vehicleId: string, status: VehicleStatus) {
		update(state => {
			const vehicles = new Map(state.vehicles);
			const vehicle = vehicles.get(vehicleId);

			if (vehicle) {
				vehicle.status = status;
				vehicles.set(vehicleId, vehicle);

				// Update selected if it's the same vehicle
				const selected = state.selected?.id === vehicleId ? vehicle : state.selected;

				return { ...state, vehicles, selected };
			}

			return state;
		});
	}

	function updateVehicleBattery(vehicleId: string, battery: Vehicle['battery']) {
		update(state => {
			const vehicles = new Map(state.vehicles);
			const vehicle = vehicles.get(vehicleId);

			if (vehicle) {
				vehicle.battery = battery;
				vehicles.set(vehicleId, vehicle);

				// Update selected if it's the same vehicle
				const selected = state.selected?.id === vehicleId ? vehicle : state.selected;

				return { ...state, vehicles, selected };
			}

			return state;
		});
	}

	function addVehicleAlert(vehicleId: string, alert: Vehicle['alerts'][0]) {
		update(state => {
			const vehicles = new Map(state.vehicles);
			const vehicle = vehicles.get(vehicleId);

			if (vehicle) {
				vehicle.alerts = [alert, ...vehicle.alerts].slice(0, 10); // Keep last 10 alerts
				vehicles.set(vehicleId, vehicle);

				// Update selected if it's the same vehicle
				const selected = state.selected?.id === vehicleId ? vehicle : state.selected;

				return { ...state, vehicles, selected };
			}

			return state;
		});
	}

	function selectVehicle(vehicleId: string | null) {
		update(state => {
			const selected = vehicleId ? state.vehicles.get(vehicleId) || null : null;
			return { ...state, selected };
		});
	}

	async function sendCommand(vehicleId: string, command: string, params?: any) {
		const state = get(vehicle);

		if (state.wsConnection && state.wsConnection.readyState === WebSocket.OPEN) {
			state.wsConnection.send(JSON.stringify({
				type: 'command',
				vehicleId,
				command,
				params
			}));
			return { success: true };
		} else {
			// Fallback to HTTP
			try {
				const response = await fetch(`/api/vehicles/${vehicleId}/command`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ command, params })
				});

				if (response.ok) {
					return { success: true };
				} else {
					const error = await response.json();
					return { success: false, error: error.message };
				}
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				};
			}
		}
	}

	return {
		subscribe,
		loadVehicles,
		connectWebSocket,
		disconnectWebSocket,
		selectVehicle,
		sendCommand
	};
}

export const vehicle = createVehicleStore();

// Derived stores for filtering and statistics
export const vehiclesByStatus = derived(
	vehicle,
	$vehicle => {
		const statusMap = new Map<VehicleStatus, Vehicle[]>();

		$vehicle.vehicles.forEach(v => {
			const status = v.status;
			if (!statusMap.has(status)) {
				statusMap.set(status, []);
			}
			statusMap.get(status)!.push(v);
		});

		return statusMap;
	}
);

export const vehicleStatistics = derived(
	vehicle,
	$vehicle => {
		const vehicles = Array.from($vehicle.vehicles.values());

		return {
			total: vehicles.length,
			operating: vehicles.filter(v => v.status === 'operating').length,
			charging: vehicles.filter(v => v.status === 'charging').length,
			idle: vehicles.filter(v => v.status === 'idle').length,
			warning: vehicles.filter(v => v.status === 'warning').length,
			error: vehicles.filter(v => v.status === 'error').length,
			maintenance: vehicles.filter(v => v.status === 'maintenance').length,
			avgBattery: vehicles.reduce((acc, v) => acc + v.battery.level, 0) / vehicles.length || 0,
			lowBattery: vehicles.filter(v => v.battery.level < 20).length,
			activeReservations: vehicles.filter(v => v.reservation?.status === 'active').length
		};
	}
);

// Helper function to get store state
function get<T>(store: { subscribe: (run: (value: T) => void) => () => void }) {
	let value: T;
	store.subscribe(v => value = v)();
	return value;
}