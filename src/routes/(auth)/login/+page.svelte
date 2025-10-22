<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth, Role } from "$lib/stores/auth";
  import { notification } from "$lib/stores/notification";

  let email = "";
  let password = "";
  let isLoading = false;
  let selectedRole: Role = Role.TENANT_MANAGER;

  const demoAccounts = [
    {
      role: Role.SUPER_ADMIN,
      email: "admin@dyinnovate.com",
      label: "MANUFACTURER",
    },
    {
      role: Role.TENANT_OWNER,
      email: "owner@golfcourse.com",
      label: "GOLF COURSE OWNER",
    },
    {
      role: Role.TENANT_MANAGER,
      email: "manager@golfcourse.com",
      label: "GOLF COURSE MANAGER",
    },
    { role: Role.SYSTEM_ADMIN, email: "dev@via.com", label: "SYSTEM ADMIN" },
    {
      role: Role.OPERATION_STAFF,
      email: "staff@golfcourse.com",
      label: "OPERATION STAFF",
    },
  ];

  async function handleSubmit() {
    if (!email || !password) {
      notification.error("VALIDATION ERROR", "Email and password required");
      return;
    }

    isLoading = true;

    const result = await auth.login(email, password);

    if (result.success) {
      notification.success("LOGIN SUCCESSFUL", "Redirecting to dashboard...");
      goto("/dashboard");
    } else {
      notification.error("LOGIN FAILED", result.error || "Invalid credentials");
    }

    isLoading = false;
  }

  function quickLogin(account: (typeof demoAccounts)[0]) {
    email = account.email;
    password = "demo123";
    selectedRole = account.role;
  }
</script>

<div class="login-page">
  <div class="login-container">
    <div class="login-header">
      <div class="logo">
        <div class="logo-icon">AP</div>
        <div class="logo-text">APROFLEET</div>
      </div>
      <div class="tagline">AUTONOMOUS GOLF CART FLEET MANAGEMENT</div>
    </div>

    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="email" class="form-label">EMAIL</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          class="form-input"
          placeholder="user@example.com"
          disabled={isLoading}
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">PASSWORD</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="form-input"
          placeholder="••••••••"
          disabled={isLoading}
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="login-button" disabled={isLoading}>
        {isLoading ? "AUTHENTICATING..." : "LOGIN"}
      </button>
    </form>

    <div class="demo-section">
      <div class="demo-header">DEMO ACCOUNTS</div>
      <div class="demo-accounts">
        {#each demoAccounts as account}
          <button
            class="demo-account"
            class:active={selectedRole === account.role}
            on:click={() => quickLogin(account)}
            disabled={isLoading}
          >
            <span class="account-label">{account.label}</span>
            <span class="account-email">{account.email}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="login-footer">
      <div class="status-grid">
        <div class="status-item">
          <span class="status-indicator">●</span>
          <span class="status-label">API ONLINE</span>
        </div>
        <div class="status-item">
          <span class="status-indicator">●</span>
          <span class="status-label">WS READY</span>
        </div>
        <div class="status-item">
          <span class="status-indicator">●</span>
          <span class="status-label">DB CONNECTED</span>
        </div>
      </div>
      <div class="version">VERSION 1.0.0 | BUILD 2024.01</div>
    </div>
  </div>
</div>

<style>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--color-white);
  }

  .login-container {
    width: 100%;
    max-width: 400px;
    padding: var(--space-4);
  }

  .login-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: var(--color-black);
    color: var(--color-white);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
  }

  .logo-text {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
  }

  .tagline {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
  }

  .login-form {
    margin-bottom: var(--space-6);
  }

  .form-group {
    margin-bottom: var(--space-4);
  }

  .form-label {
    display: block;
    margin-bottom: var(--space-2);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wider);
  }

  .form-input {
    width: 100%;
    height: 40px;
    padding: 0 var(--space-3);
    border: var(--border-width) solid var(--color-black);
    font-size: var(--text-base);
    background: var(--color-white);
  }

  .form-input:focus {
    outline: none;
    border-width: var(--border-width-2);
  }

  .form-input:disabled {
    background: var(--color-gray-04);
    color: var(--color-gray-40);
  }

  .login-button {
    width: 100%;
    height: 48px;
    background: var(--color-black);
    color: var(--color-white);
    border: var(--border-width) solid var(--color-black);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wider);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing-linear);
  }

  .login-button:hover:not(:disabled) {
    background: var(--color-white);
    color: var(--color-black);
  }

  .login-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .demo-section {
    padding: var(--space-4);
    border: var(--border-width) dashed var(--color-gray-20);
    margin-bottom: var(--space-6);
  }

  .demo-header {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-3);
    text-align: center;
    color: var(--color-gray-40);
  }

  .demo-accounts {
    display: grid;
    gap: var(--space-2);
  }

  .demo-account {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-gray-12);
    font-size: var(--text-xs);
    cursor: pointer;
    text-align: left;
    transition: all var(--duration-fast) var(--easing-linear);
  }

  .demo-account:hover:not(:disabled) {
    background: var(--color-gray-04);
    border-color: var(--color-gray-40);
  }

  .demo-account.active {
    background: var(--color-black);
    color: var(--color-white);
    border-color: var(--color-black);
  }

  .demo-account:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .account-label {
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wide);
  }

  .account-email {
    opacity: 0.6;
    font-family: monospace;
  }

  .login-footer {
    text-align: center;
  }

  .status-grid {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    margin-bottom: var(--space-3);
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .status-indicator {
    font-size: 8px;
    color: var(--color-black);
  }

  .status-label {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
  }

  .version {
    font-size: var(--text-xs);
    color: var(--color-gray-20);
    letter-spacing: var(--tracking-wider);
    font-variant-numeric: tabular-nums;
  }
</style>
