<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { vehicle, type Vehicle, type VehicleStatus } from '$lib/stores/vehicle';

	export let selectedVehicle: Vehicle | null = null;
	export let height = '500px';
	export let onVehicleClick: ((vehicle: Vehicle) => void) | null = null;

	let mapContainer: HTMLDivElement;
	let hoveredVehicle: Vehicle | null = null;

	// Mock map data - in production, use Leaflet/Mapbox
	const MAP_CENTER = { lat: 39.7837, lng: -74.9669 };
	const ZOOM_LEVEL = 15;

	$: vehicleList = Array.from($vehicle.vehicles.values());

	function getStatusShape(status: VehicleStatus): string {
		switch (status) {
			case 'operating': return '■';
			case 'charging': return '▢';
			case 'idle': return '⬚';
			case 'warning': return '▲';
			case 'error': return '✖';
			case 'maintenance': return '◆';
			default: return '●';
		}
	}

	function getStatusBorder(status: VehicleStatus): string {
		switch (status) {
			case 'error': return 'border-width: 2px;';
			case 'warning': return 'border-style: dashed;';
			default: return '';
		}
	}

	function calculatePosition(lat: number, lng: number): { x: number; y: number } {
		// Simple offset calculation from center
		const latOffset = (lat - MAP_CENTER.lat) * 10000 * ZOOM_LEVEL;
		const lngOffset = (lng - MAP_CENTER.lng) * 10000 * ZOOM_LEVEL;

		return {
			x: 50 + lngOffset, // percentage from center
			y: 50 - latOffset
		};
	}

	function handleVehicleClick(v: Vehicle) {
		if (onVehicleClick) {
			onVehicleClick(v);
		} else {
			vehicle.selectVehicle(v.id);
		}
	}
</script>

