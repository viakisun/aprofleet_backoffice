<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface LogEntry {
		id: string;
		timestamp: Date;
		level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
		service: string;
		message: string;
		metadata?: Record<string, any>;
		userId?: string;
		requestId?: string;
		ip?: string;
	}

	// Filter state
	let selectedLevel: string = 'all';
	let activeServiceTab: string = 'all'; // Changed from selectedService
	let searchQuery: string = '';
	let startDate: string = '';
	let endDate: string = '';
	let autoRefresh: boolean = true;

	// Pagination
	let currentPage = 1;
	let itemsPerPage = 50;

	// Mock data
	let services = ['api-server', 'database', 'redis', 'websocket', 'auth-service', 'payment-service'];
	let logCounter = 0; // Counter for unique IDs
	let logs: LogEntry[] = generateMockLogs(200);
	let refreshInterval: number;

	function generateMockLogs(count: number): LogEntry[] {
		const levels: LogEntry['level'][] = ['debug', 'info', 'warn', 'error', 'critical'];
		const messages = [
			'Request processed successfully',
			'Database query executed',
			'Cache miss, fetching from database',
			'Rate limit exceeded for IP',
			'Authentication failed',
			'Connection timeout',
			'Invalid request payload',
			'Service health check passed',
			'Memory usage above threshold',
			'Disk space low',
			'WebSocket connection established',
			'Payment processing completed',
			'User session expired',
			'API key validation failed',
			'Database connection pool exhausted'
		];

		return Array.from({ length: count }, (_, i) => {
			const level = levels[Math.floor(Math.random() * levels.length)];
			const service = services[Math.floor(Math.random() * services.length)];
			const message = messages[Math.floor(Math.random() * messages.length)];

			return {
				id: `log-${++logCounter}`,
				timestamp: new Date(Date.now() - i * 60000 - Math.random() * 3600000),
				level,
				service,
				message,
				metadata: level === 'error' || level === 'critical' ? {
					stackTrace: 'Error: Something went wrong\n  at handler (/app/server.js:123:45)',
					errorCode: `E${Math.floor(Math.random() * 9000) + 1000}`
				} : undefined,
				userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
				requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
				ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
			};
		});
	}

	// Filter logs
	$: filteredLogs = logs.filter(log => {
		// Level filter
		if (selectedLevel !== 'all' && log.level !== selectedLevel) return false;

		// Service tab filter
		if (activeServiceTab === 'all') {
			// Show all services
		} else if (activeServiceTab === 'api-server') {
			if (log.service !== 'api-server') return false;
		} else if (activeServiceTab === 'database') {
			if (log.service !== 'database') return false;
		}

		// Search query
		if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
		    !log.service.toLowerCase().includes(searchQuery.toLowerCase()) &&
		    !(log.requestId?.toLowerCase().includes(searchQuery.toLowerCase()))) {
			return false;
		}

		// Date range
		if (startDate && log.timestamp < new Date(startDate)) return false;
		if (endDate && log.timestamp > new Date(endDate)) return false;

		return true;
	});

	// Paginate logs
	$: paginatedLogs = filteredLogs.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

	// Statistics
	$: logStats = {
		total: logs.length,
		debug: logs.filter(l => l.level === 'debug').length,
		info: logs.filter(l => l.level === 'info').length,
		warn: logs.filter(l => l.level === 'warn').length,
		error: logs.filter(l => l.level === 'error').length,
		critical: logs.filter(l => l.level === 'critical').length
	};

	function formatTimestamp(date: Date): string {
		return date.toISOString().replace('T', ' ').substring(0, 19);
	}

	function getLevelColor(level: LogEntry['level']): string {
		switch (level) {
			case 'debug': return 'var(--color-gray-40)';
			case 'info': return 'var(--color-black)';
			case 'warn': return '#FF8C00';
			case 'error': return '#DC143C';
			case 'critical': return '#8B0000';
			default: return 'var(--color-black)';
		}
	}

	function clearFilters() {
		selectedLevel = 'all';
		activeServiceTab = 'all';
		searchQuery = '';
		startDate = '';
		endDate = '';
		currentPage = 1;
	}

	function exportLogs() {
		const csvContent = [
			'Timestamp,Level,Service,Message,Request ID,IP',
			...filteredLogs.map(log =>
				`"${formatTimestamp(log.timestamp)}","${log.level}","${log.service}","${log.message}","${log.requestId || ''}","${log.ip || ''}"`
			)
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	function refreshLogs() {
		// Add new random logs at the top
		const newLogs = generateMockLogs(Math.floor(Math.random() * 5) + 1);
		logs = [...newLogs, ...logs].slice(0, 500); // Keep only latest 500
	}

	onMount(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(refreshLogs, 10000) as unknown as number;
		}
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	// Handle auto-refresh toggle
	$: {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
		if (autoRefresh) {
			refreshInterval = setInterval(refreshLogs, 10000) as unknown as number;
		}
	}

	let expandedLog: string | null = null;

	function toggleLogDetails(logId: string) {
		expandedLog = expandedLog === logId ? null : logId;
	}
</script>

<div class="logs-page">
	<!-- Header -->
	<div class="page-header">
		<div class="header-left">
			<h1 class="page-title">SYSTEM LOGS</h1>
			<p class="page-subtitle">REAL-TIME LOG MONITORING AND ANALYSIS</p>
		</div>
		<div class="header-actions">
			<button class="action-button" on:click={refreshLogs}>
				REFRESH
			</button>
			<button class="action-button" on:click={exportLogs}>
				EXPORT CSV
			</button>
			<label class="auto-refresh-toggle">
				<input type="checkbox" bind:checked={autoRefresh} />
				<span>AUTO-REFRESH (10s)</span>
			</label>
		</div>
	</div>

	<!-- Statistics -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">TOTAL LOGS</div>
			<div class="stat-value">{logStats.total.toLocaleString()}</div>
		</div>
		<div class="stat-card debug">
			<div class="stat-label">DEBUG</div>
			<div class="stat-value">{logStats.debug.toLocaleString()}</div>
		</div>
		<div class="stat-card info">
			<div class="stat-label">INFO</div>
			<div class="stat-value">{logStats.info.toLocaleString()}</div>
		</div>
		<div class="stat-card warn">
			<div class="stat-label">WARN</div>
			<div class="stat-value">{logStats.warn.toLocaleString()}</div>
		</div>
		<div class="stat-card error">
			<div class="stat-label">ERROR</div>
			<div class="stat-value">{logStats.error.toLocaleString()}</div>
		</div>
		<div class="stat-card critical">
			<div class="stat-label">CRITICAL</div>
			<div class="stat-value">{logStats.critical.toLocaleString()}</div>
		</div>
	</div>

	<!-- Service Tabs -->
	<div class="tabs-container">
		<button
			class="tab-btn"
			class:active={activeServiceTab === 'all'}
			on:click={() => activeServiceTab = 'all'}
		>
			ALL SERVICES
		</button>
		<button
			class="tab-btn"
			class:active={activeServiceTab === 'api-server'}
			on:click={() => activeServiceTab = 'api-server'}
		>
			API SERVER
		</button>
		<button
			class="tab-btn"
			class:active={activeServiceTab === 'database'}
			on:click={() => activeServiceTab = 'database'}
		>
			DATABASE
		</button>
	</div>

	<!-- Filters -->
	<div class="filters-section">
		<div class="filters-row">
			<div class="filter-group">
				<label for="level-filter">LEVEL</label>
				<select id="level-filter" bind:value={selectedLevel}>
					<option value="all">All Levels</option>
					<option value="debug">Debug</option>
					<option value="info">Info</option>
					<option value="warn">Warning</option>
					<option value="error">Error</option>
					<option value="critical">Critical</option>
				</select>
			</div>

			<div class="filter-group">
				<label for="search-filter">SEARCH</label>
				<input
					id="search-filter"
					type="text"
					placeholder="Search logs..."
					bind:value={searchQuery}
				/>
			</div>

			<div class="filter-group">
				<label for="start-date">FROM</label>
				<input
					id="start-date"
					type="datetime-local"
					bind:value={startDate}
				/>
			</div>

			<div class="filter-group">
				<label for="end-date">TO</label>
				<input
					id="end-date"
					type="datetime-local"
					bind:value={endDate}
				/>
			</div>

			<button class="clear-filters-button" on:click={clearFilters}>
				CLEAR
			</button>
		</div>

		<div class="filters-info">
			Showing {paginatedLogs.length} of {filteredLogs.length.toLocaleString()} logs
			{#if filteredLogs.length !== logs.length}
				(filtered from {logs.length.toLocaleString()} total)
			{/if}
		</div>
	</div>

	<!-- Logs Table -->
	<div class="logs-table-container">
		<table class="logs-table">
			<thead>
				<tr>
					<th>TIMESTAMP</th>
					<th>LEVEL</th>
					<th>SERVICE</th>
					<th>MESSAGE</th>
					<th>REQUEST ID</th>
					<th>IP ADDRESS</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each paginatedLogs as log (log.id)}
					<tr class="log-row" class:expanded={expandedLog === log.id}>
						<td class="timestamp">{formatTimestamp(log.timestamp)}</td>
						<td>
							<span class="level-badge" style="color: {getLevelColor(log.level)}">
								{log.level.toUpperCase()}
							</span>
						</td>
						<td class="service">{log.service}</td>
						<td class="message">{log.message}</td>
						<td class="request-id">{log.requestId || '-'}</td>
						<td class="ip">{log.ip || '-'}</td>
						<td class="actions">
							{#if log.metadata || log.userId}
								<button
									class="expand-button"
									on:click={() => toggleLogDetails(log.id)}
								>
									{expandedLog === log.id ? '▼' : '▶'}
								</button>
							{/if}
						</td>
					</tr>
					{#if expandedLog === log.id}
						<tr class="log-details">
							<td colspan="7">
								<div class="details-content">
									{#if log.userId}
										<div class="detail-item">
											<strong>USER ID:</strong> {log.userId}
										</div>
									{/if}
									{#if log.metadata}
										<div class="detail-item">
											<strong>METADATA:</strong>
											<pre>{JSON.stringify(log.metadata, null, 2)}</pre>
										</div>
									{/if}
								</div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>

		{#if paginatedLogs.length === 0}
			<div class="empty-state">
				<p>NO LOGS FOUND</p>
				<button class="clear-filters-button" on:click={clearFilters}>
					CLEAR FILTERS
				</button>
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="pagination">
			<button
				class="pagination-button"
				disabled={currentPage === 1}
				on:click={() => currentPage = 1}
			>
				FIRST
			</button>
			<button
				class="pagination-button"
				disabled={currentPage === 1}
				on:click={() => currentPage--}
			>
				PREVIOUS
			</button>
			<span class="pagination-info">
				PAGE {currentPage} OF {totalPages}
			</span>
			<button
				class="pagination-button"
				disabled={currentPage === totalPages}
				on:click={() => currentPage++}
			>
				NEXT
			</button>
			<button
				class="pagination-button"
				disabled={currentPage === totalPages}
				on:click={() => currentPage = totalPages}
			>
				LAST
			</button>
		</div>
	{/if}
</div>

<style>
	.logs-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
	}

	/* Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-6);
		gap: var(--space-4);
	}

	.header-left {
		flex: 1;
	}

	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.page-subtitle {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
	}

	.header-actions {
		display: flex;
		gap: var(--space-3);
		align-items: center;
	}

	.action-button {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		white-space: nowrap;
	}

	.auto-refresh-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
		user-select: none;
	}

	.auto-refresh-toggle input[type="checkbox"] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	/* Tabs */
	.tabs-container {
		display: flex;
		gap: 8px;
		margin-bottom: 24px;
		border-bottom: 2px solid var(--color-black);
	}

	.tab-btn {
		background: var(--color-white);
		border: 1px solid var(--color-black);
		border-bottom: none;
		padding: 12px 24px;
		font-weight: 600;
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
		transition: all 0.15s ease;
		position: relative;
		top: 2px;
	}

	.tab-btn:hover {
		background: var(--color-gray-90);
	}

	.tab-btn.active {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* Statistics */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.stat-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.stat-card.debug { border-color: var(--color-gray-40); }
	.stat-card.info { border-color: var(--color-black); }
	.stat-card.warn { border-color: #FF8C00; }
	.stat-card.error { border-color: #DC143C; }
	.stat-card.critical { border-color: #8B0000; background: #FFF5F5; }

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-1);
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	/* Filters */
	.filters-section {
		margin-bottom: var(--space-6);
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-gray-04);
	}

	.filters-row {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		align-items: flex-end;
		margin-bottom: var(--space-3);
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 150px;
	}

	.filter-group label {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		color: var(--color-gray-40);
	}

	.filter-group select,
	.filter-group input {
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.filter-group input::placeholder {
		color: var(--color-gray-40);
	}

	.clear-filters-button {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		white-space: nowrap;
		align-self: flex-end;
	}

	.filters-info {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	/* Logs Table */
	.logs-table-container {
		border: var(--border-width) solid var(--color-black);
		margin-bottom: var(--space-4);
		overflow-x: auto;
		background: var(--color-white);
	}

	.logs-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.logs-table thead {
		background: var(--color-black);
		color: var(--color-white);
	}

	.logs-table th {
		padding: var(--space-3) var(--space-2);
		text-align: left;
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		white-space: nowrap;
	}

	.logs-table td {
		padding: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.log-row {
		transition: background var(--duration-fast) var(--easing-linear);
	}

	.log-row:hover {
		background: var(--color-gray-04);
	}

	.log-row.expanded {
		background: var(--color-gray-08);
	}

	.timestamp {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: var(--color-gray-40);
	}

	.level-badge {
		display: inline-block;
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
		white-space: nowrap;
	}

	.service {
		font-weight: var(--font-medium);
		white-space: nowrap;
	}

	.message {
		max-width: 400px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.request-id,
	.ip {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		white-space: nowrap;
	}

	.actions {
		text-align: center;
		width: 40px;
	}

	.expand-button {
		padding: var(--space-1);
		width: 24px;
		height: 24px;
		font-size: 10px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: var(--border-width) solid var(--color-gray-20);
	}

	.expand-button:hover {
		background: var(--color-gray-12);
	}

	.log-details td {
		background: var(--color-gray-04);
		border-top: none;
	}

	.details-content {
		padding: var(--space-3);
		font-size: var(--text-sm);
	}

	.detail-item {
		margin-bottom: var(--space-2);
	}

	.detail-item:last-child {
		margin-bottom: 0;
	}

	.detail-item strong {
		display: block;
		margin-bottom: var(--space-1);
		color: var(--color-gray-40);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
	}

	.detail-item pre {
		background: var(--color-white);
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		overflow-x: auto;
		font-size: var(--text-xs);
		line-height: 1.5;
	}

	.empty-state {
		padding: var(--space-8);
		text-align: center;
	}

	.empty-state p {
		font-size: var(--text-lg);
		color: var(--color-gray-40);
		margin-bottom: var(--space-4);
		letter-spacing: var(--tracking-wider);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
	}

	.pagination-button {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
	}

	.pagination-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.pagination-info {
		padding: 0 var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wide);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.logs-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
		}

		.header-actions {
			flex-wrap: wrap;
			width: 100%;
		}

		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.filters-row {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-group {
			min-width: unset;
		}

		.clear-filters-button {
			align-self: stretch;
		}

		.message {
			max-width: 200px;
		}
	}

	@media (max-width: 640px) {
		.logs-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.logs-table {
			font-size: var(--text-xs);
		}

		.logs-table th,
		.logs-table td {
			padding: var(--space-1);
		}

		.message {
			max-width: 120px;
		}

		.pagination {
			flex-wrap: wrap;
		}
	}
</style>
