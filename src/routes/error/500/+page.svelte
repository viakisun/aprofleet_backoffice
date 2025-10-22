<script lang="ts">
	import { goto } from '$app/navigation';

	function reload() {
		window.location.reload();
	}

	function goHome() {
		goto('/dashboard');
	}

	// Generate a mock error ID for support
	const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
</script>

<div class="error-page">
	<div class="error-container">
		<div class="error-code">500</div>
		<div class="error-title">INTERNAL SERVER ERROR</div>
		<div class="error-message">
			AN UNEXPECTED ERROR OCCURRED WHILE PROCESSING YOUR REQUEST.
		</div>

		<div class="error-details">
			<div class="detail-box critical">
				<div class="detail-label">■ SYSTEM STATUS</div>
				<div class="status-grid">
					<div class="status-item">
						<span class="status-label">API SERVER:</span>
						<span class="status-value error">✖ ERROR</span>
					</div>
					<div class="status-item">
						<span class="status-label">DATABASE:</span>
						<span class="status-value">■ ONLINE</span>
					</div>
					<div class="status-item">
						<span class="status-label">CACHE:</span>
						<span class="status-value">■ ONLINE</span>
					</div>
					<div class="status-item">
						<span class="status-label">WEBSOCKET:</span>
						<span class="status-value">■ ONLINE</span>
					</div>
				</div>
			</div>

			<div class="detail-box">
				<div class="detail-label">RECOMMENDED ACTIONS:</div>
				<ul class="detail-list">
					<li>■ REFRESH THE PAGE TO TRY AGAIN</li>
					<li>■ WAIT A FEW MINUTES AND RETRY</li>
					<li>■ CHECK YOUR INTERNET CONNECTION</li>
					<li>■ CONTACT SUPPORT IF PROBLEM PERSISTS</li>
				</ul>
			</div>
		</div>

		<div class="error-actions">
			<button class="btn-secondary" on:click={reload}>
				↻ RELOAD PAGE
			</button>
			<button class="btn-primary" on:click={goHome}>
				GO TO DASHBOARD
			</button>
		</div>

		<div class="error-footer">
			<div class="footer-text critical">
				■ PLEASE REPORT THIS ERROR TO TECHNICAL SUPPORT WITH THE FOLLOWING INFORMATION:
			</div>
			<div class="error-code-box">
				<div class="code-line">ERROR CODE: 500</div>
				<div class="code-line">ERROR ID: {errorId}</div>
				<div class="code-line">TIMESTAMP: {new Date().toISOString()}</div>
				<div class="code-line">PATH: {window.location.pathname}</div>
				<div class="code-line">USER AGENT: {navigator.userAgent.substring(0, 80)}...</div>
			</div>
			<div class="support-info">
				<div class="support-label">TECHNICAL SUPPORT:</div>
				<div class="support-details">
					<div class="support-item">EMAIL: support@dyinnovate.com</div>
					<div class="support-item">PHONE: +82-2-1234-5678</div>
					<div class="support-item">HOURS: MON-FRI 09:00-18:00 KST</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-6);
		background: var(--color-white);
	}

	.error-container {
		max-width: 800px;
		width: 100%;
		border: var(--border-width-2) solid var(--color-black);
		padding: var(--space-8);
		background: var(--color-white);
	}

	.error-code {
		font-size: 120px;
		font-weight: var(--font-semibold);
		line-height: 1;
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-4);
		font-variant-numeric: tabular-nums;
	}

	.error-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.error-message {
		font-size: var(--text-base);
		line-height: 1.5;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-6);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.error-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.detail-box {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.detail-box.critical {
		border-width: var(--border-width-2);
		border-color: var(--color-black);
		background: var(--color-white);
	}

	.detail-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.status-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.status-item {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		padding: var(--space-2);
		background: var(--color-gray-04);
	}

	.status-label {
		font-family: monospace;
	}

	.status-value {
		font-family: monospace;
		font-weight: var(--font-medium);
	}

	.status-value.error {
		border: var(--border-width) solid var(--color-black);
		padding: 0 var(--space-2);
	}

	.detail-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.detail-list li {
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.error-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-6);
		border-bottom: var(--border-width) solid var(--color-gray-20);
	}

	.btn-primary {
		padding: var(--space-3) var(--space-6);
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
		padding: var(--space-3) var(--space-6);
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

	.error-footer {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.footer-text {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
		text-align: center;
	}

	.footer-text.critical {
		color: var(--color-black);
		font-weight: var(--font-medium);
	}

	.error-code-box {
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-20);
		font-family: monospace;
		font-size: var(--text-xs);
	}

	.code-line {
		padding: var(--space-1) 0;
	}

	.support-info {
		padding: var(--space-4);
		border: var(--border-width-2) solid var(--color-black);
		background: var(--color-white);
	}

	.support-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.support-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.support-item {
		font-family: monospace;
		font-size: var(--text-sm);
	}

	@media (max-width: 768px) {
		.error-details {
			grid-template-columns: 1fr;
		}

		.error-code {
			font-size: 80px;
		}
	}
</style>
