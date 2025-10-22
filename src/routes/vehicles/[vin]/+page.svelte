<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { vehicle, type Vehicle } from '$lib/stores/vehicle';
	import { notification } from '$lib/stores/notification';
	import VehicleCard from '$lib/components/fleet/VehicleCard.svelte';
	import VehicleMap from '$lib/components/fleet/VehicleMap.svelte';

	$: vin = $page.params.vin;
	$: currentVehicle = Array.from($vehicle.vehicles.values()).find(v => v.vin === vin);

	let activeTab: 'overview' | 'location' | 'health' | 'history' | 'firmware' = 'overview';

	// Mock history data
	const tripHistory = [
		{ id: '1', date: '2024-10-22 14:30', distance: 12.5, duration: '45 min', startBattery: 85, endBattery: 72 },
		{ id: '2', date: '2024-10-22 12:15', distance: 8.3, duration: '30 min', startBattery: 92, endBattery: 85 },
		{ id: '3', date: '2024-10-22 09:45', distance: 15.2, duration: '55 min', startBattery: 100, endBattery: 92 }
	];

	const maintenanceHistory = [
		{ id: '1', date: '2024-10-15', type: 'Scheduled', description: 'Battery calibration', technician: 'John Smith', status: 'Completed' },
		{ id: '2', date: '2024-10-08', type: 'Repair', description: 'Brake pad replacement', technician: 'Jane Doe', status: 'Completed' },
		{ id: '3', date: '2024-09-28', type: 'Scheduled', description: 'General inspection', technician: 'Mike Johnson', status: 'Completed' }
	];

	async function sendCommand(command: string) {
		if (!currentVehicle) return;

		const result = await vehicle.sendCommand(currentVehicle.id, command);
		if (result.success) {
			notification.success('COMMAND SENT', `${command.toUpperCase()} sent to ${currentVehicle.vin}`);
		} else {
			notification.error('COMMAND FAILED', result.error);
		}
	}

	function goBack() {
		goto('/vehicles');
	}
</script>

