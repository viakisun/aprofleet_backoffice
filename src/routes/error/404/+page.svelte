<script lang="ts">
	import { goto } from '$app/navigation';

	function goBack() {
		window.history.back();
	}

	function goHome() {
		goto('/dashboard');
	}
</script>

<div class="error-page">
	<div class="error-container">
		<div class="error-code">404</div>
		<div class="error-title">PAGE NOT FOUND</div>
		<div class="error-message">
			THE REQUESTED RESOURCE COULD NOT BE LOCATED.
		</div>

		<div class="error-details">
			<div class="detail-box">
				<div class="detail-label">POSSIBLE REASONS:</div>
				<ul class="detail-list">
					<li>■ URL WAS TYPED INCORRECTLY</li>
					<li>■ RESOURCE HAS BEEN MOVED OR DELETED</li>
					<li>■ OUTDATED BOOKMARK OR LINK</li>
					<li>■ FEATURE NOT YET IMPLEMENTED</li>
				</ul>
			</div>

			<div class="detail-box">
				<div class="detail-label">QUICK NAVIGATION:</div>
				<ul class="detail-list">
					<li>■ DASHBOARD - MAIN OVERVIEW</li>
					<li>■ VEHICLES - FLEET MONITORING</li>
					<li>■ OPERATIONS - DAILY OPERATIONS</li>
					<li>■ RESERVATIONS - BOOKING SYSTEM</li>
				</ul>
			</div>
		</div>

		<div class="error-actions">
			<button class="btn-secondary" on:click={goBack}>
				← GO BACK
			</button>
			<button class="btn-primary" on:click={goHome}>
				GO TO DASHBOARD
			</button>
		</div>

		<div class="error-footer">
			<div class="footer-text">
				IF THIS PAGE SHOULD EXIST, PLEASE REPORT THIS ISSUE TO YOUR SYSTEM ADMINISTRATOR.
			</div>
			<div class="error-code-box">
				<div class="code-line">ERROR CODE: 404</div>
				<div class="code-line">TIMESTAMP: {new Date().toISOString()}</div>
				<div class="code-line">PATH: {window.location.pathname}</div>
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

	.detail-label {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
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

	@media (max-width: 768px) {
		.error-details {
			grid-template-columns: 1fr;
		}

		.error-code {
			font-size: 80px;
		}
	}
</style>
