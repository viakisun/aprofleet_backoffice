<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	// Check if current route should use AppShell
	// Exclude login page, root page, and error pages
	$: isAuthRoute = $page.url.pathname.startsWith('/login') ||
	                 $page.url.pathname === '/' ||
	                 $page.url.pathname.startsWith('/error');
</script>

{#if isAuthRoute}
	<!-- Auth pages without AppShell -->
	<slot />
{:else}
	<!-- App pages with AppShell -->
	<AppShell>
		<slot />
	</AppShell>
{/if}