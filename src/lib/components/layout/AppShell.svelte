<script lang="ts">
  import { page } from "$app/stores";
  import {
    auth,
    Role,
    isManufacturer,
    isTenantAdmin,
    isSystemAdmin,
  } from "$lib/stores/auth";
  import { tenant } from "$lib/stores/tenant";
  import { vehicle, vehicleStatistics } from "$lib/stores/vehicle";
  import { notification } from "$lib/stores/notification";
  import TenantSwitcher from "./TenantSwitcher.svelte";
  import CommandPalette from "./CommandPalette.svelte";
  import NotificationToast from "./NotificationToast.svelte";

  export let showSidebar = true;

  let isSidebarOpen = true;
  let isCommandPaletteOpen = false;

  // Navigation items based on role
  $: navigationItems = getNavigationItems($auth.user?.role);

  function getNavigationItems(role: Role | undefined) {
    if (!role) return [];

    const manufacturerItems = [
      { label: "DASHBOARD", href: "/dashboard", icon: "■" },
      { label: "GOLF COURSES", href: "/golf-courses", icon: "▢" },
      { label: "MODELS", href: "/models", icon: "⬚" },
      { label: "FIRMWARE", href: "/firmware", icon: "▲" },
      { label: "DELIVERIES", href: "/deliveries", icon: "◆" },
      { label: "CONTRACTS", href: "/contracts", icon: "◈" },
      { label: "SETTINGS", href: "/settings", icon: "●" },
    ];

    const tenantItems = [
      { label: "DASHBOARD", href: "/dashboard", icon: "●" },
      { label: "OPERATIONS", href: "/operations", icon: "■" },
      { label: "VEHICLES", href: "/vehicles", icon: "▢" },
      { label: "RESERVATIONS", href: "/reservations", icon: "⬚" },
      { label: "CHARGING", href: "/charging", icon: "▲" },
      { label: "MAINTENANCE", href: "/maintenance", icon: "◆" },
      { label: "CUSTOMERS", href: "/customers", icon: "◈" },
      { label: "SETTINGS", href: "/settings", icon: "○" },
    ];

    const systemItems = [
      { label: "MONITORING", href: "/monitoring", icon: "■" },
      { label: "LOGS", href: "/logs", icon: "▢" },
      { label: "DEPLOYMENT", href: "/deployment", icon: "⬚" },
      { label: "INFRASTRUCTURE", href: "/infrastructure", icon: "▲" },
      { label: "API DOCS", href: "/api-docs", icon: "◆" },
      { label: "SETTINGS", href: "/settings", icon: "●" },
    ];

    switch (role) {
      case Role.SUPER_ADMIN:
        return manufacturerItems;
      case Role.TENANT_OWNER:
      case Role.TENANT_MANAGER:
      case Role.OPERATION_STAFF:
        return tenantItems;
      case Role.SYSTEM_ADMIN:
        return systemItems;
      default:
        return [];
    }
  }

  // Keyboard shortcuts
  function handleKeydown(e: KeyboardEvent) {
    // Cmd+K for command palette
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      isCommandPaletteOpen = true;
    }

    // Cmd+B for sidebar toggle
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault();
      isSidebarOpen = !isSidebarOpen;
    }

    // ? for help
    if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const target = e.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        // Show help modal
      }
    }
  }

  // Connection status
  $: connectionStatus = $vehicle.connectionStatus;
  $: connectionIcon =
    connectionStatus === "connected"
      ? "●"
      : connectionStatus === "connecting"
        ? "◐"
        : "○";
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="app-shell" class:sidebar-open={isSidebarOpen}>
  <!-- Skip to main content for accessibility -->
  <a href="#main" class="skip-link">Skip to main content</a>

  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <button
        class="sidebar-toggle"
        on:click={() => (isSidebarOpen = !isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? "◀" : "▶"}
      </button>

      <div class="logo">
        <span class="logo-icon">AP</span>
        <span class="logo-text">APROFLEET</span>
      </div>

      {#if $tenant.current}
        <div class="tenant-indicator">
          <span class="separator">|</span>
          <TenantSwitcher />
        </div>
      {/if}
    </div>

    <div class="header-center">
      {#if $vehicleStatistics}
        <div class="quick-stats">
          <div class="stat">
            <span class="stat-value">{$vehicleStatistics.operating}</span>
            <span class="stat-label">ACTIVE</span>
          </div>
          <div class="stat">
            <span class="stat-value">{$vehicleStatistics.charging}</span>
            <span class="stat-label">CHARGING</span>
          </div>
          <div class="stat">
            <span class="stat-value"
              >{$vehicleStatistics.warning + $vehicleStatistics.error}</span
            >
            <span class="stat-label">ALERTS</span>
          </div>
        </div>
      {/if}
    </div>

    <div class="header-right">
      <button
        class="cmd-button"
        on:click={() => (isCommandPaletteOpen = true)}
        aria-label="Open command palette"
      >
        CMD+K
      </button>

      <div
        class="connection-indicator"
        title="Connection status: {connectionStatus}"
      >
        <span class="connection-icon">{connectionIcon}</span>
        <span class="connection-text">{connectionStatus.toUpperCase()}</span>
      </div>

      <div class="user-menu">
        <span class="user-name">{$auth.user?.name || "USER"}</span>
        <span class="user-role">[{$auth.user?.role || "UNKNOWN"}]</span>
      </div>

      <button class="logout-button" on:click={() => auth.logout()}>
        LOGOUT
      </button>
    </div>
  </header>

  <!-- Sidebar -->
  {#if showSidebar}
    <aside class="sidebar" class:open={isSidebarOpen}>
      <nav class="navigation">
        {#each navigationItems as item}
          <a
            href={item.href}
            class="nav-item"
            class:active={$page.url.pathname === item.href}
            aria-current={$page.url.pathname === item.href ? "page" : undefined}
          >
            <span class="nav-icon">{item.icon}</span>
            <span class="nav-label">{item.label}</span>
          </a>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <div class="system-time">
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </div>
        <div class="system-date">
          {new Date()
            .toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })
            .toUpperCase()}
        </div>
      </div>
    </aside>
  {/if}

  <!-- Main content -->
  <main id="main" class="main-content">
    <slot />
  </main>

  <!-- Command palette -->
  {#if isCommandPaletteOpen}
    <CommandPalette bind:open={isCommandPaletteOpen} />
  {/if}

  <!-- Notifications -->
  <NotificationToast />
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-rows: var(--header-height) 1fr;
    grid-template-columns: 0 1fr;
    height: 100vh;
    background: var(--color-white);
    transition: grid-template-columns var(--duration-normal) var(--easing-ease);
  }

  .app-shell.sidebar-open {
    grid-template-columns: var(--sidebar-width) 1fr;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-black);
    color: var(--color-white);
    padding: var(--space-2) var(--space-4);
    z-index: 100;
    text-decoration: none;
  }

  .skip-link:focus {
    top: 0;
  }

  /* Header */
  .header {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
    padding: 0 var(--space-4);
    border-bottom: var(--border-width) solid var(--color-black);
    background: var(--color-white);
  }

  .header-left,
  .header-center,
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .sidebar-toggle {
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: var(--color-black);
    color: var(--color-white);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
  }

  .logo-text {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wider);
  }

  .tenant-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .separator {
    color: var(--color-gray-20);
  }

  .quick-stats {
    display: flex;
    gap: var(--space-6);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stat-value {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
  }

  .stat-label {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
  }

  .cmd-button {
    padding: var(--space-1) var(--space-2);
    height: 24px;
    font-size: var(--text-xs);
    background: var(--color-gray-04);
    border: var(--border-width) solid var(--color-gray-20);
  }

  .connection-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--color-gray-12);
  }

  .connection-icon {
    font-size: 8px;
  }

  .connection-text {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wider);
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .user-name {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }

  .user-role {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
  }

  .logout-button {
    padding: var(--space-1) var(--space-2);
    height: 24px;
    font-size: var(--text-xs);
  }

  /* Sidebar */
  .sidebar {
    grid-row: 2;
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: var(--sidebar-width);
    background: var(--color-white);
    border-right: var(--border-width) solid var(--color-black);
    transform: translateX(-100%);
    transition: transform var(--duration-normal) var(--easing-ease);
    overflow-y: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .navigation {
    display: flex;
    flex-direction: column;
    padding: var(--space-4) 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-4);
    text-decoration: none;
    color: var(--color-black);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    transition: background var(--duration-fast) var(--easing-linear);
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

  .sidebar-footer {
    padding: var(--space-4);
    border-top: var(--border-width) solid var(--color-gray-12);
    text-align: center;
  }

  .system-time {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    font-variant-numeric: tabular-nums;
  }

  .system-date {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
    margin-top: var(--space-1);
  }

  /* Main content */
  .main-content {
    grid-row: 2;
    grid-column: 2;
    overflow-y: auto;
    background: var(--color-white);
  }
</style>
