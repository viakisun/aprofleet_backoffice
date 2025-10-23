<script lang="ts">
	import { onMount } from 'svelte';
	import { vehicle, vehicleStatistics, type Vehicle } from '$lib/stores/vehicle';
	import { tenant } from '$lib/stores/tenant';
	import VehicleMap from '$lib/components/fleet/VehicleMap.svelte';
	import VehicleTable from '$lib/components/fleet/VehicleTable.svelte';
	import VehicleCard from '$lib/components/fleet/VehicleCard.svelte';

	let viewMode: 'map' | 'table' | 'split' = 'split';
	let selectedVehicle: Vehicle | null = null;
	let detailModalVehicle: Vehicle | null = null;
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
		detailModalVehicle = v;
	}

	function closeDetailModal() {
		detailModalVehicle = null;
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
						on:click={() => selectedVehicle && handleVehicleDetail(selectedVehicle)}
					>
						VIEW FULL DETAILS →
					</button>
				</div>
			</div>
		{/if}

		<!-- Vehicle Details Modal -->
		{#if detailModalVehicle}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="modal-overlay" on:click={closeDetailModal}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="modal-content" on:click|stopPropagation>
					<div class="modal-header">
						<h2 class="modal-title">VEHICLE DETAILS</h2>
						<button class="modal-close-btn" on:click={closeDetailModal}>✖</button>
					</div>
					<div class="modal-body">
						<div class="detail-section">
							<h3 class="detail-section-title">BASIC INFORMATION</h3>
							<div class="detail-grid">
								<div class="detail-item">
									<span class="detail-label">VIN</span>
									<span class="detail-value">{detailModalVehicle.vin}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Model</span>
									<span class="detail-value">{detailModalVehicle.model}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Status</span>
									<span class="detail-value status-{detailModalVehicle.status}">{detailModalVehicle.status.toUpperCase()}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Battery</span>
									<span class="detail-value">{detailModalVehicle.battery}%</span>
								</div>
							</div>
						</div>

						<div class="detail-section">
							<h3 class="detail-section-title">OPERATIONAL DATA</h3>
							<div class="detail-grid">
								<div class="detail-item">
									<span class="detail-label">Total Distance</span>
									<span class="detail-value">{detailModalVehicle.usage.totalDistance} km</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Total Runtime</span>
									<span class="detail-value">{detailModalVehicle.usage.totalHours} hrs</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Location</span>
									<span class="detail-value">
										Lat: {detailModalVehicle.location.latitude.toFixed(6)},
										Lng: {detailModalVehicle.location.longitude.toFixed(6)}
									</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Last Update</span>
									<span class="detail-value">{new Date(detailModalVehicle.location.timestamp).toLocaleString()}</span>
								</div>
							</div>
						</div>

						{#if detailModalVehicle.alerts && detailModalVehicle.alerts.length > 0}
							<div class="detail-section">
								<h3 class="detail-section-title">ALERTS</h3>
								<div class="alerts-list">
									{#each detailModalVehicle.alerts as alert}
										<div class="alert-item alert-{alert.type}">
											<span class="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
											<span class="alert-message">{alert.message}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
</div>

<style>
	.vehicles-page {
		padding: var(--space-6);
		max-width: var(--content-max-width);
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

	/* Vehicle Details Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.modal-content {
		background: var(--color-white);
		border: var(--border-width-2) solid var(--color-black);
		width: 90%;
		max-width: 800px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
		background: var(--color-black);
		color: var(--color-white);
	}

	.modal-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin: 0;
	}

	.modal-close-btn {
		width: 28px;
		height: 28px;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--color-white);
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background var(--duration-fast) var(--easing-linear);
	}

	.modal-close-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.modal-body {
		padding: var(--space-6);
	}

	.detail-section {
		margin-bottom: var(--space-6);
	}

	.detail-section:last-child {
		margin-bottom: 0;
	}

	.detail-section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-20);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.detail-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}

	.detail-value {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		font-variant-numeric: tabular-nums;
	}

	.detail-value.status-operating {
		color: var(--color-green);
	}

	.detail-value.status-charging {
		color: var(--color-blue);
	}

	.detail-value.status-warning {
		color: var(--color-yellow);
	}

	.detail-value.status-error {
		color: var(--color-red);
	}

	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.alert-item {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-left: var(--border-width-2) solid var(--color-black);
		background: var(--color-gray-04);
		font-size: var(--text-sm);
	}

	.alert-item.alert-warning {
		border-left-color: var(--color-yellow);
	}

	.alert-item.alert-error {
		border-left-color: var(--color-red);
	}

	.alert-time {
		color: var(--color-gray-40);
		min-width: 80px;
		font-variant-numeric: tabular-nums;
	}

	.alert-message {
		flex: 1;
	}
</style>