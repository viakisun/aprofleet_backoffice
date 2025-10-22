<script lang="ts">
	import { vehicle, type Vehicle, type VehicleStatus } from '$lib/stores/vehicle';
	import { notification } from '$lib/stores/notification';
	import { goto } from '$app/navigation';

	export let vehicles: Vehicle[] = [];
	export let showActions = true;
	export let selectable = false;
	export let onSelect: ((vehicle: Vehicle) => void) | null = null;

	// Sorting
	let sortKey: keyof Vehicle | 'battery.level' | 'location.speed' = 'vin';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Filtering
	let filterStatus: VehicleStatus | 'all' = 'all';
	let filterSearch = '';

	// Selection
	let selectedVehicles = new Set<string>();

	// Pagination
	let currentPage = 1;
	let itemsPerPage = 25;

	// Get vehicles from store if not provided
	$: displayVehicles = vehicles.length > 0 ? vehicles : Array.from($vehicle.vehicles.values());

	// Apply filters
	$: filteredVehicles = displayVehicles.filter(v => {
		if (filterStatus !== 'all' && v.status !== filterStatus) return false;
		if (filterSearch) {
			const search = filterSearch.toLowerCase();
			return v.vin.toLowerCase().includes(search) ||
			       v.model.toLowerCase().includes(search) ||
			       v.id.toLowerCase().includes(search);
		}
		return true;
	});

	// Apply sorting
	$: sortedVehicles = [...filteredVehicles].sort((a, b) => {
		let aVal: any;
		let bVal: any;

		if (sortKey.includes('.')) {
			const keys = sortKey.split('.');
			aVal = keys.reduce((obj, key) => obj?.[key], a as any);
			bVal = keys.reduce((obj, key) => obj?.[key], b as any);
		} else {
			aVal = a[sortKey as keyof Vehicle];
			bVal = b[sortKey as keyof Vehicle];
		}

		if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
		if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
		return 0;
	});

	// Paginate
	$: totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
	$: paginatedVehicles = sortedVehicles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Reset page when filters change
	$: filterStatus, filterSearch, currentPage = 1;

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

	function getBatteryIndicator(level: number): string {
		if (level > 80) return '[████████]';
		if (level > 60) return '[██████░░]';
		if (level > 40) return '[████░░░░]';
		if (level > 20) return '[██░░░░░░]';
		return '[░░░░░░░░]';
	}

	function handleSort(key: typeof sortKey) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}

	function getSortIndicator(key: typeof sortKey): string {
		if (sortKey !== key) return '';
		return sortDirection === 'asc' ? ' ▲' : ' ▼';
	}

	function selectVehicle(v: Vehicle) {
		if (onSelect) {
			onSelect(v);
		} else {
			vehicle.selectVehicle(v.id);
			goto(`/vehicles/${v.vin}`);
		}
	}

	function toggleSelection(vehicleId: string) {
		if (selectedVehicles.has(vehicleId)) {
			selectedVehicles.delete(vehicleId);
		} else {
			selectedVehicles.add(vehicleId);
		}
		selectedVehicles = new Set(selectedVehicles);
	}

	function selectAll() {
		if (selectedVehicles.size === paginatedVehicles.length) {
			selectedVehicles.clear();
		} else {
			paginatedVehicles.forEach(v => selectedVehicles.add(v.id));
		}
		selectedVehicles = new Set(selectedVehicles);
	}

	async function sendCommand(vehicleId: string, command: string) {
		const result = await vehicle.sendCommand(vehicleId, command);
		if (result.success) {
			notification.success(`COMMAND SENT`, `${command.toUpperCase()} sent to vehicle`);
		} else {
			notification.error(`COMMAND FAILED`, result.error);
		}
	}

	function exportData() {
		const csv = [
			['VIN', 'MODEL', 'STATUS', 'BATTERY', 'LOCATION', 'SPEED', 'LAST UPDATE'],
			...sortedVehicles.map(v => [
				v.vin,
				v.model,
				v.status,
				`${v.battery.level}%`,
				`${v.location.latitude},${v.location.longitude}`,
				`${v.location.speed} km/h`,
				v.location.timestamp
			])
		].map(row => row.join(',')).join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `vehicles-${new Date().toISOString()}.csv`;
		a.click();
		URL.revokeObjectURL(url);

		notification.success('EXPORT COMPLETE', `${sortedVehicles.length} vehicles exported`);
	}
