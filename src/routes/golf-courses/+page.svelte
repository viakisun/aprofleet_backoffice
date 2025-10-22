<script lang="ts">
	import { tenant } from '$lib/stores/tenant';
	import { vehicle } from '$lib/stores/vehicle';
	import { goto } from '$app/navigation';

	interface GolfCourse {
		id: string;
		name: string;
		location: string;
		country: string;
		contactPerson: string;
		email: string;
		phone: string;
		contractStatus: 'active' | 'pending' | 'expired' | 'suspended';
		contractStart: string;
		contractEnd: string;
		fleetSize: number;
		activeVehicles: number;
		utilizationRate: number;
		monthlyRevenue: number;
		totalDistance: number;
		totalTrips: number;
		status: 'operational' | 'setup' | 'maintenance' | 'inactive';
	}

	// Mock golf course data
	const golfCourses: GolfCourse[] = [
		{
			id: 'tenant-001',
			name: 'Pine Valley Golf Club',
			location: 'Pine Valley, NJ',
			country: 'USA',
			contactPerson: 'John Smith',
			email: 'john.smith@pinevalley.com',
			phone: '+1-609-783-3000',
			contractStatus: 'active',
			contractStart: '2024-01-01',
			contractEnd: '2026-12-31',
			fleetSize: 25,
			activeVehicles: 23,
			utilizationRate: 78.5,
			monthlyRevenue: 45000,
			totalDistance: 125430,
			totalTrips: 8234,
			status: 'operational'
		},
		{
			id: 'tenant-002',
			name: 'Augusta National Golf Club',
			location: 'Augusta, GA',
			country: 'USA',
			contactPerson: 'Sarah Johnson',
			email: 'sarah.johnson@augustanational.com',
			phone: '+1-706-667-6000',
			contractStatus: 'active',
			contractStart: '2023-06-01',
			contractEnd: '2025-05-31',
			fleetSize: 20,
			activeVehicles: 20,
			utilizationRate: 82.3,
			monthlyRevenue: 38000,
			totalDistance: 98765,
			totalTrips: 6543,
			status: 'operational'
		},
		{
			id: 'tenant-003',
			name: 'Pebble Beach Golf Links',
			location: 'Pebble Beach, CA',
			country: 'USA',
			contactPerson: 'Michael Brown',
			email: 'michael.brown@pebblebeach.com',
			phone: '+1-831-624-3811',
			contractStatus: 'active',
			contractStart: '2024-03-01',
			contractEnd: '2027-02-28',
			fleetSize: 15,
			activeVehicles: 14,
			utilizationRate: 65.2,
			monthlyRevenue: 28000,
			totalDistance: 67890,
			totalTrips: 4321,
			status: 'operational'
		},
		{
			id: 'tenant-004',
			name: 'St Andrews Links',
			location: 'St Andrews, Fife',
			country: 'Scotland',
			contactPerson: 'David Wilson',
			email: 'david.wilson@standrews.com',
			phone: '+44-1334-466666',
			contractStatus: 'pending',
			contractStart: '2025-01-01',
			contractEnd: '2028-12-31',
			fleetSize: 0,
			activeVehicles: 0,
			utilizationRate: 0,
			monthlyRevenue: 0,
			totalDistance: 0,
			totalTrips: 0,
			status: 'setup'
		},
		{
			id: 'tenant-005',
			name: 'Royal Melbourne Golf Club',
			location: 'Melbourne, VIC',
			country: 'Australia',
			contactPerson: 'Emma Thompson',
			email: 'emma.thompson@royalmelbourne.com.au',
			phone: '+61-3-9598-6755',
			contractStatus: 'suspended',
			contractStart: '2023-01-01',
			contractEnd: '2025-12-31',
			fleetSize: 18,
			activeVehicles: 0,
			utilizationRate: 0,
			monthlyRevenue: 0,
			totalDistance: 54321,
			totalTrips: 3210,
			status: 'maintenance'
		}
	];

	let searchTerm = '';
	let statusFilter: GolfCourse['status'] | 'all' = 'all';
	let contractFilter: GolfCourse['contractStatus'] | 'all' = 'all';
	let sortBy: 'name' | 'fleetSize' | 'utilization' | 'revenue' = 'name';
	let sortDirection: 'asc' | 'desc' = 'asc';

	$: filteredCourses = golfCourses
		.filter(course => {
			const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				course.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
				course.country.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
			const matchesContract = contractFilter === 'all' || course.contractStatus === contractFilter;
			return matchesSearch && matchesStatus && matchesContract;
		})
		.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'fleetSize':
					comparison = a.fleetSize - b.fleetSize;
					break;
				case 'utilization':
					comparison = a.utilizationRate - b.utilizationRate;
					break;
				case 'revenue':
					comparison = a.monthlyRevenue - b.monthlyRevenue;
					break;
			}
			return sortDirection === 'asc' ? comparison : -comparison;
		});

	$: totalFleet = golfCourses.reduce((sum, c) => sum + c.fleetSize, 0);
	$: totalActive = golfCourses.reduce((sum, c) => sum + c.activeVehicles, 0);
	$: totalRevenue = golfCourses.reduce((sum, c) => sum + c.monthlyRevenue, 0);
	$: avgUtilization = golfCourses.length > 0
		? golfCourses.reduce((sum, c) => sum + c.utilizationRate, 0) / golfCourses.length
		: 0;

	function getContractStatusSymbol(status: GolfCourse['contractStatus']): string {
		switch (status) {
			case 'active': return '■';
			case 'pending': return '◆';
			case 'expired': return '✖';
			case 'suspended': return '▲';
		}
	}

	function getStatusSymbol(status: GolfCourse['status']): string {
		switch (status) {
			case 'operational': return '■';
			case 'setup': return '◆';
			case 'maintenance': return '▲';
			case 'inactive': return '⬚';
		}
	}

	function toggleSort(field: typeof sortBy) {
		if (sortBy === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortDirection = 'asc';
		}
	}

	function handleCourseClick(courseId: string) {
		goto(`/golf-courses/${courseId}`);
	}

	function handleAddNew() {
		goto('/golf-courses/new');
	}
