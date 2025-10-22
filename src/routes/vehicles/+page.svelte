<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { vehicle, vehicleStatistics, type Vehicle } from '$lib/stores/vehicle';
	import { tenant } from '$lib/stores/tenant';
	import VehicleMap from '$lib/components/fleet/VehicleMap.svelte';
	import VehicleTable from '$lib/components/fleet/VehicleTable.svelte';
	import VehicleCard from '$lib/components/fleet/VehicleCard.svelte';

	let viewMode: 'map' | 'table' | 'split' = 'split';
	let selectedVehicle: Vehicle | null = null;
	let filterStatus: 'all' | 'operating' | 'charging' | 'idle' | 'warning' | 'error' = 'all';

	onMount(() => {
		if ($tenant.current) {
			vehicle.loadVehicles($tenant.current.id);
			vehicle.connectWebSocket($tenant.current.id);
		}

		return () => {
			vehicle.disconnectWebSocket();
		};
	});

	function handleVehicleClick(v: Vehicle) {
		selectedVehicle = v;
		vehicle.selectVehicle(v.id);
	}

	function handleVehicleDetail(v: Vehicle) {
		goto(`/vehicles/${v.vin}`);
	}

	function refreshData() {
		if ($tenant.current) {
			vehicle.loadVehicles($tenant.current.id);
		}
	}

	$: filteredVehicles = filterStatus === 'all'
		? Array.from($vehicle.vehicles.values())
		: Array.from($vehicle.vehicles.values()).filter(v => v.status === filterStatus);
</script>

<div class="vehicles-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">VEHICLES</h1>
				<div class="page-meta">
					{#if $tenant.current}
						<span class="meta-item">{$tenant.current.name.toUpperCase()}</span>
						<span class="meta-item">|</span>
					{/if}
					<span class="meta-item">{filteredVehicles.length} VEHICLES</span>
				</div>
			</div>
			<div class="header-actions">
				<div class="view-switcher">
					<button
						class="view-button"
						class:active={viewMode === 'map'}
						on:click={() => viewMode = 'map'}
					>
						MAP
					</button>
					<button
						class="view-button"
						class:active={viewMode === 'split'}
						on:click={() => viewMode = 'split'}
					>
						SPLIT
					</button>
					<button
						class="view-button"
						class:active={viewMode === 'table'}
						on:click={() => viewMode === 'table'}
					>
						TABLE
					</button>
				</div>
				<button class="action-button" on:click={refreshData}>
					REFRESH
				</button>
			</div>
		</div>

		<!-- Quick Stats -->
		{#if $vehicleStatistics}
			<div class="quick-stats">
				<div class="stat-card">
					<span class="stat-icon">■</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.operating}</div>
						<div class="stat-label">OPERATING</div>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">▢</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.charging}</div>
						<div class="stat-label">CHARGING</div>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">⬚</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.idle}</div>
						<div class="stat-label">IDLE</div>
					</div>
				</div>
				<div class="stat-card warning">
					<span class="stat-icon">▲</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.warning}</div>
						<div class="stat-label">WARNING</div>
					</div>
				</div>
				<div class="stat-card error">
					<span class="stat-icon">✖</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.error}</div>
						<div class="stat-label">ERROR</div>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">◆</span>
					<div class="stat-content">
						<div class="stat-value">{$vehicleStatistics.maintenance}</div>
						<div class="stat-label">MAINTENANCE</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<div class="main-content" class:split={viewMode === 'split'}>
			{#if viewMode === 'map' || viewMode === 'split'}
				<div class="map-section">
					<div class="section-header">
						<h2 class="section-title">FLEET MAP</h2>
						<div class="section-meta">
							<select bind:value={filterStatus} class="filter-select">
								<option value="all">ALL STATUS</option>
								<option value="operating">OPERATING</option>
								<option value="charging">CHARGING</option>
								<option value="idle">IDLE</option>
								<option value="warning">WARNING</option>
								<option value="error">ERROR</option>
							</select>
						</div>
					</div>
					<VehicleMap
						selectedVehicle={selectedVehicle}
						height={viewMode === 'split' ? '400px' : '600px'}
						onVehicleClick={handleVehicleClick}
					/>
				</div>
			{/if}

			{#if viewMode === 'table' || viewMode === 'split'}
				<div class="table-section">
					<div class="section-header">
						<h2 class="section-title">FLEET DATA</h2>
					</div>
					<div class="table-container">
						<VehicleTable
							vehicles={filteredVehicles}
							onSelect={handleVehicleDetail}
						/>
					</div>
				</div>
			{/if}
		</div>

		<!-- Selected Vehicle Card -->
		{#if selectedVehicle}
			<div class="side-panel">
				<div class="panel-header">
					<h3 class="panel-title">VEHICLE DETAIL</h3>
					<button
						class="close-button"
						on:click={() => selectedVehicle = null}
					>
						✖
					</button>
				</div>
				<div class="panel-content">
					<VehicleCard vehicleData={selectedVehicle} />
					<button
						class="detail-button"
						on:click={() => handleVehicleDetail(selectedVehicle)}
					>
						VIEW FULL DETAILS →
					</button>
				</div>
			</div>
		{/if}
</div>

<style>
	.vehicles-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
		position: relative;
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
		gap: var(--space-3);
		align-items: center;
	}

	.view-switcher {
		display: flex;
		border: var(--border-width) solid var(--color-black);
	}

	.view-button {
		padding: var(--space-1) var(--space-3);
		background: var(--color-white);
		border: none;
		border-right: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.view-button:last-child {
		border-right: none;
	}

	.view-button.active {
		background: var(--color-black);
		color: var(--color-white);
	}

	.view-button:not(.active):hover {
		background: var(--color-gray-04);
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

	/* Quick Stats */
	.quick-stats {
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

	.stat-card.warning {
		border-style: dashed;
	}

	.stat-card.error {
		border-width: var(--border-width-2);
	}

	.stat-icon {
		font-size: var(--text-xl);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	/* Main Content */
	.main-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.main-content.split {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
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

	.section-meta {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.filter-select {
		height: 28px;
		padding: 0 var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.table-container {
		height: 500px;
		border: var(--border-width) solid var(--color-black);
	}

	/* Side Panel */
	.side-panel {
		position: fixed;
		top: var(--header-height);
		right: 0;
		width: 400px;
		height: calc(100vh - var(--header-height));
		background: var(--color-white);
		border-left: var(--border-width-2) solid var(--color-black);
		z-index: 30;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.panel-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.close-button {
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		font-size: 12px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		background: var(--color-gray-04);
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
	}

	.detail-button {
		width: 100%;
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-black);
		color: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.detail-button:hover {
		background: var(--color-white);
		color: var(--color-black);
	}
</style>