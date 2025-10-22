<script lang="ts">
	import { notification } from '$lib/stores/notification';

	interface Customer {
		id: string;
		name: string;
		email: string;
		phone: string;
		membershipTier: 'regular' | 'premium' | 'vip';
		memberSince: string;
		status: 'active' | 'inactive' | 'suspended';
		totalReservations: number;
		totalRounds: number;
		totalDistance: number; // km
		averageRating: number;
		preferredVehicleType?: string;
		lastVisit?: string;
		notes?: string;
		emergencyContact?: {
			name: string;
			phone: string;
			relationship: string;
		};
	}

	// Mock customers data
	const customers: Customer[] = [
		{
			id: 'CUST-001',
			name: 'John Smith',
			email: 'john.smith@email.com',
			phone: '+1-555-0101',
			membershipTier: 'vip',
			memberSince: '2022-03-15',
			status: 'active',
			totalReservations: 87,
			totalRounds: 82,
			totalDistance: 1456,
			averageRating: 4.9,
			preferredVehicleType: 'APROFLEET SPORT',
			lastVisit: '2024-10-20',
			notes: 'Prefers early morning tee times. VIP member with priority booking.',
			emergencyContact: {
				name: 'Jane Smith',
				phone: '+1-555-0102',
				relationship: 'Spouse'
			}
		},
		{
			id: 'CUST-002',
			name: 'Michael Johnson',
			email: 'm.johnson@email.com',
			phone: '+1-555-0201',
			membershipTier: 'premium',
			memberSince: '2023-01-20',
			status: 'active',
			totalReservations: 54,
			totalRounds: 51,
			totalDistance: 924,
			averageRating: 4.7,
			preferredVehicleType: 'APROFLEET PASSENGER',
			lastVisit: '2024-10-18',
			notes: 'Regular weekend player. Requests 4-seater cart.',
			emergencyContact: {
				name: 'Sarah Johnson',
				phone: '+1-555-0202',
				relationship: 'Spouse'
			}
		},
		{
			id: 'CUST-003',
			name: 'David Williams',
			email: 'd.williams@email.com',
			phone: '+1-555-0301',
			membershipTier: 'regular',
			memberSince: '2023-06-10',
			status: 'active',
			totalReservations: 28,
			totalRounds: 26,
			totalDistance: 468,
			averageRating: 4.5,
			lastVisit: '2024-10-15',
			notes: 'New member. Learning the course.'
		},
		{
			id: 'CUST-004',
			name: 'Sarah Davis',
			email: 's.davis@email.com',
			phone: '+1-555-0401',
			membershipTier: 'vip',
			memberSince: '2021-11-05',
			status: 'active',
			totalReservations: 132,
			totalRounds: 128,
			totalDistance: 2304,
			averageRating: 5.0,
			preferredVehicleType: 'APROFLEET CARGO',
			lastVisit: '2024-10-21',
			notes: 'Long-time VIP member. Excellent customer.',
			emergencyContact: {
				name: 'Robert Davis',
				phone: '+1-555-0402',
				relationship: 'Spouse'
			}
		},
		{
			id: 'CUST-005',
			name: 'James Brown',
			email: 'j.brown@email.com',
			phone: '+1-555-0501',
			membershipTier: 'premium',
			memberSince: '2022-08-12',
			status: 'active',
			totalReservations: 64,
			totalRounds: 60,
			totalDistance: 1080,
			averageRating: 4.6,
			lastVisit: '2024-10-19',
			notes: 'Corporate member. Books for clients.'
		},
		{
			id: 'CUST-006',
			name: 'Emily Wilson',
			email: 'e.wilson@email.com',
			phone: '+1-555-0601',
			membershipTier: 'regular',
			memberSince: '2024-02-28',
			status: 'active',
			totalReservations: 15,
			totalRounds: 14,
			totalDistance: 252,
			averageRating: 4.8,
			lastVisit: '2024-10-17',
			notes: 'New member. Very enthusiastic.'
		},
		{
			id: 'CUST-007',
			name: 'Robert Anderson',
			email: 'r.anderson@email.com',
			phone: '+1-555-0701',
			membershipTier: 'premium',
			memberSince: '2022-05-20',
			status: 'inactive',
			totalReservations: 42,
			totalRounds: 39,
			totalDistance: 702,
			averageRating: 4.4,
			lastVisit: '2024-08-10',
			notes: 'Has not visited in 2+ months. Follow up needed.'
		},
		{
			id: 'CUST-008',
			name: 'Jennifer Martinez',
			email: 'j.martinez@email.com',
			phone: '+1-555-0801',
			membershipTier: 'vip',
			memberSince: '2020-09-15',
			status: 'active',
			totalReservations: 198,
			totalRounds: 192,
			totalDistance: 3456,
			averageRating: 4.9,
			preferredVehicleType: 'APROFLEET SPORT',
			lastVisit: '2024-10-22',
			notes: 'Founding VIP member. Tournament player.',
			emergencyContact: {
				name: 'Carlos Martinez',
				phone: '+1-555-0802',
				relationship: 'Spouse'
			}
		}
	];

	let selectedCustomer: Customer | null = null;
	let filterTier: Customer['membershipTier'] | 'all' = 'all';
	let filterStatus: Customer['status'] | 'all' = 'all';
	let searchTerm = '';
	let sortBy: 'name' | 'since' | 'reservations' | 'distance' = 'name';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Computed values
	$: filteredCustomers = customers
		.filter(customer => {
			const matchesTier = filterTier === 'all' || customer.membershipTier === filterTier;
			const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
			const matchesSearch = !searchTerm ||
				customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				customer.email.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesTier && matchesStatus && matchesSearch;
		})
		.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'since':
					comparison = new Date(a.memberSince).getTime() - new Date(b.memberSince).getTime();
					break;
				case 'reservations':
					comparison = a.totalReservations - b.totalReservations;
					break;
				case 'distance':
					comparison = a.totalDistance - b.totalDistance;
					break;
			}
			return sortDirection === 'asc' ? comparison : -comparison;
		});

	$: totalCustomers = customers.length;
	$: activeCustomers = customers.filter(c => c.status === 'active').length;
	$: vipCustomers = customers.filter(c => c.membershipTier === 'vip').length;
	$: totalReservations = customers.reduce((sum, c) => sum + c.totalReservations, 0);

	function getTierSymbol(tier: Customer['membershipTier']): string {
		switch (tier) {
			case 'vip': return '★';
			case 'premium': return '◆';
			case 'regular': return '○';
		}
	}

	function getTierLabel(tier: Customer['membershipTier']): string {
		return tier.toUpperCase();
	}

	function getStatusSymbol(status: Customer['status']): string {
		switch (status) {
			case 'active': return '■';
			case 'inactive': return '⬚';
			case 'suspended': return '✖';
		}
	}

	function getMembershipDuration(memberSince: string): string {
		const since = new Date(memberSince);
		const now = new Date();
		const years = now.getFullYear() - since.getFullYear();
		const months = now.getMonth() - since.getMonth();
		const totalMonths = years * 12 + months;

		if (totalMonths < 12) {
			return `${totalMonths} MONTHS`;
		} else {
			const y = Math.floor(totalMonths / 12);
			const m = totalMonths % 12;
			return m > 0 ? `${y}Y ${m}M` : `${y} YEARS`;
		}
	}

	function handleCustomerClick(customer: Customer) {
		selectedCustomer = customer;
	}

	function closeModal() {
		selectedCustomer = null;
	}

	function toggleSort(field: typeof sortBy) {
		if (sortBy === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortDirection = 'asc';
		}
	}
