<script lang="ts">
// Tab state
let activeTab: 'fleet' | 'usage' | 'maintenance' | 'cost' | 'performance' = 'fleet';

// Fleet Overview data
const fleetSummary = [
  { label: 'Total Vehicles', value: 348 },
  { label: 'Active Today', value: 312 },
  { label: 'In Maintenance', value: 24 },
  { label: 'Idle', value: 12 },
];

const fleetByTenant = [
  { tenant: 'GolfClub A', total: 85, active: 78, maintenance: 5, idle: 2 },
  { tenant: 'GolfClub B', total: 62, active: 58, maintenance: 3, idle: 1 },
  { tenant: 'Resort X', total: 120, active: 108, maintenance: 9, idle: 3 },
  { tenant: 'Country Club Y', total: 81, active: 68, maintenance: 7, idle: 6 },
];

// Usage Trends data
const usageSummary = [
  { label: 'Daily Avg Distance (km)', value: 28.4 },
  { label: 'Daily Avg Runtime (hrs)', value: 6.2 },
  { label: 'Peak Usage Time', value: '09:00' },
  { label: 'Utilization Rate (%)', value: 89.7 },
];

const usageTrends = [
  { date: '10-01', distance: 9850, runtime: 2150, vehicles: 305 },
  { date: '10-08', distance: 10200, runtime: 2240, vehicles: 310 },
  { date: '10-15', distance: 9980, runtime: 2180, vehicles: 308 },
  { date: '10-22', distance: 10450, runtime: 2310, vehicles: 312 },
];

// Maintenance Analytics data
const maintenanceSummary = [
  { label: 'Service Requests', value: 47 },
  { label: 'Completed This Week', value: 38 },
  { label: 'Avg Resolution Time (hrs)', value: 18.3 },
  { label: 'Preventive Maintenance (%)', value: 65 },
];

const maintenanceByType = [
  { type: 'Battery Replacement', count: 12, avgCost: 180000 },
  { type: 'Tire Service', count: 8, avgCost: 65000 },
  { type: 'Brake Inspection', count: 15, avgCost: 45000 },
  { type: 'General Checkup', count: 18, avgCost: 35000 },
];

// Cost Analysis data
const costSummary = [
  { label: 'Total Monthly Cost (KRW M)', value: 42.8 },
  { label: 'Avg Cost per Vehicle (KRW)', value: 123000 },
  { label: 'Maintenance Cost (KRW M)', value: 18.5 },
  { label: 'Energy Cost (KRW M)', value: 24.3 },
];

const costBreakdown = [
  { category: 'Maintenance Parts', amount: 12500000, percentage: 29.2 },
  { category: 'Labor', amount: 6000000, percentage: 14.0 },
  { category: 'Energy/Charging', amount: 24300000, percentage: 56.8 },
];

// Performance Metrics data
const performanceSummary = [
  { label: 'Avg Battery Health (%)', value: 94.3 },
  { label: 'System Uptime (%)', value: 99.2 },
  { label: 'Avg Response Time (ms)', value: 142 },
  { label: 'Alert Resolution Rate (%)', value: 96.8 },
];

const performanceMetrics = [
  { metric: 'Battery Efficiency', current: 94.3, target: 95.0, status: 'Good' },
  { metric: 'Vehicle Availability', current: 89.7, target: 90.0, status: 'Good' },
  { metric: 'Maintenance Compliance', current: 96.8, target: 95.0, status: 'Excellent' },
  { metric: 'Energy Consumption', current: 88.2, target: 85.0, status: 'Fair' },
];
</script>

<style>
.page-root {
  background: #fff;
  color: #111;
  font-family: 'Noto Sans', Arial, sans-serif;
  padding: 32px 40px 40px 40px;
  min-height: 100vh;
}

/* Tab Navigation */
.tabs-container {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-black);
}
.tab-btn {
  background: var(--color-white);
  border: 1px solid var(--color-black);
  border-bottom: none;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  top: 2px;
  color: var(--color-black);
}
.tab-btn:hover {
  background: var(--color-gray-light);
}
.tab-btn.active {
  background: var(--color-black);
  color: var(--color-white);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 18px;
  letter-spacing: 0.01em;
  color: #111;
}
.summary-grid {
  display: flex;
  gap: 32px;
  margin-bottom: 36px;
}
.summary-item {
  border: 1px solid #222;
  background: #fafafa;
  padding: 18px 32px;
  min-width: 140px;
  text-align: center;
  border-radius: 0;
  box-shadow: none;
}
.summary-label {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 8px;
}
.summary-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #111;
}
.chart-area {
  border: 1px solid #222;
  background: #fff;
  padding: 24px 32px 16px 32px;
  margin-bottom: 36px;
  border-radius: 0;
  box-shadow: none;
}
.chart-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.98rem;
}
.chart-table th, .chart-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: right;
}
.chart-table th {
  color: #222;
  font-weight: 600;
  background: #f5f5f5;
}
.chart-table td:first-child, .chart-table th:first-child {
  text-align: left;
}
</style>

