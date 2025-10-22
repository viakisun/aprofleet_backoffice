<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	// Redirect to appropriate dashboard based on role
	onMount(() => {
		if ($auth.isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="loading">
	<div class="loading-text">APROFLEET</div>
	<div class="loading-indicator">[░░░░░░░░░░]</div>
</div>

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		gap: var(--space-4);
	}

	.loading-text {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.loading-indicator {
		font-family: monospace;
		font-size: var(--text-sm);
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 1; }
	}
</style>