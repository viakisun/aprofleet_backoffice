<script lang="ts">
	import { notification, type Notification } from '$lib/stores/notification';
	import { fly, fade } from 'svelte/transition';

	function getTypeIcon(type: string): string {
		switch (type) {
			case 'success': return '✓';
			case 'error': return '✖';
			case 'warning': return '▲';
			case 'info': return 'ℹ';
			default: return '•';
		}
	}

	function getBorderStyle(type: string): string {
		switch (type) {
			case 'error': return 'border-width: 2px';
			case 'warning': return 'border-style: dashed';
			default: return '';
		}
	}

	function handleAction(notif: Notification) {
		if (notif.action) {
			notif.action.handler();
			notification.remove(notif.id);
		}
	}
</script>

{#if $notification.notifications.length > 0}
	<div class="toast-container" aria-live="polite" aria-atomic="true">
		{#each $notification.notifications as notif (notif.id)}
			<div
				class="toast"
				class:error={notif.type === 'error'}
				class:warning={notif.type === 'warning'}
				style={getBorderStyle(notif.type)}
				transition:fly={{ y: 20, duration: 150 }}
			>
				<div class="toast-icon">
					{getTypeIcon(notif.type)}
				</div>

				<div class="toast-content">
					<div class="toast-title">{notif.title}</div>
					{#if notif.message}
						<div class="toast-message">{notif.message}</div>
					{/if}
				</div>

				{#if notif.action}
					<button
						class="toast-action"
						on:click={() => handleAction(notif)}
					>
						{notif.action.label}
					</button>
				{/if}

				<button
					class="toast-close"
					on:click={() => notification.remove(notif.id)}
					aria-label="Close notification"
				>
					✖
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-4);
		right: var(--space-4);
		z-index: var(--z-toast);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-width: 400px;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		min-width: 300px;
	}

	.toast.error {
		border-width: var(--border-width-2);
	}

	.toast.warning {
		border-style: dashed;
	}

	.toast-icon {
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		flex-shrink: 0;
	}

	.toast-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.toast-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
	}

	.toast-message {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.toast-action {
		padding: var(--space-1) var(--space-2);
		height: 24px;
		font-size: var(--text-xs);
		background: var(--color-black);
		color: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		cursor: pointer;
		letter-spacing: var(--tracking-wider);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.toast-action:hover {
		background: var(--color-white);
		color: var(--color-black);
	}

	.toast-close {
		width: 16px;
		height: 16px;
		padding: 0;
		border: none;
		background: transparent;
		font-size: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.4;
		transition: opacity var(--duration-fast) var(--easing-linear);
	}

	.toast-close:hover {
		opacity: 1;
	}
</style>