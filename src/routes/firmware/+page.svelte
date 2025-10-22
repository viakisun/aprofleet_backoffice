<script lang="ts">
	interface FirmwareVersion {
		id: string;
		version: string;
		releaseDate: string;
		status: 'stable' | 'beta' | 'deprecated' | 'development';
		type: 'major' | 'minor' | 'patch' | 'hotfix';
		size: number; // MB
		changelog: string[];
		bugFixes: string[];
		knownIssues: string[];
		compatibleModels: string[];
		deployedVehicles: number;
		totalVehicles: number;
	}

	interface OTACampaign {
		id: string;
		name: string;
		firmwareVersion: string;
		status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'failed';
		createdAt: string;
		scheduledAt: string;
		completedAt?: string;
		targetVehicles: number;
		successfulUpdates: number;
		failedUpdates: number;
		pendingUpdates: number;
		progress: number;
		rollbackEnabled: boolean;
		autoRetry: boolean;
	}

	const firmwareVersions: FirmwareVersion[] = [
		{
			id: 'fw-001',
			version: '2.4.1',
			releaseDate: '2024-10-15',
			status: 'stable',
			type: 'patch',
			size: 245,
			changelog: [
				'Improved obstacle detection accuracy',
				'Enhanced battery management algorithm',
				'Optimized route planning performance'
			],
			bugFixes: [
				'Fixed GPS drift issue in tunnel areas',
				'Resolved charging station handshake timeout',
				'Corrected speed limiter behavior on slopes'
			],
			knownIssues: [],
			compatibleModels: ['AFC-200', 'AFP-400', 'AFU-150'],
			deployedVehicles: 52,
			totalVehicles: 60
		},
		{
			id: 'fw-002',
			version: '2.4.0',
			releaseDate: '2024-09-01',
			status: 'stable',
			type: 'minor',
			size: 289,
			changelog: [
				'Added weather-adaptive driving modes',
				'Implemented V2X communication protocol',
				'New passenger comfort features'
			],
			bugFixes: [
				'Fixed memory leak in sensor fusion module',
				'Improved camera calibration stability'
			],
			knownIssues: [
				'Occasional GPS drift in tunnel areas (fixed in 2.4.1)'
			],
			compatibleModels: ['AFC-200', 'AFP-400'],
			deployedVehicles: 8,
			totalVehicles: 60
		},
		{
			id: 'fw-003',
			version: '3.0.0-beta.2',
			releaseDate: '2024-10-20',
			status: 'beta',
			type: 'major',
			size: 512,
			changelog: [
				'Full Level 5 autonomy support',
				'Advanced AI path planning',
				'Fleet coordination system',
				'Predictive maintenance AI'
			],
			bugFixes: [],
			knownIssues: [
				'Beta version - not for production use',
				'Fleet coordination requires all vehicles on same version'
			],
			compatibleModels: ['AFS-600'],
			deployedVehicles: 0,
			totalVehicles: 0
		},
		{
			id: 'fw-004',
			version: '2.3.5',
			releaseDate: '2024-07-10',
			status: 'deprecated',
			type: 'patch',
			size: 234,
			changelog: [
				'Minor performance improvements',
				'Updated security certificates'
			],
			bugFixes: [
				'Fixed rare crash during startup'
			],
			knownIssues: [],
			compatibleModels: ['AFC-200', 'AFU-150'],
			deployedVehicles: 0,
			totalVehicles: 60
		}
	];

	const otaCampaigns: OTACampaign[] = [
		{
			id: 'campaign-001',
			name: 'AFC/AFP Fleet Update to 2.4.1',
			firmwareVersion: '2.4.1',
			status: 'in_progress',
			createdAt: '2024-10-20 14:30',
			scheduledAt: '2024-10-22 02:00',
			targetVehicles: 43,
			successfulUpdates: 28,
			failedUpdates: 2,
			pendingUpdates: 13,
			progress: 69.8,
			rollbackEnabled: true,
			autoRetry: true
		},
		{
			id: 'campaign-002',
			name: 'Emergency Security Patch',
			firmwareVersion: '2.4.1',
			status: 'completed',
			createdAt: '2024-10-15 09:00',
			scheduledAt: '2024-10-15 22:00',
			completedAt: '2024-10-16 03:45',
			targetVehicles: 17,
			successfulUpdates: 17,
			failedUpdates: 0,
			pendingUpdates: 0,
			progress: 100,
			rollbackEnabled: false,
			autoRetry: true
		},
		{
			id: 'campaign-003',
			name: 'Beta Test - Level 5 Autonomy',
			firmwareVersion: '3.0.0-beta.2',
			status: 'scheduled',
			createdAt: '2024-10-21 16:00',
			scheduledAt: '2024-10-25 00:00',
			targetVehicles: 2,
			successfulUpdates: 0,
			failedUpdates: 0,
			pendingUpdates: 2,
			progress: 0,
			rollbackEnabled: true,
			autoRetry: false
		},
		{
			id: 'campaign-004',
			name: 'Rollback to 2.3.5',
			firmwareVersion: '2.3.5',
			status: 'failed',
			createdAt: '2024-09-28 11:00',
			scheduledAt: '2024-09-28 23:00',
			completedAt: '2024-09-29 01:30',
			targetVehicles: 5,
			successfulUpdates: 2,
			failedUpdates: 3,
			pendingUpdates: 0,
			progress: 40,
			rollbackEnabled: false,
			autoRetry: false
		}
	];

	let selectedTab: 'versions' | 'campaigns' = 'versions';
	let selectedVersion: FirmwareVersion | null = null;
	let selectedCampaign: OTACampaign | null = null;

	function getStatusSymbol(status: string): string {
		const symbols: Record<string, string> = {
			'stable': '■',
			'beta': '◆',
			'deprecated': '✖',
			'development': '⬚',
			'scheduled': '◆',
			'in_progress': '▶',
			'paused': '■',
			'completed': '✓',
			'failed': '✖'
		};
		return symbols[status] || '●';
	}

	function getProgressBar(progress: number): string {
		const filled = Math.floor(progress / 10);
		const empty = 10 - filled;
		return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
	}

	function handleVersionClick(version: FirmwareVersion) {
		selectedVersion = version;
	}

	function handleCampaignClick(campaign: OTACampaign) {
		selectedCampaign = campaign;
	}

	function closeModal() {
		selectedVersion = null;
		selectedCampaign = null;
	}