</script>

<div class="customers-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">CUSTOMER MANAGEMENT</h1>
			<p class="page-subtitle">Golf Club Members & Guest Registry</p>
		</div>
		<button class="btn-primary">+ ADD CUSTOMER</button>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">TOTAL CUSTOMERS</div>
			<div class="card-value">{totalCustomers}</div>
			<div class="card-detail">REGISTERED MEMBERS</div>
		</div>

		<div class="summary-card">
			<div class="card-label">ACTIVE MEMBERS</div>
			<div class="card-value">{activeCustomers}</div>
			<div class="card-detail">{((activeCustomers / totalCustomers) * 100).toFixed(0)}% RETENTION</div>
		</div>

		<div class="summary-card vip">
			<div class="card-label">VIP MEMBERS</div>
			<div class="card-value">{vipCustomers}</div>
			<div class="card-detail">PREMIUM TIER</div>
		</div>

		<div class="summary-card">
			<div class="card-label">TOTAL RESERVATIONS</div>
			<div class="card-value">{totalReservations}</div>
			<div class="card-detail">ALL TIME</div>
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
				placeholder="Name, ID, or email..."
			/>
		</div>

		<div class="filter-group">
			<label for="tier-filter">TIER:</label>
			<select id="tier-filter" bind:value={filterTier}>
				<option value="all">ALL</option>
				<option value="vip">VIP</option>
				<option value="premium">PREMIUM</option>
				<option value="regular">REGULAR</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="status-filter">STATUS:</label>
			<select id="status-filter" bind:value={filterStatus}>
				<option value="all">ALL</option>
				<option value="active">ACTIVE</option>
				<option value="inactive">INACTIVE</option>
				<option value="suspended">SUSPENDED</option>
			</select>
		</div>

		<div class="results-count">
			SHOWING {filteredCustomers.length} OF {customers.length}
		</div>
	</div>

	<!-- Customers Grid -->
	<div class="customers-grid">
		{#each filteredCustomers as customer}
			<button class="customer-card" on:click={() => handleCustomerClick(customer)}>
				<div class="card-header">
					<div class="customer-name">{customer.name}</div>
					<div class="membership-tier" class:vip={customer.membershipTier === 'vip'} class:premium={customer.membershipTier === 'premium'}>
						<span class="tier-symbol">{getTierSymbol(customer.membershipTier)}</span>
						{getTierLabel(customer.membershipTier)}
					</div>
				</div>

				<div class="customer-id">{customer.id}</div>

				<div class="contact-info">
					<div class="contact-row">
						<span class="contact-icon">@</span>
						{customer.email}
					</div>
					<div class="contact-row">
						<span class="contact-icon">☎</span>
						{customer.phone}
					</div>
				</div>

				<div class="customer-stats">
					<div class="stat-item">
						<div class="stat-label">MEMBER SINCE</div>
						<div class="stat-value">{customer.memberSince}</div>
						<div class="stat-sub">{getMembershipDuration(customer.memberSince)}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">RESERVATIONS</div>
						<div class="stat-value">{customer.totalReservations}</div>
						<div class="stat-sub">{customer.totalRounds} ROUNDS</div>
					</div>
				</div>

				<div class="customer-metrics">
					<div class="metric-row">
						<span class="metric-label">TOTAL DISTANCE:</span>
						<span class="metric-value">{customer.totalDistance} KM</span>
					</div>
					<div class="metric-row">
						<span class="metric-label">AVG RATING:</span>
						<span class="metric-value">{'★'.repeat(Math.floor(customer.averageRating))} {customer.averageRating.toFixed(1)}</span>
					</div>
				</div>

				<div class="customer-footer">
					<div class="status-badge" class:active={customer.status === 'active'} class:inactive={customer.status === 'inactive'}>
						<span class="status-symbol">{getStatusSymbol(customer.status)}</span>
						{customer.status.toUpperCase()}
					</div>
					{#if customer.lastVisit}
						<div class="last-visit">LAST: {customer.lastVisit}</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if filteredCustomers.length === 0}
		<div class="no-data">
			NO CUSTOMERS FOUND
		</div>
	{/if}
</div>

<!-- Customer Detail Modal -->
{#if selectedCustomer}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		on:click={closeModal}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="modal-content"
			role="dialog"
			aria-modal="true"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div class="modal-header">
				<div>
					<h2 class="modal-title">{selectedCustomer.name}</h2>
					<div class="modal-subtitle">
						{selectedCustomer.id} • {getTierLabel(selectedCustomer.membershipTier)} MEMBER
					</div>
				</div>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="detail-section">
					<div class="section-title">MEMBERSHIP INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">MEMBERSHIP TIER</div>
							<div class="detail-value">
								<span class="tier-symbol">{getTierSymbol(selectedCustomer.membershipTier)}</span>
								{getTierLabel(selectedCustomer.membershipTier)}
							</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">MEMBER SINCE</div>
							<div class="detail-value">{selectedCustomer.memberSince}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">DURATION</div>
							<div class="detail-value">{getMembershipDuration(selectedCustomer.memberSince)}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">STATUS</div>
							<div class="detail-value">
								<span class="status-symbol">{getStatusSymbol(selectedCustomer.status)}</span>
								{selectedCustomer.status.toUpperCase()}
							</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">CONTACT INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">EMAIL</div>
							<div class="detail-value">{selectedCustomer.email}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">PHONE</div>
							<div class="detail-value">{selectedCustomer.phone}</div>
						</div>
					</div>
				</div>

				{#if selectedCustomer.emergencyContact}
					<div class="detail-section">
						<div class="section-title">EMERGENCY CONTACT</div>
						<div class="detail-grid">
							<div class="detail-item">
								<div class="detail-label">NAME</div>
								<div class="detail-value">{selectedCustomer.emergencyContact.name}</div>
							</div>
							<div class="detail-item">
								<div class="detail-label">PHONE</div>
								<div class="detail-value">{selectedCustomer.emergencyContact.phone}</div>
							</div>
							<div class="detail-item">
								<div class="detail-label">RELATIONSHIP</div>
								<div class="detail-value">{selectedCustomer.emergencyContact.relationship}</div>
							</div>
						</div>
					</div>
				{/if}

				<div class="detail-section">
					<div class="section-title">ACTIVITY STATISTICS</div>
					<div class="stats-grid">
						<div class="stat-box">
							<div class="stat-box-value">{selectedCustomer.totalReservations}</div>
							<div class="stat-box-label">RESERVATIONS</div>
						</div>
						<div class="stat-box">
							<div class="stat-box-value">{selectedCustomer.totalRounds}</div>
							<div class="stat-box-label">ROUNDS PLAYED</div>
						</div>
						<div class="stat-box">
							<div class="stat-box-value">{selectedCustomer.totalDistance}</div>
							<div class="stat-box-label">TOTAL KM</div>
						</div>
						<div class="stat-box">
							<div class="stat-box-value">{selectedCustomer.averageRating.toFixed(1)}</div>
							<div class="stat-box-label">AVG RATING</div>
						</div>
					</div>
				</div>

				{#if selectedCustomer.preferredVehicleType}
					<div class="detail-section">
						<div class="section-title">PREFERENCES</div>
						<div class="preference-item">
							<span class="preference-label">PREFERRED VEHICLE:</span>
							<span class="preference-value">{selectedCustomer.preferredVehicleType}</span>
						</div>
					</div>
				{/if}

				{#if selectedCustomer.lastVisit}
					<div class="detail-section">
						<div class="section-title">RECENT ACTIVITY</div>
						<div class="activity-item">
							<span class="activity-label">LAST VISIT:</span>
							<span class="activity-value">{selectedCustomer.lastVisit}</span>
						</div>
					</div>
				{/if}

				{#if selectedCustomer.notes}
					<div class="detail-section">
						<div class="section-title">NOTES</div>
						<div class="notes-content">{selectedCustomer.notes}</div>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeModal}>CLOSE</button>
				<button class="btn-secondary">VIEW RESERVATIONS</button>
				<button class="btn-primary">EDIT CUSTOMER</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.customers-page {
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

	.btn-primary:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.btn-secondary {
		padding: var(--space-3) var(--space-4);
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.btn-secondary:hover {
		background: var(--color-gray-04);
	}

	.btn-secondary:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	/* Summary Cards */
	.summary-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.summary-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		min-height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.summary-card.vip {
		border-width: var(--border-width-2);
		background: var(--color-gray-04);
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
		flex-wrap: wrap;
		gap: var(--space-3);
		align-items: center;
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.search-box {
		flex: 1;
		min-width: 250px;
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
		background: var(--color-white);
		transition: border-color var(--duration-fast) var(--easing-linear);
	}

	.search-box input:focus {
		outline: none;
		border-color: var(--color-black);
		border-width: var(--border-width-2);
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
		min-width: 130px;
		cursor: pointer;
		transition: border-color var(--duration-fast) var(--easing-linear);
	}

	.filter-group select:focus {
		outline: none;
		border-color: var(--color-black);
		border-width: var(--border-width-2);
	}

	.results-count {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-left: auto;
	}

	/* Customers Grid */
	.customers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: var(--space-5);
	}

	.customer-card {
		/* Override global button styles */
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		height: auto;
		width: 100%;

		gap: var(--space-3);
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		text-align: left;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
		text-transform: none;
		white-space: normal;
		letter-spacing: normal;
		font-weight: var(--font-normal);
		font-size: var(--text-base);
	}

	.customer-card:hover {
		border-color: var(--color-black);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.customer-card:focus {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.customer-card:focus:not(:focus-visible) {
		outline: none;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.customer-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
		flex: 1;
	}

	.membership-tier {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		white-space: nowrap;
	}

	.membership-tier.vip {
		border-color: var(--color-black);
		background: var(--color-gray-04);
	}

	.membership-tier.premium {
		border-color: var(--color-gray-40);
	}

	.tier-symbol {
		font-size: 10px;
	}

	.customer-id {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.contact-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.contact-icon {
		font-size: 10px;
	}

	.customer-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
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
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.stat-sub {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.customer-metrics {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3) 0;
		border-top: var(--border-width) solid var(--color-gray-12);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.metric-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-sm);
	}

	.metric-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.metric-value {
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.customer-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-badge {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.status-badge.active {
		border-color: var(--color-black);
	}

	.status-badge.inactive {
		border-style: dashed;
	}

	.status-symbol {
		font-size: 10px;
	}

	.last-visit {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-family: monospace;
	}

	.no-data {
		padding: var(--space-8);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
	}

	.modal-content {
		background: var(--color-white);
		border: var(--border-width-2) solid var(--color-black);
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.modal-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin: 0 0 var(--space-1) 0;
	}

	.modal-subtitle {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--text-lg);
		cursor: pointer;
		padding: var(--space-2);
		transition: transform var(--duration-fast) var(--easing-linear);
	}

	.close-btn:hover {
		transform: scale(1.1);
	}

	.close-btn:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.modal-body {
		padding: var(--space-4);
		overflow-y: auto;
		flex: 1;
	}

	.detail-section {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.detail-section:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
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
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3);
	}

	.stat-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.stat-box-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.stat-box-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		text-align: center;
	}

	.preference-item,
	.activity-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.preference-label,
	.activity-label {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-wide);
	}

	.preference-value,
	.activity-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.notes-content {
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.customers-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
			align-items: flex-start;
		}

		.customers-grid {
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.customers-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.summary-cards {
			grid-template-columns: repeat(2, 1fr);
		}

		.filters-section {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			min-width: 100%;
		}

		.results-count {
			margin-left: 0;
		}

		.customers-grid {
			grid-template-columns: 1fr;
		}

		.detail-grid {
			grid-template-columns: 1fr;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.modal-content {
			max-width: 100%;
			max-height: 100vh;
		}

		.modal-footer {
			flex-direction: column-reverse;
		}

		.modal-footer button {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.customers-page {
			padding: var(--space-2);
		}

		.page-title {
			font-size: var(--text-lg);
		}

		.summary-cards {
			grid-template-columns: 1fr;
		}

		.btn-primary,
		.btn-secondary {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}
	}
</style>
