<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import { vehicle } from '$lib/stores/vehicle';
	import { notification } from '$lib/stores/notification';
	import { onMount, onDestroy } from 'svelte';

	export let open = false;

	let searchQuery = '';
	let selectedIndex = 0;
	let inputRef: HTMLInputElement;
	let commands: Command[] = [];
	let filteredCommands: Command[] = [];

	interface Command {
		id: string;
		label: string;
		description?: string;
		category: 'navigation' | 'vehicle' | 'action' | 'help';
		shortcut?: string;
		handler: () => void;
		keywords?: string[];
	}

	// Build command list based on user role
	$: {
		const baseCommands: Command[] = [
			// Navigation
			{
				id: 'nav-dashboard',
				label: 'GO TO DASHBOARD',
				category: 'navigation',
				shortcut: 'G D',
				handler: () => goto('/dashboard'),
				keywords: ['dashboard', 'home', 'overview']
			},
			{
				id: 'nav-vehicles',
				label: 'GO TO VEHICLES',
				category: 'navigation',
				shortcut: 'G V',
				handler: () => goto('/vehicles'),
				keywords: ['vehicles', 'fleet', 'cars']
			},
			{
				id: 'nav-reservations',
				label: 'GO TO RESERVATIONS',
				category: 'navigation',
				shortcut: 'G R',
				handler: () => goto('/reservations'),
				keywords: ['reservations', 'bookings', 'schedule']
			},

			// Actions
			{
				id: 'action-refresh',
				label: 'REFRESH DATA',
				category: 'action',
				shortcut: 'R',
				handler: () => {
					vehicle.loadVehicles();
					notification.success('DATA REFRESHED');
				},
				keywords: ['refresh', 'reload', 'update']
			},
			{
				id: 'action-export',
				label: 'EXPORT CURRENT VIEW',
				category: 'action',
				shortcut: 'E',
				handler: () => {
					notification.info('EXPORT STARTED', 'Preparing download...');
				},
				keywords: ['export', 'download', 'csv', 'excel']
			},
			{
				id: 'action-logout',
				label: 'LOGOUT',
				category: 'action',
				handler: () => auth.logout(),
				keywords: ['logout', 'signout', 'exit']
			},

			// Help
			{
				id: 'help-shortcuts',
				label: 'SHOW KEYBOARD SHORTCUTS',
				category: 'help',
				shortcut: '?',
				handler: () => {
					notification.info('KEYBOARD SHORTCUTS', 'CMD+K: Command palette | CMD+B: Toggle sidebar | ?: Help');
				},
				keywords: ['help', 'shortcuts', 'keyboard']
			}
		];

		// Add vehicle-specific commands if vehicles are loaded
		const vehicleCommands: Command[] = Array.from($vehicle.vehicles.values()).map(v => ({
			id: `vehicle-${v.id}`,
			label: `VEHICLE ${v.vin}`,
			description: `${v.model} - ${v.status.toUpperCase()}`,
			category: 'vehicle' as const,
			handler: () => {
				vehicle.selectVehicle(v.id);
				goto(`/vehicles/${v.vin}`);
			},
			keywords: [v.vin, v.model, v.status]
		}));

		commands = [...baseCommands, ...vehicleCommands];
	}

	// Filter commands based on search
	$: {
		if (!searchQuery) {
			filteredCommands = commands;
		} else {
			const query = searchQuery.toLowerCase();
			filteredCommands = commands.filter(cmd => {
				const searchTargets = [
					cmd.label.toLowerCase(),
					cmd.description?.toLowerCase() || '',
					...(cmd.keywords || [])
				];
				return searchTargets.some(target => target.includes(query));
			});
		}

		// Reset selection when filtered results change
		selectedIndex = 0;
	}

	// Focus input when opened
	$: if (open && inputRef) {
		inputRef.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				close();
				break;

			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(0, selectedIndex - 1);
				scrollToSelected();
				break;

			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(filteredCommands.length - 1, selectedIndex + 1);
				scrollToSelected();
				break;

			case 'Enter':
				e.preventDefault();
				if (filteredCommands[selectedIndex]) {
					executeCommand(filteredCommands[selectedIndex]);
				}
				break;
		}
	}

	function executeCommand(command: Command) {
		command.handler();
		close();
	}

	function close() {
		open = false;
		searchQuery = '';
		selectedIndex = 0;
	}

	function scrollToSelected() {
		const element = document.querySelector(`[data-command-index="${selectedIndex}"]`);
		element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}

	function getCategoryIcon(category: string): string {
		switch (category) {
			case 'navigation': return '→';
			case 'vehicle': return '▢';
			case 'action': return '◆';
			case 'help': return '?';
			default: return '•';
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if open}
	<div
		class="command-palette-overlay"
		role="button"
		tabindex="0"
		on:click={close}
		on:keydown={(e) => e.key === 'Escape' && close()}
	>
		<div
			class="command-palette"
			role="dialog"
			aria-modal="true"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div class="search-wrapper">
				<span class="search-icon">></span>
				<input
					bind:this={inputRef}
					bind:value={searchQuery}
					type="text"
					class="search-input"
					placeholder="TYPE A COMMAND OR SEARCH..."
					aria-label="Command search"
				/>
				<span class="search-hint">ESC TO CLOSE</span>
			</div>

			<div class="commands-list">
				{#if filteredCommands.length === 0}
					<div class="no-results">NO COMMANDS FOUND</div>
				{:else}
					{#each filteredCommands as command, i}
						<button
							class="command-item"
							class:selected={i === selectedIndex}
							data-command-index={i}
							on:click={() => executeCommand(command)}
							on:mouseenter={() => selectedIndex = i}
						>
							<span class="command-icon">{getCategoryIcon(command.category)}</span>
							<div class="command-content">
								<span class="command-label">{command.label}</span>
								{#if command.description}
									<span class="command-description">{command.description}</span>
								{/if}
							</div>
							{#if command.shortcut}
								<span class="command-shortcut">{command.shortcut}</span>
							{/if}
						</button>
					{/each}
				{/if}
			</div>

			<div class="command-footer">
				<span class="footer-hint">↑↓ TO NAVIGATE</span>
				<span class="footer-hint">↵ TO SELECT</span>
				<span class="footer-hint">ESC TO CLOSE</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.command-palette-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 10vh;
		z-index: var(--z-modal);
	}

	.command-palette {
		width: 600px;
		max-width: 90vw;
		max-height: 70vh;
		background: var(--color-white);
		border: var(--border-width-2) solid var(--color-black);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.search-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-black);
	}

	.search-icon {
		font-family: monospace;
		font-size: var(--text-base);
		color: var(--color-gray-40);
	}

	.search-input {
		flex: 1;
		padding: 0;
		border: none;
		background: transparent;
		font-size: var(--text-lg);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wide);
		text-transform: uppercase;
		height: auto;
	}

	.search-input:focus {
		outline: none;
		border: none;
	}

	.search-input::placeholder {
		color: var(--color-gray-20);
	}

	.search-hint {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.commands-list {
		flex: 1;
		overflow-y: auto;
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.no-results {
		padding: var(--space-8);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.command-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		border-bottom: var(--border-width) solid var(--color-gray-08);
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing-linear);
		text-align: left;
	}

	.command-item:hover {
		background: var(--color-gray-04);
	}

	.command-item.selected {
		background: var(--color-black);
		color: var(--color-white);
	}

	.command-icon {
		width: 16px;
		text-align: center;
		font-size: 12px;
		flex-shrink: 0;
	}

	.command-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.command-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wide);
	}

	.command-description {
		font-size: var(--text-xs);
		opacity: 0.6;
	}

	.command-shortcut {
		padding: 2px 6px;
		background: var(--color-gray-08);
		font-size: var(--text-xs);
		font-family: monospace;
		letter-spacing: 1px;
	}

	.command-item.selected .command-shortcut {
		background: rgba(255, 255, 255, 0.2);
	}

	.command-footer {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: var(--color-gray-04);
	}

	.footer-hint {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}
</style>