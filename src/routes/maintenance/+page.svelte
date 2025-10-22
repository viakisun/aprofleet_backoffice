<script lang="ts">
	import { onMount } from 'svelte';
	import { vehicle } from '$lib/stores/vehicle';
	import { notification } from '$lib/stores/notification';

	interface MaintenanceTicket {
		id: string;
		vehicleVin: string;
		vehicleModel: string;
		type: 'scheduled' | 'repair' | 'inspection' | 'urgent';
		priority: 'low' | 'medium' | 'high' | 'critical';
		status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
		title: string;
		description: string;
		assignedTo: string | null;
		createdAt: string;
		scheduledDate: string | null;
		completedDate: string | null;
		estimatedCost: number;
		actualCost: number | null;
		parts: Array<{ name: string; quantity: number; cost: number }>;
	}

	// Mock maintenance tickets
	let tickets: MaintenanceTicket[] = [
		{
			id: 'MT-001',
			vehicleVin: 'APGC00000008',
			vehicleModel: 'AP-2024',
			type: 'urgent',
			priority: 'critical',
			status: 'in_progress',
			title: 'MOTOR FAILURE',
			description: 'Motor stopped working during operation. Requires immediate attention.',
			assignedTo: 'John Smith',
			createdAt: '2024-10-22T10:30:00',
			scheduledDate: '2024-10-22T14:00:00',
			completedDate: null,
			estimatedCost: 1200,
			actualCost: null,
			parts: [
				{ name: 'Motor Controller', quantity: 1, cost: 850 },
				{ name: 'Wiring Harness', quantity: 1, cost: 150 }
			]
		},
		{
			id: 'MT-002',
			vehicleVin: 'APGC00000015',
			vehicleModel: 'AP-2023',
			type: 'scheduled',
			priority: 'medium',
			status: 'pending',
			title: 'ROUTINE MAINTENANCE',
			description: 'Scheduled 3-month inspection and service',
			assignedTo: null,
			createdAt: '2024-10-20T09:00:00',
			scheduledDate: '2024-10-24T10:00:00',
			completedDate: null,
			estimatedCost: 250,
			actualCost: null,
			parts: []
		},
		{
			id: 'MT-003',
			vehicleVin: 'APGC00000003',
			vehicleModel: 'AP-2024 Elite',
			type: 'repair',
			priority: 'high',
			status: 'pending',
			title: 'BRAKE PAD REPLACEMENT',
			description: 'Front brake pads worn below minimum thickness',
			assignedTo: 'Jane Doe',
			createdAt: '2024-10-21T14:30:00',
			scheduledDate: '2024-10-23T09:00:00',
			completedDate: null,
			estimatedCost: 450,
			actualCost: null,
			parts: [
				{ name: 'Brake Pads (Front)', quantity: 1, cost: 280 },
				{ name: 'Brake Fluid', quantity: 2, cost: 35 }
			]
		},
		{
			id: 'MT-004',
			vehicleVin: 'APGC00000011',
			vehicleModel: 'AP-2024',
			type: 'inspection',
			priority: 'low',
			status: 'completed',
			title: 'SAFETY INSPECTION',
			description: 'Annual safety and compliance check',
			assignedTo: 'Mike Johnson',
			createdAt: '2024-10-19T08:00:00',
			scheduledDate: '2024-10-20T11:00:00',
			completedDate: '2024-10-20T13:30:00',
			estimatedCost: 180,
			actualCost: 180,
			parts: []
		}
	];

	let filterType: 'all' | 'scheduled' | 'repair' | 'inspection' | 'urgent' = 'all';
	let filterStatus: 'all' | 'pending' | 'in_progress' | 'completed' = 'all';
	let showNewTicketForm = false;

	// New ticket form
	let newTicket = {
		vehicleVin: '',
		type: 'scheduled' as MaintenanceTicket['type'],
		priority: 'medium' as MaintenanceTicket['priority'],
		title: '',
		description: '',
		scheduledDate: '',
		estimatedCost: 0
	};

	onMount(() => {
		vehicle.loadVehicles();
	});

	$: filteredTickets = tickets.filter(t => {
		const matchesType = filterType === 'all' || t.type === filterType;
		const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
		return matchesType && matchesStatus;
	});

	$: statistics = {
		total: tickets.length,
		pending: tickets.filter(t => t.status === 'pending').length,
		inProgress: tickets.filter(t => t.status === 'in_progress').length,
		completed: tickets.filter(t => t.status === 'completed').length,
		critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'completed').length,
		avgCost: tickets.filter(t => t.actualCost).reduce((acc, t) => acc + (t.actualCost || 0), 0) /
			(tickets.filter(t => t.actualCost).length || 1)
	};

	function getPriorityIndicator(priority: string): string {
		switch (priority) {
			case 'critical': return '✖';
			case 'high': return '▲';
			case 'medium': return '■';
			case 'low': return '▢';
			default: return '•';
		}
	}

	function getTypeLabel(type: string): string {
		return type.toUpperCase().replace('_', ' ');
	}

	function formatDate(date: string | null): string {
		if (!date) return '-';
		return new Date(date).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleCreateTicket() {
		const ticket: MaintenanceTicket = {
			id: `MT-${String(tickets.length + 1).padStart(3, '0')}`,
			vehicleVin: newTicket.vehicleVin,
			vehicleModel: Array.from($vehicle.vehicles.values()).find(v => v.vin === newTicket.vehicleVin)?.model || 'Unknown',
			type: newTicket.type,
			priority: newTicket.priority,
			status: 'pending',
			title: newTicket.title,
			description: newTicket.description,
			assignedTo: null,
			createdAt: new Date().toISOString(),
			scheduledDate: newTicket.scheduledDate || null,
			completedDate: null,
			estimatedCost: newTicket.estimatedCost,
			actualCost: null,
			parts: []
		};

		tickets = [ticket, ...tickets];
		showNewTicketForm = false;

		// Reset form
		newTicket = {
			vehicleVin: '',
			type: 'scheduled',
			priority: 'medium',
			title: '',
			description: '',
			scheduledDate: '',
			estimatedCost: 0
		};

		notification.success('TICKET CREATED', `Maintenance ticket ${ticket.id} created`);
	}

	function handleUpdateStatus(ticketId: string, newStatus: MaintenanceTicket['status']) {
		tickets = tickets.map(t =>
			t.id === ticketId
				? { ...t, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString() : t.completedDate }
				: t
		);
		notification.success('STATUS UPDATED', `Ticket ${ticketId} marked as ${newStatus}`);
	}
</script>

<div class="maintenance-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">MAINTENANCE</h1>
				<div class="page-meta">
					<span class="meta-item">{filteredTickets.length} TICKETS</span>
				</div>
			</div>
			<div class="header-actions">
				<button class="action-button primary" on:click={() => showNewTicketForm = true}>
					+ NEW TICKET
				</button>
			</div>
		</div>

		<!-- Statistics -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value">{statistics.total}</div>
				<div class="stat-label">TOTAL TICKETS</div>
			</div>

			<div class="stat-card pending">
				<div class="stat-icon">⬚</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.pending}</div>
					<div class="stat-label">PENDING</div>
				</div>
			</div>

			<div class="stat-card in-progress">
				<div class="stat-icon">■</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.inProgress}</div>
					<div class="stat-label">IN PROGRESS</div>
				</div>
			</div>

			<div class="stat-card critical">
				<div class="stat-icon">✖</div>
				<div class="stat-content">
					<div class="stat-value">{statistics.critical}</div>
					<div class="stat-label">CRITICAL</div>
				</div>
			</div>

			<div class="stat-card">
				<div class="stat-content">
					<div class="stat-value">${statistics.avgCost.toFixed(0)}</div>
					<div class="stat-label">AVG COST</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="filters-bar">
			<div class="filter-group">
				<select bind:value={filterType} class="filter-select">
					<option value="all">ALL TYPES</option>
					<option value="scheduled">SCHEDULED</option>
					<option value="repair">REPAIR</option>
					<option value="inspection">INSPECTION</option>
					<option value="urgent">URGENT</option>
				</select>

				<select bind:value={filterStatus} class="filter-select">
					<option value="all">ALL STATUS</option>
					<option value="pending">PENDING</option>
					<option value="in_progress">IN PROGRESS</option>
					<option value="completed">COMPLETED</option>
				</select>
			</div>
		</div>

		<!-- Tickets List -->
		<div class="tickets-list">
			{#each filteredTickets as ticket}
				<div
					class="ticket-card"
					class:critical={ticket.priority === 'critical'}
					class:high={ticket.priority === 'high'}
					class:in-progress={ticket.status === 'in_progress'}
				>
					<div class="card-header">
						<div class="header-left">
							<span class="priority-icon">{getPriorityIndicator(ticket.priority)}</span>
							<div class="ticket-info">
								<div class="ticket-id">{ticket.id}</div>
								<div class="ticket-title">{ticket.title}</div>
							</div>
						</div>
						<div class="header-right">
							<div class="status-badge">{ticket.status.toUpperCase().replace('_', ' ')}</div>
							<div class="type-badge">{getTypeLabel(ticket.type)}</div>
						</div>
					</div>

					<div class="card-body">
						<div class="info-grid">
							<div class="info-item">
								<span class="info-label">VEHICLE</span>
								<span class="info-value">{ticket.vehicleVin}</span>
								<span class="info-sub">{ticket.vehicleModel}</span>
							</div>

							<div class="info-item">
								<span class="info-label">PRIORITY</span>
								<span class="info-value priority-{ticket.priority}">
									{ticket.priority.toUpperCase()}
								</span>
							</div>

							<div class="info-item">
								<span class="info-label">CREATED</span>
								<span class="info-value">{formatDate(ticket.createdAt)}</span>
							</div>

							<div class="info-item">
								<span class="info-label">SCHEDULED</span>
								<span class="info-value">{formatDate(ticket.scheduledDate)}</span>
							</div>

							<div class="info-item">
								<span class="info-label">ASSIGNED TO</span>
								<span class="info-value">{ticket.assignedTo || 'UNASSIGNED'}</span>
							</div>

							<div class="info-item">
								<span class="info-label">COST</span>
								<span class="info-value">
									${ticket.actualCost || ticket.estimatedCost}
									{#if !ticket.actualCost}
										<span class="estimate-label">(EST)</span>
									{/if}
								</span>
							</div>
						</div>

						<div class="description">
							<span class="description-label">DESCRIPTION:</span>
							<p class="description-text">{ticket.description}</p>
						</div>

						{#if ticket.parts.length > 0}
							<div class="parts-section">
								<div class="parts-label">PARTS REQUIRED:</div>
								<div class="parts-list">
									{#each ticket.parts as part}
										<div class="part-item">
											<span class="part-name">{part.name}</span>
											<span class="part-quantity">QTY: {part.quantity}</span>
											<span class="part-cost">${part.cost}</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<div class="card-actions">
						{#if ticket.status === 'pending'}
							<button
								class="action-btn primary"
								on:click={() => handleUpdateStatus(ticket.id, 'in_progress')}
							>
								START WORK
							</button>
						{:else if ticket.status === 'in_progress'}
							<button
								class="action-btn primary"
								on:click={() => handleUpdateStatus(ticket.id, 'completed')}
							>
								COMPLETE
							</button>
						{/if}

						{#if ticket.status !== 'completed'}
							<button
								class="action-btn"
								on:click={() => handleUpdateStatus(ticket.id, 'cancelled')}
							>
								CANCEL
							</button>
						{/if}
					</div>
				</div>
			{/each}

			{#if filteredTickets.length === 0}
				<div class="no-tickets">
					NO MAINTENANCE TICKETS FOUND
				</div>
			{/if}
		</div>

		<!-- New Ticket Modal -->
		{#if showNewTicketForm}
			<div
				class="modal-overlay"
				role="button"
				tabindex="0"
				on:click={() => showNewTicketForm = false}
				on:keydown={(e) => e.key === 'Escape' && (showNewTicketForm = false)}
			>
				<div
					class="modal"
					role="dialog"
					aria-modal="true"
					on:click|stopPropagation
					on:keydown|stopPropagation
				>
					<div class="modal-header">
						<h2 class="modal-title">NEW MAINTENANCE TICKET</h2>
						<button class="close-button" on:click={() => showNewTicketForm = false}>
							✖
						</button>
					</div>

					<form class="modal-body" on:submit|preventDefault={handleCreateTicket}>
						<div class="form-group">
							<label for="vehicleVin">VEHICLE VIN</label>
							<select id="vehicleVin" bind:value={newTicket.vehicleVin} required>
								<option value="">SELECT VEHICLE</option>
								{#each Array.from($vehicle.vehicles.values()) as v}
									<option value={v.vin}>{v.vin} - {v.model}</option>
								{/each}
							</select>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="type">TYPE</label>
								<select id="type" bind:value={newTicket.type}>
									<option value="scheduled">SCHEDULED</option>
									<option value="repair">REPAIR</option>
									<option value="inspection">INSPECTION</option>
									<option value="urgent">URGENT</option>
								</select>
							</div>

							<div class="form-group">
								<label for="priority">PRIORITY</label>
								<select id="priority" bind:value={newTicket.priority}>
									<option value="low">LOW</option>
									<option value="medium">MEDIUM</option>
									<option value="high">HIGH</option>
									<option value="critical">CRITICAL</option>
								</select>
							</div>
						</div>

						<div class="form-group">
							<label for="title">TITLE</label>
							<input
								id="title"
								type="text"
								bind:value={newTicket.title}
								required
							/>
						</div>

						<div class="form-group">
							<label for="description">DESCRIPTION</label>
							<textarea
								id="description"
								bind:value={newTicket.description}
								rows="4"
								required
							></textarea>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="scheduledDate">SCHEDULED DATE</label>
								<input
									id="scheduledDate"
									type="datetime-local"
									bind:value={newTicket.scheduledDate}
								/>
							</div>

							<div class="form-group">
								<label for="estimatedCost">ESTIMATED COST ($)</label>
								<input
									id="estimatedCost"
									type="number"
									min="0"
									step="10"
									bind:value={newTicket.estimatedCost}
									required
								/>
							</div>
						</div>

						<div class="form-actions">
							<button type="button" class="action-btn" on:click={() => showNewTicketForm = false}>
								CANCEL
							</button>
							<button type="submit" class="action-btn primary">
								CREATE TICKET
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}
</div>

<style>
	.maintenance-page {
		padding: var(--space-6);
		max-width: 1400px;
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
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.stat-card.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.stat-card.in-progress {
		border-style: dashed;
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

	.filter-select {
		height: 32px;
		padding: 0 var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
	}

	/* Tickets List */
	.tickets-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.ticket-card {
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-4);
	}

	.ticket-card.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.ticket-card.high {
		border-style: dashed;
	}

	.ticket-card.in-progress {
		background: var(--color-gray-04);
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

	.priority-icon {
		font-size: var(--text-lg);
	}

	.ticket-id {
		font-family: monospace;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	.ticket-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.header-right {
		display: flex;
		gap: var(--space-2);
	}

	.status-badge,
	.type-badge {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		white-space: nowrap;
	}

	.status-badge {
		background: var(--color-black);
		color: var(--color-white);
	}

	.type-badge {
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
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

	.estimate-label {
		font-size: var(--text-xs);
		color: var(--color-gray-20);
	}

	.priority-critical {
		font-weight: var(--font-semibold);
	}

	.description {
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-08);
	}

	.description-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		display: block;
		margin-bottom: var(--space-2);
	}

	.description-text {
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	.parts-section {
		border: var(--border-width) solid var(--color-gray-20);
		padding: var(--space-3);
	}

	.parts-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.parts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.part-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2);
		background: var(--color-gray-04);
		font-size: var(--text-sm);
	}

	.part-name {
		flex: 1;
	}

	.part-quantity {
		font-family: monospace;
		margin-right: var(--space-3);
	}

	.part-cost {
		font-family: monospace;
		font-weight: var(--font-medium);
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

	.no-tickets {
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