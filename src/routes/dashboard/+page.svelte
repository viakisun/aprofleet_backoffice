<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, isManufacturer, isTenantAdmin } from '$lib/stores/auth';
	import { tenant } from '$lib/stores/tenant';
	import { vehicle, vehicleStatistics } from '$lib/stores/vehicle';
	import VehicleTable from '$lib/components/fleet/VehicleTable.svelte';

	onMount(() => {
		// Load data based on user role
		if ($isManufacturer) {
			tenant.loadAvailableTenants();
		}

		if ($tenant.current) {
			vehicle.loadVehicles($tenant.current.id);
			vehicle.connectWebSocket($tenant.current.id);
		}

		return () => {
			vehicle.disconnectWebSocket();
		};
	});

	// Sample metrics data
	const metrics = {
		daily: {
			trips: 247,
			distance: 1842,
			revenue: 4925,
			efficiency: 87
		},
		weekly: {
			trips: 1523,
			distance: 11284,
			revenue: 30450,
			efficiency: 82
		}
	};

	function getProgressBar(value: number, max: number): string {
		const percentage = (value / max) * 10;
		const filled = Math.round(percentage);
		const empty = 10 - filled;
		return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
	}
</script>

<div class="dashboard">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">DASHBOARD</h1>
			<div class="page-meta">
				{#if $auth.user}
					<span class="meta-item">{$auth.user.role.toUpperCase()}</span>
				{/if}
				{#if $tenant.current}
					<span class="meta-item">|</span>
					<span class="meta-item">{$tenant.current.name.toUpperCase()}</span>
				{/if}
				<span class="meta-item">|</span>
				<span class="meta-item">{new Date().toLocaleDateString('en-US', {
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				}).toUpperCase()}</span>
			</div>
		</div>
		<div class="header-actions">
			<button class="action-button" on:click={() => vehicle.loadVehicles()}>
				REFRESH
			</button>
		</div>
	</div>

	<!-- Quick Stats -->
	{#if $vehicleStatistics}
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-header">
					<span class="stat-label">TOTAL VEHICLES</span>
					<span class="stat-icon">▢</span>
				</div>
				<div class="stat-value">{$vehicleStatistics.total}</div>
				<div class="stat-bar">
					{getProgressBar($vehicleStatistics.total, 100)}
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-header">
					<span class="stat-label">OPERATING</span>
					<span class="stat-icon">■</span>
				</div>
				<div class="stat-value">{$vehicleStatistics.operating}</div>
				<div class="stat-sub">
					{Math.round(($vehicleStatistics.operating / $vehicleStatistics.total) * 100)}% UTILIZATION
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-header">
					<span class="stat-label">CHARGING</span>
					<span class="stat-icon">▢</span>
				</div>
				<div class="stat-value">{$vehicleStatistics.charging}</div>
				<div class="stat-sub">
					AVG BATTERY: {Math.round($vehicleStatistics.avgBattery)}%
				</div>
			</div>

			<div class="stat-card warning">
				<div class="stat-header">
					<span class="stat-label">ALERTS</span>
					<span class="stat-icon">▲</span>
				</div>
				<div class="stat-value">{$vehicleStatistics.warning + $vehicleStatistics.error}</div>
				<div class="stat-sub">
					{$vehicleStatistics.warning} WARNINGS | {$vehicleStatistics.error} ERRORS
				</div>
			</div>
		</div>
	{/if}

	<!-- Metrics Grid -->
	<div class="metrics-section">
		<div class="section-header">
			<h2 class="section-title">PERFORMANCE METRICS</h2>
		</div>

		<div class="metrics-grid">
			<div class="metric-card">
				<div class="metric-period">TODAY</div>
				<div class="metric-rows">
					<div class="metric-row">
						<span class="metric-label">TRIPS</span>
						<span class="metric-value">{metrics.daily.trips}</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">DISTANCE</span>
						<span class="metric-value">{metrics.daily.distance} KM</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">REVENUE</span>
						<span class="metric-value">${metrics.daily.revenue}</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">EFFICIENCY</span>
						<span class="metric-value">{metrics.daily.efficiency}%</span>
					</div>
				</div>
			</div>

			<div class="metric-card">
				<div class="metric-period">THIS WEEK</div>
				<div class="metric-rows">
					<div class="metric-row">
						<span class="metric-label">TRIPS</span>
						<span class="metric-value">{metrics.weekly.trips}</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">DISTANCE</span>
						<span class="metric-value">{metrics.weekly.distance} KM</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">REVENUE</span>
						<span class="metric-value">${metrics.weekly.revenue}</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">EFFICIENCY</span>
						<span class="metric-value">{metrics.weekly.efficiency}%</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Vehicle Fleet Table -->
	<div class="table-section">
		<div class="section-header">
			<h2 class="section-title">FLEET STATUS</h2>
			<div class="section-actions">
				<span class="connection-status">
					{$vehicle.connectionStatus === 'connected' ? '●' : '○'}
					{$vehicle.connectionStatus.toUpperCase()}
				</span>
			</div>
		</div>

		<div class="table-container">
			<VehicleTable />
		</div>
	</div>
</div>

<style>
	.dashboard {
		padding: var(--space-6);
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.header-content {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-tight);
	}

	.page-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
	}

	.action-button {
		padding: var(--space-2) var(--space-4);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.action-button:hover {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.stat-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.stat-card.warning {
		border-width: var(--border-width-2);
		border-style: dashed;
	}

	.stat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.stat-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		color: var(--color-gray-40);
	}

	.stat-icon {
		font-size: var(--text-sm);
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-2);
	}

	.stat-sub {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.stat-bar {
		font-family: monospace;
		font-size: 10px;
		letter-spacing: -2px;
		margin-top: var(--space-2);
	}

	/* Metrics Section */
	.metrics-section {
		margin-bottom: var(--space-8);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.section-actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.metric-card {
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.metric-period {
		padding: var(--space-2) var(--space-3);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.metric-rows {
		padding: var(--space-3);
	}

	.metric-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: var(--border-width) solid var(--color-gray-08);
	}

	.metric-row:last-child {
		border-bottom: none;
	}

	.metric-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.metric-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-variant-numeric: tabular-nums;
	}

	/* Table Section */
	.table-section {
		margin-bottom: var(--space-8);
	}

	.table-container {
		height: 500px;
		border: var(--border-width) solid var(--color-black);
	}
</style>