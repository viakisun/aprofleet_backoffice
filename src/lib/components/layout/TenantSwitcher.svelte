<script lang="ts">
	import { tenant, tenantFeatures } from '$lib/stores/tenant';
	import { auth, isManufacturer } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let isOpen = false;
	let dropdownRef: HTMLDivElement;

	// Only show switcher for manufacturer role
	$: canSwitch = $isManufacturer;

	onMount(() => {
		// Load available tenants if user can switch
		if (canSwitch) {
			tenant.loadAvailableTenants();
		}

		// Close dropdown on outside click
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});

	function selectTenant(tenantId: string) {
		tenant.selectTenant(tenantId);
		isOpen = false;
	}

	function formatTier(tier: string): string {
		return `[${tier.charAt(0)}]`;
	}

	function getStatusIndicator(vehicleCount: number, activeVehicles: number): string {
		const utilization = (activeVehicles / vehicleCount) * 100;
		if (utilization > 80) return '■';
		if (utilization > 40) return '▢';
		return '⬚';
	}
</script>

<div class="tenant-switcher" bind:this={dropdownRef}>
	{#if $tenant.current}
		<button
			class="tenant-button"
			class:can-switch={canSwitch}
			on:click={() => canSwitch && (isOpen = !isOpen)}
			disabled={!canSwitch}
			aria-expanded={isOpen}
			aria-haspopup="true"
		>
			<span class="tenant-name">{$tenant.current.name}</span>
			<span class="tenant-tier">{formatTier($tenant.current.tier)}</span>
			{#if canSwitch}
				<span class="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
			{/if}
		</button>

		{#if isOpen && canSwitch}
			<div class="dropdown-menu" role="menu">
				<div class="dropdown-header">SELECT GOLF COURSE</div>

				{#each $tenant.available as t}
					<button
						class="dropdown-item"
						class:active={t.id === $tenant.current?.id}
						on:click={() => selectTenant(t.id)}
						role="menuitem"
					>
						<div class="item-main">
							<span class="item-indicator">
								{getStatusIndicator(t.vehicleCount, t.activeVehicles)}
							</span>
							<span class="item-name">{t.name}</span>
						</div>
						<div class="item-meta">
							<span class="item-tier">{formatTier(t.tier)}</span>
							<span class="item-stats">
								{t.activeVehicles}/{t.vehicleCount}
							</span>
						</div>
					</button>
				{/each}

				<div class="dropdown-footer">
					<button class="add-tenant-button" on:click={() => {/* Navigate to add tenant */}}>
						+ ADD NEW GOLF COURSE
					</button>
				</div>
			</div>
		{/if}
	{:else}
		<div class="no-tenant">NO TENANT SELECTED</div>
	{/if}
</div>

<style>
	.tenant-switcher {
		position: relative;
		min-width: 200px;
	}

	.tenant-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-1) var(--space-3);
		height: 28px;
		background: transparent;
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
		cursor: default;
		width: 100%;
		justify-content: space-between;
	}

	.tenant-button.can-switch {
		cursor: pointer;
	}

	.tenant-button.can-switch:hover {
		border-color: var(--color-black);
		background: var(--color-gray-04);
	}

	.tenant-button:disabled {
		opacity: 1;
		cursor: default;
	}

	.tenant-name {
		flex: 1;
		text-align: left;
		font-weight: var(--font-medium);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.tenant-tier {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
	}

	.dropdown-arrow {
		font-size: 8px;
		margin-left: var(--space-2);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + var(--space-1));
		left: 0;
		right: 0;
		background: var(--color-white);
		border: var(--border-width) solid var(--color-black);
		box-shadow: none;
		z-index: var(--z-dropdown);
		max-height: 400px;
		overflow-y: auto;
	}

	.dropdown-header {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		background: var(--color-gray-04);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: none;
		border-bottom: var(--border-width) solid var(--color-gray-08);
		font-size: var(--text-sm);
		cursor: pointer;
		text-align: left;
		transition: background var(--duration-fast) var(--easing-linear);
	}

	.dropdown-item:hover {
		background: var(--color-gray-04);
	}

	.dropdown-item.active {
		background: var(--color-black);
		color: var(--color-white);
	}

	.item-main {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
	}

	.item-indicator {
		font-size: 10px;
	}

	.item-name {
		font-weight: var(--font-medium);
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.item-meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.item-tier {
		font-size: var(--text-xs);
		opacity: 0.6;
	}

	.item-stats {
		font-size: var(--text-xs);
		font-variant-numeric: tabular-nums;
	}

	.dropdown-footer {
		padding: var(--space-2);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.add-tenant-button {
		width: 100%;
		padding: var(--space-2);
		background: transparent;
		border: var(--border-width) dashed var(--color-gray-20);
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.add-tenant-button:hover {
		border-color: var(--color-black);
		border-style: solid;
		background: var(--color-gray-04);
	}

	.no-tenant {
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}
</style>