<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface SystemMetric {
		name: string;
		value: number;
		unit: string;
		status: 'healthy' | 'warning' | 'critical';
		threshold: number;
	}

	interface ServiceStatus {
		name: string;
		status: 'running' | 'stopped' | 'error';
		uptime: string;
		responseTime: number;
		lastCheck: string;
		endpoint: string;
	}

	interface Alert {
		id: string;
		severity: 'info' | 'warning' | 'error' | 'critical';
		message: string;
		timestamp: string;
		service: string;
		resolved: boolean;
	}

	// Mock system metrics
	let cpuUsage: SystemMetric = {
		name: 'CPU Usage',
		value: 42,
		unit: '%',
		status: 'healthy',
		threshold: 80
	};

	let memoryUsage: SystemMetric = {
		name: 'Memory Usage',
		value: 68,
		unit: '%',
		status: 'healthy',
		threshold: 85
	};

	let diskUsage: SystemMetric = {
		name: 'Disk Usage',
		value: 54,
		unit: '%',
		status: 'healthy',
		threshold: 90
	};

	let networkTraffic: SystemMetric = {
		name: 'Network Traffic',
		value: 125,
		unit: 'Mbps',
		status: 'healthy',
		threshold: 500
	};

	// Mock service statuses
	const services: ServiceStatus[] = [
		{
			name: 'API Server',
			status: 'running',
			uptime: '15d 8h 32m',
			responseTime: 45,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 'https://api.aprofleet.com'
		},
		{
			name: 'Database',
			status: 'running',
			uptime: '15d 8h 32m',
			responseTime: 12,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 'postgresql://db.aprofleet.com'
		},
		{
			name: 'Redis Cache',
			status: 'running',
			uptime: '15d 8h 32m',
			responseTime: 3,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 'redis://cache.aprofleet.com'
		},
		{
			name: 'WebSocket Server',
			status: 'running',
			uptime: '15d 8h 32m',
			responseTime: 8,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 'wss://ws.aprofleet.com'
		},
		{
			name: 'Message Queue',
			status: 'running',
			uptime: '15d 8h 32m',
			responseTime: 15,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 'amqp://mq.aprofleet.com'
		},
		{
			name: 'S3 Storage',
			status: 'running',
			uptime: '24/7',
			responseTime: 98,
			lastCheck: '2024-10-22 15:30:00',
			endpoint: 's3://aprofleet-storage'
		}
	];

	// Mock alerts
	const alerts: Alert[] = [
		{
			id: 'ALERT-001',
			severity: 'warning',
			message: 'High memory usage on server-03: 82%',
			timestamp: '2024-10-22 14:45:00',
			service: 'API Server',
			resolved: false
		},
		{
			id: 'ALERT-002',
			severity: 'info',
			message: 'Database backup completed successfully',
			timestamp: '2024-10-22 02:00:00',
			service: 'Database',
			resolved: true
		},
		{
			id: 'ALERT-003',
			severity: 'error',
			message: 'Failed to connect to external API endpoint',
			timestamp: '2024-10-22 13:22:00',
			service: 'API Server',
			resolved: true
		},
		{
			id: 'ALERT-004',
			severity: 'critical',
			message: 'SSL certificate expiring in 7 days',
			timestamp: '2024-10-22 09:00:00',
			service: 'API Server',
			resolved: false
		}
	];

	let autoRefresh = true;
	let refreshInterval: number;

	onMount(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(() => {
				// Simulate metric updates
				updateMetrics();
			}, 5000);
		}
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	function updateMetrics() {
		// Simulate random fluctuations
		cpuUsage.value = Math.min(100, Math.max(0, cpuUsage.value + (Math.random() - 0.5) * 10));
		memoryUsage.value = Math.min(100, Math.max(0, memoryUsage.value + (Math.random() - 0.5) * 5));
		diskUsage.value = Math.min(100, Math.max(0, diskUsage.value + (Math.random() - 0.5) * 2));
		networkTraffic.value = Math.min(500, Math.max(0, networkTraffic.value + (Math.random() - 0.5) * 50));

		// Update statuses
		updateMetricStatus(cpuUsage);
		updateMetricStatus(memoryUsage);
		updateMetricStatus(diskUsage);
	}

	function updateMetricStatus(metric: SystemMetric) {
		const percentage = (metric.value / metric.threshold) * 100;
		if (percentage >= 90) {
			metric.status = 'critical';
		} else if (percentage >= 75) {
			metric.status = 'warning';
		} else {
			metric.status = 'healthy';
		}
	}

	function getStatusSymbol(status: string): string {
		switch (status) {
			case 'running':
			case 'healthy': return '■';
			case 'warning': return '▲';
			case 'stopped': return '⬚';
			case 'error':
			case 'critical': return '✖';
			default: return '●';
		}
	}

	function getSeveritySymbol(severity: Alert['severity']): string {
		switch (severity) {
			case 'info': return '●';
			case 'warning': return '▲';
			case 'error': return '■';
			case 'critical': return '✖';
		}
	}

	function getProgressBar(value: number, max: number): string {
		const percentage = (value / max) * 10;
		const filled = Math.round(percentage);
		const empty = 10 - filled;
		return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
	}

	$: unresolvedAlerts = alerts.filter(a => !a.resolved).length;
	$: criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
	$: runningServices = services.filter(s => s.status === 'running').length;
	$: avgResponseTime = Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length);
