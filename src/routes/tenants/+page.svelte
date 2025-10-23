<script lang="ts">
// Mock data
let tenants = [
  { name: 'GolfClub A', plan: 'Standard', users: 18, status: 'Active', since: '2023-01-10' },
  { name: 'GolfClub B', plan: 'Premium', users: 7, status: 'Inactive', since: '2022-11-03' },
  { name: 'GolfClub C', plan: 'Standard', users: 12, status: 'Active', since: '2024-02-15' },
  { name: 'GolfClub D', plan: 'Trial', users: 3, status: 'Active', since: '2025-01-01' },
];

function upgrade(idx: number) {
  tenants[idx].plan = 'Premium';
}
function toggleStatus(idx: number) {
  tenants[idx].status = tenants[idx].status === 'Active' ? 'Inactive' : 'Active';
}
function removeTenant(idx: number) {
  tenants = tenants.filter((_, i) => i !== idx);
}
</script>

<style>
.tenants-page {
  background: #fff;
  color: #111;
  font-family: 'Noto Sans', Arial, sans-serif;
  padding: var(--space-6);
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: var(--border-width) solid var(--color-black);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-tight);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wider);
  margin-bottom: var(--space-3);
}
.tenants-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 36px;
  font-size: 1rem;
  border: 1px solid #222;
}
.tenants-table th, .tenants-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: left;
}
.tenants-table th {
  background: #f5f5f5;
  color: #222;
  font-weight: 600;
}
.tenants-table td.status {
  font-weight: 600;
  color: #222;
}
.tenants-table td.status.inactive {
  color: #888;
}
.action-btn {
  background: #fff;
  color: #111;
  border: 1px solid #222;
  border-radius: 0;
  font-size: 0.97rem;
  padding: 5px 16px;
  margin-right: 8px;
  cursor: pointer;
  box-shadow: none;
}
.action-btn:active {
  background: #eee;
}
.action-btn.danger {
  color: #111;
  border-color: #222;
}
.add-btn {
  float: right;
  margin-bottom: 18px;
  background: #fff;
  color: #111;
  border: 1px solid #222;
  border-radius: 0;
  font-size: 0.97rem;
  padding: 6px 18px;
  cursor: pointer;
  box-shadow: none;
}
.add-btn:active {
  background: #eee;
}
</style>

<div class="tenants-page">
  <div class="page-header">
    <h1 class="page-title">TENANTS</h1>
    <button class="add-btn" disabled>+ Add Tenant</button>
  </div>

  <div class="section-title">Tenant List</div>
  <table class="tenants-table">
    <thead>
      <tr>
        <th>Company</th>
        <th>Plan</th>
        <th>Users</th>
        <th>Status</th>
        <th>Joined</th>
        <th>Subscription</th>
      </tr>
    </thead>
    <tbody>
      {#each tenants as t, i}
        <tr>
          <td>{t.name}</td>
          <td>{t.plan}</td>
          <td>{t.users}</td>
          <td class="status {t.status === 'Inactive' ? 'inactive' : ''}">{t.status}</td>
          <td>{t.since}</td>
          <td>
            <button class="action-btn" on:click={() => upgrade(i)} disabled={t.plan === 'Premium'}>Upgrade</button>
            <button class="action-btn" on:click={() => toggleStatus(i)}>{t.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
            <button class="action-btn danger" on:click={() => removeTenant(i)}>Remove</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