<div class="vehicle-detail-page">
		{#if !currentVehicle}
			<div class="not-found">
				<div class="not-found-icon">✖</div>
				<div class="not-found-title">VEHICLE NOT FOUND</div>
				<div class="not-found-text">VIN: {vin}</div>
				<button class="back-button" on:click={goBack}>
					← BACK TO VEHICLES
				</button>
			</div>
		{:else}
			<!-- Page Header -->
			<div class="page-header">
				<button class="back-button" on:click={goBack}>
					← BACK
				</button>
				<div class="header-content">
					<h1 class="page-title">{currentVehicle.vin}</h1>
					<div class="page-meta">
						<span class="meta-item">{currentVehicle.model}</span>
						<span class="meta-item">|</span>
						<span class="meta-item">{currentVehicle.year}</span>
						<span class="meta-item">|</span>
						<span class="meta-item">{currentVehicle.status.toUpperCase()}</span>
					</div>
				</div>
				<div class="header-actions">
					<button class="action-btn" on:click={() => sendCommand('lock')}>
						LOCK
					</button>
					<button class="action-btn" on:click={() => sendCommand('unlock')}>
						UNLOCK
					</button>
					<button class="action-btn" on:click={() => sendCommand('honk')}>
						HONK
					</button>
				</div>
			</div>

			<!-- Tabs -->
			<div class="tabs">
				<button
					class="tab"
					class:active={activeTab === 'overview'}
					on:click={() => activeTab = 'overview'}
				>
					OVERVIEW
				</button>
				<button
					class="tab"
					class:active={activeTab === 'location'}
					on:click={() => activeTab = 'location'}
				>
					LOCATION
				</button>
				<button
					class="tab"
					class:active={activeTab === 'health'}
					on:click={() => activeTab = 'health'}
				>
					HEALTH
				</button>
				<button
					class="tab"
					class:active={activeTab === 'history'}
					on:click={() => activeTab = 'history'}
				>
					HISTORY
				</button>
				<button
					class="tab"
					class:active={activeTab === 'firmware'}
					on:click={() => activeTab = 'firmware'}
				>
					FIRMWARE
				</button>
			</div>

			<!-- Tab Content -->
			<div class="tab-content">
				{#if activeTab === 'overview'}
					<div class="overview-grid">
						<div class="overview-main">
							<VehicleCard vehicleData={currentVehicle} showActions={false} />
						</div>
						<div class="overview-sidebar">
							<div class="sidebar-section">
								<h3 class="sidebar-title">QUICK ACTIONS</h3>
								<div class="action-grid">
									<button class="quick-action" on:click={() => sendCommand('lock')}>
										<span class="action-icon">[L]</span>
										<span class="action-label">LOCK</span>
									</button>
									<button class="quick-action" on:click={() => sendCommand('unlock')}>
										<span class="action-icon">[U]</span>
										<span class="action-label">UNLOCK</span>
									</button>
									<button class="quick-action" on:click={() => sendCommand('honk')}>
										<span class="action-icon">[H]</span>
										<span class="action-label">HONK</span>
									</button>
									<button class="quick-action" on:click={() => sendCommand('flash')}>
										<span class="action-icon">[F]</span>
										<span class="action-label">FLASH</span>
									</button>
								</div>
							</div>

							<div class="sidebar-section">
								<h3 class="sidebar-title">MAINTENANCE</h3>
								<div class="maintenance-info">
									<div class="info-row">
										<span class="info-label">LAST SERVICE:</span>
										<span class="info-value">
											{new Date(currentVehicle.lastMaintenance).toLocaleDateString()}
										</span>
									</div>
									<div class="info-row">
										<span class="info-label">NEXT SERVICE:</span>
										<span class="info-value">
											{new Date(currentVehicle.nextMaintenance).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>

							<div class="sidebar-section">
								<h3 class="sidebar-title">FIRMWARE</h3>
								<div class="firmware-info">
									<div class="info-row">
										<span class="info-label">VERSION:</span>
										<span class="info-value">{currentVehicle.firmware.version}</span>
									</div>
									<div class="info-row">
										<span class="info-label">LAST UPDATE:</span>
										<span class="info-value">
											{new Date(currentVehicle.firmware.lastUpdate).toLocaleDateString()}
										</span>
									</div>
									{#if currentVehicle.firmware.pendingUpdate}
										<div class="update-notice">
											UPDATE AVAILABLE: {currentVehicle.firmware.pendingUpdate}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'location'}
					<div class="location-content">
						<VehicleMap
							selectedVehicle={currentVehicle}
							height="600px"
							onVehicleClick={null}
						/>
						<div class="location-details">
							<h3 class="details-title">LOCATION DETAILS</h3>
							<div class="details-grid">
								<div class="detail-item">
									<span class="detail-label">LATITUDE</span>
									<span class="detail-value">{currentVehicle.location.latitude.toFixed(6)}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">LONGITUDE</span>
									<span class="detail-value">{currentVehicle.location.longitude.toFixed(6)}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">SPEED</span>
									<span class="detail-value">{currentVehicle.location.speed} KM/H</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">HEADING</span>
									<span class="detail-value">{currentVehicle.location.heading}°</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">LAST UPDATE</span>
									<span class="detail-value">
										{new Date(currentVehicle.location.timestamp).toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'health'}
					<div class="health-content">
						<div class="health-grid">
							<div class="health-card">
								<div class="health-header">
									<h3 class="health-title">OVERALL HEALTH</h3>
									<span class="health-score">{currentVehicle.health.overall}%</span>
								</div>
								<div class="health-bar-large">
									{'█'.repeat(Math.floor(currentVehicle.health.overall / 10))}{'░'.repeat(10 - Math.floor(currentVehicle.health.overall / 10))}
								</div>
							</div>

							<div class="health-card">
								<h3 class="health-title">MOTOR</h3>
								<div class="health-detail">
									<div class="health-bar">
										{'█'.repeat(Math.floor(currentVehicle.health.motor / 10))}{'░'.repeat(10 - Math.floor(currentVehicle.health.motor / 10))}
									</div>
									<span class="health-value">{currentVehicle.health.motor}%</span>
								</div>
							</div>

							<div class="health-card">
								<h3 class="health-title">BATTERY</h3>
								<div class="health-detail">
									<div class="health-bar">
										{'█'.repeat(Math.floor(currentVehicle.health.battery / 10))}{'░'.repeat(10 - Math.floor(currentVehicle.health.battery / 10))}
									</div>
									<span class="health-value">{currentVehicle.health.battery}%</span>
								</div>
							</div>

							<div class="health-card">
								<h3 class="health-title">BRAKES</h3>
								<div class="health-detail">
									<div class="health-bar">
										{'█'.repeat(Math.floor(currentVehicle.health.brakes / 10))}{'░'.repeat(10 - Math.floor(currentVehicle.health.brakes / 10))}
									</div>
									<span class="health-value">{currentVehicle.health.brakes}%</span>
								</div>
							</div>

							<div class="health-card">
								<h3 class="health-title">TIRES</h3>
								<div class="health-detail">
									<div class="health-bar">
										{'█'.repeat(Math.floor(currentVehicle.health.tires / 10))}{'░'.repeat(10 - Math.floor(currentVehicle.health.tires / 10))}
									</div>
									<span class="health-value">{currentVehicle.health.tires}%</span>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'history'}
					<div class="history-content">
						<div class="history-section">
							<h3 class="history-title">TRIP HISTORY</h3>
							<table class="history-table">
								<thead>
									<tr>
										<th>DATE/TIME</th>
										<th>DISTANCE</th>
										<th>DURATION</th>
										<th>START BATTERY</th>
										<th>END BATTERY</th>
									</tr>
								</thead>
								<tbody>
									{#each tripHistory as trip}
										<tr>
											<td>{trip.date}</td>
											<td>{trip.distance} KM</td>
											<td>{trip.duration}</td>
											<td>{trip.startBattery}%</td>
											<td>{trip.endBattery}%</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<div class="history-section">
							<h3 class="history-title">MAINTENANCE HISTORY</h3>
							<table class="history-table">
								<thead>
									<tr>
										<th>DATE</th>
										<th>TYPE</th>
										<th>DESCRIPTION</th>
										<th>TECHNICIAN</th>
										<th>STATUS</th>
									</tr>
								</thead>
								<tbody>
									{#each maintenanceHistory as maintenance}
										<tr>
											<td>{maintenance.date}</td>
											<td>{maintenance.type}</td>
											<td>{maintenance.description}</td>
											<td>{maintenance.technician}</td>
											<td>{maintenance.status}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>

				{:else if activeTab === 'firmware'}
					<div class="firmware-content">
						<div class="firmware-card">
							<h3 class="firmware-title">CURRENT FIRMWARE</h3>
							<div class="firmware-info-large">
								<div class="firmware-version">
									VERSION {currentVehicle.firmware.version}
								</div>
								<div class="firmware-date">
									INSTALLED: {new Date(currentVehicle.firmware.lastUpdate).toLocaleDateString()}
								</div>
							</div>
						</div>

						{#if currentVehicle.firmware.pendingUpdate}
							<div class="firmware-card update">
								<h3 class="firmware-title">PENDING UPDATE</h3>
								<div class="update-info">
									<div class="update-version">
										VERSION {currentVehicle.firmware.pendingUpdate}
									</div>
									<button class="install-button">
										INSTALL UPDATE
									</button>
								</div>
							</div>
						{/if}

						<div class="firmware-card">
							<h3 class="firmware-title">UPDATE HISTORY</h3>
							<div class="update-history">
								<div class="update-item">
									<div class="update-item-version">v1.4.2</div>
									<div class="update-item-date">2024-10-15</div>
									<div class="update-item-status">INSTALLED</div>
								</div>
								<div class="update-item">
									<div class="update-item-version">v1.4.1</div>
									<div class="update-item-date">2024-09-28</div>
									<div class="update-item-status">INSTALLED</div>
								</div>
								<div class="update-item">
									<div class="update-item-version">v1.4.0</div>
									<div class="update-item-date">2024-09-10</div>
									<div class="update-item-status">INSTALLED</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
</div>

<style>
	.vehicle-detail-page {
		padding: var(--space-6);
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Not Found */
	.not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		gap: var(--space-4);
	}

	.not-found-icon {
		font-size: 48px;
	}

	.not-found-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.not-found-text {
		font-size: var(--text-base);
		color: var(--color-gray-40);
		font-family: monospace;
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

	.back-button {
		padding: var(--space-2) var(--space-4);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.back-button:hover {
		border-color: var(--color-black);
		background: var(--color-gray-04);
	}

	.header-content {
		flex: 1;
		margin-left: var(--space-4);
	}

	.page-title {
		font-size: var(--text-3xl);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-tight);
		font-family: monospace;
	}

	.page-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-top: var(--space-2);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
	}

	.action-btn {
		padding: var(--space-2) var(--space-4);
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

	/* Tabs */
	.tabs {
		display: flex;
		border-bottom: var(--border-width) solid var(--color-black);
		margin-bottom: var(--space-6);
	}

	.tab {
		padding: var(--space-3) var(--space-6);
		background: transparent;
		border: none;
		border-bottom: var(--border-width-2) solid transparent;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
		margin-bottom: -1px;
	}

	.tab:hover {
		background: var(--color-gray-04);
	}

	.tab.active {
		background: var(--color-white);
		border-bottom-color: var(--color-black);
	}

	/* Tab Content */
	.tab-content {
		min-height: 500px;
	}

	/* Overview Grid */
	.overview-grid {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: var(--space-6);
	}

	.overview-sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.sidebar-section {
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.sidebar-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.quick-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.quick-action:hover {
		background: var(--color-black);
		color: var(--color-white);
		border-color: var(--color-black);
	}

	.action-icon {
		font-family: monospace;
		font-size: var(--text-lg);
	}

	.action-label {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
	}

	.maintenance-info,
	.firmware-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-08);
	}

	.info-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.info-value {
		font-size: var(--text-sm);
		font-family: monospace;
	}

	.update-notice {
		margin-top: var(--space-2);
		padding: var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		text-align: center;
		letter-spacing: var(--tracking-wider);
	}

	/* Location Content */
	.location-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.location-details {
		border: var(--border-width) solid var(--color-black);
		padding: var(--space-4);
	}

	.details-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.detail-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.detail-value {
		font-size: var(--text-base);
		font-family: monospace;
		font-variant-numeric: tabular-nums;
	}

	/* Health Content */
	.health-content {
		padding: var(--space-4);
	}

	.health-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-4);
	}

	.health-card {
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.health-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.health-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.health-score {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.health-bar-large {
		font-family: monospace;
		font-size: 20px;
		letter-spacing: -2px;
	}

	.health-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.health-bar {
		flex: 1;
		font-family: monospace;
		font-size: 14px;
		letter-spacing: -1px;
	}

	.health-value {
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}

	/* History Content */
	.history-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.history-section {
		border: var(--border-width) solid var(--color-black);
		padding: var(--space-4);
	}

	.history-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.history-table {
		width: 100%;
		border-collapse: collapse;
	}

	.history-table thead {
		background: var(--color-gray-04);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.history-table th {
		padding: var(--space-2);
		text-align: left;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.history-table td {
		padding: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-08);
		font-size: var(--text-sm);
	}

	.history-table tbody tr:hover {
		background: var(--color-gray-04);
	}

	/* Firmware Content */
	.firmware-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.firmware-card {
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.firmware-card.update {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.firmware-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.firmware-info-large {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.firmware-version {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.firmware-date {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.update-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.update-version {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.install-button {
		padding: var(--space-3) var(--space-6);
		background: var(--color-black);
		color: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.install-button:hover {
		background: var(--color-white);
		color: var(--color-black);
	}

	.update-history {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.update-item {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-08);
	}

	.update-item-version {
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.update-item-date {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.update-item-status {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-align: right;
	}
</style>