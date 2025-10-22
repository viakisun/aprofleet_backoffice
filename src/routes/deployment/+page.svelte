<script lang="ts">
	import { onMount } from 'svelte';

	interface Deployment {
		id: string;
		version: string;
		environment: 'production' | 'staging' | 'development';
		status: 'deployed' | 'deploying' | 'failed' | 'rolled_back';
		deployedAt: Date;
		deployedBy: string;
		commitHash: string;
		commitMessage: string;
		branch: string;
		services: DeploymentService[];
		duration?: number;
		rollbackable: boolean;
	}

	interface DeploymentService {
		name: string;
		status: 'success' | 'deploying' | 'failed';
		version: string;
		healthCheck: boolean;
		replicas: number;
		url?: string;
	}

	interface Release {
		version: string;
		createdAt: Date;
		createdBy: string;
		commitHash: string;
		branch: string;
		changes: string[];
		artifacts: string[];
	}

	// State
	let selectedEnvironment: 'all' | 'production' | 'staging' | 'development' = 'all';
	let deployments: Deployment[] = generateMockDeployments();
	let releases: Release[] = generateMockReleases();
	let showDeployModal = false;
	let showRollbackModal = false;
	let selectedDeployment: Deployment | null = null;
	let selectedRelease: Release | null = null;
	let deploymentInProgress = false;

	function generateMockDeployments(): Deployment[] {
		const envs: Deployment['environment'][] = ['production', 'staging', 'development'];
		const statuses: Deployment['status'][] = ['deployed', 'deploying', 'failed', 'rolled_back'];
		const users = ['john.doe', 'jane.smith', 'admin', 'ci-bot'];
		const services = ['api-server', 'web-app', 'worker', 'websocket', 'auth-service'];

		return Array.from({ length: 30 }, (_, i) => {
			const env = envs[i % envs.length];
			const status = i === 0 ? 'deployed' : (i === 1 ? 'deploying' : statuses[Math.floor(Math.random() * statuses.length)]);
			const version = `v1.${Math.floor(i / 3)}.${i % 3}`;

			return {
				id: `deploy-${30 - i}`,
				version,
				environment: env,
				status,
				deployedAt: new Date(Date.now() - i * 3600000 * 6),
				deployedBy: users[Math.floor(Math.random() * users.length)],
				commitHash: Math.random().toString(36).substring(2, 9),
				commitMessage: `Release ${version}: ${['Bug fixes', 'New features', 'Performance improvements', 'Security updates'][i % 4]}`,
				branch: env === 'production' ? 'main' : (env === 'staging' ? 'staging' : 'develop'),
				duration: status === 'deployed' ? Math.floor(Math.random() * 600) + 120 : undefined,
				rollbackable: status === 'deployed' && i > 0,
				services: services.map(name => ({
					name,
					status: status === 'deploying' ? (Math.random() > 0.5 ? 'success' : 'deploying') :
					        (status === 'failed' && Math.random() > 0.7 ? 'failed' : 'success'),
					version,
					healthCheck: status === 'deployed' || status === 'deploying',
					replicas: Math.floor(Math.random() * 3) + 2,
					url: env === 'production' ? `https://${name}.aprofleet.com` :
					     `https://${name}-${env}.aprofleet.com`
				}))
			};
		});
	}

	function generateMockReleases(): Release[] {
		const users = ['john.doe', 'jane.smith', 'admin'];
		const changes = [
			'Add new dashboard widgets',
			'Fix vehicle tracking accuracy',
			'Update authentication flow',
			'Improve database performance',
			'Add reservation notifications',
			'Fix charging station sync',
			'Update UI components',
			'Add export functionality'
		];

		return Array.from({ length: 15 }, (_, i) => ({
			version: `v1.${Math.floor(i / 3)}.${i % 3}`,
			createdAt: new Date(Date.now() - i * 86400000),
			createdBy: users[i % users.length],
			commitHash: Math.random().toString(36).substring(2, 9),
			branch: 'main',
			changes: Array.from(
				{ length: Math.floor(Math.random() * 4) + 2 },
				() => changes[Math.floor(Math.random() * changes.length)]
			),
			artifacts: [
				'api-server.tar.gz',
				'web-app.tar.gz',
				'worker.tar.gz'
			]
		}));
	}

	// Filter deployments
	$: filteredDeployments = deployments.filter(d =>
		selectedEnvironment === 'all' || d.environment === selectedEnvironment
	);

	// Current deployments per environment
	$: currentDeployments = {
		production: deployments.find(d => d.environment === 'production' && d.status === 'deployed'),
		staging: deployments.find(d => d.environment === 'staging' && d.status === 'deployed'),
		development: deployments.find(d => d.environment === 'development' && d.status === 'deployed')
	};

	// Statistics
	$: stats = {
		total: deployments.length,
		deployed: deployments.filter(d => d.status === 'deployed').length,
		deploying: deployments.filter(d => d.status === 'deploying').length,
		failed: deployments.filter(d => d.status === 'failed').length,
		rolledBack: deployments.filter(d => d.status === 'rolled_back').length
	};

	function formatDuration(seconds?: number): string {
		if (!seconds) return '-';
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	}

	function formatTimestamp(date: Date): string {
		return date.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).toUpperCase();
	}

	function getStatusColor(status: Deployment['status']): string {
		switch (status) {
			case 'deployed': return 'var(--color-black)';
			case 'deploying': return '#1E90FF';
			case 'failed': return '#DC143C';
			case 'rolled_back': return '#FF8C00';
			default: return 'var(--color-gray-40)';
		}
	}

	function getEnvironmentColor(env: Deployment['environment']): string {
		switch (env) {
			case 'production': return '#DC143C';
			case 'staging': return '#FF8C00';
			case 'development': return '#1E90FF';
			default: return 'var(--color-gray-40)';
		}
	}

	function openDeployModal(release: Release) {
		selectedRelease = release;
		showDeployModal = true;
	}

	function closeDeployModal() {
		showDeployModal = false;
		selectedRelease = null;
	}

	function openRollbackModal(deployment: Deployment) {
		selectedDeployment = deployment;
		showRollbackModal = true;
	}

	function closeRollbackModal() {
		showRollbackModal = false;
		selectedDeployment = null;
	}

	async function deployRelease(env: Deployment['environment']) {
		if (!selectedRelease || deploymentInProgress) return;

		deploymentInProgress = true;
		const newDeployment: Deployment = {
			id: `deploy-${Date.now()}`,
			version: selectedRelease.version,
			environment: env,
			status: 'deploying',
			deployedAt: new Date(),
			deployedBy: 'current-user',
			commitHash: selectedRelease.commitHash,
			commitMessage: selectedRelease.changes.join(', '),
			branch: selectedRelease.branch,
			rollbackable: false,
			services: ['api-server', 'web-app', 'worker', 'websocket', 'auth-service'].map(name => ({
				name,
				status: 'deploying',
				version: selectedRelease.version,
				healthCheck: false,
				replicas: 3,
				url: `https://${name}-${env}.aprofleet.com`
			}))
		};

		deployments = [newDeployment, ...deployments];
		closeDeployModal();

		// Simulate deployment progress
		setTimeout(() => {
			const index = deployments.findIndex(d => d.id === newDeployment.id);
			if (index !== -1) {
				deployments[index].status = 'deployed';
				deployments[index].duration = Math.floor(Math.random() * 300) + 120;
				deployments[index].rollbackable = true;
				deployments[index].services = deployments[index].services.map(s => ({
					...s,
					status: 'success',
					healthCheck: true
				}));
				deployments = [...deployments];
			}
			deploymentInProgress = false;
		}, 5000);
	}

	async function rollbackDeployment() {
		if (!selectedDeployment || deploymentInProgress) return;

		deploymentInProgress = true;
		const index = deployments.findIndex(d => d.id === selectedDeployment.id);

		if (index !== -1) {
			deployments[index].status = 'rolled_back';
			deployments = [...deployments];
		}

		closeRollbackModal();

		// Simulate rollback completion
		setTimeout(() => {
			deploymentInProgress = false;
		}, 3000);
	}

	let expandedDeployment: string | null = null;

	function toggleDeploymentDetails(deploymentId: string) {
		expandedDeployment = expandedDeployment === deploymentId ? null : deploymentId;
	}
