<script lang="ts">
	import { notification } from '$lib/stores/notification';
	import { tenant } from '$lib/stores/tenant';

	interface Contract {
		id: string;
		golfCourseId: string;
		golfCourseName: string;
		location: string;
		status: 'active' | 'expiring_soon' | 'expired' | 'pending';
		type: 'purchase' | 'lease' | 'rental';
		startDate: string;
		endDate: string;
		vehicleCount: number;
		monthlyPayment: number;
		totalValue: number;
		paymentStatus: 'current' | 'overdue' | 'pending';
		renewalOption: boolean;
		autoRenewal: boolean;
		documents: string[];
		contactPerson: string;
		contactEmail: string;
		contactPhone: string;
	}

	// Mock contracts data
	const contracts: Contract[] = [
		{
			id: 'CONTRACT-001',
			golfCourseId: 'tenant-001',
			golfCourseName: 'Pine Valley Golf Club',
			location: 'Pine Valley, NJ, USA',
			status: 'active',
			type: 'lease',
			startDate: '2024-01-01',
			endDate: '2026-12-31',
			vehicleCount: 25,
			monthlyPayment: 18750,
			totalValue: 675000,
			paymentStatus: 'current',
			renewalOption: true,
			autoRenewal: false,
			documents: ['contract_001.pdf', 'insurance_001.pdf', 'maintenance_agreement_001.pdf'],
			contactPerson: 'John Smith',
			contactEmail: 'john.smith@pinevalley.com',
			contactPhone: '+1-609-783-3000'
		},
		{
			id: 'CONTRACT-002',
			golfCourseId: 'tenant-002',
			golfCourseName: 'Augusta National Golf Club',
			location: 'Augusta, GA, USA',
			status: 'active',
			type: 'purchase',
			startDate: '2023-06-15',
			endDate: '2028-06-14',
			vehicleCount: 35,
			monthlyPayment: 0,
			totalValue: 1680000,
			paymentStatus: 'current',
			renewalOption: false,
			autoRenewal: false,
			documents: ['contract_002.pdf', 'purchase_agreement_002.pdf', 'warranty_002.pdf'],
			contactPerson: 'Michael Johnson',
			contactEmail: 'm.johnson@augusta.com',
			contactPhone: '+1-706-667-6000'
		},
		{
			id: 'CONTRACT-003',
			golfCourseId: 'tenant-003',
			golfCourseName: 'Pebble Beach Golf Links',
			location: 'Pebble Beach, CA, USA',
			status: 'expiring_soon',
			type: 'lease',
			startDate: '2022-03-01',
			endDate: '2025-02-28',
			vehicleCount: 18,
			monthlyPayment: 13500,
			totalValue: 486000,
			paymentStatus: 'current',
			renewalOption: true,
			autoRenewal: true,
			documents: ['contract_003.pdf', 'lease_agreement_003.pdf'],
			contactPerson: 'Sarah Williams',
			contactEmail: 's.williams@pebblebeach.com',
			contactPhone: '+1-831-622-8723'
		},
		{
			id: 'CONTRACT-004',
			golfCourseId: 'tenant-004',
			golfCourseName: 'St Andrews Links',
			location: 'St Andrews, Scotland',
			status: 'pending',
			type: 'rental',
			startDate: '2024-11-01',
			endDate: '2025-10-31',
			vehicleCount: 12,
			monthlyPayment: 9600,
			totalValue: 115200,
			paymentStatus: 'pending',
			renewalOption: true,
			autoRenewal: false,
			documents: ['proposal_004.pdf'],
			contactPerson: 'James McGregor',
			contactEmail: 'j.mcgregor@standrews.com',
			contactPhone: '+44-1334-466666'
		},
		{
			id: 'CONTRACT-005',
			golfCourseId: 'tenant-005',
			golfCourseName: 'Cypress Point Club',
			location: 'Pebble Beach, CA, USA',
			status: 'expired',
			type: 'lease',
			startDate: '2021-01-01',
			endDate: '2024-09-30',
			vehicleCount: 15,
			monthlyPayment: 11250,
			totalValue: 506250,
			paymentStatus: 'overdue',
			renewalOption: true,
			autoRenewal: false,
			documents: ['contract_005.pdf', 'expired_notice_005.pdf'],
			contactPerson: 'Robert Taylor',
			contactEmail: 'r.taylor@cypresspoint.com',
			contactPhone: '+1-831-624-2223'
		}
	];

	let selectedContract: Contract | null = null;
	let filterStatus: Contract['status'] | 'all' = 'all';
	let filterType: Contract['type'] | 'all' = 'all';
	let searchTerm = '';
	let sortBy: 'name' | 'endDate' | 'value' | 'vehicles' = 'name';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Computed values
	$: filteredContracts = contracts
		.filter(contract => {
			const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
			const matchesType = filterType === 'all' || contract.type === filterType;
			const matchesSearch = !searchTerm ||
				contract.golfCourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				contract.location.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesStatus && matchesType && matchesSearch;
		})
		.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'name':
					comparison = a.golfCourseName.localeCompare(b.golfCourseName);
					break;
				case 'endDate':
					comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
					break;
				case 'value':
					comparison = a.totalValue - b.totalValue;
					break;
				case 'vehicles':
					comparison = a.vehicleCount - b.vehicleCount;
					break;
			}
			return sortDirection === 'asc' ? comparison : -comparison;
		});

	$: activeContracts = contracts.filter(c => c.status === 'active').length;
	$: expiringSoon = contracts.filter(c => c.status === 'expiring_soon').length;
	$: totalVehicles = contracts.filter(c => c.status === 'active' || c.status === 'expiring_soon').reduce((sum, c) => sum + c.vehicleCount, 0);
	$: monthlyRevenue = contracts.filter(c => c.status === 'active' || c.status === 'expiring_soon').reduce((sum, c) => sum + c.monthlyPayment, 0);

	function getStatusSymbol(status: Contract['status']): string {
		switch (status) {
			case 'active': return '■';
			case 'expiring_soon': return '▲';
			case 'expired': return '✖';
			case 'pending': return '◆';
		}
	}

	function getTypeLabel(type: Contract['type']): string {
		switch (type) {
			case 'purchase': return 'PURCHASE';
			case 'lease': return 'LEASE';
			case 'rental': return 'RENTAL';
		}
	}

	function getDaysUntilExpiry(endDate: string): number {
		const end = new Date(endDate);
		const now = new Date();
		const diff = end.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}

	function formatCurrency(amount: number): string {
		return `$${amount.toLocaleString()}`;
	}

	function handleContractClick(contract: Contract) {
		selectedContract = contract;
	}

	function closeModal() {
		selectedContract = null;
	}

	function toggleSort(field: typeof sortBy) {
		if (sortBy === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortDirection = 'asc';
		}
	}

	function getSortIndicator(field: typeof sortBy): string {
		if (sortBy !== field) return '';
		return sortDirection === 'asc' ? ' ▲' : ' ▼';
	}