<div class="page-root">
  <!-- Tab Navigation -->
  <div class="tabs-container">
    <button
      class="tab-btn"
      class:active={activeTab === 'fleet'}
      on:click={() => activeTab = 'fleet'}
    >
      FLEET OVERVIEW
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'usage'}
      on:click={() => activeTab = 'usage'}
    >
      USAGE TRENDS
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'maintenance'}
      on:click={() => activeTab = 'maintenance'}
    >
      MAINTENANCE
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'cost'}
      on:click={() => activeTab = 'cost'}
    >
      COST ANALYSIS
    </button>
    <button
      class="tab-btn"
      class:active={activeTab === 'performance'}
      on:click={() => activeTab = 'performance'}
    >
      PERFORMANCE
    </button>
  </div>

  <!-- Fleet Overview Tab -->
  {#if activeTab === 'fleet'}
    <div class="section-title">Fleet Status Summary</div>
    <div class="summary-grid">
      {#each fleetSummary as s}
        <div class="summary-item">
          <div class="summary-label">{s.label}</div>
          <div class="summary-value">{s.value}</div>
        </div>
      {/each}
    </div>

    <div class="section-title">Fleet Distribution by Tenant</div>
    <div class="chart-area">
      <table class="chart-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Total</th>
            <th>Active</th>
            <th>Maintenance</th>
            <th>Idle</th>
          </tr>
        </thead>
        <tbody>
          {#each fleetByTenant as row}
            <tr>
              <td>{row.tenant}</td>
              <td>{row.total}</td>
              <td>{row.active}</td>
              <td>{row.maintenance}</td>
              <td>{row.idle}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Usage Trends Tab -->
  {#if activeTab === 'usage'}
    <div class="section-title">Usage Metrics Summary</div>
    <div class="summary-grid">
      {#each usageSummary as s}
        <div class="summary-item">
          <div class="summary-label">{s.label}</div>
          <div class="summary-value">{s.value}</div>
        </div>
      {/each}
    </div>

    <div class="section-title">Weekly Usage Trends</div>
    <div class="chart-area">
      <table class="chart-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Distance (km)</th>
            <th>Runtime (hrs)</th>
            <th>Active Vehicles</th>
          </tr>
        </thead>
        <tbody>
          {#each usageTrends as row}
            <tr>
              <td>{row.date}</td>
              <td>{row.distance.toLocaleString()}</td>
              <td>{row.runtime.toLocaleString()}</td>
              <td>{row.vehicles}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Maintenance Analytics Tab -->
  {#if activeTab === 'maintenance'}
    <div class="section-title">Maintenance Overview</div>
    <div class="summary-grid">
      {#each maintenanceSummary as s}
        <div class="summary-item">
          <div class="summary-label">{s.label}</div>
          <div class="summary-value">{s.value}</div>
        </div>
      {/each}
    </div>

    <div class="section-title">Maintenance by Type</div>
    <div class="chart-area">
      <table class="chart-table">
        <thead>
          <tr>
            <th>Service Type</th>
            <th>Count</th>
            <th>Avg Cost (KRW)</th>
          </tr>
        </thead>
        <tbody>
          {#each maintenanceByType as row}
            <tr>
              <td>{row.type}</td>
              <td>{row.count}</td>
              <td>{row.avgCost.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Cost Analysis Tab -->
  {#if activeTab === 'cost'}
    <div class="section-title">Cost Summary</div>
    <div class="summary-grid">
      {#each costSummary as s}
        <div class="summary-item">
          <div class="summary-label">{s.label}</div>
          <div class="summary-value">{s.value}</div>
        </div>
      {/each}
    </div>

    <div class="section-title">Cost Breakdown</div>
    <div class="chart-area">
      <table class="chart-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (KRW)</th>
            <th>Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {#each costBreakdown as row}
            <tr>
              <td>{row.category}</td>
              <td>{row.amount.toLocaleString()}</td>
              <td>{row.percentage}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Performance Metrics Tab -->
  {#if activeTab === 'performance'}
    <div class="section-title">Performance Summary</div>
    <div class="summary-grid">
      {#each performanceSummary as s}
        <div class="summary-item">
          <div class="summary-label">{s.label}</div>
          <div class="summary-value">{s.value}</div>
        </div>
      {/each}
    </div>

    <div class="section-title">Key Performance Indicators</div>
    <div class="chart-area">
      <table class="chart-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Current (%)</th>
            <th>Target (%)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each performanceMetrics as row}
            <tr>
              <td>{row.metric}</td>
              <td>{row.current}</td>
              <td>{row.target}</td>
              <td>{row.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