</script>

<div class="vehicle-table">
	<!-- Toolbar -->
	<div class="table-toolbar">
		<div class="toolbar-left">
			<div class="filter-group">
				<select
					bind:value={filterStatus}
					class="filter-select"
					aria-label="Filter by status"
				>
					<option value="all">ALL STATUS</option>
					<option value="operating">OPERATING</option>
					<option value="charging">CHARGING</option>
					<option value="idle">IDLE</option>
					<option value="warning">WARNING</option>
					<option value="error">ERROR</option>
					<option value="maintenance">MAINTENANCE</option>
				</select>

				<input
					type="text"
					bind:value={filterSearch}
					placeholder="SEARCH VIN/MODEL..."
					class="filter-search"
					aria-label="Search vehicles"
				/>
			</div>

			{#if selectedVehicles.size > 0}
				<div class="bulk-actions">
					<span class="selection-count">[{selectedVehicles.size} SELECTED]</span>
					<button class="action-button" on:click={() => selectedVehicles.clear()}>
						CLEAR
					</button>
				</div>
			{/if}
		</div>

		<div class="toolbar-right">
			<div class="pagination-info">
				{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedVehicles.length)} OF {sortedVehicles.length}
			</div>
			<button class="action-button" on:click={exportData}>
				EXPORT CSV
			</button>
		</div>
	</div>

	<!-- Table -->
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					{#if selectable}
						<th class="checkbox-column">
							<input
								type="checkbox"
								on:change={selectAll}
								checked={selectedVehicles.size === paginatedVehicles.length && paginatedVehicles.length > 0}
								aria-label="Select all vehicles"
							/>
						</th>
					{/if}
					<th on:click={() => handleSort('vin')} class="sortable">
						VIN{getSortIndicator('vin')}
					</th>
					<th on:click={() => handleSort('model')} class="sortable">
						MODEL{getSortIndicator('model')}
					</th>
					<th on:click={() => handleSort('status')} class="sortable">
						STATUS{getSortIndicator('status')}
					</th>
					<th on:click={() => handleSort('battery.level')} class="sortable">
						BATTERY{getSortIndicator('battery.level')}
					</th>
					<th on:click={() => handleSort('location.speed')} class="sortable">
						SPEED{getSortIndicator('location.speed')}
					</th>
					<th>LOCATION</th>
					<th>HEALTH</th>
					{#if showActions}
						<th>ACTIONS</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each paginatedVehicles as v (v.id)}
					<tr class:selected={selectedVehicles.has(v.id)}>
						{#if selectable}
							<td class="checkbox-column">
								<input
									type="checkbox"
									checked={selectedVehicles.has(v.id)}
									on:change={() => toggleSelection(v.id)}
									aria-label="Select vehicle {v.vin}"
								/>
							</td>
						{/if}
						<td class="vin-cell">
							<button class="link-button" on:click={() => selectVehicle(v)}>
								{v.vin}
							</button>
						</td>
						<td>{v.model}</td>
						<td class="status-cell">
							<span class="status-indicator">{getStatusIndicator(v.status)}</span>
							<span class="status-text">{v.status.toUpperCase()}</span>
						</td>
						<td class="battery-cell">
							<span class="battery-indicator">{getBatteryIndicator(v.battery.level)}</span>
							<span class="battery-value">{v.battery.level}%</span>
						</td>
						<td class="speed-cell">{v.location.speed} KM/H</td>
						<td class="location-cell">
							{v.location.latitude.toFixed(4)}, {v.location.longitude.toFixed(4)}
						</td>
						<td class="health-cell">{v.health.overall}%</td>
						{#if showActions}
							<td class="actions-cell">
								<button
									class="action-icon"
									on:click={() => sendCommand(v.id, 'lock')}
									title="Lock vehicle"
								>
									[L]
								</button>
								<button
									class="action-icon"
									on:click={() => sendCommand(v.id, 'unlock')}
									title="Unlock vehicle"
								>
									[U]
								</button>
								<button
									class="action-icon"
									on:click={() => sendCommand(v.id, 'honk')}
									title="Honk horn"
								>
									[H]
								</button>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>

		{#if paginatedVehicles.length === 0}
			<div class="no-data">
				NO VEHICLES FOUND
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="pagination">
			<button
				class="pagination-button"
				on:click={() => currentPage = 1}
				disabled={currentPage === 1}
			>
				[FIRST]
			</button>
			<button
				class="pagination-button"
				on:click={() => currentPage--}
				disabled={currentPage === 1}
			>
				[PREV]
			</button>

			<div class="page-numbers">
				{#each Array(totalPages) as _, i}
					{#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2)}
						<button
							class="page-number"
							class:active={currentPage === i + 1}
							on:click={() => currentPage = i + 1}
						>
							{i + 1}
						</button>
					{:else if i + 1 === currentPage - 3 || i + 1 === currentPage + 3}
						<span class="page-ellipsis">...</span>
					{/if}
				{/each}
			</div>

			<button
				class="pagination-button"
				on:click={() => currentPage++}
				disabled={currentPage === totalPages}
			>
				[NEXT]
			</button>
			<button
				class="pagination-button"
				on:click={() => currentPage = totalPages}
				disabled={currentPage === totalPages}
			>
				[LAST]
			</button>
		</div>
	{/if}
</div>

<style>
	.vehicle-table {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.table-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		border-bottom: var(--border-width) solid var(--color-gray-12);
		background: var(--color-gray-04);
	}

	.toolbar-left,
	.toolbar-right {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.filter-group {
		display: flex;
		gap: var(--space-2);
	}

	.filter-select,
	.filter-search {
		height: 28px;
		padding: 0 var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
	}

	.filter-select {
		min-width: 140px;
	}

	.filter-search {
		width: 200px;
	}

	.bulk-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-left: var(--space-3);
		border-left: var(--border-width) solid var(--color-gray-20);
	}

	.selection-count {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.pagination-info {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-variant-numeric: tabular-nums;
	}

	.action-button {
		padding: var(--space-1) var(--space-2);
		height: 24px;
		font-size: var(--text-xs);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.table-wrapper {
		flex: 1;
		overflow: auto;
		background: var(--color-white);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		position: sticky;
		top: 0;
		background: var(--color-gray-04);
		z-index: 1;
	}

	th {
		padding: var(--space-2) var(--space-3);
		text-align: left;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		border-bottom: var(--border-width) solid var(--color-black);
		white-space: nowrap;
	}

	th.sortable {
		cursor: pointer;
		user-select: none;
	}

	th.sortable:hover {
		background: var(--color-gray-08);
	}

	.checkbox-column {
		width: 40px;
		text-align: center;
	}

	td {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		border-bottom: var(--border-width) solid var(--color-gray-08);
		white-space: nowrap;
	}

	tr:hover {
		background: var(--color-gray-04);
	}

	tr.selected {
		background: var(--color-gray-08);
	}

	.vin-cell {
		font-weight: var(--font-medium);
	}

	.link-button {
		background: transparent;
		border: none;
		padding: 0;
		font: inherit;
		color: inherit;
		text-decoration: underline;
		cursor: pointer;
		text-transform: none;
	}

	.link-button:hover {
		text-decoration: none;
	}

	.status-cell {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.status-indicator {
		font-size: 10px;
	}

	.battery-cell {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-variant-numeric: tabular-nums;
	}

	.battery-indicator {
		font-family: monospace;
		font-size: 10px;
		letter-spacing: -1px;
	}

	.speed-cell,
	.health-cell {
		font-variant-numeric: tabular-nums;
	}

	.location-cell {
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.actions-cell {
		display: flex;
		gap: var(--space-1);
	}

	.action-icon {
		padding: 2px 4px;
		background: transparent;
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		cursor: pointer;
		font-family: monospace;
	}

	.action-icon:hover {
		background: var(--color-black);
		color: var(--color-white);
		border-color: var(--color-black);
	}

	.no-data {
		padding: var(--space-8);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-12);
		background: var(--color-gray-04);
	}

	.pagination-button {
		padding: var(--space-1) var(--space-2);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		cursor: pointer;
		font-family: monospace;
	}

	.pagination-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination-button:not(:disabled):hover {
		background: var(--color-black);
		color: var(--color-white);
		border-color: var(--color-black);
	}

	.page-numbers {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.page-number {
		width: 24px;
		height: 24px;
		padding: 0;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.page-number.active {
		background: var(--color-black);
		color: var(--color-white);
		border-color: var(--color-black);
	}

	.page-number:not(.active):hover {
		background: var(--color-gray-04);
	}

	.page-ellipsis {
		padding: 0 var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}
</style>