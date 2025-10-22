<script lang="ts">
	import { notification } from '$lib/stores/notification';

	interface DeliveryVehicle {
		model: string;
		quantity: number;
		vins: string[];
	}

	interface Delivery {
		id: string;
		golfCourseId: string;
		golfCourseName: string;
		location: string;
		contractId: string;
		status: 'scheduled' | 'preparing' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
		vehicles: DeliveryVehicle[];
		totalVehicles: number;
		scheduledDate: string;
		estimatedArrival?: string;
		deliveredDate?: string;
		carrier: string;
		trackingNumber?: string;
		contactPerson: string;
		contactPhone: string;
		deliveryAddress: string;
		notes?: string;
		documents: string[];
	}

	// Mock deliveries data
	const deliveries: Delivery[] = [
		{
			id: 'DELIVERY-001',
			golfCourseId: 'tenant-001',
			golfCourseName: 'Pine Valley Golf Club',
			location: 'Pine Valley, NJ, USA',
			contractId: 'CONTRACT-001',
			status: 'in_transit',
			vehicles: [
				{ model: 'APROFLEET CARGO', quantity: 8, vins: ['APGC00000101', 'APGC00000102', 'APGC00000103', 'APGC00000104', 'APGC00000105', 'APGC00000106', 'APGC00000107', 'APGC00000108'] },
				{ model: 'APROFLEET PASSENGER', quantity: 5, vins: ['APPG00000201', 'APPG00000202', 'APPG00000203', 'APPG00000204', 'APPG00000205'] }
			],
			totalVehicles: 13,
			scheduledDate: '2024-10-25',
			estimatedArrival: '2024-10-25 14:00',
			carrier: 'AproFleet Logistics',
			trackingNumber: 'AFL-2024-1025-001',
			contactPerson: 'John Smith',
			contactPhone: '+1-609-783-3000',
			deliveryAddress: '101 Pine Valley Drive, Pine Valley, NJ 08021',
			notes: 'Preferred delivery time: Morning. Setup crew will be available.',
			documents: ['delivery_manifest_001.pdf', 'vehicle_specs_001.pdf', 'insurance_docs_001.pdf']
		},
		{
			id: 'DELIVERY-002',
			golfCourseId: 'tenant-003',
			golfCourseName: 'Pebble Beach Golf Links',
			location: 'Pebble Beach, CA, USA',
			contractId: 'CONTRACT-003',
			status: 'preparing',
			vehicles: [
				{ model: 'APROFLEET SPORT', quantity: 6, vins: ['APSP00000301', 'APSP00000302', 'APSP00000303', 'APSP00000304', 'APSP00000305', 'APSP00000306'] }
			],
			totalVehicles: 6,
			scheduledDate: '2024-10-28',
			carrier: 'West Coast Transport',
			contactPerson: 'Sarah Williams',
			contactPhone: '+1-831-622-8723',
			deliveryAddress: '1700 17 Mile Drive, Pebble Beach, CA 93953',
			notes: 'Special handling required for Sport models',
			documents: ['delivery_order_002.pdf', 'inspection_checklist_002.pdf']
		},
		{
			id: 'DELIVERY-003',
			golfCourseId: 'tenant-002',
			golfCourseName: 'Augusta National Golf Club',
			location: 'Augusta, GA, USA',
			contractId: 'CONTRACT-002',
			status: 'delivered',
			vehicles: [
				{ model: 'APROFLEET CARGO', quantity: 10, vins: ['APGC00000401', 'APGC00000402', 'APGC00000403', 'APGC00000404', 'APGC00000405', 'APGC00000406', 'APGC00000407', 'APGC00000408', 'APGC00000409', 'APGC00000410'] },
				{ model: 'APROFLEET UTILITY', quantity: 5, vins: ['APUT00000501', 'APUT00000502', 'APUT00000503', 'APUT00000504', 'APUT00000505'] }
			],
			totalVehicles: 15,
			scheduledDate: '2024-10-15',
			estimatedArrival: '2024-10-15 10:00',
			deliveredDate: '2024-10-15 09:45',
			carrier: 'AproFleet Logistics',
			trackingNumber: 'AFL-2024-1015-003',
			contactPerson: 'Michael Johnson',
			contactPhone: '+1-706-667-6000',
			deliveryAddress: '2604 Washington Road, Augusta, GA 30904',
			documents: ['delivery_confirmation_003.pdf', 'signed_receipt_003.pdf']
		},
		{
			id: 'DELIVERY-004',
			golfCourseId: 'tenant-004',
			golfCourseName: 'St Andrews Links',
			location: 'St Andrews, Scotland',
			contractId: 'CONTRACT-004',
			status: 'scheduled',
			vehicles: [
				{ model: 'APROFLEET PASSENGER', quantity: 12, vins: ['APPG00000601', 'APPG00000602', 'APPG00000603', 'APPG00000604', 'APPG00000605', 'APPG00000606', 'APPG00000607', 'APPG00000608', 'APPG00000609', 'APPG00000610', 'APPG00000611', 'APPG00000612'] }
			],
			totalVehicles: 12,
			scheduledDate: '2024-11-05',
			carrier: 'International Freight Services',
			contactPerson: 'James McGregor',
			contactPhone: '+44-1334-466666',
			deliveryAddress: 'Pilmour Links, St Andrews, Fife KY16 9SF',
			notes: 'International shipment. Customs clearance required.',
			documents: ['shipping_manifest_004.pdf', 'customs_docs_004.pdf', 'import_license_004.pdf']
		},
		{
			id: 'DELIVERY-005',
			golfCourseId: 'tenant-005',
			golfCourseName: 'Cypress Point Club',
			location: 'Pebble Beach, CA, USA',
			contractId: 'CONTRACT-005',
			status: 'delayed',
			vehicles: [
				{ model: 'APROFLEET CARGO', quantity: 7, vins: ['APGC00000701', 'APGC00000702', 'APGC00000703', 'APGC00000704', 'APGC00000705', 'APGC00000706', 'APGC00000707'] }
			],
			totalVehicles: 7,
			scheduledDate: '2024-10-20',
			estimatedArrival: '2024-10-26 16:00',
			carrier: 'West Coast Transport',
			trackingNumber: 'WCT-2024-1020-005',
			contactPerson: 'Robert Taylor',
			contactPhone: '+1-831-624-2223',
			deliveryAddress: '3150 17 Mile Drive, Pebble Beach, CA 93953',
			notes: 'Delayed due to weather. Rescheduled for Oct 26.',
			documents: ['delay_notice_005.pdf', 'revised_schedule_005.pdf']
		}
	];

	let selectedDelivery: Delivery | null = null;
	let filterStatus: Delivery['status'] | 'all' = 'all';
	let searchTerm = '';
	let sortBy: 'date' | 'name' | 'vehicles' = 'date';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Computed values
	$: filteredDeliveries = deliveries
		.filter(delivery => {
			const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
			const matchesSearch = !searchTerm ||
				delivery.golfCourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				delivery.location.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesStatus && matchesSearch;
		})
		.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'date':
					comparison = new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
					break;
				case 'name':
					comparison = a.golfCourseName.localeCompare(b.golfCourseName);
					break;
				case 'vehicles':
					comparison = a.totalVehicles - b.totalVehicles;
					break;
			}
			return sortDirection === 'asc' ? comparison : -comparison;
		});

	$: scheduledCount = deliveries.filter(d => d.status === 'scheduled').length;
	$: inTransitCount = deliveries.filter(d => d.status === 'in_transit' || d.status === 'preparing').length;
	$: deliveredCount = deliveries.filter(d => d.status === 'delivered').length;
	$: delayedCount = deliveries.filter(d => d.status === 'delayed').length;

	function getStatusSymbol(status: Delivery['status']): string {
		switch (status) {
			case 'scheduled': return '◆';
			case 'preparing': return '◐';
			case 'in_transit': return '▶';
			case 'delivered': return '■';
			case 'delayed': return '▲';
			case 'cancelled': return '✖';
		}
	}

	function getStatusLabel(status: Delivery['status']): string {
		return status.toUpperCase().replace('_', ' ');
	}

	function getDaysUntilDelivery(scheduledDate: string): number {
		const scheduled = new Date(scheduledDate);
		const now = new Date();
		const diff = scheduled.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	}

	function handleDeliveryClick(delivery: Delivery) {
		selectedDelivery = delivery;
	}

	function closeModal() {
		selectedDelivery = null;
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

<div class="deliveries-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">DELIVERY MANAGEMENT</h1>
			<p class="page-subtitle">Vehicle Delivery Tracking & Logistics</p>
		</div>
		<button class="btn-primary">+ SCHEDULE DELIVERY</button>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">SCHEDULED</div>
			<div class="card-value">{scheduledCount}</div>
			<div class="card-detail">UPCOMING DELIVERIES</div>
		</div>

		<div class="summary-card active">
			<div class="card-label">IN PROGRESS</div>
			<div class="card-value">{inTransitCount}</div>
			<div class="card-detail">PREPARING / IN TRANSIT</div>
		</div>

		<div class="summary-card">
			<div class="card-label">DELIVERED</div>
			<div class="card-value">{deliveredCount}</div>
			<div class="card-detail">COMPLETED</div>
		</div>

		<div class="summary-card warning">
			<div class="card-label">DELAYED</div>
			<div class="card-value">{delayedCount}</div>
			<div class="card-detail">REQUIRES ATTENTION</div>
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
				<option value="scheduled">SCHEDULED</option>
				<option value="preparing">PREPARING</option>
				<option value="in_transit">IN TRANSIT</option>
				<option value="delivered">DELIVERED</option>
				<option value="delayed">DELAYED</option>
				<option value="cancelled">CANCELLED</option>
			</select>
		</div>

		<div class="results-count">
			SHOWING {filteredDeliveries.length} OF {deliveries.length}
		</div>
	</div>

	<!-- Deliveries Grid -->
	<div class="deliveries-grid">
		{#each filteredDeliveries as delivery}
			<button class="delivery-card" on:click={() => handleDeliveryClick(delivery)}>
				<div class="card-header">
					<div class="golf-course-name">{delivery.golfCourseName}</div>
					<div class="delivery-status">
						<span class="status-symbol">{getStatusSymbol(delivery.status)}</span>
						{getStatusLabel(delivery.status)}
					</div>
				</div>

				<div class="delivery-id">{delivery.id}</div>
				<div class="delivery-location">{delivery.location}</div>

				<div class="vehicle-summary">
					<div class="summary-header">VEHICLES ({delivery.totalVehicles} UNITS)</div>
					{#each delivery.vehicles as vehicle}
						<div class="vehicle-row">
							<span class="vehicle-model">{vehicle.model}</span>
							<span class="vehicle-quantity">× {vehicle.quantity}</span>
						</div>
					{/each}
				</div>

				<div class="delivery-timeline">
					<div class="timeline-item">
						<span class="timeline-label">SCHEDULED:</span>
						<span class="timeline-value">{delivery.scheduledDate}</span>
					</div>
					{#if delivery.estimatedArrival}
						<div class="timeline-item">
							<span class="timeline-label">ESTIMATED:</span>
							<span class="timeline-value">{delivery.estimatedArrival}</span>
						</div>
					{/if}
					{#if delivery.deliveredDate}
						<div class="timeline-item delivered">
							<span class="timeline-label">DELIVERED:</span>
							<span class="timeline-value">{delivery.deliveredDate}</span>
						</div>
					{/if}
					{#if delivery.status === 'scheduled' || delivery.status === 'preparing' || delivery.status === 'in_transit'}
						<div class="timeline-item countdown">
							<span class="timeline-label">
								{#if getDaysUntilDelivery(delivery.scheduledDate) > 0}
									IN {getDaysUntilDelivery(delivery.scheduledDate)} DAYS
								{:else if getDaysUntilDelivery(delivery.scheduledDate) === 0}
									TODAY
								{:else}
									OVERDUE
								{/if}
							</span>
						</div>
					{/if}
				</div>

				<div class="delivery-footer">
					<div class="carrier-info">
						<span class="carrier-icon">■</span>
						{delivery.carrier}
					</div>
					{#if delivery.trackingNumber}
						<div class="tracking-badge">{delivery.trackingNumber}</div>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	{#if filteredDeliveries.length === 0}
		<div class="no-data">
			NO DELIVERIES FOUND
		</div>
	{/if}
</div>

<!-- Delivery Detail Modal -->
{#if selectedDelivery}
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
					<h2 class="modal-title">{selectedDelivery.golfCourseName}</h2>
					<div class="modal-subtitle">{selectedDelivery.id} • {selectedDelivery.location}</div>
				</div>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="detail-section">
					<div class="section-title">DELIVERY STATUS</div>
					<div class="status-display">
						<span class="status-symbol large">{getStatusSymbol(selectedDelivery.status)}</span>
						<div class="status-info">
							<div class="status-label">{getStatusLabel(selectedDelivery.status)}</div>
							<div class="status-detail">Contract: {selectedDelivery.contractId}</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">TIMELINE</div>
					<div class="timeline-grid">
						<div class="timeline-entry">
							<div class="entry-label">SCHEDULED DATE</div>
							<div class="entry-value">{selectedDelivery.scheduledDate}</div>
						</div>
						{#if selectedDelivery.estimatedArrival}
							<div class="timeline-entry">
								<div class="entry-label">ESTIMATED ARRIVAL</div>
								<div class="entry-value">{selectedDelivery.estimatedArrival}</div>
							</div>
						{/if}
						{#if selectedDelivery.deliveredDate}
							<div class="timeline-entry">
								<div class="entry-label">DELIVERED DATE</div>
								<div class="entry-value">{selectedDelivery.deliveredDate}</div>
							</div>
						{/if}
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">VEHICLES ({selectedDelivery.totalVehicles} UNITS)</div>
					{#each selectedDelivery.vehicles as vehicle}
						<div class="vehicle-detail">
							<div class="vehicle-model-header">{vehicle.model} × {vehicle.quantity}</div>
							<div class="vin-list">
								{#each vehicle.vins as vin}
									<div class="vin-item">{vin}</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="detail-section">
					<div class="section-title">LOGISTICS</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">CARRIER</div>
							<div class="detail-value">{selectedDelivery.carrier}</div>
						</div>
						{#if selectedDelivery.trackingNumber}
							<div class="detail-item">
								<div class="detail-label">TRACKING NUMBER</div>
								<div class="detail-value">{selectedDelivery.trackingNumber}</div>
							</div>
						{/if}
						<div class="detail-item">
							<div class="detail-label">DELIVERY ADDRESS</div>
							<div class="detail-value">{selectedDelivery.deliveryAddress}</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">CONTACT INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">CONTACT PERSON</div>
							<div class="detail-value">{selectedDelivery.contactPerson}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">PHONE</div>
							<div class="detail-value">{selectedDelivery.contactPhone}</div>
						</div>
					</div>
				</div>

				{#if selectedDelivery.notes}
					<div class="detail-section">
						<div class="section-title">NOTES</div>
						<div class="notes-content">{selectedDelivery.notes}</div>
					</div>
				{/if}

				<div class="detail-section">
					<div class="section-title">DOCUMENTS ({selectedDelivery.documents.length})</div>
					<div class="documents-list">
						{#each selectedDelivery.documents as doc}
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
				{#if selectedDelivery.status === 'scheduled' || selectedDelivery.status === 'preparing'}
					<button class="btn-secondary">UPDATE STATUS</button>
					<button class="btn-primary">START DELIVERY</button>
				{:else if selectedDelivery.status === 'in_transit'}
					<button class="btn-primary">CONFIRM DELIVERY</button>
				{:else if selectedDelivery.status === 'delayed'}
					<button class="btn-secondary">RESCHEDULE</button>
					<button class="btn-primary">UPDATE ETA</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.deliveries-page {
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

	.summary-card.active {
		border-width: var(--border-width-2);
		background: var(--color-gray-04);
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

	/* Deliveries Grid */
	.deliveries-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
		gap: var(--space-5);
	}

	.delivery-card {
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

	.delivery-card:hover {
		border-color: var(--color-black);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.delivery-card:focus {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.delivery-card:focus:not(:focus-visible) {
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

	.delivery-status {
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

	.delivery-id {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.delivery-location {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.vehicle-summary {
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.summary-header {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.vehicle-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
	}

	.vehicle-model {
		font-weight: var(--font-medium);
	}

	.vehicle-quantity {
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.delivery-timeline {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3) 0;
		border-top: var(--border-width) solid var(--color-gray-12);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.timeline-item {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
	}

	.timeline-item.delivered {
		font-weight: var(--font-medium);
	}

	.timeline-item.countdown {
		justify-content: center;
		font-weight: var(--font-medium);
		padding-top: var(--space-1);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.timeline-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.timeline-value {
		font-family: monospace;
	}

	.delivery-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}

	.carrier-info {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.carrier-icon {
		font-size: 8px;
	}

	.tracking-badge {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		font-family: monospace;
		letter-spacing: var(--tracking-wide);
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

	.status-display {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.status-symbol.large {
		font-size: 24px;
	}

	.status-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.status-label {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
	}

	.status-detail {
		font-size: var(--text-sm);
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.timeline-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.timeline-entry {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.entry-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.entry-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.vehicle-detail {
		margin-bottom: var(--space-3);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.vehicle-model-header {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
	}

	.vin-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: var(--space-1);
	}

	.vin-item {
		font-family: monospace;
		font-size: var(--text-xs);
		padding: var(--space-1);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
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

	.notes-content {
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
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
		.deliveries-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
			align-items: flex-start;
		}

		.deliveries-grid {
			grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.deliveries-page {
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

		.deliveries-grid {
			grid-template-columns: 1fr;
		}

		.timeline-grid {
			grid-template-columns: 1fr;
		}

		.vin-list {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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
		.deliveries-page {
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

		.vin-list {
			grid-template-columns: 1fr;
		}
	}
</style>
