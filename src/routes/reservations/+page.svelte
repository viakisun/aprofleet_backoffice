<script lang="ts">
	import { onMount } from 'svelte';
	import { notification } from '$lib/stores/notification';
	import { vehicle } from '$lib/stores/vehicle';

	interface Reservation {
		id: string;
		customerId: string;
		customerName: string;
		vehicleVin: string;
		vehicleModel: string;
		startTime: string;
		endTime: string;
		status: 'scheduled' | 'active' | 'completed' | 'cancelled';
		holes: number;
		players: number;
		notes?: string;
	}

	// Mock reservation data
	const mockReservations: Reservation[] = [
		{
			id: 'RES-001',
			customerId: 'CUST-123',
			customerName: 'John Smith',
			vehicleVin: 'APGC00000001',
			vehicleModel: 'AP-2024',
			startTime: '2024-10-22T09:00:00',
			endTime: '2024-10-22T13:00:00',
			status: 'active',
			holes: 18,
			players: 4,
			notes: 'VIP Member'
		},
		{
			id: 'RES-002',
			customerId: 'CUST-456',
			customerName: 'Jane Doe',
			vehicleVin: 'APGC00000002',
			vehicleModel: 'AP-2024 Elite',
			startTime: '2024-10-22T10:30:00',
			endTime: '2024-10-22T14:30:00',
			status: 'active',
			holes: 18,
			players: 2
		},
		{
			id: 'RES-003',
			customerId: 'CUST-789',
			customerName: 'Mike Johnson',
			vehicleVin: 'APGC00000003',
			vehicleModel: 'AP-2023',
			startTime: '2024-10-22T14:00:00',
			endTime: '2024-10-22T17:00:00',
			status: 'scheduled',
			holes: 9,
			players: 3
		},
		{
			id: 'RES-004',
			customerId: 'CUST-321',
			customerName: 'Sarah Wilson',
			vehicleVin: 'APGC00000004',
			vehicleModel: 'AP-2024',
			startTime: '2024-10-22T07:00:00',
			endTime: '2024-10-22T11:00:00',
			status: 'completed',
			holes: 18,
			players: 4
		}
	];

	let reservations = mockReservations;
	let filterStatus: 'all' | 'scheduled' | 'active' | 'completed' | 'cancelled' = 'all';
	let searchQuery = '';
	let showNewReservationForm = false;

	// New reservation form
	let newReservation = {
		customerName: '',
		vehicleVin: '',
		startTime: '',
		endTime: '',
		holes: 18,
		players: 4,
		notes: ''
	};

	$: filteredReservations = reservations.filter(r => {
		const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
		const matchesSearch = !searchQuery ||
			r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			r.vehicleVin.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	$: statistics = {
		total: reservations.length,
		scheduled: reservations.filter(r => r.status === 'scheduled').length,
		active: reservations.filter(r => r.status === 'active').length,
		completed: reservations.filter(r => r.status === 'completed').length,
		cancelled: reservations.filter(r => r.status === 'cancelled').length
	};

	function getStatusIndicator(status: string): string {
		switch (status) {
			case 'scheduled': return '⬚';
			case 'active': return '■';
			case 'completed': return '✓';
			case 'cancelled': return '✖';
			default: return '•';
		}
	}

	function handleCreateReservation() {
		// Mock create reservation
		const newRes: Reservation = {
			id: `RES-${String(reservations.length + 1).padStart(3, '0')}`,
			customerId: `CUST-${Math.floor(Math.random() * 1000)}`,
			...newReservation,
			status: 'scheduled'
		};

		reservations = [newRes, ...reservations];
		showNewReservationForm = false;

		// Reset form
		newReservation = {
			customerName: '',
			vehicleVin: '',
			startTime: '',
			endTime: '',
			holes: 18,
			players: 4,
			notes: ''
		};

		notification.success('RESERVATION CREATED', `Reservation ${newRes.id} has been created`);
	}

	function handleCancelReservation(id: string) {
		reservations = reservations.map(r =>
			r.id === id ? { ...r, status: 'cancelled' as const } : r
		);
		notification.success('RESERVATION CANCELLED', `Reservation ${id} has been cancelled`);
	}

	function handleCompleteReservation(id: string) {
		reservations = reservations.map(r =>
			r.id === id ? { ...r, status: 'completed' as const } : r
		);
		notification.success('RESERVATION COMPLETED', `Reservation ${id} marked as completed`);
	}

	function formatDateTime(dateTime: string): string {
		const date = new Date(dateTime);
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getDuration(start: string, end: string): string {
		const diff = new Date(end).getTime() - new Date(start).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}H ${minutes}M`;
	}
</script>

<div class="reservations-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">RESERVATIONS</h1>
				<div class="page-meta">
					<span class="meta-item">{filteredReservations.length} RESERVATIONS</span>
				</div>
			</div>
			<div class="header-actions">
				<button class="action-button primary" on:click={() => showNewReservationForm = true}>
					+ NEW RESERVATION
				</button>
			</div>
		</div>

		<!-- Statistics -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value">{statistics.total}</div>
				<div class="stat-label">TOTAL</div>
			</div>
			<div class="stat-card scheduled">
				<div class="stat-icon">⬚</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.scheduled}</div>
					<div class="stat-label">SCHEDULED</div>
				</div>
			</div>
			<div class="stat-card active">
				<div class="stat-icon">■</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.active}</div>
					<div class="stat-label">ACTIVE</div>
				</div>
			</div>
			<div class="stat-card completed">
				<div class="stat-icon">✓</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.completed}</div>
					<div class="stat-label">COMPLETED</div>
				</div>
			</div>
			<div class="stat-card cancelled">
				<div class="stat-icon">✖</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.cancelled}</div>
					<div class="stat-label">CANCELLED</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="filters-bar">
			<div class="filter-group">
				<select bind:value={filterStatus} class="filter-select">
					<option value="all">ALL STATUS</option>
					<option value="scheduled">SCHEDULED</option>
					<option value="active">ACTIVE</option>
					<option value="completed">COMPLETED</option>
					<option value="cancelled">CANCELLED</option>
				</select>

				<input
					type="text"
					bind:value={searchQuery}
					placeholder="SEARCH..."
					class="filter-search"
				/>
			</div>
		</div>

		<!-- Reservations List -->
		<div class="reservations-list">
			{#each filteredReservations as reservation}
				<div
					class="reservation-card"
					class:scheduled={reservation.status === 'scheduled'}
					class:active={reservation.status === 'active'}
					class:completed={reservation.status === 'completed'}
					class:cancelled={reservation.status === 'cancelled'}
				>
					<div class="card-header">
						<div class="header-left">
							<span class="status-indicator">{getStatusIndicator(reservation.status)}</span>
							<div class="header-info">
								<div class="reservation-id">{reservation.id}</div>
								<div class="customer-name">{reservation.customerName}</div>
							</div>
						</div>
						<div class="status-badge">{reservation.status.toUpperCase()}</div>
					</div>

					<div class="card-body">
						<div class="info-grid">
							<div class="info-item">
								<span class="info-label">VEHICLE</span>
								<span class="info-value">{reservation.vehicleVin}</span>
								<span class="info-sub">{reservation.vehicleModel}</span>
							</div>
							<div class="info-item">
								<span class="info-label">START TIME</span>
								<span class="info-value">{formatDateTime(reservation.startTime)}</span>
							</div>
							<div class="info-item">
								<span class="info-label">END TIME</span>
								<span class="info-value">{formatDateTime(reservation.endTime)}</span>
							</div>
							<div class="info-item">
								<span class="info-label">DURATION</span>
								<span class="info-value">{getDuration(reservation.startTime, reservation.endTime)}</span>
							</div>
							<div class="info-item">
								<span class="info-label">HOLES</span>
								<span class="info-value">{reservation.holes}</span>
							</div>
							<div class="info-item">
								<span class="info-label">PLAYERS</span>
								<span class="info-value">{reservation.players}</span>
							</div>
						</div>

						{#if reservation.notes}
							<div class="notes">
								<span class="notes-label">NOTES:</span>
								<span class="notes-text">{reservation.notes}</span>
							</div>
						{/if}
					</div>

					<div class="card-actions">
						{#if reservation.status === 'scheduled'}
							<button class="action-btn" on:click={() => handleCancelReservation(reservation.id)}>
								CANCEL
							</button>
						{:else if reservation.status === 'active'}
							<button class="action-btn primary" on:click={() => handleCompleteReservation(reservation.id)}>
								COMPLETE
							</button>
							<button class="action-btn" on:click={() => handleCancelReservation(reservation.id)}>
								CANCEL
							</button>
						{/if}
					</div>
				</div>
			{/each}

			{#if filteredReservations.length === 0}
				<div class="no-reservations">
					NO RESERVATIONS FOUND
				</div>
			{/if}
		</div>

		<!-- New Reservation Form Modal -->
		{#if showNewReservationForm}
			<div
				class="modal-overlay"
				role="button"
				tabindex="0"
				on:click={() => showNewReservationForm = false}
				on:keydown={(e) => e.key === 'Escape' && (showNewReservationForm = false)}
			>
				<div
					class="modal"
					role="dialog"
					aria-modal="true"
					on:click|stopPropagation
					on:keydown|stopPropagation
				>
					<div class="modal-header">
						<h2 class="modal-title">NEW RESERVATION</h2>
						<button class="close-button" on:click={() => showNewReservationForm = false}>
							✖
						</button>
					</div>

					<form class="modal-body" on:submit|preventDefault={handleCreateReservation}>
						<div class="form-group">
							<label for="customerName">CUSTOMER NAME</label>
							<input
								id="customerName"
								type="text"
								bind:value={newReservation.customerName}
								required
							/>
						</div>

						<div class="form-group">
							<label for="vehicleVin">VEHICLE VIN</label>
							<select
								id="vehicleVin"
								bind:value={newReservation.vehicleVin}
								required
							>
								<option value="">SELECT VEHICLE</option>
								{#each Array.from($vehicle.vehicles.values()).filter(v => v.status === 'idle') as v}
									<option value={v.vin}>{v.vin} - {v.model}</option>
								{/each}
							</select>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="startTime">START TIME</label>
								<input
									id="startTime"
									type="datetime-local"
									bind:value={newReservation.startTime}
									required
								/>
							</div>

							<div class="form-group">
								<label for="endTime">END TIME</label>
								<input
									id="endTime"
									type="datetime-local"
									bind:value={newReservation.endTime}
									required
								/>
							</div>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="holes">HOLES</label>
								<select id="holes" bind:value={newReservation.holes}>
									<option value={9}>9 HOLES</option>
									<option value={18}>18 HOLES</option>
								</select>
							</div>

							<div class="form-group">
								<label for="players">PLAYERS</label>
								<input
									id="players"
									type="number"
									min="1"
									max="4"
									bind:value={newReservation.players}
									required
								/>
							</div>
						</div>

						<div class="form-group">
							<label for="notes">NOTES (OPTIONAL)</label>
							<textarea
								id="notes"
								bind:value={newReservation.notes}
								rows="3"
							></textarea>
						</div>

						<div class="form-actions">
							<button type="button" class="action-btn" on:click={() => showNewReservationForm = false}>
								CANCEL
							</button>
							<button type="submit" class="action-btn primary">
								CREATE RESERVATION
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
</div>

<style>
	.reservations-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
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
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
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

	.action-button.primary {
		background: var(--color-black);
		color: var(--color-white);
	}

	.action-button.primary:hover {
		background: var(--color-white);
		color: var(--color-black);
	}

	/* Statistics */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		border: var(--border-width-2) solid var(--color-black);
		background: var(--color-white);
		min-height: 80px;
	}

	.stat-card.scheduled {
		border-color: var(--color-gray-40);
	}

	.stat-card.active {
		border-color: var(--color-black);
	}

	.stat-card.completed {
		border-color: var(--color-gray-60);
	}

	.stat-card.cancelled {
		border-color: var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.stat-icon {
		font-size: var(--text-2xl);
		min-width: 32px;
		text-align: center;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
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

	/* Filters */
	.filters-bar {
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.filter-group {
		display: flex;
		gap: var(--space-2);
	}

	.filter-select,
	.filter-search {
		height: 32px;
		padding: 0 var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.filter-select {
		min-width: 140px;
	}

	.filter-search {
		flex: 1;
		max-width: 300px;
	}

	/* Reservations List */
	.reservations-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.reservation-card {
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.reservation-card.active {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.reservation-card.cancelled {
		border-style: dashed;
		opacity: 0.6;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.status-indicator {
		font-size: var(--text-lg);
	}

	.reservation-id {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-family: monospace;
		letter-spacing: var(--tracking-wide);
	}

	.customer-name {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.status-badge {
		padding: var(--space-1) var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
	}

	.reservation-card.scheduled .status-badge {
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
	}

	.card-body {
		margin-bottom: var(--space-3);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-3);
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.info-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.info-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.info-sub {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.notes {
		margin-top: var(--space-3);
		padding: var(--space-2);
		background: var(--color-gray-04);
		font-size: var(--text-sm);
	}

	.notes-label {
		font-weight: var(--font-medium);
		margin-right: var(--space-2);
	}

	.card-actions {
		display: flex;
		gap: var(--space-2);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-12);
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

	.action-btn.primary {
		background: var(--color-black);
		color: var(--color-white);
	}

	.action-btn.primary:hover {
		background: var(--color-white);
		color: var(--color-black);
	}

	.no-reservations {
		padding: var(--space-8);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		border: var(--border-width) dashed var(--color-gray-20);
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-modal);
	}

	.modal {
		width: 90%;
		max-width: 600px;
		max-height: 90vh;
		background: var(--color-white);
		border: var(--border-width-2) solid var(--color-black);
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.modal-title {
		font-size: var(--text-lg);
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
	}

	.close-button:hover {
		background: var(--color-gray-04);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
	}

	.form-group {
		margin-bottom: var(--space-4);
	}

	.form-group label {
		display: block;
		margin-bottom: var(--space-2);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
		font-family: inherit;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-black);
		border-width: var(--border-width-2);
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		margin-top: var(--space-6);
		padding-top: var(--space-4);
		border-top: var(--border-width) solid var(--color-gray-12);
	}
</style>