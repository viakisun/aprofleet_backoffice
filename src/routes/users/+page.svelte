<script lang="ts">
// Mock data
import { onMount } from 'svelte';
type User = { name: string; email: string; role: string; tenant: string; status: string };
let users: User[] = [
  { name: 'John Kim', email: 'user1@golf.com', role: 'Admin', tenant: 'GolfClub A', status: 'Active' },
  { name: 'Lisa Manager', email: 'manager@golf.com', role: 'Manager', tenant: 'GolfClub B', status: 'Inactive' },
  { name: 'Paul Guest', email: 'guest@golf.com', role: 'Guest', tenant: 'GolfClub C', status: 'Active' },
  { name: 'Super Choi', email: 'super@dyinnovate.com', role: 'Super-User', tenant: 'HQ', status: 'Active' },
];
let search = '';
let filtered: User[] = users;
onMount(() => { filtered = users; });
function doSearch() {
  filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.tenant.toLowerCase().includes(search.toLowerCase())
  );
}
function toggleStatus(idx: number) {
  const u = filtered[idx];
  u.status = u.status === 'Active' ? 'Inactive' : 'Active';
}
function changeRole(idx: number) {
  const u = filtered[idx];
  u.role = u.role === 'Admin' ? 'Manager' : u.role === 'Manager' ? 'Guest' : 'Admin';
}
function removeUser(idx: number) {
  const u = filtered[idx];
  users = users.filter(user => user !== u);
  doSearch();
}
</script>

<style>
.users-page {
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
.search-bar {
  margin-bottom: 18px;
  display: flex;
  gap: 12px;
}
.search-input {
  border: 1px solid #222;
  border-radius: 0;
  padding: 7px 14px;
  font-size: 1rem;
  width: 260px;
  box-shadow: none;
}
.search-btn {
  background: #fff;
  color: #111;
  border: 1px solid #222;
  border-radius: 0;
  font-size: 0.97rem;
  padding: 7px 18px;
  cursor: pointer;
  box-shadow: none;
}
.search-btn:active {
  background: #eee;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  border: 1px solid #222;
}
.users-table th, .users-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: left;
}
.users-table th {
  background: #f5f5f5;
  color: #222;
  font-weight: 600;
}
.users-table td.status {
  font-weight: 600;
  color: #222;
}
.users-table td.status.inactive {
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
</style>

<div class="users-page">
  <div class="page-header">
    <h1 class="page-title">USERS</h1>
  </div>

  <div class="section-title">User List</div>
  <div class="search-bar">
    <input class="search-input" type="text" bind:value={search} placeholder="Search name, email, tenant" on:input={doSearch} />
    <button class="search-btn" on:click={doSearch}>Search</button>
  </div>
  <table class="users-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Tenant</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as u, i}
        <tr>
          <td>{u.name}</td>
          <td>{u.email}</td>
          <td>{u.role}</td>
          <td>{u.tenant}</td>
          <td class="status {u.status === 'Inactive' ? 'inactive' : ''}">{u.status}</td>
          <td>
            <button class="action-btn" on:click={() => changeRole(i)}>Change Role</button>
            <button class="action-btn" on:click={() => toggleStatus(i)}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
            <button class="action-btn danger" on:click={() => removeUser(i)}>Remove</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
