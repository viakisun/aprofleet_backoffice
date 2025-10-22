<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Server {
		id: string;
		name: string;
		type: 'web' | 'api' | 'database' | 'cache' | 'worker' | 'lb';
		status: 'running' | 'stopped' | 'warning' | 'error';
		environment: 'production' | 'staging' | 'development';
		region: string;
		provider: 'aws' | 'gcp' | 'azure';
		instanceType: string;
		cpu: number;
		memory: number;
		disk: number;
		network: number;
		uptime: string;
		cost: number;
		ipAddress: string;
		createdAt: Date;
	}

	interface Database {
		id: string;
		name: string;
		type: 'postgresql' | 'mongodb' | 'redis' | 'elasticsearch';
		status: 'healthy' | 'degraded' | 'down';
		environment: 'production' | 'staging' | 'development';
		connections: number;
		maxConnections: number;
		size: number;
		replication: string;
		backup: {
			lastBackup: Date;
			nextBackup: Date;
			status: 'success' | 'failed' | 'in_progress';
		};
	}

	interface LoadBalancer {
		id: string;
		name: string;
		status: 'healthy' | 'degraded' | 'down';
		requestsPerSecond: number;
		activeConnections: number;
		targets: {
			id: string;
			healthy: boolean;
			responseTime: number;
		}[];
	}

	// State
	let selectedEnvironment: 'all' | 'production' | 'staging' | 'development' = 'all';
	let selectedType: string = 'all';
	let autoRefresh = true;
	let refreshInterval: number;

	// Mock data
	let servers: Server[] = generateMockServers();
	let databases: Database[] = generateMockDatabases();
	let loadBalancers: LoadBalancer[] = generateMockLoadBalancers();

	function generateMockServers(): Server[] {
		const types: Server['type'][] = ['web', 'api', 'database', 'cache', 'worker', 'lb'];
		const envs: Server['environment'][] = ['production', 'staging', 'development'];
		const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
		const providers: Server['provider'][] = ['aws', 'gcp', 'azure'];
		const instanceTypes = ['t3.medium', 't3.large', 'm5.xlarge', 'c5.2xlarge'];

		return Array.from({ length: 24 }, (_, i) => {
			const type = types[i % types.length];
			const env = envs[Math.floor(i / 8)];
			const status = Math.random() > 0.9 ? (Math.random() > 0.5 ? 'warning' : 'error') : 'running';

			return {
				id: `server-${i + 1}`,
				name: `${type}-${env}-${Math.floor(i / types.length) + 1}`,
				type,
				status,
				environment: env,
				region: regions[i % regions.length],
				provider: providers[i % providers.length],
				instanceType: instanceTypes[Math.floor(Math.random() * instanceTypes.length)],
				cpu: Math.random() * 80 + 10,
				memory: Math.random() * 80 + 10,
				disk: Math.random() * 70 + 20,
				network: Math.random() * 500 + 50,
				uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h`,
				cost: Math.random() * 500 + 50,
				ipAddress: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
				createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600000)
			};
		});
	}

	function generateMockDatabases(): Database[] {
		const types: Database['type'][] = ['postgresql', 'mongodb', 'redis', 'elasticsearch'];
		const envs: Database['environment'][] = ['production', 'staging', 'development'];

		return types.flatMap((type, typeIdx) =>
			envs.map((env, envIdx) => ({
				id: `db-${typeIdx * 3 + envIdx + 1}`,
				name: `${type}-${env}`,
				type,
				status: Math.random() > 0.95 ? 'degraded' : 'healthy' as Database['status'],
				environment: env,
				connections: Math.floor(Math.random() * 80) + 10,
				maxConnections: 100,
				size: Math.random() * 500 + 50,
				replication: env === 'production' ? 'Multi-AZ' : 'Single-AZ',
				backup: {
					lastBackup: new Date(Date.now() - Math.random() * 86400000),
					nextBackup: new Date(Date.now() + Math.random() * 86400000),
					status: Math.random() > 0.98 ? 'failed' : 'success'
				}
			}))
		);
	}

	function generateMockLoadBalancers(): LoadBalancer[] {
		return [
			{
				id: 'lb-prod-1',
				name: 'production-alb',
				status: 'healthy',
				requestsPerSecond: Math.random() * 1000 + 500,
				activeConnections: Math.floor(Math.random() * 5000) + 1000,
				targets: Array.from({ length: 4 }, (_, i) => ({
					id: `target-${i + 1}`,
					healthy: Math.random() > 0.1,
					responseTime: Math.random() * 200 + 50
				}))
			},
			{
				id: 'lb-staging-1',
				name: 'staging-alb',
				status: 'healthy',
				requestsPerSecond: Math.random() * 200 + 100,
				activeConnections: Math.floor(Math.random() * 1000) + 200,
				targets: Array.from({ length: 2 }, (_, i) => ({
					id: `target-${i + 1}`,
					healthy: true,
					responseTime: Math.random() * 150 + 30
				}))
			}
		];
	}

	// Filter servers
	$: filteredServers = servers.filter(s => {
		if (selectedEnvironment !== 'all' && s.environment !== selectedEnvironment) return false;
		if (selectedType !== 'all' && s.type !== selectedType) return false;
		return true;
	});

	// Statistics
	$: serverStats = {
		total: filteredServers.length,
		running: filteredServers.filter(s => s.status === 'running').length,
		warning: filteredServers.filter(s => s.status === 'warning').length,
		error: filteredServers.filter(s => s.status === 'error').length,
		totalCost: filteredServers.reduce((sum, s) => sum + s.cost, 0)
	};

	$: resourceStats = {
		avgCpu: filteredServers.reduce((sum, s) => sum + s.cpu, 0) / filteredServers.length || 0,
		avgMemory: filteredServers.reduce((sum, s) => sum + s.memory, 0) / filteredServers.length || 0,
		avgDisk: filteredServers.reduce((sum, s) => sum + s.disk, 0) / filteredServers.length || 0,
		totalNetwork: filteredServers.reduce((sum, s) => sum + s.network, 0)
	};

	function getStatusColor(status: Server['status'] | Database['status'] | LoadBalancer['status']): string {
		switch (status) {
			case 'running':
			case 'healthy': return 'var(--color-black)';
			case 'warning':
			case 'degraded': return '#FF8C00';
			case 'error':
			case 'down': return '#DC143C';
			case 'stopped': return 'var(--color-gray-40)';
			default: return 'var(--color-gray-40)';
		}
	}

	function getEnvironmentColor(env: string): string {
		switch (env) {
			case 'production': return '#DC143C';
			case 'staging': return '#FF8C00';
			case 'development': return '#1E90FF';
			default: return 'var(--color-gray-40)';
		}
	}

	function getTypeIcon(type: Server['type']): string {
		switch (type) {
			case 'web': return '🌐';
			case 'api': return '📡';
			case 'database': return '🗄️';
			case 'cache': return '⚡';
			case 'worker': return '⚙️';
			case 'lb': return '⚖️';
			default: return '●';
		}
	}

	function getProviderLogo(provider: Server['provider']): string {
		switch (provider) {
			case 'aws': return 'AWS';
			case 'gcp': return 'GCP';
			case 'azure': return 'AZ';
			default: return provider.toUpperCase();
		}
	}

	function refreshData() {
		// Simulate metric updates
		servers = servers.map(s => ({
			...s,
			cpu: Math.max(0, Math.min(100, s.cpu + (Math.random() - 0.5) * 10)),
			memory: Math.max(0, Math.min(100, s.memory + (Math.random() - 0.5) * 10)),
			disk: Math.max(0, Math.min(100, s.disk + (Math.random() - 0.5) * 5)),
			network: Math.max(0, s.network + (Math.random() - 0.5) * 50)
		}));

		databases = databases.map(db => ({
			...db,
			connections: Math.max(0, Math.min(db.maxConnections, db.connections + Math.floor((Math.random() - 0.5) * 10)))
		}));

		loadBalancers = loadBalancers.map(lb => ({
			...lb,
			requestsPerSecond: Math.max(0, lb.requestsPerSecond + (Math.random() - 0.5) * 100),
			activeConnections: Math.max(0, lb.activeConnections + Math.floor((Math.random() - 0.5) * 500))
		}));
	}

	onMount(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(refreshData, 5000) as unknown as number;
		}
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	$: {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
		if (autoRefresh) {
			refreshInterval = setInterval(refreshData, 5000) as unknown as number;
		}
	}
</script>

<div class="infrastructure-page">
	<!-- Header -->
	<div class="page-header">
		<div class="header-left">
			<h1 class="page-title">INFRASTRUCTURE</h1>
			<p class="page-subtitle">SERVER AND RESOURCE MANAGEMENT</p>
		</div>
		<div class="header-actions">
			<button class="action-button" on:click={refreshData}>
				REFRESH
			</button>
			<label class="auto-refresh-toggle">
				<input type="checkbox" bind:checked={autoRefresh} />
				<span>AUTO-REFRESH (5s)</span>
			</label>
		</div>
	</div>

	<!-- Statistics -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">TOTAL SERVERS</div>
			<div class="stat-value">{serverStats.total}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">RUNNING</div>
			<div class="stat-value">{serverStats.running}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">WARNINGS</div>
			<div class="stat-value">{serverStats.warning}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">ERRORS</div>
			<div class="stat-value">{serverStats.error}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">MONTHLY COST</div>
			<div class="stat-value">${serverStats.totalCost.toFixed(0)}</div>
		</div>
	</div>

	<!-- Resource Usage -->
	<div class="resources-section">
		<h2 class="section-title">AVERAGE RESOURCE USAGE</h2>
		<div class="resources-grid">
			<div class="resource-card">
				<div class="resource-label">CPU</div>
				<div class="resource-bar">
					<div class="resource-fill" style="width: {resourceStats.avgCpu}%"></div>
				</div>
				<div class="resource-value">{resourceStats.avgCpu.toFixed(1)}%</div>
			</div>
			<div class="resource-card">
				<div class="resource-label">MEMORY</div>
				<div class="resource-bar">
					<div class="resource-fill" style="width: {resourceStats.avgMemory}%"></div>
				</div>
				<div class="resource-value">{resourceStats.avgMemory.toFixed(1)}%</div>
			</div>
			<div class="resource-card">
				<div class="resource-label">DISK</div>
				<div class="resource-bar">
					<div class="resource-fill" style="width: {resourceStats.avgDisk}%"></div>
				</div>
				<div class="resource-value">{resourceStats.avgDisk.toFixed(1)}%</div>
			</div>
			<div class="resource-card">
				<div class="resource-label">NETWORK</div>
				<div class="resource-value">{resourceStats.totalNetwork.toFixed(0)} Mbps</div>
			</div>
		</div>
	</div>

	<!-- Load Balancers -->
	<div class="load-balancers-section">
		<h2 class="section-title">LOAD BALANCERS</h2>
		<div class="lb-grid">
			{#each loadBalancers as lb}
				<div class="lb-card">
					<div class="lb-header">
						<div class="lb-name">{lb.name}</div>
						<div class="lb-status" style="color: {getStatusColor(lb.status)}">
							{lb.status.toUpperCase()}
						</div>
					</div>
					<div class="lb-metrics">
						<div class="lb-metric">
							<div class="metric-label">REQUESTS/SEC</div>
							<div class="metric-value">{lb.requestsPerSecond.toFixed(0)}</div>
						</div>
						<div class="lb-metric">
							<div class="metric-label">CONNECTIONS</div>
							<div class="metric-value">{lb.activeConnections.toLocaleString()}</div>
						</div>
					</div>
					<div class="lb-targets">
						<div class="targets-label">TARGETS ({lb.targets.length})</div>
						<div class="targets-list">
							{#each lb.targets as target}
								<div class="target-item">
									<span class="target-status" style="color: {target.healthy ? 'var(--color-black)' : '#DC143C'}">
										{target.healthy ? '●' : '○'}
									</span>
									<span class="target-id">{target.id}</span>
									<span class="target-response">{target.responseTime.toFixed(0)}ms</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Databases -->
	<div class="databases-section">
		<h2 class="section-title">DATABASES</h2>
		<div class="databases-grid">
			{#each databases as db}
				<div class="db-card">
					<div class="db-header">
						<div class="db-name">{db.name}</div>
						<div class="db-status" style="color: {getStatusColor(db.status)}">
							{db.status.toUpperCase()}
						</div>
					</div>
					<div class="db-info">
						<div class="db-detail">
							<span class="label">TYPE:</span>
							<span class="value">{db.type.toUpperCase()}</span>
						</div>
						<div class="db-detail">
							<span class="label">CONNECTIONS:</span>
							<span class="value">{db.connections}/{db.maxConnections}</span>
						</div>
						<div class="db-detail">
							<span class="label">SIZE:</span>
							<span class="value">{db.size.toFixed(1)} GB</span>
						</div>
						<div class="db-detail">
							<span class="label">REPLICATION:</span>
							<span class="value">{db.replication}</span>
						</div>
						<div class="db-detail">
							<span class="label">LAST BACKUP:</span>
							<span class="value" style="color: {db.backup.status === 'success' ? 'var(--color-black)' : '#DC143C'}">
								{db.backup.lastBackup.toLocaleTimeString()}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Servers -->
	<div class="servers-section">
		<div class="servers-header">
			<h2 class="section-title">SERVERS</h2>
			<div class="servers-filters">
				<select bind:value={selectedEnvironment}>
					<option value="all">All Environments</option>
					<option value="production">Production</option>
					<option value="staging">Staging</option>
					<option value="development">Development</option>
				</select>
				<select bind:value={selectedType}>
					<option value="all">All Types</option>
					<option value="web">Web</option>
					<option value="api">API</option>
					<option value="database">Database</option>
					<option value="cache">Cache</option>
					<option value="worker">Worker</option>
					<option value="lb">Load Balancer</option>
				</select>
			</div>
		</div>

		<div class="servers-table-container">
			<table class="servers-table">
				<thead>
					<tr>
						<th>SERVER</th>
						<th>TYPE</th>
						<th>STATUS</th>
						<th>ENVIRONMENT</th>
						<th>PROVIDER</th>
						<th>INSTANCE</th>
						<th>CPU</th>
						<th>MEMORY</th>
						<th>DISK</th>
						<th>NETWORK</th>
						<th>UPTIME</th>
						<th>COST/MO</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredServers as server}
						<tr class="server-row">
							<td class="server-name">
								<div class="name-cell">
									<span class="server-icon">{getTypeIcon(server.type)}</span>
									<div>
										<div class="name">{server.name}</div>
										<div class="ip">{server.ipAddress}</div>
									</div>
								</div>
							</td>
							<td class="type">{server.type.toUpperCase()}</td>
							<td>
								<span class="status-badge" style="color: {getStatusColor(server.status)}">
									{server.status.toUpperCase()}
								</span>
							</td>
							<td>
								<span class="env-badge" style="color: {getEnvironmentColor(server.environment)}">
									{server.environment.toUpperCase()}
								</span>
							</td>
							<td class="provider">
								<span class="provider-badge">{getProviderLogo(server.provider)}</span>
								<span class="region">{server.region}</span>
							</td>
							<td class="instance">{server.instanceType}</td>
							<td class="metric">
								<div class="metric-bar">
									<div class="metric-fill" style="width: {server.cpu}%; background: {server.cpu > 80 ? '#DC143C' : server.cpu > 60 ? '#FF8C00' : 'var(--color-black)'}"></div>
								</div>
								<span>{server.cpu.toFixed(0)}%</span>
							</td>
							<td class="metric">
								<div class="metric-bar">
									<div class="metric-fill" style="width: {server.memory}%; background: {server.memory > 80 ? '#DC143C' : server.memory > 60 ? '#FF8C00' : 'var(--color-black)'}"></div>
								</div>
								<span>{server.memory.toFixed(0)}%</span>
							</td>
							<td class="metric">
								<div class="metric-bar">
									<div class="metric-fill" style="width: {server.disk}%; background: {server.disk > 80 ? '#DC143C' : server.disk > 60 ? '#FF8C00' : 'var(--color-black)'}"></div>
								</div>
								<span>{server.disk.toFixed(0)}%</span>
							</td>
							<td class="network">{server.network.toFixed(0)} Mbps</td>
							<td class="uptime">{server.uptime}</td>
							<td class="cost">${server.cost.toFixed(0)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	.infrastructure-page {
		padding: var(--space-6);
		max-width: 1800px;
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

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-4);
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

	/* Resources */
	.resources-section {
		margin-bottom: var(--space-6);
	}

	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.resource-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.resource-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.resource-bar {
		height: 24px;
		background: var(--color-gray-08);
		border: var(--border-width) solid var(--color-gray-20);
		margin-bottom: var(--space-2);
	}

	.resource-fill {
		height: 100%;
		background: var(--color-black);
		transition: width var(--duration-normal) var(--easing-ease);
	}

	.resource-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	/* Load Balancers */
	.load-balancers-section {
		margin-bottom: var(--space-6);
	}

	.lb-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--space-4);
	}

	.lb-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.lb-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.lb-name {
		font-weight: var(--font-semibold);
		font-family: var(--font-mono);
	}

	.lb-status {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.lb-metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.lb-metric {
		padding: var(--space-2);
		background: var(--color-gray-04);
	}

	.metric-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-1);
	}

	.metric-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
	}

	.lb-targets {
		padding: var(--space-2);
		background: var(--color-gray-04);
	}

	.targets-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.targets-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.target-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-family: var(--font-mono);
	}

	.target-status {
		font-size: 8px;
	}

	.target-id {
		flex: 1;
	}

	.target-response {
		color: var(--color-gray-40);
		font-size: var(--text-xs);
	}

	/* Databases */
	.databases-section {
		margin-bottom: var(--space-6);
	}

	.databases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.db-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.db-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.db-name {
		font-weight: var(--font-semibold);
		font-family: var(--font-mono);
	}

	.db-status {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.db-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.db-detail {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		padding: var(--space-1) 0;
	}

	.db-detail .label {
		color: var(--color-gray-40);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
	}

	.db-detail .value {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	/* Servers */
	.servers-section {
		margin-bottom: var(--space-6);
	}

	.servers-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.servers-filters {
		display: flex;
		gap: var(--space-2);
	}

	.servers-filters select {
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.servers-table-container {
		border: var(--border-width) solid var(--color-black);
		overflow-x: auto;
		background: var(--color-white);
	}

	.servers-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.servers-table thead {
		background: var(--color-black);
		color: var(--color-white);
	}

	.servers-table th {
		padding: var(--space-2);
		text-align: left;
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		white-space: nowrap;
	}

	.servers-table td {
		padding: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.server-row:hover {
		background: var(--color-gray-04);
	}

	.server-name .name-cell {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.server-icon {
		font-size: 16px;
	}

	.server-name .name {
		font-weight: var(--font-semibold);
	}

	.server-name .ip {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.type {
		font-weight: var(--font-medium);
	}

	.status-badge,
	.env-badge {
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.provider {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.provider-badge {
		font-weight: var(--font-semibold);
		padding: 2px 4px;
		background: var(--color-gray-08);
		border: var(--border-width) solid var(--color-gray-20);
	}

	.region {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.instance {
		font-weight: var(--font-medium);
	}

	.metric {
		min-width: 80px;
	}

	.metric-bar {
		height: 4px;
		background: var(--color-gray-08);
		margin-bottom: var(--space-1);
	}

	.metric-fill {
		height: 100%;
		transition: width var(--duration-normal) var(--easing-ease);
	}

	.metric span {
		font-variant-numeric: tabular-nums;
	}

	.network,
	.uptime,
	.cost {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.infrastructure-page {
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

		.lb-grid {
			grid-template-columns: 1fr;
		}

		.databases-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.servers-table {
			font-size: 10px;
		}
	}

	@media (max-width: 640px) {
		.infrastructure-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.resources-grid {
			grid-template-columns: 1fr;
		}

		.databases-grid {
			grid-template-columns: 1fr;
		}

		.servers-filters {
			flex-direction: column;
			width: 100%;
		}

		.servers-filters select {
			width: 100%;
		}
	}
</style>