</script>

<div class="firmware-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">FIRMWARE MANAGEMENT</h1>
			<p class="page-subtitle">OTA Updates & Version Control</p>
		</div>
		<div class="header-actions">
			<button class="btn-secondary">+ UPLOAD FIRMWARE</button>
			<button class="btn-primary">+ CREATE OTA CAMPAIGN</button>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">LATEST STABLE</div>
			<div class="stat-value">2.4.1</div>
			<div class="stat-detail">RELEASED OCT 15, 2024</div>
		</div>

		<div class="stat-card">
			<div class="stat-label">ACTIVE CAMPAIGNS</div>
			<div class="stat-value">{otaCampaigns.filter(c => c.status === 'in_progress').length}</div>
			<div class="stat-detail">IN PROGRESS</div>
		</div>

		<div class="stat-card">
			<div class="stat-label">PENDING UPDATES</div>
			<div class="stat-value">{otaCampaigns.reduce((sum, c) => sum + c.pendingUpdates, 0)}</div>
			<div class="stat-detail">ACROSS ALL CAMPAIGNS</div>
		</div>

		<div class="stat-card">
			<div class="stat-label">SUCCESS RATE</div>
			<div class="stat-value">
				{(
					(otaCampaigns.reduce((sum, c) => sum + c.successfulUpdates, 0) /
					otaCampaigns.reduce((sum, c) => sum + c.targetVehicles, 0)) * 100
				).toFixed(1)}%
			</div>
			<div class="stat-detail">OVERALL DEPLOYMENT</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="tabs">
		<button
			class="tab"
			class:active={selectedTab === 'versions'}
			on:click={() => selectedTab = 'versions'}
		>
			FIRMWARE VERSIONS
		</button>
		<button
			class="tab"
			class:active={selectedTab === 'campaigns'}
			on:click={() => selectedTab = 'campaigns'}
		>
			OTA CAMPAIGNS
		</button>
	</div>

	<!-- Firmware Versions Tab -->
	{#if selectedTab === 'versions'}
		<div class="versions-section">
			<div class="versions-grid">
				{#each firmwareVersions as version}
					<button class="version-card" on:click={() => handleVersionClick(version)}>
						<div class="card-header">
							<div class="version-number">{version.version}</div>
							<div class="version-status">
								<span class="status-symbol">{getStatusSymbol(version.status)}</span>
								{version.status.toUpperCase()}
							</div>
						</div>

						<div class="version-meta">
							<span class="meta-item">
								<span class="meta-label">TYPE:</span>
								{version.type.toUpperCase()}
							</span>
							<span class="meta-item">
								<span class="meta-label">SIZE:</span>
								{version.size}MB
							</span>
							<span class="meta-item">
								<span class="meta-label">RELEASED:</span>
								{version.releaseDate}
							</span>
						</div>

						<div class="deployment-progress">
							<div class="progress-label">DEPLOYMENT</div>
							<div class="progress-bar">
								<div
									class="progress-fill"
									style="width: {(version.deployedVehicles / version.totalVehicles) * 100}%"
								></div>
							</div>
							<div class="progress-text">
								{version.deployedVehicles} / {version.totalVehicles} VEHICLES
							</div>
						</div>

						<div class="version-features">
							<div class="features-label">CHANGES:</div>
							<div class="features-count">
								{version.changelog.length} NEW FEATURES, {version.bugFixes.length} BUG FIXES
							</div>
						</div>

						<div class="compatible-models">
							<div class="models-label">COMPATIBLE:</div>
							<div class="models-list">
								{#each version.compatibleModels as model}
									<span class="model-chip">{model}</span>
								{/each}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- OTA Campaigns Tab -->
	{#if selectedTab === 'campaigns'}
		<div class="campaigns-section">
			<div class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th>CAMPAIGN</th>
							<th>FIRMWARE</th>
							<th>STATUS</th>
							<th>PROGRESS</th>
							<th>SCHEDULED</th>
							<th>TARGETS</th>
							<th>SUCCESS</th>
							<th>FAILED</th>
							<th>OPTIONS</th>
						</tr>
					</thead>
					<tbody>
						{#each otaCampaigns as campaign}
							<tr class="clickable-row" on:click={() => handleCampaignClick(campaign)}>
								<td>
									<div class="campaign-name">{campaign.name}</div>
									<div class="campaign-id">{campaign.id}</div>
								</td>
								<td>
									<div class="firmware-version">{campaign.firmwareVersion}</div>
								</td>
								<td>
									<div class="status-cell">
										<span class="status-symbol">{getStatusSymbol(campaign.status)}</span>
										{campaign.status.toUpperCase().replace('_', ' ')}
									</div>
								</td>
								<td>
									<div class="progress-cell">
										<div class="progress-bar-ascii">{getProgressBar(campaign.progress)}</div>
										<div class="progress-percent">{campaign.progress.toFixed(1)}%</div>
									</div>
								</td>
								<td>
									<div class="date-cell">
										<div>{campaign.scheduledAt}</div>
										{#if campaign.completedAt}
											<div class="completed-date">✓ {campaign.completedAt}</div>
										{/if}
									</div>
								</td>
								<td>
									<div class="number-cell">{campaign.targetVehicles}</div>
								</td>
								<td>
									<div class="number-cell success">{campaign.successfulUpdates}</div>
								</td>
								<td>
									<div class="number-cell {campaign.failedUpdates > 0 ? 'error' : ''}">{campaign.failedUpdates}</div>
								</td>
								<td>
									<div class="options-cell">
										{#if campaign.rollbackEnabled}
											<span class="option-badge">ROLLBACK</span>
										{/if}
										{#if campaign.autoRetry}
											<span class="option-badge">AUTO-RETRY</span>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Version Detail Modal -->
{#if selectedVersion}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		on:click={closeModal}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="modal-content large"
			role="dialog"
			aria-modal="true"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div class="modal-header">
				<div>
					<h2 class="modal-title">FIRMWARE {selectedVersion.version}</h2>
					<div class="modal-subtitle">
						<span class="status-symbol">{getStatusSymbol(selectedVersion.status)}</span>
						{selectedVersion.status.toUpperCase()} - {selectedVersion.type.toUpperCase()} RELEASE
					</div>
				</div>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="info-grid">
					<div class="info-item">
						<div class="info-label">RELEASE DATE</div>
						<div class="info-value">{selectedVersion.releaseDate}</div>
					</div>
					<div class="info-item">
						<div class="info-label">SIZE</div>
						<div class="info-value">{selectedVersion.size} MB</div>
					</div>
					<div class="info-item">
						<div class="info-label">DEPLOYED</div>
						<div class="info-value">{selectedVersion.deployedVehicles} / {selectedVersion.totalVehicles}</div>
					</div>
					<div class="info-item">
						<div class="info-label">DEPLOYMENT RATE</div>
						<div class="info-value">
							{((selectedVersion.deployedVehicles / selectedVersion.totalVehicles) * 100).toFixed(1)}%
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">COMPATIBLE MODELS</div>
					<div class="models-grid">
						{#each selectedVersion.compatibleModels as model}
							<div class="model-badge">{model}</div>
						{/each}
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">CHANGELOG ({selectedVersion.changelog.length})</div>
					<ul class="changelog-list">
						{#each selectedVersion.changelog as change}
							<li>{change}</li>
						{/each}
					</ul>
				</div>

				<div class="detail-section">
					<div class="section-title">BUG FIXES ({selectedVersion.bugFixes.length})</div>
					<ul class="bugfix-list">
						{#each selectedVersion.bugFixes as fix}
							<li>{fix}</li>
						{/each}
					</ul>
				</div>

				{#if selectedVersion.knownIssues.length > 0}
					<div class="detail-section warning">
						<div class="section-title">KNOWN ISSUES ({selectedVersion.knownIssues.length})</div>
						<ul class="issues-list">
							{#each selectedVersion.knownIssues as issue}
								<li>▲ {issue}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeModal}>CLOSE</button>
				<button class="btn-primary">CREATE OTA CAMPAIGN</button>
			</div>
		</div>
	</div>
{/if}

<!-- Campaign Detail Modal -->
{#if selectedCampaign}
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
					<h2 class="modal-title">{selectedCampaign.name}</h2>
					<div class="modal-subtitle">{selectedCampaign.id}</div>
				</div>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="campaign-overview">
					<div class="overview-status">
						<span class="status-symbol large">{getStatusSymbol(selectedCampaign.status)}</span>
						<div class="status-info">
							<div class="status-label">{selectedCampaign.status.toUpperCase().replace('_', ' ')}</div>
							<div class="status-detail">FIRMWARE {selectedCampaign.firmwareVersion}</div>
						</div>
					</div>

					<div class="overview-progress">
						<div class="progress-header">
							<span>PROGRESS</span>
							<span>{selectedCampaign.progress.toFixed(1)}%</span>
						</div>
						<div class="progress-bar large">
							<div class="progress-fill" style="width: {selectedCampaign.progress}%"></div>
						</div>
						<div class="progress-stats">
							<div class="stat-item">
								<div class="stat-value">{selectedCampaign.successfulUpdates}</div>
								<div class="stat-label">SUCCESSFUL</div>
							</div>
							<div class="stat-item">
								<div class="stat-value">{selectedCampaign.failedUpdates}</div>
								<div class="stat-label">FAILED</div>
							</div>
							<div class="stat-item">
								<div class="stat-value">{selectedCampaign.pendingUpdates}</div>
								<div class="stat-label">PENDING</div>
							</div>
							<div class="stat-item">
								<div class="stat-value">{selectedCampaign.targetVehicles}</div>
								<div class="stat-label">TOTAL</div>
							</div>
						</div>
					</div>
				</div>

				<div class="info-grid">
					<div class="info-item">
						<div class="info-label">CREATED</div>
						<div class="info-value">{selectedCampaign.createdAt}</div>
					</div>
					<div class="info-item">
						<div class="info-label">SCHEDULED</div>
						<div class="info-value">{selectedCampaign.scheduledAt}</div>
					</div>
					{#if selectedCampaign.completedAt}
						<div class="info-item">
							<div class="info-label">COMPLETED</div>
							<div class="info-value">{selectedCampaign.completedAt}</div>
						</div>
					{/if}
				</div>

				<div class="options-section">
					<div class="section-title">CAMPAIGN OPTIONS</div>
					<div class="options-grid">
						<div class="option-item">
							<div class="option-status {selectedCampaign.rollbackEnabled ? 'enabled' : 'disabled'}">
								{selectedCampaign.rollbackEnabled ? '■' : '⬚'}
							</div>
							<div class="option-label">ROLLBACK ENABLED</div>
						</div>
						<div class="option-item">
							<div class="option-status {selectedCampaign.autoRetry ? 'enabled' : 'disabled'}">
								{selectedCampaign.autoRetry ? '■' : '⬚'}
							</div>
							<div class="option-label">AUTO-RETRY ON FAILURE</div>
						</div>
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeModal}>CLOSE</button>
				{#if selectedCampaign.status === 'in_progress'}
					<button class="btn-secondary">PAUSE CAMPAIGN</button>
					{#if selectedCampaign.rollbackEnabled}
						<button class="btn-danger">ROLLBACK</button>
					{/if}
				{:else if selectedCampaign.status === 'paused'}
					<button class="btn-primary">RESUME CAMPAIGN</button>
				{:else if selectedCampaign.status === 'failed'}
					<button class="btn-primary">RETRY FAILED UPDATES</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.firmware-page {
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
		gap: var(--space-3);
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

	.btn-danger {
		padding: var(--space-3) var(--space-4);
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width-2) solid var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.stat-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		min-height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.stat-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-1);
	}

	.stat-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.tab {
		padding: var(--space-3) var(--space-4);
		background: none;
		border: none;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		border-bottom: var(--border-width-2) solid transparent;
		margin-bottom: calc(-1 * var(--border-width-2));
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.tab:hover {
		background: var(--color-gray-04);
	}

	.tab.active {
		border-bottom-color: var(--color-black);
	}

	/* Versions Grid */
	.versions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: var(--space-4);
	}

	.version-card {
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

	.version-card:hover {
		border-color: var(--color-black);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.version-card:focus {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.version-card:focus:not(:focus-visible) {
		outline: none;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.version-number {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.version-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.status-symbol {
		font-size: 10px;
	}

	.version-meta {
		display: flex;
		gap: var(--space-3);
		font-size: var(--text-xs);
	}

	.meta-label {
		color: var(--color-gray-40);
	}

	.deployment-progress {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.progress-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-gray-12);
		border: var(--border-width) solid var(--color-gray-20);
		position: relative;
	}

	.progress-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		background: var(--color-black);
	}

	.progress-text {
		font-size: var(--text-xs);
		font-family: monospace;
	}

	.version-features {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.features-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.features-count {
		font-size: var(--text-sm);
	}

	.compatible-models {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.models-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.models-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.model-chip {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-family: monospace;
	}

	/* Campaigns Table */
	.table-container {
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
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

	.campaign-name {
		font-weight: var(--font-medium);
	}

	.campaign-id {
		font-size: var(--text-xs);
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.firmware-version {
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.status-cell {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.progress-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 150px;
	}

	.progress-bar-ascii {
		font-family: monospace;
		font-size: 11px;
		letter-spacing: -2px;
	}

	.progress-percent {
		font-size: var(--text-xs);
		font-family: monospace;
	}

	.date-cell {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.completed-date {
		color: var(--color-gray-40);
	}

	.number-cell {
		font-family: monospace;
		font-weight: var(--font-medium);
		text-align: center;
	}

	.number-cell.success {
		color: var(--color-black);
	}

	.number-cell.error {
		border: var(--border-width) solid var(--color-black);
		padding: var(--space-1);
	}

	.options-cell {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
	}

	.option-badge {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wide);
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
		max-width: 700px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-content.large {
		max-width: 900px;
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
	}

	.modal-body {
		padding: var(--space-4);
		overflow-y: auto;
		flex: 1;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
		margin-bottom: var(--space-4);
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

	.detail-section {
		margin-bottom: var(--space-4);
	}

	.detail-section.warning {
		padding: var(--space-3);
		border: var(--border-width-2) solid var(--color-black);
		background: var(--color-gray-04);
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.models-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.model-badge {
		padding: var(--space-2) var(--space-3);
		border: var(--border-width) solid var(--color-black);
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.changelog-list,
	.bugfix-list,
	.issues-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.changelog-list li::before {
		content: '■ ';
		margin-right: var(--space-2);
	}

	.bugfix-list li::before {
		content: '✓ ';
		margin-right: var(--space-2);
	}

	.campaign-overview {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
		margin-bottom: var(--space-4);
	}

	.overview-status {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width) solid var(--color-gray-20);
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

	.overview-progress {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.progress-bar.large {
		height: 24px;
	}

	.progress-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-3);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-20);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-item .stat-value {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.stat-item .stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.options-section {
		margin-bottom: var(--space-4);
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

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	/* Responsive Media Queries */
	@media (max-width: 1024px) {
		.firmware-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
			align-items: flex-start;
		}

		.header-actions {
			width: 100%;
			flex-direction: column;
		}

		.header-actions button {
			width: 100%;
		}

		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		}

		.versions-grid {
			grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		}
	}

	@media (max-width: 768px) {
		.firmware-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}

		.tabs {
			flex-direction: column;
			gap: 0;
		}

		.tab {
			width: 100%;
			border-bottom: var(--border-width) solid var(--color-gray-20);
			margin-bottom: 0;
		}

		.tab.active {
			border-left: var(--border-width-2) solid var(--color-black);
			border-bottom: var(--border-width) solid var(--color-gray-20);
		}

		.versions-grid {
			grid-template-columns: 1fr;
		}

		.table-container {
			overflow-x: auto;
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

		.progress-stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.firmware-page {
			padding: var(--space-2);
		}

		.page-title {
			font-size: var(--text-lg);
		}

		.page-subtitle {
			font-size: var(--text-xs);
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: var(--space-2);
		}

		.stat-card {
			min-height: 100px;
			padding: var(--space-3);
		}

		.stat-value {
			font-size: var(--text-2xl);
		}

		.btn-primary,
		.btn-secondary,
		.btn-danger {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}

		.progress-stats {
			grid-template-columns: 1fr;
		}

		.options-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
