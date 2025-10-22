<script lang="ts">
	import { onMount } from 'svelte';
	import { vehicle } from '$lib/stores/vehicle';
	import { tenant } from '$lib/stores/tenant';
	import UsageChart from '$lib/components/charts/UsageChart.svelte';
	import { notification } from '$lib/stores/notification';

	interface ChargingStation {
		id: string;
		name: string;
		status: 'available' | 'occupied' | 'offline' | 'maintenance';
		power: number; // kW
		currentVehicle: string | null;
		batteryLevel: number;
		timeRemaining: number | null; // minutes
		totalSessions: number;
		totalEnergy: number; // kWh
	}

	// Mock charging stations
	const stations: ChargingStation[] = [
		{ id: 'CS-001', name: 'STATION A1', status: 'occupied', power: 7.2, currentVehicle: 'APGC00000005', batteryLevel: 67, timeRemaining: 45, totalSessions: 142, totalEnergy: 1024 },
		{ id: 'CS-002', name: 'STATION A2', status: 'occupied', power: 7.2, currentVehicle: 'APGC00000012', batteryLevel: 82, timeRemaining: 25, totalSessions: 138, totalEnergy: 994 },
		{ id: 'CS-003', name: 'STATION A3', status: 'available', power: 7.2, currentVehicle: null, batteryLevel: 0, timeRemaining: null, totalSessions: 156, totalEnergy: 1123 },
		{ id: 'CS-004', name: 'STATION A4', status: 'available', power: 7.2, currentVehicle: null, batteryLevel: 0, timeRemaining: null, totalSessions: 145, totalEnergy: 1045 },
		{ id: 'CS-005', name: 'STATION B1', status: 'occupied', power: 11, currentVehicle: 'APGC00000018', batteryLevel: 45, timeRemaining: 65, totalSessions: 98, totalEnergy: 856 },
		{ id: 'CS-006', name: 'STATION B2', status: 'offline', power: 11, currentVehicle: null, batteryLevel: 0, timeRemaining: null, totalSessions: 102, totalEnergy: 892 },
		{ id: 'CS-007', name: 'STATION C1', status: 'occupied', power: 22, currentVehicle: 'APGC00000021', batteryLevel: 91, timeRemaining: 8, totalSessions: 67, totalEnergy: 723 },
		{ id: 'CS-008', name: 'STATION C2', status: 'available', power: 22, currentVehicle: null, batteryLevel: 0, timeRemaining: null, totalSessions: 72, totalEnergy: 781 }
	];

	// Mock daily charging data
	const dailyChargingSessions = [
		{ label: '00', value: 2 },
		{ label: '02', value: 3 },
		{ label: '04', value: 1 },
		{ label: '06', value: 4 },
		{ label: '08', value: 2 },
		{ label: '10', value: 1 },
		{ label: '12', value: 3 },
		{ label: '14', value: 2 },
		{ label: '16', value: 4 },
		{ label: '18', value: 6 },
		{ label: '20', value: 5 },
		{ label: '22', value: 4 }
	];

	const energyUsage = [
		{ label: 'MON', value: 145 },
		{ label: 'TUE', value: 167 },
		{ label: 'WED', value: 152 },
		{ label: 'THU', value: 189 },
		{ label: 'FRI', value: 201 },
		{ label: 'SAT', value: 234 },
		{ label: 'SUN', value: 198 }
	];

	onMount(() => {
		if ($tenant.current) {
			vehicle.loadVehicles($tenant.current.id);
		}
	});

	$: chargingVehicles = Array.from($vehicle.vehicles.values()).filter(v => v.battery.isCharging);

	$: statistics = {
		total: stations.length,
		available: stations.filter(s => s.status === 'available').length,
		occupied: stations.filter(s => s.status === 'occupied').length,
		offline: stations.filter(s => s.status === 'offline').length,
		totalPower: stations.reduce((acc, s) => acc + s.power, 0),
		activePower: stations.filter(s => s.status === 'occupied').reduce((acc, s) => acc + s.power, 0)
	};

	function getStatusIndicator(status: string): string {
		switch (status) {
			case 'available': return '⬚';
			case 'occupied': return '■';
			case 'offline': return '✖';
			case 'maintenance': return '◆';
			default: return '?';
		}
	}

	function getBatteryBar(level: number): string {
		const filled = Math.floor(level / 10);
		const empty = 10 - filled;
		return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
	}

	function formatTime(minutes: number | null): string {
		if (minutes === null) return '-';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}H ${mins}M` : `${mins}M`;
	}

	function handleStationAction(stationId: string, action: 'start' | 'stop' | 'reset') {
		notification.info('STATION COMMAND', `${action.toUpperCase()} command sent to ${stationId}`);
	}
</script>

<div class="charging-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">CHARGING STATIONS</h1>
				<div class="page-meta">
					<span class="meta-item">{statistics.total} TOTAL STATIONS</span>
				</div>
			</div>
			<div class="header-stats">
				<div class="stat-item">
					<span class="stat-label">ACTIVE POWER:</span>
					<span class="stat-value">{statistics.activePower}KW</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">CAPACITY:</span>
					<span class="stat-value">{statistics.totalPower}KW</span>
				</div>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="stats-grid">
			<div class="stat-card available">
				<div class="stat-icon">⬚</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.available}</div>
					<div class="stat-label">AVAILABLE</div>
				</div>
			</div>

			<div class="stat-card occupied">
				<div class="stat-icon">■</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.occupied}</div>
					<div class="stat-label">CHARGING</div>
				</div>
			</div>

			<div class="stat-card offline">
				<div class="stat-icon">✖</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.offline}</div>
					<div class="stat-label">OFFLINE</div>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-content">
					<div class="stat-value">{Math.round((statistics.occupied / statistics.total) * 100)}%</div>
					<div class="stat-label">UTILIZATION</div>
				</div>
			</div>
		</div>

		<!-- Charging Stations Grid -->
		<div class="stations-section">
			<div class="section-header">
				<h2 class="section-title">STATIONS STATUS</h2>
			</div>

			<div class="stations-grid">
				{#each stations as station}
					<div
						class="station-card"
						class:available={station.status === 'available'}
						class:occupied={station.status === 'occupied'}
						class:offline={station.status === 'offline'}
					>
						<div class="card-header">
							<div class="header-left">
								<span class="status-icon">{getStatusIndicator(station.status)}</span>
								<div class="station-info">
									<div class="station-id">{station.id}</div>
									<div class="station-name">{station.name}</div>
								</div>
							</div>
							<div class="station-power">{station.power}KW</div>
						</div>

						<div class="card-body">
							<div class="status-badge">{station.status.toUpperCase()}</div>

							{#if station.currentVehicle}
								<div class="charging-info">
									<div class="info-row">
										<span class="info-label">VEHICLE:</span>
										<span class="info-value">{station.currentVehicle}</span>
									</div>

									<div class="battery-display">
										<div class="battery-bar">{getBatteryBar(station.batteryLevel)}</div>
										<div class="battery-level">{station.batteryLevel}%</div>
									</div>

									<div class="info-row">
										<span class="info-label">TIME REMAINING:</span>
										<span class="info-value">{formatTime(station.timeRemaining)}</span>
									</div>

									<div class="progress-bar">
										<div
											class="progress-fill"
											style="width: {station.batteryLevel}%"
										></div>
									</div>
								</div>
							{/if}

							<div class="stats-row">
								<div class="stat-item">
									<span class="stat-label">SESSIONS:</span>
									<span class="stat-value">{station.totalSessions}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">ENERGY:</span>
									<span class="stat-value">{station.totalEnergy}KWH</span>
								</div>
							</div>
						</div>

						<div class="card-actions">
							{#if station.status === 'occupied'}
								<button
									class="action-btn"
									on:click={() => handleStationAction(station.id, 'stop')}
								>
									STOP
								</button>
							{:else if station.status === 'offline'}
								<button
									class="action-btn"
									on:click={() => handleStationAction(station.id, 'reset')}
								>
									RESET
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Charts -->
		<div class="charts-section">
			<div class="chart-container">
				<UsageChart
					data={dailyChargingSessions}
					title="CHARGING SESSIONS TODAY"
					height={200}
					lineStyle="solid"
				/>
			</div>

			<div class="chart-container">
				<UsageChart
					data={energyUsage}
					title="WEEKLY ENERGY USAGE (KWH)"
					height={200}
					lineStyle="dashed"
				/>
			</div>
		</div>

		<!-- Currently Charging Vehicles -->
		<div class="vehicles-section">
			<div class="section-header">
				<h2 class="section-title">CURRENTLY CHARGING</h2>
				<span class="section-count">{chargingVehicles.length} VEHICLES</span>
			</div>

			<div class="vehicles-list">
				{#each chargingVehicles as v}
					<div class="vehicle-item">
						<div class="vehicle-vin">{v.vin}</div>
						<div class="vehicle-battery">
							<span class="battery-bar">{getBatteryBar(v.battery.level)}</span>
							<span class="battery-value">{v.battery.level}%</span>
						</div>
						<div class="vehicle-details">
							<span class="detail-item">RANGE: {v.battery.range}KM</span>
							<span class="detail-separator">|</span>
							<span class="detail-item">VOLTAGE: {v.battery.voltage.toFixed(1)}V</span>
							<span class="detail-separator">|</span>
							<span class="detail-item">TEMP: {v.battery.temperature.toFixed(0)}°C</span>
						</div>
					</div>
				{/each}

				{#if chargingVehicles.length === 0}
					<div class="no-vehicles">
						NO VEHICLES CURRENTLY CHARGING
					</div>
				{/if}
			</div>
		</div>
</div>

<style>
	.charging-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
	}

	/* Page Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-tight);
	}

	.page-meta {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.header-stats {
		display: flex;
		gap: var(--space-4);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.stat-value {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.stat-card.available {
		border-style: dashed;
	}

	.stat-card.occupied {
		border-width: var(--border-width-2);
	}

	.stat-card.offline {
		border-style: dotted;
	}

	.stat-icon {
		font-size: var(--text-xl);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	/* Stations Section */
	.stations-section {
		margin-bottom: var(--space-6);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.section-count {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		font-variant-numeric: tabular-nums;
	}

	.stations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-3);
	}

	.station-card {
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-3);
	}

	.station-card.available {
		border-style: dashed;
	}

	.station-card.occupied {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.station-card.offline {
		opacity: 0.6;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
		margin-bottom: var(--space-3);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.status-icon {
		font-size: 14px;
	}

	.station-id {
		font-family: monospace;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	.station-name {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.station-power {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-variant-numeric: tabular-nums;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.status-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-align: center;
	}

	.station-card.available .status-badge {
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
	}

	.charging-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.info-value {
		font-size: var(--text-xs);
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.battery-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-2);
		background: var(--color-gray-04);
	}

	.battery-bar {
		font-family: monospace;
		font-size: 11px;
		letter-spacing: -2px;
	}

	.battery-level {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		text-align: center;
	}

	.progress-bar {
		height: 4px;
		background: var(--color-gray-12);
		position: relative;
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--color-black);
		transition: width var(--duration-normal) var(--easing-linear);
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		padding-top: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.card-actions {
		display: flex;
		gap: var(--space-2);
		padding-top: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.action-btn {
		flex: 1;
		padding: var(--space-2);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.action-btn:hover {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* Charts Section */
	.charts-section {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	/* Vehicles Section */
	.vehicles-section {
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.vehicles-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.vehicle-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-08);
	}

	.vehicle-vin {
		font-family: monospace;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		min-width: 140px;
	}

	.vehicle-battery {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 180px;
	}

	.battery-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-variant-numeric: tabular-nums;
	}

	.vehicle-details {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
	}

	.detail-separator {
		color: var(--color-gray-20);
	}

	.no-vehicles {
		padding: var(--space-8);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}
</style>