</script>

<div class="deployment-page">
	<!-- Header -->
	<div class="page-header">
		<div class="header-left">
			<h1 class="page-title">DEPLOYMENT MANAGEMENT</h1>
			<p class="page-subtitle">VERSION CONTROL AND RELEASE MANAGEMENT</p>
		</div>
	</div>

	<!-- Current Deployments -->
	<div class="current-deployments">
		<h2 class="section-title">CURRENT DEPLOYMENTS</h2>
		<div class="environments-grid">
			{#each ['production', 'staging', 'development'] as env}
				{@const deployment = currentDeployments[env]}
				<div class="environment-card {env}">
					<div class="env-header">
						<div class="env-name" style="color: {getEnvironmentColor(env)}">
							{env.toUpperCase()}
						</div>
						{#if deployment}
							<div class="env-version">{deployment.version}</div>
						{/if}
					</div>
					{#if deployment}
						<div class="env-details">
							<div class="env-detail">
								<span class="label">DEPLOYED:</span>
								<span class="value">{formatTimestamp(deployment.deployedAt)}</span>
							</div>
							<div class="env-detail">
								<span class="label">BY:</span>
								<span class="value">{deployment.deployedBy}</span>
							</div>
							<div class="env-detail">
								<span class="label">COMMIT:</span>
								<span class="value">{deployment.commitHash}</span>
							</div>
							<div class="env-detail">
								<span class="label">DURATION:</span>
								<span class="value">{formatDuration(deployment.duration)}</span>
							</div>
						</div>
						<div class="env-actions">
							{#if deployment.rollbackable}
								<button
									class="rollback-button"
									on:click={() => openRollbackModal(deployment)}
									disabled={deploymentInProgress}
								>
									ROLLBACK
								</button>
							{/if}
						</div>
					{:else}
						<div class="env-empty">
							<p>NO ACTIVE DEPLOYMENT</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Statistics -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">TOTAL DEPLOYMENTS</div>
			<div class="stat-value">{stats.total}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">DEPLOYED</div>
			<div class="stat-value">{stats.deployed}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">IN PROGRESS</div>
			<div class="stat-value">{stats.deploying}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">FAILED</div>
			<div class="stat-value">{stats.failed}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">ROLLED BACK</div>
			<div class="stat-value">{stats.rolledBack}</div>
		</div>
	</div>

	<!-- Available Releases -->
	<div class="releases-section">
		<h2 class="section-title">AVAILABLE RELEASES</h2>
		<div class="releases-grid">
			{#each releases as release}
				<div class="release-card">
					<div class="release-header">
						<div class="release-version">{release.version}</div>
						<div class="release-date">{formatTimestamp(release.createdAt)}</div>
					</div>
					<div class="release-info">
						<div class="release-detail">
							<span class="label">COMMIT:</span>
							<span class="value">{release.commitHash}</span>
						</div>
						<div class="release-detail">
							<span class="label">BY:</span>
							<span class="value">{release.createdBy}</span>
						</div>
						<div class="release-detail">
							<span class="label">BRANCH:</span>
							<span class="value">{release.branch}</span>
						</div>
					</div>
					<div class="release-changes">
						<div class="changes-title">CHANGES:</div>
						<ul>
							{#each release.changes.slice(0, 3) as change}
								<li>{change}</li>
							{/each}
						</ul>
					</div>
					<button
						class="deploy-button"
						on:click={() => openDeployModal(release)}
						disabled={deploymentInProgress}
					>
						DEPLOY
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Deployment History -->
	<div class="history-section">
		<div class="history-header">
			<h2 class="section-title">DEPLOYMENT HISTORY</h2>
			<div class="history-filters">
				<label>
					<input
						type="radio"
						bind:group={selectedEnvironment}
						value="all"
					/>
					ALL
				</label>
				<label>
					<input
						type="radio"
						bind:group={selectedEnvironment}
						value="production"
					/>
					PRODUCTION
				</label>
				<label>
					<input
						type="radio"
						bind:group={selectedEnvironment}
						value="staging"
					/>
					STAGING
				</label>
				<label>
					<input
						type="radio"
						bind:group={selectedEnvironment}
						value="development"
					/>
					DEVELOPMENT
				</label>
			</div>
		</div>

		<div class="history-list">
			{#each filteredDeployments as deployment}
				<div class="history-item" class:expanded={expandedDeployment === deployment.id}>
					<div class="history-main">
						<div class="history-info">
							<div class="history-version">{deployment.version}</div>
							<div
								class="history-env"
								style="color: {getEnvironmentColor(deployment.environment)}"
							>
								{deployment.environment.toUpperCase()}
							</div>
							<div
								class="history-status"
								style="color: {getStatusColor(deployment.status)}"
							>
								{deployment.status.toUpperCase().replace('_', ' ')}
							</div>
							<div class="history-time">{formatTimestamp(deployment.deployedAt)}</div>
							<div class="history-user">{deployment.deployedBy}</div>
							<div class="history-commit">{deployment.commitHash}</div>
							<div class="history-duration">{formatDuration(deployment.duration)}</div>
						</div>
						<div class="history-actions">
							<button
								class="expand-button"
								on:click={() => toggleDeploymentDetails(deployment.id)}
							>
								{expandedDeployment === deployment.id ? '▼' : '▶'}
							</button>
						</div>
					</div>

					{#if expandedDeployment === deployment.id}
						<div class="history-details">
							<div class="details-section">
								<div class="details-title">COMMIT MESSAGE:</div>
								<p>{deployment.commitMessage}</p>
							</div>
							<div class="details-section">
								<div class="details-title">SERVICES:</div>
								<div class="services-grid">
									{#each deployment.services as service}
										<div class="service-item">
											<div class="service-name">{service.name}</div>
											<div class="service-info">
												<span
													class="service-status"
													style="color: {service.status === 'success' ? 'var(--color-black)' :
													                service.status === 'deploying' ? '#1E90FF' : '#DC143C'}"
												>
													{service.status.toUpperCase()}
												</span>
												<span class="service-meta">
													{service.replicas} replicas
													{service.healthCheck ? '✓' : '✗'}
												</span>
											</div>
											{#if service.url}
												<a href={service.url} target="_blank" class="service-url">
													{service.url}
												</a>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Deploy Modal -->
{#if showDeployModal && selectedRelease}
	<div class="modal-overlay" on:click={closeDeployModal}>
		<div class="modal" on:click|stopPropagation>
			<div class="modal-header">
				<h3>DEPLOY {selectedRelease.version}</h3>
				<button class="modal-close" on:click={closeDeployModal}>×</button>
			</div>
			<div class="modal-body">
				<p class="modal-text">Select target environment for deployment:</p>
				<div class="modal-actions">
					<button
						class="modal-button production"
						on:click={() => deployRelease('production')}
						disabled={deploymentInProgress}
					>
						PRODUCTION
					</button>
					<button
						class="modal-button staging"
						on:click={() => deployRelease('staging')}
						disabled={deploymentInProgress}
					>
						STAGING
					</button>
					<button
						class="modal-button development"
						on:click={() => deployRelease('development')}
						disabled={deploymentInProgress}
					>
						DEVELOPMENT
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Rollback Modal -->
{#if showRollbackModal && selectedDeployment}
	<div class="modal-overlay" on:click={closeRollbackModal}>
		<div class="modal" on:click|stopPropagation>
			<div class="modal-header">
				<h3>ROLLBACK DEPLOYMENT</h3>
				<button class="modal-close" on:click={closeRollbackModal}>×</button>
			</div>
			<div class="modal-body">
				<p class="modal-text warning">
					Are you sure you want to rollback {selectedDeployment.version} from {selectedDeployment.environment.toUpperCase()}?
				</p>
				<div class="modal-actions">
					<button
						class="modal-button danger"
						on:click={rollbackDeployment}
						disabled={deploymentInProgress}
					>
						CONFIRM ROLLBACK
					</button>
					<button
						class="modal-button"
						on:click={closeRollbackModal}
					>
						CANCEL
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.deployment-page {
		padding: var(--space-6);
		max-width: 1800px;
		margin: 0 auto;
	}

	/* Header */
	.page-header {
		margin-bottom: var(--space-6);
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

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-4);
	}

	/* Current Deployments */
	.current-deployments {
		margin-bottom: var(--space-6);
	}

	.environments-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.environment-card {
		border: 2px solid var(--color-black);
		padding: var(--space-4);
		background: var(--color-white);
	}

	.environment-card.production {
		border-color: #DC143C;
	}

	.environment-card.staging {
		border-color: #FF8C00;
	}

	.environment-card.development {
		border-color: #1E90FF;
	}

	.env-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.env-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.env-version {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-family: var(--font-mono);
	}

	.env-details {
		margin-bottom: var(--space-3);
	}

	.env-detail {
		display: flex;
		justify-content: space-between;
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
	}

	.env-detail .label {
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
	}

	.env-detail .value {
		font-family: var(--font-mono);
		font-weight: var(--font-medium);
	}

	.env-actions {
		display: flex;
		gap: var(--space-2);
	}

	.rollback-button {
		flex: 1;
		padding: var(--space-2);
		background: #DC143C;
		color: var(--color-white);
		border: none;
		font-size: var(--text-sm);
	}

	.rollback-button:hover:not(:disabled) {
		background: #8B0000;
	}

	.rollback-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.env-empty {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-gray-40);
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

	/* Releases */
	.releases-section {
		margin-bottom: var(--space-6);
	}

	.releases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
	}

	.release-card {
		border: var(--border-width) solid var(--color-black);
		padding: var(--space-4);
		background: var(--color-white);
		display: flex;
		flex-direction: column;
	}

	.release-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.release-version {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-family: var(--font-mono);
	}

	.release-date {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.release-info {
		margin-bottom: var(--space-3);
	}

	.release-detail {
		display: flex;
		justify-content: space-between;
		padding: var(--space-1) 0;
		font-size: var(--text-sm);
	}

	.release-detail .label {
		color: var(--color-gray-40);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
	}

	.release-detail .value {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.release-changes {
		margin-bottom: var(--space-3);
		flex: 1;
	}

	.changes-title {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-1);
	}

	.release-changes ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.release-changes li {
		font-size: var(--text-sm);
		padding: var(--space-1) 0;
		padding-left: var(--space-3);
		position: relative;
	}

	.release-changes li::before {
		content: '•';
		position: absolute;
		left: 0;
	}

	.deploy-button {
		width: 100%;
		padding: var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		border: none;
		font-size: var(--text-sm);
	}

	.deploy-button:hover:not(:disabled) {
		background: var(--color-gray-60);
	}

	.deploy-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* History */
	.history-section {
		margin-bottom: var(--space-6);
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.history-filters {
		display: flex;
		gap: var(--space-3);
	}

	.history-filters label {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-wide);
		cursor: pointer;
	}

	.history-filters input[type="radio"] {
		cursor: pointer;
	}

	.history-list {
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.history-item {
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.history-item:last-child {
		border-bottom: none;
	}

	.history-main {
		display: flex;
		align-items: center;
		padding: var(--space-3);
		transition: background var(--duration-fast) var(--easing-linear);
	}

	.history-main:hover {
		background: var(--color-gray-04);
	}

	.history-info {
		flex: 1;
		display: grid;
		grid-template-columns: 100px 120px 120px 140px 1fr 100px 80px;
		gap: var(--space-3);
		align-items: center;
		font-size: var(--text-sm);
	}

	.history-version {
		font-family: var(--font-mono);
		font-weight: var(--font-semibold);
	}

	.history-env,
	.history-status {
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.history-time {
		color: var(--color-gray-40);
	}

	.history-user {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.history-commit {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.history-duration {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		text-align: right;
	}

	.history-actions {
		padding: 0 var(--space-2);
	}

	.expand-button {
		width: 24px;
		height: 24px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		background: transparent;
		border: var(--border-width) solid var(--color-gray-20);
	}

	.expand-button:hover {
		background: var(--color-gray-12);
	}

	.history-details {
		padding: var(--space-4);
		background: var(--color-gray-04);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.details-section {
		margin-bottom: var(--space-4);
	}

	.details-section:last-child {
		margin-bottom: 0;
	}

	.details-title {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.details-section p {
		font-size: var(--text-sm);
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.service-item {
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
	}

	.service-name {
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		margin-bottom: var(--space-1);
	}

	.service-info {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-xs);
		margin-bottom: var(--space-1);
	}

	.service-status {
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wide);
	}

	.service-meta {
		color: var(--color-gray-40);
	}

	.service-url {
		font-size: var(--text-xs);
		color: #1E90FF;
		text-decoration: none;
		word-break: break-all;
	}

	.service-url:hover {
		text-decoration: underline;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: var(--color-white);
		border: 2px solid var(--color-black);
		max-width: 500px;
		width: 90%;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.modal-header h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.modal-close {
		width: 32px;
		height: 32px;
		padding: 0;
		font-size: 24px;
		line-height: 1;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.modal-body {
		padding: var(--space-6);
	}

	.modal-text {
		margin-bottom: var(--space-4);
		font-size: var(--text-sm);
	}

	.modal-text.warning {
		color: #DC143C;
		font-weight: var(--font-semibold);
	}

	.modal-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.modal-button {
		padding: var(--space-3);
		font-size: var(--text-sm);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
	}

	.modal-button.production {
		border-color: #DC143C;
		color: #DC143C;
	}

	.modal-button.production:hover:not(:disabled) {
		background: #DC143C;
		color: var(--color-white);
	}

	.modal-button.staging {
		border-color: #FF8C00;
		color: #FF8C00;
	}

	.modal-button.staging:hover:not(:disabled) {
		background: #FF8C00;
		color: var(--color-white);
	}

	.modal-button.development {
		border-color: #1E90FF;
		color: #1E90FF;
	}

	.modal-button.development:hover:not(:disabled) {
		background: #1E90FF;
		color: var(--color-white);
	}

	.modal-button.danger {
		background: #DC143C;
		color: var(--color-white);
		border-color: #DC143C;
	}

	.modal-button.danger:hover:not(:disabled) {
		background: #8B0000;
	}

	.modal-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.deployment-page {
			padding: var(--space-4);
		}

		.environments-grid {
			grid-template-columns: 1fr;
		}

		.history-info {
			grid-template-columns: 1fr;
			gap: var(--space-1);
		}

		.services-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.deployment-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.releases-grid {
			grid-template-columns: 1fr;
		}

		.history-filters {
			flex-direction: column;
			width: 100%;
		}
	}
</style>