</script>

<div class="monitoring-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">SYSTEM MONITORING</h1>
			<p class="page-subtitle">Real-time System Health & Performance</p>
		</div>
		<div class="header-actions">
			<label class="auto-refresh">
				<input type="checkbox" bind:checked={autoRefresh} />
				AUTO-REFRESH (5S)
			</label>
			<button class="btn-primary" on:click={updateMetrics}>REFRESH NOW</button>
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">SERVICES STATUS</div>
			<div class="card-value">{runningServices}/{services.length}</div>
			<div class="card-detail">RUNNING</div>
		</div>

		<div class="summary-card {criticalAlerts > 0 ? 'critical' : ''}">
			<div class="card-label">ACTIVE ALERTS</div>
			<div class="card-value">{unresolvedAlerts}</div>
			<div class="card-detail">{criticalAlerts} CRITICAL</div>
		</div>

		<div class="summary-card">
			<div class="card-label">AVG RESPONSE TIME</div>
			<div class="card-value">{avgResponseTime}MS</div>
			<div class="card-detail">ACROSS ALL SERVICES</div>
		</div>

		<div class="summary-card">
			<div class="card-label">SYSTEM UPTIME</div>
			<div class="card-value">99.98%</div>
			<div class="card-detail">LAST 30 DAYS</div>
		</div>
	</div>

	<!-- System Metrics -->
	<div class="metrics-section">
		<div class="section-header">
			<h2 class="section-title">SYSTEM METRICS</h2>
		</div>

		<div class="metrics-grid">
			<div class="metric-card" class:warning={cpuUsage.status === 'warning'} class:critical={cpuUsage.status === 'critical'}>
				<div class="metric-header">
					<span class="metric-name">{cpuUsage.name}</span>
					<span class="metric-status">{getStatusSymbol(cpuUsage.status)} {cpuUsage.status.toUpperCase()}</span>
				</div>
				<div class="metric-value">{cpuUsage.value.toFixed(1)}{cpuUsage.unit}</div>
				<div class="metric-bar">{getProgressBar(cpuUsage.value, 100)}</div>
				<div class="metric-threshold">THRESHOLD: {cpuUsage.threshold}{cpuUsage.unit}</div>
			</div>

			<div class="metric-card" class:warning={memoryUsage.status === 'warning'} class:critical={memoryUsage.status === 'critical'}>
				<div class="metric-header">
					<span class="metric-name">{memoryUsage.name}</span>
					<span class="metric-status">{getStatusSymbol(memoryUsage.status)} {memoryUsage.status.toUpperCase()}</span>
				</div>
				<div class="metric-value">{memoryUsage.value.toFixed(1)}{memoryUsage.unit}</div>
				<div class="metric-bar">{getProgressBar(memoryUsage.value, 100)}</div>
				<div class="metric-threshold">THRESHOLD: {memoryUsage.threshold}{memoryUsage.unit}</div>
			</div>

			<div class="metric-card" class:warning={diskUsage.status === 'warning'} class:critical={diskUsage.status === 'critical'}>
				<div class="metric-header">
					<span class="metric-name">{diskUsage.name}</span>
					<span class="metric-status">{getStatusSymbol(diskUsage.status)} {diskUsage.status.toUpperCase()}</span>
				</div>
				<div class="metric-value">{diskUsage.value.toFixed(1)}{diskUsage.unit}</div>
				<div class="metric-bar">{getProgressBar(diskUsage.value, 100)}</div>
				<div class="metric-threshold">THRESHOLD: {diskUsage.threshold}{diskUsage.unit}</div>
			</div>

			<div class="metric-card">
				<div class="metric-header">
					<span class="metric-name">{networkTraffic.name}</span>
					<span class="metric-status">{getStatusSymbol(networkTraffic.status)} {networkTraffic.status.toUpperCase()}</span>
				</div>
				<div class="metric-value">{networkTraffic.value.toFixed(0)}{networkTraffic.unit}</div>
				<div class="metric-bar">{getProgressBar(networkTraffic.value, networkTraffic.threshold)}</div>
				<div class="metric-threshold">THRESHOLD: {networkTraffic.threshold}{networkTraffic.unit}</div>
			</div>
		</div>
	</div>

	<!-- Services Status -->
	<div class="services-section">
		<div class="section-header">
			<h2 class="section-title">SERVICES STATUS</h2>
		</div>

		<div class="services-grid">
			{#each services as service}
				<div class="service-card">
					<div class="service-header">
						<span class="service-name">{service.name}</span>
						<span class="service-status" class:running={service.status === 'running'}>
							{getStatusSymbol(service.status)} {service.status.toUpperCase()}
						</span>
					</div>
					<div class="service-endpoint">{service.endpoint}</div>
					<div class="service-metrics">
						<div class="service-metric">
							<span class="metric-label">UPTIME:</span>
							<span class="metric-value">{service.uptime}</span>
						</div>
						<div class="service-metric">
							<span class="metric-label">RESPONSE:</span>
							<span class="metric-value">{service.responseTime}MS</span>
						</div>
					</div>
					<div class="service-footer">
						<span class="last-check">LAST CHECK: {service.lastCheck}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Alerts -->
	<div class="alerts-section">
		<div class="section-header">
			<h2 class="section-title">RECENT ALERTS</h2>
		</div>

		<div class="alerts-list">
			{#each alerts as alert}
				<div class="alert-item" class:resolved={alert.resolved} class:critical={alert.severity === 'critical'} class:error={alert.severity === 'error'} class:warning={alert.severity === 'warning'}>
					<div class="alert-header">
						<span class="alert-severity">{getSeveritySymbol(alert.severity)} {alert.severity.toUpperCase()}</span>
						<span class="alert-id">{alert.id}</span>
						<span class="alert-timestamp">{alert.timestamp}</span>
					</div>
					<div class="alert-message">{alert.message}</div>
					<div class="alert-footer">
						<span class="alert-service">SERVICE: {alert.service}</span>
						{#if alert.resolved}
							<span class="alert-resolved">■ RESOLVED</span>
						{:else}
							<button class="btn-resolve">RESOLVE</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.monitoring-page {
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

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.auto-refresh {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
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

	.btn-resolve {
		padding: var(--space-1) var(--space-2);
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
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

	.summary-card.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
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

	/* Sections */
	.metrics-section,
	.services-section,
	.alerts-section {
		margin-bottom: var(--space-8);
	}

	.section-header {
		margin-bottom: var(--space-4);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	/* Metrics Grid */
	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.metric-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.metric-card.warning {
		border-width: var(--border-width-2);
		border-color: var(--color-gray-40);
	}

	.metric-card.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
		background: var(--color-gray-04);
	}

	.metric-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-xs);
	}

	.metric-name {
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.metric-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.metric-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
		font-variant-numeric: tabular-nums;
	}

	.metric-bar {
		font-family: monospace;
		font-size: 10px;
		letter-spacing: -2px;
	}

	.metric-threshold {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	/* Services Grid */
	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--space-4);
	}

	.service-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.service-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.service-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.service-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
	}

	.service-status.running {
		font-weight: var(--font-medium);
	}

	.service-endpoint {
		font-family: monospace;
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.service-metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
		padding: var(--space-2) 0;
	}

	.service-metric {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.service-metric .metric-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.service-metric .metric-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.service-footer {
		padding-top: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.last-check {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-family: monospace;
	}

	/* Alerts List */
	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.alert-item {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.alert-item.resolved {
		opacity: 0.6;
		background: var(--color-gray-04);
	}

	.alert-item.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
	}

	.alert-item.error {
		border-width: var(--border-width-2);
	}

	.alert-item.warning {
		border-style: dashed;
	}

	.alert-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-size: var(--text-xs);
	}

	.alert-severity {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-medium);
	}

	.alert-id {
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.alert-timestamp {
		font-family: monospace;
		color: var(--color-gray-40);
		margin-left: auto;
	}

	.alert-message {
		font-size: var(--text-sm);
		line-height: var(--leading-relaxed);
	}

	.alert-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
		font-size: var(--text-xs);
	}

	.alert-service {
		color: var(--color-gray-40);
	}

	.alert-resolved {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-weight: var(--font-medium);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.monitoring-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
		}

		.metrics-grid,
		.services-grid {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.monitoring-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.summary-cards {
			grid-template-columns: repeat(2, 1fr);
		}

		.metrics-grid,
		.services-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.monitoring-page {
			padding: var(--space-2);
		}

		.summary-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
