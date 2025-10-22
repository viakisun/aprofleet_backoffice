<script lang="ts">
	import { auth } from '$lib/stores/auth';

	let activeTab: 'account' | 'notifications' | 'display' | 'security' | 'api' = 'account';

	// Account settings
	let accountSettings = {
		name: $auth.user?.name || '',
		email: $auth.user?.email || '',
		phone: '+82-10-1234-5678',
		department: 'Operations',
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	// Notification settings
	let notificationSettings = {
		email: {
			fleetAlerts: true,
			maintenanceReminders: true,
			systemUpdates: false,
			weeklyReports: true
		},
		push: {
			criticalAlerts: true,
			vehicleWarnings: true,
			reservationUpdates: false,
			batteryAlerts: true
		},
		sms: {
			emergencyOnly: true,
			maintenanceUrgent: false
		}
	};

	// Display settings
	let displaySettings = {
		language: 'en-US',
		timezone: 'Asia/Seoul',
		dateFormat: 'YYYY-MM-DD',
		timeFormat: '24h',
		theme: 'system'
	};

	// Security settings
	let securitySettings = {
		twoFactorEnabled: false,
		sessionTimeout: 30,
		loginNotifications: true,
		ipWhitelist: ''
	};

	// API settings
	let apiKeys = [
		{
			id: 'api-001',
			name: 'Production API Key',
			key: 'ak_live_xxxxxxxxxxxxxxxxxxxxxx',
			created: '2024-01-15',
			lastUsed: '2024-10-22 14:30',
			permissions: ['read', 'write']
		},
		{
			id: 'api-002',
			name: 'Development API Key',
			key: 'ak_test_yyyyyyyyyyyyyyyyyyyyyyyy',
			created: '2024-03-20',
			lastUsed: '2024-10-20 09:15',
			permissions: ['read']
		}
	];

	let showPassword = false;
	let unsavedChanges = false;

	function saveAccountSettings() {
		// Mock save
		console.log('Saving account settings:', accountSettings);
		unsavedChanges = false;
	}

	function saveNotificationSettings() {
		console.log('Saving notification settings:', notificationSettings);
		unsavedChanges = false;
	}

	function saveDisplaySettings() {
		console.log('Saving display settings:', displaySettings);
		unsavedChanges = false;
	}

	function saveSecuritySettings() {
		console.log('Saving security settings:', securitySettings);
		unsavedChanges = false;
	}

	function generateApiKey() {
		console.log('Generating new API key');
	}

	function revokeApiKey(keyId: string) {
		console.log('Revoking API key:', keyId);
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<div class="settings-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">SETTINGS</h1>
			<p class="page-subtitle">Manage Your Account & Preferences</p>
		</div>
		{#if unsavedChanges}
			<div class="unsaved-indicator">
				■ UNSAVED CHANGES
			</div>
		{/if}
	</div>

	<div class="settings-container">
		<!-- Sidebar Navigation -->
		<div class="settings-sidebar">
			<nav class="settings-nav">
				<button
					class="nav-item"
					class:active={activeTab === 'account'}
					on:click={() => activeTab = 'account'}
				>
					<span class="nav-icon">■</span>
					<span class="nav-label">ACCOUNT</span>
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'notifications'}
					on:click={() => activeTab = 'notifications'}
				>
					<span class="nav-icon">■</span>
					<span class="nav-label">NOTIFICATIONS</span>
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'display'}
					on:click={() => activeTab = 'display'}
				>
					<span class="nav-icon">■</span>
					<span class="nav-label">DISPLAY</span>
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'security'}
					on:click={() => activeTab = 'security'}
				>
					<span class="nav-icon">■</span>
					<span class="nav-label">SECURITY</span>
				</button>
				<button
					class="nav-item"
					class:active={activeTab === 'api'}
					on:click={() => activeTab = 'api'}
				>
					<span class="nav-icon">■</span>
					<span class="nav-label">API KEYS</span>
				</button>
			</nav>
		</div>

		<!-- Content Area -->
		<div class="settings-content">
			<!-- Account Settings -->
			{#if activeTab === 'account'}
				<div class="settings-section">
					<div class="section-header">
						<h2 class="section-title">ACCOUNT INFORMATION</h2>
						<p class="section-description">Update your personal information and credentials</p>
					</div>

					<div class="form-section">
						<div class="form-group">
							<label for="name">FULL NAME</label>
							<input
								id="name"
								type="text"
								bind:value={accountSettings.name}
								on:input={() => unsavedChanges = true}
							/>
						</div>

						<div class="form-group">
							<label for="email">EMAIL ADDRESS</label>
							<input
								id="email"
								type="email"
								bind:value={accountSettings.email}
								on:input={() => unsavedChanges = true}
							/>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="phone">PHONE NUMBER</label>
								<input
									id="phone"
									type="tel"
									bind:value={accountSettings.phone}
									on:input={() => unsavedChanges = true}
								/>
							</div>

							<div class="form-group">
								<label for="department">DEPARTMENT</label>
								<input
									id="department"
									type="text"
									bind:value={accountSettings.department}
									on:input={() => unsavedChanges = true}
								/>
							</div>
						</div>
					</div>

					<div class="section-header">
						<h2 class="section-title">CHANGE PASSWORD</h2>
						<p class="section-description">Update your password to maintain account security</p>
					</div>

					<div class="form-section">
						<div class="form-group">
							<label for="current-password">CURRENT PASSWORD</label>
							{#if showPassword}
								<input
									id="current-password"
									type="text"
									bind:value={accountSettings.currentPassword}
								/>
							{:else}
								<input
									id="current-password"
									type="password"
									bind:value={accountSettings.currentPassword}
								/>
							{/if}
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="new-password">NEW PASSWORD</label>
								{#if showPassword}
									<input
										id="new-password"
										type="text"
										bind:value={accountSettings.newPassword}
									/>
								{:else}
									<input
										id="new-password"
										type="password"
										bind:value={accountSettings.newPassword}
									/>
								{/if}
							</div>

							<div class="form-group">
								<label for="confirm-password">CONFIRM PASSWORD</label>
								{#if showPassword}
									<input
										id="confirm-password"
										type="text"
										bind:value={accountSettings.confirmPassword}
									/>
								{:else}
									<input
										id="confirm-password"
										type="password"
										bind:value={accountSettings.confirmPassword}
									/>
								{/if}
							</div>
						</div>

						<div class="form-group checkbox">
							<input
								id="show-password"
								type="checkbox"
								bind:checked={showPassword}
							/>
							<label for="show-password">SHOW PASSWORDS</label>
						</div>
					</div>

					<div class="form-actions">
						<button class="btn-secondary" on:click={() => unsavedChanges = false}>
							CANCEL
						</button>
						<button class="btn-primary" on:click={saveAccountSettings}>
							SAVE CHANGES
						</button>
					</div>
				</div>
			{/if}

			<!-- Notification Settings -->
			{#if activeTab === 'notifications'}
				<div class="settings-section">
					<div class="section-header">
						<h2 class="section-title">NOTIFICATION PREFERENCES</h2>
						<p class="section-description">Choose how you want to receive notifications</p>
					</div>

					<div class="notification-group">
						<div class="group-title">EMAIL NOTIFICATIONS</div>
						<div class="notification-items">
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Fleet Alerts</div>
									<div class="item-description">Vehicle warnings, critical battery levels, maintenance alerts</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.email.fleetAlerts}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Maintenance Reminders</div>
									<div class="item-description">Scheduled maintenance and inspection reminders</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.email.maintenanceReminders}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">System Updates</div>
									<div class="item-description">Platform updates and new feature announcements</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.email.systemUpdates}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Weekly Reports</div>
									<div class="item-description">Weekly fleet performance and utilization reports</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.email.weeklyReports}
									on:change={() => unsavedChanges = true}
								/>
							</div>
						</div>
					</div>

					<div class="notification-group">
						<div class="group-title">PUSH NOTIFICATIONS</div>
						<div class="notification-items">
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Critical Alerts</div>
									<div class="item-description">Immediate attention required for vehicle issues</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.push.criticalAlerts}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Vehicle Warnings</div>
									<div class="item-description">Non-critical vehicle status warnings</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.push.vehicleWarnings}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Reservation Updates</div>
									<div class="item-description">New reservations and booking changes</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.push.reservationUpdates}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Battery Alerts</div>
									<div class="item-description">Low battery and charging status notifications</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.push.batteryAlerts}
									on:change={() => unsavedChanges = true}
								/>
							</div>
						</div>
					</div>

					<div class="notification-group">
						<div class="group-title">SMS NOTIFICATIONS</div>
						<div class="notification-items">
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Emergency Only</div>
									<div class="item-description">Critical system failures and security alerts</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.sms.emergencyOnly}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="notification-item">
								<div class="item-info">
									<div class="item-name">Urgent Maintenance</div>
									<div class="item-description">Immediate maintenance required notifications</div>
								</div>
								<input
									type="checkbox"
									bind:checked={notificationSettings.sms.maintenanceUrgent}
									on:change={() => unsavedChanges = true}
								/>
							</div>
						</div>
					</div>

					<div class="form-actions">
						<button class="btn-secondary" on:click={() => unsavedChanges = false}>
							CANCEL
						</button>
						<button class="btn-primary" on:click={saveNotificationSettings}>
							SAVE PREFERENCES
						</button>
					</div>
				</div>
			{/if}

			<!-- Display Settings -->
			{#if activeTab === 'display'}
				<div class="settings-section">
					<div class="section-header">
						<h2 class="section-title">DISPLAY PREFERENCES</h2>
						<p class="section-description">Customize your interface preferences</p>
					</div>

					<div class="form-section">
						<div class="form-group">
							<label for="language">LANGUAGE</label>
							<select
								id="language"
								bind:value={displaySettings.language}
								on:change={() => unsavedChanges = true}
							>
								<option value="en-US">ENGLISH (US)</option>
								<option value="ko-KR">한국어 (KOREAN)</option>
								<option value="ja-JP">日本語 (JAPANESE)</option>
								<option value="zh-CN">中文 (CHINESE)</option>
							</select>
						</div>

						<div class="form-group">
							<label for="timezone">TIMEZONE</label>
							<select
								id="timezone"
								bind:value={displaySettings.timezone}
								on:change={() => unsavedChanges = true}
							>
								<option value="Asia/Seoul">ASIA/SEOUL (UTC+09:00)</option>
								<option value="America/New_York">AMERICA/NEW_YORK (UTC-05:00)</option>
								<option value="America/Los_Angeles">AMERICA/LOS_ANGELES (UTC-08:00)</option>
								<option value="Europe/London">EUROPE/LONDON (UTC+00:00)</option>
								<option value="Asia/Tokyo">ASIA/TOKYO (UTC+09:00)</option>
							</select>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="date-format">DATE FORMAT</label>
								<select
									id="date-format"
									bind:value={displaySettings.dateFormat}
									on:change={() => unsavedChanges = true}
								>
									<option value="YYYY-MM-DD">YYYY-MM-DD (2024-10-22)</option>
									<option value="MM/DD/YYYY">MM/DD/YYYY (10/22/2024)</option>
									<option value="DD/MM/YYYY">DD/MM/YYYY (22/10/2024)</option>
								</select>
							</div>

							<div class="form-group">
								<label for="time-format">TIME FORMAT</label>
								<select
									id="time-format"
									bind:value={displaySettings.timeFormat}
									on:change={() => unsavedChanges = true}
								>
									<option value="24h">24-HOUR (14:30)</option>
									<option value="12h">12-HOUR (2:30 PM)</option>
								</select>
							</div>
						</div>

						<div class="form-group">
							<label for="theme">THEME</label>
							<select
								id="theme"
								bind:value={displaySettings.theme}
								on:change={() => unsavedChanges = true}
							>
								<option value="system">SYSTEM DEFAULT</option>
								<option value="light">LIGHT (ALWAYS)</option>
								<option value="dark">DARK (NOT IMPLEMENTED)</option>
							</select>
							<div class="field-note">
								NOTE: Dark theme is not available in the current "extreme black & white" design system.
							</div>
						</div>
					</div>

					<div class="form-actions">
						<button class="btn-secondary" on:click={() => unsavedChanges = false}>
							CANCEL
						</button>
						<button class="btn-primary" on:click={saveDisplaySettings}>
							SAVE PREFERENCES
						</button>
					</div>
				</div>
			{/if}

			<!-- Security Settings -->
			{#if activeTab === 'security'}
				<div class="settings-section">
					<div class="section-header">
						<h2 class="section-title">SECURITY SETTINGS</h2>
						<p class="section-description">Manage your account security and access controls</p>
					</div>

					<div class="security-section">
						<div class="security-item">
							<div class="item-header">
								<div class="item-title">TWO-FACTOR AUTHENTICATION</div>
								<button class="toggle-btn {securitySettings.twoFactorEnabled ? 'enabled' : 'disabled'}">
									{securitySettings.twoFactorEnabled ? '■ ENABLED' : '⬚ DISABLED'}
								</button>
							</div>
							<div class="item-description">
								Add an extra layer of security by requiring a verification code in addition to your password.
							</div>
							{#if !securitySettings.twoFactorEnabled}
								<button class="btn-secondary small" on:click={() => {
									securitySettings.twoFactorEnabled = true;
									unsavedChanges = true;
								}}>
									ENABLE 2FA
								</button>
							{/if}
						</div>

						<div class="security-item">
							<div class="item-title">SESSION TIMEOUT</div>
							<div class="item-description">
								Automatically log out after a period of inactivity.
							</div>
							<div class="form-group inline">
								<select
									bind:value={securitySettings.sessionTimeout}
									on:change={() => unsavedChanges = true}
								>
									<option value={15}>15 MINUTES</option>
									<option value={30}>30 MINUTES</option>
									<option value={60}>1 HOUR</option>
									<option value={240}>4 HOURS</option>
									<option value={480}>8 HOURS</option>
								</select>
							</div>
						</div>

						<div class="security-item">
							<div class="item-header">
								<div class="item-title">LOGIN NOTIFICATIONS</div>
								<input
									type="checkbox"
									bind:checked={securitySettings.loginNotifications}
									on:change={() => unsavedChanges = true}
								/>
							</div>
							<div class="item-description">
								Receive email notifications when your account is accessed from a new device or location.
							</div>
						</div>

						<div class="security-item">
							<div class="item-title">IP WHITELIST</div>
							<div class="item-description">
								Restrict account access to specific IP addresses (comma-separated). Leave empty to allow all.
							</div>
							<textarea
								bind:value={securitySettings.ipWhitelist}
								on:input={() => unsavedChanges = true}
								placeholder="192.168.1.1, 10.0.0.1"
								rows="3"
							></textarea>
						</div>
					</div>

					<div class="form-actions">
						<button class="btn-secondary" on:click={() => unsavedChanges = false}>
							CANCEL
						</button>
						<button class="btn-primary" on:click={saveSecuritySettings}>
							SAVE SECURITY SETTINGS
						</button>
					</div>
				</div>
			{/if}

			<!-- API Keys -->
			{#if activeTab === 'api'}
				<div class="settings-section">
					<div class="section-header">
						<h2 class="section-title">API KEYS</h2>
						<p class="section-description">Manage API keys for programmatic access</p>
						<button class="btn-primary" on:click={generateApiKey}>
							+ GENERATE NEW KEY
						</button>
					</div>

					<div class="api-keys-list">
						{#each apiKeys as key}
							<div class="api-key-card">
								<div class="key-header">
									<div class="key-name">{key.name}</div>
									<button class="btn-danger-text" on:click={() => revokeApiKey(key.id)}>
										✖ REVOKE
									</button>
								</div>

								<div class="key-value">
									<code>{key.key}</code>
									<button class="btn-icon" on:click={() => copyToClipboard(key.key)}>
										COPY
									</button>
								</div>

								<div class="key-meta">
									<div class="meta-row">
										<span class="meta-label">CREATED:</span>
										<span class="meta-value">{key.created}</span>
									</div>
									<div class="meta-row">
										<span class="meta-label">LAST USED:</span>
										<span class="meta-value">{key.lastUsed}</span>
									</div>
									<div class="meta-row">
										<span class="meta-label">PERMISSIONS:</span>
										<span class="meta-value">{key.permissions.join(', ').toUpperCase()}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="api-info-box">
						<div class="info-title">API DOCUMENTATION</div>
						<div class="info-text">
							For API documentation and usage examples, visit the developer portal at:
							<code>https://api.dyinnovate.com/docs</code>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.settings-page {
		padding: var(--space-6);
		max-width: 1400px;
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

	.unsaved-indicator {
		padding: var(--space-2) var(--space-3);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	/* Container */
	.settings-container {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: var(--space-6);
	}

	/* Sidebar */
	.settings-sidebar {
		position: sticky;
		top: var(--space-6);
		height: fit-content;
	}

	.settings-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		padding: var(--space-3) 0;
	}

	.nav-item {
		display: flex !important;
		align-items: center;
		justify-content: flex-start !important;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-4);
		background: none;
		border: none;
		text-align: left;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
		height: auto;
		text-transform: none;
		white-space: normal;
	}

	.nav-item:hover {
		background: var(--color-gray-04);
	}

	.nav-item.active {
		background: var(--color-black);
		color: var(--color-white);
	}

	.nav-icon {
		width: 16px;
		text-align: center;
		font-size: 12px;
	}

	.nav-label {
		flex: 1;
	}

	/* Content */
	.settings-content {
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		padding: var(--space-6);
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.section-header {
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin: 0 0 var(--space-1) 0;
	}

	.section-description {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		margin: 0;
	}

	/* Forms */
	.form-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-group.inline {
		flex-direction: row;
		align-items: center;
	}

	.form-group.checkbox {
		flex-direction: row;
		align-items: center;
		gap: var(--space-2);
	}

	.form-group label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.form-group input[type="text"],
	.form-group input[type="email"],
	.form-group input[type="tel"],
	.form-group input[type="password"],
	.form-group select,
	.form-group textarea {
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white) !important;
		color: var(--color-black) !important;
		font-size: var(--text-sm);
		font-family: inherit;
		text-transform: none;
		letter-spacing: normal;
		font-weight: normal;
		height: auto;
		line-height: 1.5;
		display: block;
	}

	.form-group select option {
		background: var(--color-white);
		color: var(--color-black);
	}

	.form-group textarea {
		resize: vertical;
		font-family: monospace;
	}

	.field-note {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		font-style: italic;
	}

	/* Notifications */
	.notification-group {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.group-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.notification-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.notification-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.item-info {
		flex: 1;
	}

	.item-name {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		margin-bottom: var(--space-1);
	}

	.item-description {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	/* Security */
	.security-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.security-item {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.toggle-btn {
		padding: var(--space-1) var(--space-3);
		border: var(--border-width) solid var(--color-black);
		background: var(--color-white);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
	}

	.toggle-btn.enabled {
		background: var(--color-black);
		color: var(--color-white);
	}

	/* API Keys */
	.api-keys-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.api-key-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.key-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.key-name {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
	}

	.key-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.key-value code {
		flex: 1;
		font-family: monospace;
		font-size: var(--text-sm);
	}

	.key-meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-size: var(--text-xs);
	}

	.meta-row {
		display: flex;
		gap: var(--space-2);
	}

	.meta-label {
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.meta-value {
		font-family: monospace;
	}

	.api-info-box {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.info-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.info-text {
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.info-text code {
		font-family: monospace;
		padding: var(--space-1) var(--space-2);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-gray-12);
	}

	/* Buttons */
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

	.btn-secondary.small {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
	}

	.btn-danger-text {
		background: none;
		border: none;
		color: var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		padding: var(--space-2);
	}

	.btn-danger-text:hover {
		text-decoration: underline;
	}

	.btn-icon {
		padding: var(--space-2) var(--space-3);
		background: none;
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
	}

	.btn-icon:hover {
		background: var(--color-gray-04);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding-top: var(--space-4);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	@media (max-width: 968px) {
		.settings-container {
			grid-template-columns: 1fr;
		}

		.settings-sidebar {
			position: relative;
			top: 0;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
