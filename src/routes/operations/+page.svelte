<script lang="ts">
	import { onMount } from 'svelte';
	import { vehicle, vehicleStatistics } from '$lib/stores/vehicle';
	import { tenant } from '$lib/stores/tenant';
	import VehicleMap from '$lib/components/fleet/VehicleMap.svelte';
	import BatteryGrid from '$lib/components/charts/BatteryGrid.svelte';
	import UsageChart from '$lib/components/charts/UsageChart.svelte';

	// Mock data for charts
	const hourlyUsage = [
		{ label: '00', value: 2 },
		{ label: '02', value: 1 },
		{ label: '04', value: 0 },
		{ label: '06', value: 5 },
		{ label: '08', value: 12 },
		{ label: '10', value: 18 },
		{ label: '12', value: 15 },
		{ label: '14', value: 20 },
		{ label: '16', value: 16 },
		{ label: '18', value: 10 },
		{ label: '20', value: 6 },
		{ label: '22', value: 3 }
	];

	const weeklyDistance = [
		{ label: 'MON', value: 245 },
		{ label: 'TUE', value: 312 },
		{ label: 'WED', value: 289 },
		{ label: 'THU', value: 356 },
		{ label: 'FRI', value: 401 },
		{ label: 'SAT', value: 485 },
		{ label: 'SUN', value: 521 }
	];

	const monthlyRevenue = [
		{ label: 'W1', value: 8500 },
		{ label: 'W2', value: 9200 },
		{ label: 'W3', value: 11500 },
		{ label: 'W4', value: 10800 }
	];

	onMount(() => {
		if ($tenant.current) {
			vehicle.loadVehicles($tenant.current.id);
			vehicle.connectWebSocket($tenant.current.id);
		}

		return () => {
			vehicle.disconnectWebSocket();
		};
	});

	$: vehicleList = Array.from($vehicle.vehicles.values());

	// Real-time metrics
	$: liveMetrics = {
		activeTrips: vehicleList.filter(v => v.status === 'operating').length,
		totalDistance: vehicleList.reduce((acc, v) => acc + v.usage.distanceToday, 0),
		avgSpeed: vehicleList.filter(v => v.status === 'operating')
			.reduce((acc, v) => acc + v.location.speed, 0) /
			(vehicleList.filter(v => v.status === 'operating').length || 1),
		avgBattery: vehicleList.reduce((acc, v) => acc + v.battery.level, 0) / (vehicleList.length || 1)
	};

	// Weather mock
	const weather = {
		condition: 'CLEAR',
		temperature: 22,
		humidity: 65,
		windSpeed: 8
	};

	// Operating hours
	const operatingHours = {
		open: '06:00',
		close: '20:00',
		isOpen: true,
		hoursRemaining: 8
	};
</script>

