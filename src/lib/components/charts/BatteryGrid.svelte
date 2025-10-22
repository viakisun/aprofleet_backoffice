<script lang="ts">
  import type { Vehicle } from "$lib/stores/vehicle";

  export let vehicles: Vehicle[] = [];
  export let columns = 5;
  export let onVehicleClick: ((vehicle: Vehicle) => void) | null = null;

  function getBatteryBar(level: number): string {
    const filled = Math.floor(level / 10);
    const empty = 10 - filled;
    return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
  }

  function getBatteryStatus(
    level: number,
  ): "critical" | "low" | "medium" | "good" | "full" {
    if (level >= 90) return "full";
    if (level >= 60) return "good";
    if (level >= 30) return "medium";
    if (level >= 15) return "low";
    return "critical";
  }

  function getChargingIndicator(isCharging: boolean): string {
    return isCharging ? "[CHARGING]" : "";
  }

  function handleClick(v: Vehicle) {
    if (onVehicleClick) {
      onVehicleClick(v);
    }
  }
</script>

<div class="battery-grid">
  <div class="grid-header">
    <div class="header-title">BATTERY STATUS GRID</div>
    <div class="header-stats">
      <span class="stat-item">
        TOTAL: {vehicles.length}
      </span>
      <span class="stat-separator">|</span>
      <span class="stat-item">
        CHARGING: {vehicles.filter((v) => v.battery.isCharging).length}
      </span>
      <span class="stat-separator">|</span>
      <span class="stat-item">
        LOW: {vehicles.filter((v) => v.battery.level < 20).length}
      </span>
    </div>
  </div>

  <div
    class="grid-container"
    style="grid-template-columns: repeat({columns}, 1fr)"
  >
    {#each vehicles as vehicle}
      <button
        class="battery-cell"
        class:critical={getBatteryStatus(vehicle.battery.level) === "critical"}
        class:low={getBatteryStatus(vehicle.battery.level) === "low"}
        class:charging={vehicle.battery.isCharging}
        on:click={() => handleClick(vehicle)}
      >
        <div class="cell-header">
          <span class="cell-vin">{vehicle.vin.slice(-4)}</span>
          {#if vehicle.battery.isCharging}
            <span class="charging-icon">▢</span>
          {/if}
        </div>

        <div class="battery-display">
          <div class="battery-bar">{getBatteryBar(vehicle.battery.level)}</div>
          <div class="battery-level">{vehicle.battery.level}%</div>
        </div>

        <div class="cell-details">
          <div class="detail-row">
            <span class="detail-label">RANGE:</span>
            <span class="detail-value">{vehicle.battery.range}KM</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">TEMP:</span>
            <span class="detail-value"
              >{vehicle.battery.temperature.toFixed(0)}°C</span
            >
          </div>
          {#if vehicle.battery.isCharging && vehicle.battery.timeToFull}
            <div class="detail-row charging-time">
              <span class="detail-label">TIME:</span>
              <span class="detail-value">{vehicle.battery.timeToFull}MIN</span>
            </div>
          {/if}
        </div>

        <div class="cell-status">
          {vehicle.status.toUpperCase()}
        </div>
      </button>
    {/each}
  </div>

  <!-- Legend -->
  <div class="grid-legend">
    <div class="legend-item">
      <div class="legend-box critical"></div>
      <span class="legend-label">CRITICAL (&lt;15%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-box low"></div>
      <span class="legend-label">LOW (15-29%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-box medium"></div>
      <span class="legend-label">MEDIUM (30-59%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-box good"></div>
      <span class="legend-label">GOOD (60-89%)</span>
    </div>
    <div class="legend-item">
      <div class="legend-box full"></div>
      <span class="legend-label">FULL (90-100%)</span>
    </div>
    <div class="legend-item">
      <span class="legend-icon">▢</span>
      <span class="legend-label">CHARGING</span>
    </div>
  </div>
</div>

<style>
  .battery-grid {
    width: 100%;
    border: var(--border-width) solid var(--color-gray-20);
    background: var(--color-white);
    padding: var(--space-4);
  }

  .grid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
    border-bottom: var(--border-width) solid var(--color-black);
  }

  .header-title {
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    letter-spacing: var(--tracking-wider);
  }

  .header-stats {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-gray-40);
  }

  .stat-separator {
    color: var(--color-gray-20);
  }

  .grid-container {
    display: grid;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .battery-cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-gray-20);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing-linear);
    text-align: left;
  }

  .battery-cell:hover {
    border-color: var(--color-black);
    transform: translateY(-2px);
  }

  .battery-cell.critical {
    border-width: var(--border-width-2);
    border-color: var(--color-black);
  }

  .battery-cell.low {
    border-style: dashed;
  }

  .battery-cell.charging {
    background: var(--color-gray-04);
  }

  .cell-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-2);
    border-bottom: var(--border-width) solid var(--color-gray-08);
  }

  .cell-vin {
    font-family: monospace;
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
  }

  .charging-icon {
    font-size: 12px;
  }

  .battery-display {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .battery-bar {
    font-family: monospace;
    font-size: 11px;
    letter-spacing: -2px;
  }

  .battery-level {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .cell-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2) 0;
    border-top: var(--border-width) solid var(--color-gray-08);
    border-bottom: var(--border-width) solid var(--color-gray-08);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
  }

  .detail-value {
    font-size: var(--text-xs);
    font-family: monospace;
    font-variant-numeric: tabular-nums;
  }

  .detail-row.charging-time {
    background: var(--color-black);
    color: var(--color-white);
    padding: var(--space-1);
    margin: 0 calc(-1 * var(--space-1));
  }

  .detail-row.charging-time .detail-label,
  .detail-row.charging-time .detail-value {
    color: var(--color-white);
  }

  .cell-status {
    font-size: var(--text-xs);
    text-align: center;
    letter-spacing: var(--tracking-wider);
    opacity: 0.6;
  }

  /* Legend */
  .grid-legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    padding-top: var(--space-3);
    border-top: var(--border-width) solid var(--color-gray-12);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .legend-box {
    width: 16px;
    height: 16px;
    border: var(--border-width) solid var(--color-gray-20);
  }

  .legend-box.critical {
    border-width: var(--border-width-2);
    border-color: var(--color-black);
    background: var(--color-white);
  }

  .legend-box.low {
    border-style: dashed;
  }

  .legend-box.medium {
    border-style: solid;
  }

  .legend-box.good {
    border-style: solid;
  }

  .legend-box.full {
    background: var(--color-black);
  }

  .legend-icon {
    font-size: 12px;
  }

  .legend-label {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
  }
</style>
