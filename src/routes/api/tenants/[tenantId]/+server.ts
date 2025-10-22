import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock tenant data
const mockTenants = [
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

export const GET: RequestHandler = async ({ params }) => {
	const { tenantId } = params;

	// Find tenant by ID
	const tenant = mockTenants.find(t => t.id === tenantId);

	if (!tenant) {
		return json({ error: 'Tenant not found' }, { status: 404 });
	}

	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 100));

	return json(tenant);
};
