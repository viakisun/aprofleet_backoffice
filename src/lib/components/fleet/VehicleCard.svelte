<script lang="ts">
	import { vehicle, type Vehicle, type VehicleStatus } from '$lib/stores/vehicle';
	import { notification } from '$lib/stores/notification';

	export let vehicleData: Vehicle;
	export let compact = false;
	export let showActions = true;

	function getStatusIndicator(status: VehicleStatus): string {
		switch (status) {
			case 'operating': return '■';
			case 'charging': return '▢';
			case 'idle': return '⬚';
			case 'warning': return '▲';
			case 'error': return '✖';
			case 'maintenance': return '[MAINT]';
			default: return '?';
		}
	}

	function getBatteryBar(level: number): string {
		const filled = Math.floor(level / 10);
		const empty = 10 - filled;
		return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
	}

	function getHealthBar(level: number): string {
		const filled = Math.floor(level / 10);
		const empty = 10 - filled;
		return '█'.repeat(filled) + '░'.repeat(empty);
	}

	async function sendCommand(command: string) {
		const result = await vehicle.sendCommand(vehicleData.id, command);
		if (result.success) {
			notification.success(`COMMAND SENT`, `${command.toUpperCase()} sent to ${vehicleData.vin}`);
		} else {
			notification.error(`COMMAND FAILED`, result.error);
		}
	}

	$: isLowBattery = vehicleData.battery.level < 20;
	$: hasAlerts = vehicleData.alerts && vehicleData.alerts.length > 0;
</script>