<div class="vehicle-map" style="height: {height}">
	<div class="map-container" bind:this={mapContainer}>
		<!-- Map Grid Background -->
		<div class="map-grid">
			{#each Array(20) as _, i}
				<div class="grid-line-h" style="top: {i * 5}%"></div>
				<div class="grid-line-v" style="left: {i * 5}%"></div>
			{/each}
		</div>

		<!-- Center Marker -->
		<div class="map-center">
			<div class="center-cross">+</div>
			<div class="center-label">PINE VALLEY GOLF CLUB</div>
		</div>

		<!-- Vehicle Markers -->
		{#each vehicleList as v (v.id)}
			{@const pos = calculatePosition(v.location.latitude, v.location.longitude)}
			<button
				class="vehicle-marker"
				class:selected={selectedVehicle?.id === v.id}
				class:hovered={hoveredVehicle?.id === v.id}
				style="left: {pos.x}%; top: {pos.y}%; {getStatusBorder(v.status)}"
				on:click={() => handleVehicleClick(v)}
				on:mouseenter={() => hoveredVehicle = v}
				on:mouseleave={() => hoveredVehicle = null}
			>
				<div class="marker-icon">{getStatusShape(v.status)}</div>
				<div class="marker-heading" style="transform: rotate({v.location.heading}deg)">
					→
				</div>
			</button>

			<!-- Tooltip on hover -->
			{#if hoveredVehicle?.id === v.id}
				<div class="marker-tooltip" style="left: {pos.x}%; top: {pos.y - 8}%">
					<div class="tooltip-vin">{v.vin}</div>
					<div class="tooltip-info">
						{v.model} | {v.status.toUpperCase()}
					</div>
					<div class="tooltip-battery">
						BATTERY: {v.battery.level}% | SPEED: {v.location.speed} KM/H
					</div>
				</div>
			{/if}
		{/each}

		<!-- Map Controls -->
		<div class="map-controls">
			<button class="control-button">+</button>
			<button class="control-button">−</button>
			<button class="control-button">⌂</button>
		</div>

		<!-- Map Stats -->
		<div class="map-stats">
			<div class="stat-item">
				<span class="stat-label">ZOOM</span>
				<span class="stat-value">{ZOOM_LEVEL}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">VEHICLES</span>
				<span class="stat-value">{vehicleList.length}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">ACTIVE</span>
				<span class="stat-value">
					{vehicleList.filter(v => v.status === 'operating').length}
				</span>
			</div>
		</div>

		<!-- Connection Status -->
		<div class="map-connection">
			<span class="connection-dot">{$vehicle.connectionStatus === 'connected' ? '●' : '○'}</span>
			<span class="connection-text">{$vehicle.connectionStatus.toUpperCase()}</span>
			{#if $vehicle.lastUpdate}
				<span class="connection-time">
					{new Date($vehicle.lastUpdate).toLocaleTimeString()}
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.vehicle-map {
		width: 100%;
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
		position: relative;
		overflow: hidden;
	}

	.map-container {
		width: 100%;
		height: 100%;
		position: relative;
		background: var(--color-white);
	}

	/* Grid Background */
	.map-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.grid-line-h,
	.grid-line-v {
		position: absolute;
		background: var(--color-gray-04);
	}

	.grid-line-h {
		width: 100%;
		height: 1px;
	}

	.grid-line-v {
		height: 100%;
		width: 1px;
	}

	/* Center Marker */
	.map-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		pointer-events: none;
	}

	.center-cross {
		font-size: var(--text-3xl);
		color: var(--color-gray-12);
		margin-bottom: var(--space-2);
	}

	.center-label {
		font-size: var(--text-xs);
		color: var(--color-gray-20);
		letter-spacing: var(--tracking-wider);
		font-weight: var(--font-medium);
	}

	/* Vehicle Markers */
	.vehicle-marker {
		position: absolute;
		width: 32px;
		height: 32px;
		transform: translate(-50%, -50%);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
		z-index: 1;
	}

	.vehicle-marker:hover {
		z-index: 10;
		transform: translate(-50%, -50%) scale(1.2);
		border-width: var(--border-width-2);
	}

	.vehicle-marker.selected {
		background: var(--color-black);
		color: var(--color-white);
		border-width: var(--border-width-2);
		z-index: 5;
	}

	.marker-icon {
		font-size: 14px;
		position: relative;
		z-index: 2;
	}

	.marker-heading {
		position: absolute;
		top: -8px;
		right: -8px;
		font-size: 10px;
		background: var(--color-white);
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: var(--border-width) solid var(--color-gray-12);
	}

	.vehicle-marker.selected .marker-heading {
		background: var(--color-black);
		color: var(--color-white);
		border-color: var(--color-white);
	}

	/* Tooltip */
	.marker-tooltip {
		position: absolute;
		transform: translate(-50%, -100%);
		background: var(--color-black);
		color: var(--color-white);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--color-black);
		min-width: 200px;
		z-index: 20;
		pointer-events: none;
	}

	.tooltip-vin {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
		margin-bottom: var(--space-1);
	}

	.tooltip-info {
		font-size: var(--text-xs);
		opacity: 0.8;
		margin-bottom: var(--space-1);
	}

	.tooltip-battery {
		font-size: var(--text-xs);
		opacity: 0.6;
		font-family: monospace;
	}

	/* Map Controls */
	.map-controls {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		z-index: 10;
	}

	.control-button {
		width: 32px;
		height: 32px;
		padding: 0;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.control-button:hover {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* Map Stats */
	.map-stats {
		position: absolute;
		bottom: var(--space-4);
		left: var(--space-4);
		display: flex;
		gap: var(--space-4);
		background: var(--color-white);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--color-black);
		z-index: 10;
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
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	/* Connection Status */
	.map-connection {
		position: absolute;
		top: var(--space-4);
		left: var(--space-4);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--color-white);
		padding: var(--space-1) var(--space-3);
		border: var(--border-width) solid var(--color-black);
		z-index: 10;
	}

	.connection-dot {
		font-size: 8px;
	}

	.connection-text {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.connection-time {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-family: monospace;
	}
</style>