</script>

<div class="contracts-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">CONTRACT MANAGEMENT</h1>
			<p class="page-subtitle">Golf Course Contracts & Agreements</p>
		</div>
		<button class="btn-primary">+ NEW CONTRACT</button>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">ACTIVE CONTRACTS</div>
			<div class="card-value">{activeContracts}</div>
			<div class="card-detail">CURRENTLY ACTIVE</div>
		</div>

		<div class="summary-card warning">
			<div class="card-label">EXPIRING SOON</div>
			<div class="card-value">{expiringSoon}</div>
			<div class="card-detail">WITHIN 90 DAYS</div>
		</div>

		<div class="summary-card">
			<div class="card-label">TOTAL VEHICLES</div>
			<div class="card-value">{totalVehicles}</div>
			<div class="card-detail">UNDER CONTRACT</div>
		</div>

		<div class="summary-card">
			<div class="card-label">MONTHLY REVENUE</div>
			<div class="card-value">{formatCurrency(monthlyRevenue)}</div>
			<div class="card-detail">FROM ACTIVE CONTRACTS</div>
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
				placeholder="Golf course name, ID, or location..."
			/>
		</div>

		<div class="filter-group">
			<label for="status-filter">STATUS:</label>
			<select id="status-filter" bind:value={filterStatus}>
				<option value="all">ALL</option>
				<option value="active">ACTIVE</option>
				<option value="expiring_soon">EXPIRING SOON</option>
				<option value="pending">PENDING</option>
				<option value="expired">EXPIRED</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="type-filter">TYPE:</label>
			<select id="type-filter" bind:value={filterType}>
				<option value="all">ALL</option>
				<option value="purchase">PURCHASE</option>
				<option value="lease">LEASE</option>
				<option value="rental">RENTAL</option>
			</select>
		</div>

		<div class="results-count">
			SHOWING {filteredContracts.length} OF {contracts.length}
		</div>
	</div>

	<!-- Contracts Grid -->
	<div class="contracts-grid">
		{#each filteredContracts as contract}
			<button class="contract-card" on:click={() => handleContractClick(contract)}>
				<div class="card-header">
					<div class="golf-course-name">{contract.golfCourseName}</div>
					<div class="contract-status">
						<span class="status-symbol">{getStatusSymbol(contract.status)}</span>
						{contract.status.toUpperCase().replace('_', ' ')}
					</div>
				</div>

				<div class="contract-id">{contract.id}</div>
				<div class="contract-location">{contract.location}</div>

				<div class="contract-details">
					<div class="detail-row">
						<span class="detail-label">TYPE:</span>
						<span class="detail-value">{getTypeLabel(contract.type)}</span>
					</div>
					<div class="detail-row">
						<span class="detail-label">VEHICLES:</span>
						<span class="detail-value">{contract.vehicleCount} UNITS</span>
					</div>
					<div class="detail-row">
						<span class="detail-label">PERIOD:</span>
						<span class="detail-value">{contract.startDate} ~ {contract.endDate}</span>
					</div>
					{#if contract.status === 'expiring_soon'}
						<div class="detail-row expiring">
							<span class="detail-label">EXPIRES IN:</span>
							<span class="detail-value">{getDaysUntilExpiry(contract.endDate)} DAYS</span>
						</div>
					{/if}
				</div>

				<div class="contract-financials">
					<div class="financial-item">
						<span class="financial-label">TOTAL VALUE:</span>
						<span class="financial-value">{formatCurrency(contract.totalValue)}</span>
					</div>
					{#if contract.monthlyPayment > 0}
						<div class="financial-item">
							<span class="financial-label">MONTHLY:</span>
							<span class="financial-value">{formatCurrency(contract.monthlyPayment)}</span>
						</div>
					{/if}
				</div>

				<div class="contract-footer">
					<div class="contact-info">
						<span class="contact-icon">●</span>
						{contract.contactPerson}
					</div>
					<div class="renewal-badge" class:active={contract.renewalOption}>
						{contract.renewalOption ? 'RENEWABLE' : 'NON-RENEWABLE'}
					</div>
				</div>
			</button>
		{/each}
	</div>

	{#if filteredContracts.length === 0}
		<div class="no-data">
			NO CONTRACTS FOUND
		</div>
	{/if}
</div>

<!-- Contract Detail Modal -->
{#if selectedContract}
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
					<h2 class="modal-title">{selectedContract.golfCourseName}</h2>
					<div class="modal-subtitle">{selectedContract.id} • {selectedContract.location}</div>
				</div>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="detail-section">
					<div class="section-title">CONTRACT INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">STATUS</div>
							<div class="detail-value">
								<span class="status-symbol">{getStatusSymbol(selectedContract.status)}</span>
								{selectedContract.status.toUpperCase().replace('_', ' ')}
							</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">TYPE</div>
							<div class="detail-value">{getTypeLabel(selectedContract.type)}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">START DATE</div>
							<div class="detail-value">{selectedContract.startDate}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">END DATE</div>
							<div class="detail-value">{selectedContract.endDate}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">VEHICLE COUNT</div>
							<div class="detail-value">{selectedContract.vehicleCount} UNITS</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">PAYMENT STATUS</div>
							<div class="detail-value">{selectedContract.paymentStatus.toUpperCase()}</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">FINANCIAL DETAILS</div>
					<div class="financial-details">
						<div class="financial-row">
							<span class="financial-label">TOTAL CONTRACT VALUE:</span>
							<span class="financial-value">{formatCurrency(selectedContract.totalValue)}</span>
						</div>
						{#if selectedContract.monthlyPayment > 0}
							<div class="financial-row">
								<span class="financial-label">MONTHLY PAYMENT:</span>
								<span class="financial-value">{formatCurrency(selectedContract.monthlyPayment)}</span>
							</div>
						{/if}
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">CONTACT INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">CONTACT PERSON</div>
							<div class="detail-value">{selectedContract.contactPerson}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">EMAIL</div>
							<div class="detail-value">{selectedContract.contactEmail}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">PHONE</div>
							<div class="detail-value">{selectedContract.contactPhone}</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">CONTRACT OPTIONS</div>
					<div class="options-grid">
						<div class="option-item">
							<div class="option-status {selectedContract.renewalOption ? 'enabled' : 'disabled'}">
								{selectedContract.renewalOption ? '■' : '⬚'}
							</div>
							<div class="option-label">RENEWAL OPTION</div>
						</div>
						<div class="option-item">
							<div class="option-status {selectedContract.autoRenewal ? 'enabled' : 'disabled'}">
								{selectedContract.autoRenewal ? '■' : '⬚'}
							</div>
							<div class="option-label">AUTO-RENEWAL</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">DOCUMENTS ({selectedContract.documents.length})</div>
					<div class="documents-list">
						{#each selectedContract.documents as doc}
							<div class="document-item">
								<span class="document-icon">■</span>
								{doc}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeModal}>CLOSE</button>
				{#if selectedContract.status === 'expiring_soon'}
					<button class="btn-primary">RENEW CONTRACT</button>
				{:else if selectedContract.status === 'pending'}
					<button class="btn-primary">APPROVE CONTRACT</button>
				{:else if selectedContract.status === 'active'}
					<button class="btn-secondary">EDIT CONTRACT</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.contracts-page {
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

	.summary-card.warning {
		border-width: var(--border-width-2);
		border-style: dashed;
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
		min-width: 150px;
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

	/* Contracts Grid */
	.contracts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
		gap: var(--space-5);
	}

	.contract-card {
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

	.contract-card:hover {
		border-color: var(--color-black);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.contract-card:focus {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.contract-card:focus:not(:focus-visible) {
		outline: none;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.golf-course-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
		flex: 1;
	}

	.contract-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		white-space: nowrap;
	}

	.status-symbol {
		font-size: 10px;
	}

	.contract-id {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.contract-location {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.contract-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
	}

	.detail-row.expiring {
		color: var(--color-black);
		font-weight: var(--font-medium);
	}

	.detail-label {
		color: var(--color-gray-40);
		font-size: var(--text-xs);
	}

	.detail-value {
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.contract-financials {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3) 0;
		border-top: var(--border-width) solid var(--color-gray-12);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.financial-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.financial-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.financial-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.contract-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.contact-info {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.contact-icon {
		font-size: 8px;
	}

	.renewal-badge {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
	}

	.renewal-badge.active {
		border-color: var(--color-black);
		font-weight: var(--font-medium);
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

	.detail-item .detail-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.detail-item .detail-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.financial-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.financial-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.financial-row .financial-label {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-wide);
	}

	.financial-row .financial-value {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.option-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.option-status {
		font-size: var(--text-lg);
	}

	.option-status.enabled {
		color: var(--color-black);
	}

	.option-status.disabled {
		color: var(--color-gray-20);
	}

	.option-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.documents-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.document-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
		font-family: monospace;
	}

	.document-icon {
		font-size: 10px;
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
		.contracts-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
			align-items: flex-start;
		}

		.contracts-grid {
			grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.contracts-page {
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

		.contracts-grid {
			grid-template-columns: 1fr;
		}

		.detail-grid {
			grid-template-columns: 1fr;
		}

		.options-grid {
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
		.contracts-page {
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