<div class="vehicle-card" class:compact class:error={vehicleData.status === 'error'} class:warning={vehicleData.status === 'warning'}>
	<!-- Header -->
	<div class="card-header">
		<div class="header-left">
			<span class="status-indicator">{getStatusIndicator(vehicleData.status)}</span>
			<div class="header-info">
				<div class="vehicle-vin">{vehicleData.vin}</div>
				<div class="vehicle-model">{vehicleData.model} ({vehicleData.year})</div>
			</div>
		</div>
		<div class="header-right">
			<span class="status-badge">{vehicleData.status.toUpperCase()}</span>
		</div>
	</div>

	{#if !compact}
		<!-- Battery Section -->
		<div class="card-section">
			<div class="section-label">BATTERY</div>
			<div class="battery-display" class:low={isLowBattery}>
				<div class="battery-bar">{getBatteryBar(vehicleData.battery.level)}</div>
				<div class="battery-value">{vehicleData.battery.level}%</div>
			</div>
			<div class="battery-details">
				<div class="detail-item">
					<span class="detail-label">RANGE:</span>
					<span class="detail-value">{vehicleData.battery.range} KM</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">VOLTAGE:</span>
					<span class="detail-value">{vehicleData.battery.voltage.toFixed(1)} V</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">TEMP:</span>
					<span class="detail-value">{vehicleData.battery.temperature.toFixed(1)} °C</span>
				</div>
			</div>
		</div>

		<!-- Location & Speed -->
		<div class="card-section">
			<div class="section-label">LOCATION & SPEED</div>
			<div class="location-grid">
				<div class="location-item">
					<span class="location-label">LAT:</span>
					<span class="location-value">{vehicleData.location.latitude.toFixed(6)}</span>
				</div>
				<div class="location-item">
					<span class="location-label">LNG:</span>
					<span class="location-value">{vehicleData.location.longitude.toFixed(6)}</span>
				</div>
				<div class="location-item">
					<span class="location-label">SPEED:</span>
					<span class="location-value">{vehicleData.location.speed} KM/H</span>
				</div>
				<div class="location-item">
					<span class="location-label">HEADING:</span>
					<span class="location-value">{vehicleData.location.heading}°</span>
				</div>
			</div>
		</div>

		<!-- Health -->
		<div class="card-section">
			<div class="section-label">SYSTEM HEALTH</div>
			<div class="health-grid">
				<div class="health-item">
					<span class="health-label">MOTOR</span>
					<span class="health-bar">{getHealthBar(vehicleData.health.motor)}</span>
					<span class="health-value">{vehicleData.health.motor}%</span>
				</div>
				<div class="health-item">
					<span class="health-label">BATTERY</span>
					<span class="health-bar">{getHealthBar(vehicleData.health.battery)}</span>
					<span class="health-value">{vehicleData.health.battery}%</span>
				</div>
				<div class="health-item">
					<span class="health-label">BRAKES</span>
					<span class="health-bar">{getHealthBar(vehicleData.health.brakes)}</span>
					<span class="health-value">{vehicleData.health.brakes}%</span>
				</div>
				<div class="health-item">
					<span class="health-label">TIRES</span>
					<span class="health-bar">{getHealthBar(vehicleData.health.tires)}</span>
					<span class="health-value">{vehicleData.health.tires}%</span>
				</div>
			</div>
		</div>

		<!-- Usage Stats -->
		<div class="card-section">
			<div class="section-label">USAGE STATISTICS</div>
			<div class="usage-grid">
				<div class="usage-item">
					<span class="usage-value">{vehicleData.usage.totalDistance.toLocaleString()}</span>
					<span class="usage-label">TOTAL KM</span>
				</div>
				<div class="usage-item">
					<span class="usage-value">{vehicleData.usage.totalHours.toLocaleString()}</span>
					<span class="usage-label">TOTAL HOURS</span>
				</div>
				<div class="usage-item">
					<span class="usage-value">{vehicleData.usage.tripsToday}</span>
					<span class="usage-label">TRIPS TODAY</span>
				</div>
				<div class="usage-item">
					<span class="usage-value">{vehicleData.usage.distanceToday}</span>
					<span class="usage-label">KM TODAY</span>
				</div>
			</div>
		</div>

		<!-- Alerts -->
		{#if hasAlerts}
			<div class="card-section alerts">
				<div class="section-label">ALERTS</div>
				<div class="alerts-list">
					{#each vehicleData.alerts as alert}
						<div class="alert-item" class:error={alert.type === 'error'}>
							<span class="alert-icon">{alert.type === 'error' ? '✖' : '▲'}</span>
							<span class="alert-message">{alert.message}</span>
							<span class="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Actions -->
		{#if showActions}
			<div class="card-actions">
				<button class="action-btn" on:click={() => sendCommand('lock')}>
					[LOCK]
				</button>
				<button class="action-btn" on:click={() => sendCommand('unlock')}>
					[UNLOCK]
				</button>
				<button class="action-btn" on:click={() => sendCommand('honk')}>
					[HONK]
				</button>
				<button class="action-btn" on:click={() => sendCommand('flash')}>
					[FLASH]
				</button>
			</div>
		{/if}
	{:else}
		<!-- Compact View -->
		<div class="compact-content">
			<div class="compact-stat">
				<span class="compact-label">BATTERY:</span>
				<span class="compact-value">{vehicleData.battery.level}%</span>
			</div>
			<div class="compact-stat">
				<span class="compact-label">SPEED:</span>
				<span class="compact-value">{vehicleData.location.speed} KM/H</span>
			</div>
			<div class="compact-stat">
				<span class="compact-label">HEALTH:</span>
				<span class="compact-value">{vehicleData.health.overall}%</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.vehicle-card {
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.vehicle-card.error {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.vehicle-card.warning {
		border-style: dashed;
	}

	.vehicle-card.compact {
		padding: var(--space-3);
	}

	/* Header */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--color-gray-12);
		margin-bottom: var(--space-3);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.status-indicator {
		font-size: var(--text-lg);
	}

	.vehicle-vin {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.vehicle-model {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.status-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
	}

	.vehicle-card.warning .status-badge {
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
	}

	/* Sections */
	.card-section {
		margin-bottom: var(--space-4);
	}

	.card-section:last-of-type {
		margin-bottom: 0;
	}

	.section-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		color: var(--color-gray-40);
		margin-bottom: var(--space-2);
	}

	/* Battery */
	.battery-display {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}

	.battery-display.low {
		color: var(--color-black);
	}

	.battery-bar {
		font-family: monospace;
		font-size: 14px;
		letter-spacing: -2px;
	}

	.battery-value {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.battery-details {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-2);
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
	}

	.detail-value {
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
	}

	/* Location */
	.location-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}

	.location-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-1);
		border: var(--border-width) solid var(--color-gray-08);
	}

	.location-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.location-value {
		font-size: var(--text-xs);
		font-family: monospace;
		font-variant-numeric: tabular-nums;
	}

	/* Health */
	.health-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.health-item {
		display: grid;
		grid-template-columns: 60px 1fr 40px;
		gap: var(--space-2);
		align-items: center;
	}

	.health-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.health-bar {
		font-family: monospace;
		font-size: 12px;
		letter-spacing: -1px;
	}

	.health-value {
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	/* Usage */
	.usage-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3);
	}

	.usage-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		text-align: center;
	}

	.usage-value {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.usage-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	/* Alerts */
	.card-section.alerts {
		border: var(--border-width-2) solid var(--color-black);
		padding: var(--space-3);
		margin: 0 calc(-1 * var(--space-4));
		margin-bottom: var(--space-4);
		padding: var(--space-3) var(--space-4);
	}

	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.alert-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border: var(--border-width) dashed var(--color-gray-20);
	}

	.alert-item.error {
		border-width: var(--border-width-2);
		border-style: solid;
		border-color: var(--color-black);
	}

	.alert-icon {
		font-size: 12px;
	}

	.alert-message {
		flex: 1;
		font-size: var(--text-sm);
	}

	.alert-time {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-family: monospace;
	}

	/* Actions */
	.card-actions {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-2);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.action-btn {
		padding: var(--space-2);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-family: monospace;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.action-btn:hover {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* Compact View */
	.compact-content {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.compact-stat {
		display: flex;
		gap: var(--space-1);
		font-size: var(--text-xs);
	}

	.compact-label {
		color: var(--color-gray-40);
	}

	.compact-value {
		font-weight: var(--font-medium);
		font-variant-numeric: tabular-nums;
	}
</style>