</script>

<div class="golf-courses-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">GOLF COURSE MANAGEMENT</h1>
			<p class="page-subtitle">Manufacturer Dashboard - Fleet Deployment Overview</p>
		</div>
		<button class="btn-primary" on:click={handleAddNew}>
			+ ADD NEW GOLF COURSE
		</button>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">TOTAL GOLF COURSES</div>
			<div class="card-value">{golfCourses.length}</div>
			<div class="card-detail">
				{golfCourses.filter(c => c.status === 'operational').length} OPERATIONAL
			</div>
		</div>

		<div class="summary-card">
			<div class="card-label">TOTAL FLEET SIZE</div>
			<div class="card-value">{totalFleet}</div>
			<div class="card-detail">
				{totalActive} ACTIVE VEHICLES
			</div>
		</div>

		<div class="summary-card">
			<div class="card-label">AVG UTILIZATION</div>
			<div class="card-value">{avgUtilization.toFixed(1)}%</div>
			<div class="card-detail">
				ACROSS ALL COURSES
			</div>
		</div>

		<div class="summary-card">
			<div class="card-label">TOTAL MONTHLY REVENUE</div>
			<div class="card-value">${(totalRevenue / 1000).toFixed(0)}K</div>
			<div class="card-detail">
				FROM ACTIVE CONTRACTS
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="filters-section">
		<div class="search-box">
			<label for="search">SEARCH:</label>
			<input
				id="search"
				type="text"
				bind:value={searchTerm}
				placeholder="Course name, location, country..."
			/>
		</div>

		<div class="filter-group">
			<label for="status-filter">STATUS:</label>
			<select id="status-filter" bind:value={statusFilter}>
				<option value="all">ALL</option>
				<option value="operational">OPERATIONAL</option>
				<option value="setup">SETUP</option>
				<option value="maintenance">MAINTENANCE</option>
				<option value="inactive">INACTIVE</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="contract-filter">CONTRACT:</label>
			<select id="contract-filter" bind:value={contractFilter}>
				<option value="all">ALL</option>
				<option value="active">ACTIVE</option>
				<option value="pending">PENDING</option>
				<option value="expired">EXPIRED</option>
				<option value="suspended">SUSPENDED</option>
			</select>
		</div>

		<div class="results-count">
			SHOWING {filteredCourses.length} OF {golfCourses.length}
		</div>
	</div>

	<!-- Golf Courses Table -->
	<div class="table-container">
		<table class="data-table">
			<thead>
				<tr>
					<th>
						<button class="sort-btn" on:click={() => toggleSort('name')}>
							GOLF COURSE
							{#if sortBy === 'name'}
								<span class="sort-indicator">{sortDirection === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</button>
					</th>
					<th>LOCATION</th>
					<th>CONTACT</th>
					<th>CONTRACT</th>
					<th>
						<button class="sort-btn" on:click={() => toggleSort('fleetSize')}>
							FLEET
							{#if sortBy === 'fleetSize'}
								<span class="sort-indicator">{sortDirection === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</button>
					</th>
					<th>
						<button class="sort-btn" on:click={() => toggleSort('utilization')}>
							UTILIZATION
							{#if sortBy === 'utilization'}
								<span class="sort-indicator">{sortDirection === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</button>
					</th>
					<th>
						<button class="sort-btn" on:click={() => toggleSort('revenue')}>
							MONTHLY REVENUE
							{#if sortBy === 'revenue'}
								<span class="sort-indicator">{sortDirection === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</button>
					</th>
					<th>STATUS</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredCourses as course}
					<tr class="clickable-row" on:click={() => handleCourseClick(course.id)}>
						<td>
							<div class="course-name">{course.name}</div>
						</td>
						<td>
							<div class="location-cell">
								<div>{course.location}</div>
								<div class="country">{course.country}</div>
							</div>
						</td>
						<td>
							<div class="contact-cell">
								<div>{course.contactPerson}</div>
								<div class="contact-detail">{course.email}</div>
								<div class="contact-detail">{course.phone}</div>
							</div>
						</td>
						<td>
							<div class="contract-cell">
								<div class="contract-status">
									<span class="status-symbol">{getContractStatusSymbol(course.contractStatus)}</span>
									{course.contractStatus.toUpperCase()}
								</div>
								{#if course.contractStatus === 'active' || course.contractStatus === 'pending'}
									<div class="contract-dates">
										{course.contractStart} → {course.contractEnd}
									</div>
								{/if}
							</div>
						</td>
						<td>
							<div class="fleet-cell">
								<div class="fleet-size">{course.fleetSize} UNITS</div>
								{#if course.activeVehicles > 0}
									<div class="fleet-detail">{course.activeVehicles} ACTIVE</div>
								{/if}
							</div>
						</td>
						<td>
							<div class="utilization-cell">
								{#if course.utilizationRate > 0}
									<div class="utilization-bar">
										<div class="utilization-fill" style="width: {course.utilizationRate}%"></div>
									</div>
									<div class="utilization-value">{course.utilizationRate.toFixed(1)}%</div>
								{:else}
									<div class="no-data">—</div>
								{/if}
							</div>
						</td>
						<td>
							<div class="revenue-cell">
								{#if course.monthlyRevenue > 0}
									<div class="revenue-value">${course.monthlyRevenue.toLocaleString()}</div>
									<div class="revenue-detail">{course.totalTrips.toLocaleString()} TRIPS</div>
								{:else}
									<div class="no-data">—</div>
								{/if}
							</div>
						</td>
						<td>
							<div class="status-cell">
								<span class="status-symbol">{getStatusSymbol(course.status)}</span>
								{course.status.toUpperCase()}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Legend -->
	<div class="legend">
		<div class="legend-section">
			<div class="legend-title">CONTRACT STATUS:</div>
			<div class="legend-items">
				<span class="legend-item">■ ACTIVE</span>
				<span class="legend-item">◆ PENDING</span>
				<span class="legend-item">▲ SUSPENDED</span>
				<span class="legend-item">✖ EXPIRED</span>
			</div>
		</div>
		<div class="legend-section">
			<div class="legend-title">OPERATIONAL STATUS:</div>
			<div class="legend-items">
				<span class="legend-item">■ OPERATIONAL</span>
				<span class="legend-item">◆ SETUP</span>
				<span class="legend-item">▲ MAINTENANCE</span>
				<span class="legend-item">⬚ INACTIVE</span>
			</div>
		</div>
	</div>
</div>

<style>
	.golf-courses-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
	}

	/* Page Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin: 0 0 var(--space-2) 0;
	}

	.page-subtitle {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
		margin: 0;
	}

	.btn-primary {
		padding: var(--space-3) var(--space-4);
		background: var(--color-black);
		color: var(--color-white);
		border: none;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.btn-primary:hover {
		background: var(--color-gray-60);
	}

	/* Summary Cards */
	.summary-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.summary-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.card-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.card-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-1);
	}

	.card-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
	}

	/* Filters */
	.filters-section {
		display: flex;
		gap: var(--space-3);
		align-items: center;
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.search-box label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.search-box input {
		flex: 1;
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.filter-group label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.filter-group select {
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		font-size: var(--text-sm);
		min-width: 150px;
	}

	.results-count {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-left: auto;
	}

	/* Table */
	.table-container {
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		margin-bottom: var(--space-4);
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table thead {
		background: var(--color-gray-04);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.data-table th {
		padding: var(--space-3);
		text-align: left;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.sort-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		background: none;
		border: none;
		padding: 0;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
	}

	.sort-indicator {
		font-size: 8px;
	}

	.data-table tbody tr {
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.clickable-row {
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing-linear);
	}

	.clickable-row:hover {
		background: var(--color-gray-04);
	}

	.data-table td {
		padding: var(--space-3);
		font-size: var(--text-sm);
	}

	/* Table Cell Styles */
	.course-name {
		font-weight: var(--font-semibold);
	}

	.location-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.country {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.contact-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.contact-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-family: monospace;
	}

	.contract-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.contract-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-medium);
	}

	.contract-dates {
		font-size: var(--text-xs);
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.status-symbol {
		font-size: 10px;
	}

	.fleet-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.fleet-size {
		font-weight: var(--font-medium);
	}

	.fleet-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.utilization-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 100px;
	}

	.utilization-bar {
		width: 100%;
		height: 8px;
		background: var(--color-gray-12);
		border: var(--border-width) solid var(--color-gray-20);
		position: relative;
	}

	.utilization-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--color-black);
	}

	.utilization-value {
		font-size: var(--text-xs);
		font-family: monospace;
		font-variant-numeric: tabular-nums;
	}

	.revenue-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.revenue-value {
		font-family: monospace;
		font-variant-numeric: tabular-nums;
		font-weight: var(--font-medium);
	}

	.revenue-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.status-cell {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-medium);
	}

	.no-data {
		color: var(--color-gray-20);
		text-align: center;
	}

	/* Legend */
	.legend {
		display: flex;
		gap: var(--space-6);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.legend-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.legend-title {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.legend-items {
		display: flex;
		gap: var(--space-3);
	}

	.legend-item {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
	}
</style>