<div class="operations-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">OPERATIONS</h1>
				<div class="page-meta">
					<span class="meta-item">{new Date().toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					}).toUpperCase()}</span>
				</div>
			</div>
			<div class="header-status">
				<div class="status-item" class:open={operatingHours.isOpen}>
					<span class="status-label">STATUS:</span>
					<span class="status-value">{operatingHours.isOpen ? 'OPEN' : 'CLOSED'}</span>
				</div>
				<div class="status-item">
					<span class="status-label">HOURS REMAINING:</span>
					<span class="status-value">{operatingHours.hoursRemaining}H</span>
				</div>
			</div>
		</div>

		<!-- Live Metrics -->
		<div class="metrics-row">
			<div class="metric-card highlight">
				<div class="metric-icon">■</div>
				<div class="metric-content">
					<div class="metric-value">{liveMetrics.activeTrips}</div>
					<div class="metric-label">ACTIVE TRIPS</div>
					<div class="metric-trend">
						{#if liveMetrics.activeTrips > 0}
							<span class="trend-indicator">▲</span>
							<span class="trend-text">LIVE</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-icon">◆</div>
				<div class="metric-content">
					<div class="metric-value">{liveMetrics.totalDistance.toFixed(1)}</div>
					<div class="metric-label">KM TODAY</div>
					<div class="metric-sub">
						TOTAL DISTANCE TRAVELED
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-icon">→</div>
				<div class="metric-content">
					<div class="metric-value">{liveMetrics.avgSpeed.toFixed(1)}</div>
					<div class="metric-label">AVG SPEED (KM/H)</div>
					<div class="metric-sub">
						ACTIVE VEHICLES ONLY
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-icon">▢</div>
				<div class="metric-content">
					<div class="metric-value">{liveMetrics.avgBattery.toFixed(0)}%</div>
					<div class="metric-label">AVG BATTERY</div>
					<div class="metric-sub">
						ACROSS ALL VEHICLES
					</div>
				</div>
			</div>

			<div class="metric-card weather">
				<div class="metric-content">
					<div class="weather-condition">{weather.condition}</div>
					<div class="weather-temp">{weather.temperature}°C</div>
					<div class="weather-details">
						HUMIDITY: {weather.humidity}% | WIND: {weather.windSpeed}KM/H
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Status Grid -->
		{#if $vehicleStatistics}
			<div class="status-grid">
				<div class="status-card">
					<div class="status-header">
						<span class="status-icon">■</span>
						<span class="status-title">OPERATING</span>
					</div>
					<div class="status-value">{$vehicleStatistics.operating}</div>
					<div class="status-bar">
						{('[' + '█'.repeat(Math.floor($vehicleStatistics.operating / ($vehicleStatistics.total / 10))) + '░'.repeat(10 - Math.floor($vehicleStatistics.operating / ($vehicleStatistics.total / 10))) + ']')}
					</div>
				</div>

				<div class="status-card">
					<div class="status-header">
						<span class="status-icon">▢</span>
						<span class="status-title">CHARGING</span>
					</div>
					<div class="status-value">{$vehicleStatistics.charging}</div>
					<div class="status-bar">
						{('[' + '█'.repeat(Math.floor($vehicleStatistics.charging / ($vehicleStatistics.total / 10))) + '░'.repeat(10 - Math.floor($vehicleStatistics.charging / ($vehicleStatistics.total / 10))) + ']')}
					</div>
				</div>

				<div class="status-card">
					<div class="status-header">
						<span class="status-icon">⬚</span>
						<span class="status-title">IDLE</span>
					</div>
					<div class="status-value">{$vehicleStatistics.idle}</div>
					<div class="status-bar">
						{('[' + '█'.repeat(Math.floor($vehicleStatistics.idle / ($vehicleStatistics.total / 10))) + '░'.repeat(10 - Math.floor($vehicleStatistics.idle / ($vehicleStatistics.total / 10))) + ']')}
					</div>
				</div>

				<div class="status-card alert">
					<div class="status-header">
						<span class="status-icon">▲</span>
						<span class="status-title">ALERTS</span>
					</div>
					<div class="status-value">{$vehicleStatistics.warning + $vehicleStatistics.error}</div>
					<div class="status-breakdown">
						{$vehicleStatistics.warning} WARNING | {$vehicleStatistics.error} ERROR
					</div>
				</div>
			</div>
		{/if}

		<!-- Main Dashboard Grid -->
		<div class="dashboard-grid">
			<!-- Fleet Map -->
			<div class="dashboard-section map-section">
				<div class="section-header">
					<h2 class="section-title">FLEET LOCATION</h2>
					<div class="section-meta">
						<span class="meta-icon">{$vehicle.connectionStatus === 'connected' ? '●' : '○'}</span>
						<span class="meta-text">LIVE</span>
					</div>
				</div>
				<VehicleMap height="400px" />
			</div>

			<!-- Charts Column -->
			<div class="dashboard-section charts-section">
				<div class="section-header">
					<h2 class="section-title">TODAY'S USAGE</h2>
				</div>
				<UsageChart
					data={hourlyUsage}
					title="HOURLY VEHICLE USAGE"
					height={200}
					lineStyle="solid"
				/>
			</div>
		</div>

		<!-- Bottom Charts Row -->
		<div class="charts-row">
			<div class="chart-container">
				<UsageChart
					data={weeklyDistance}
					title="WEEKLY DISTANCE (KM)"
					height={180}
					lineStyle="dashed"
				/>
			</div>

			<div class="chart-container">
				<UsageChart
					data={monthlyRevenue}
					title="MONTHLY REVENUE ($)"
					height={180}
					lineStyle="dotted"
				/>
			</div>
		</div>

		<!-- Battery Grid -->
		<div class="dashboard-section full-width">
			<BatteryGrid
				vehicles={vehicleList}
				columns={6}
			/>
		</div>
</div>

<style>
	.operations-page {
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
		border-bottom: var(--border-width-2) solid var(--color-black);
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

	.header-status {
		display: flex;
		gap: var(--space-4);
	}

	.status-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.status-item.open {
		border-color: var(--color-black);
		border-width: var(--border-width-2);
	}

	.status-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.status-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	/* Live Metrics */
	.metrics-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.metric-card {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.metric-card.highlight {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.metric-card.weather {
		background: var(--color-gray-04);
	}

	.metric-icon {
		font-size: var(--text-2xl);
		width: 32px;
		text-align: center;
	}

	.metric-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.metric-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.metric-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.metric-sub {
		font-size: var(--text-xs);
		color: var(--color-gray-20);
	}

	.metric-trend {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-top: var(--space-1);
	}

	.trend-indicator {
		font-size: 10px;
		animation: pulse 2s ease-in-out infinite;
	}

	.trend-text {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.weather-condition {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.weather-temp {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.weather-details {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	/* Status Grid */
	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.status-card {
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.status-card.alert {
		border-style: dashed;
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.status-icon {
		font-size: 14px;
	}

	.status-title {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.status-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-2);
	}

	.status-bar {
		font-family: monospace;
		font-size: 11px;
		letter-spacing: -2px;
	}

	.status-breakdown {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	/* Dashboard Grid */
	.dashboard-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.dashboard-section {
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		padding: var(--space-4);
	}

	.dashboard-section.full-width {
		grid-column: 1 / -1;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.section-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.section-meta {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.meta-icon {
		font-size: 8px;
	}

	.meta-text {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	/* Charts Row */
	.charts-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.chart-container {
		width: 100%;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
</style>