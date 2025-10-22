<script lang="ts">
	interface VehicleModel {
		id: string;
		name: string;
		modelCode: string;
		variant: string;
		status: 'active' | 'discontinued' | 'development' | 'beta';
		releaseDate: string;

		// Specifications
		maxSpeed: number;
		range: number;
		batteryCapacity: number;
		passengerCapacity: number;
		cargoCapacity: number;
		weight: number;
		dimensions: {
			length: number;
			width: number;
			height: number;
		};

		// Technology
		autonomyLevel: 1 | 2 | 3 | 4 | 5;
		firmwareVersion: string;
		sensors: string[];
		features: string[];

		// Deployment
		totalDeployed: number;
		activeUnits: number;
		avgUtilization: number;
		totalDistance: number;

		// Pricing
		unitPrice: number;
		monthlyLease: number;
	}

	const vehicleModels: VehicleModel[] = [
		{
			id: 'model-001',
			name: 'APROFLEET CARGO',
			modelCode: 'AFC-200',
			variant: 'Standard',
			status: 'active',
			releaseDate: '2023-06-01',
			maxSpeed: 25,
			range: 80,
			batteryCapacity: 72,
			passengerCapacity: 2,
			cargoCapacity: 500,
			weight: 850,
			dimensions: { length: 3.2, width: 1.5, height: 1.8 },
			autonomyLevel: 4,
			firmwareVersion: '2.4.1',
			sensors: ['LIDAR', 'CAMERA', 'RADAR', 'GPS', 'IMU', 'ULTRASONIC'],
			features: ['Autonomous Navigation', 'Obstacle Avoidance', 'Weather Resistant', 'Remote Monitoring'],
			totalDeployed: 35,
			activeUnits: 34,
			avgUtilization: 72.5,
			totalDistance: 145320,
			unitPrice: 45000,
			monthlyLease: 1200
		},
		{
			id: 'model-002',
			name: 'APROFLEET PASSENGER',
			modelCode: 'AFP-400',
			variant: 'Premium',
			status: 'active',
			releaseDate: '2024-01-15',
			maxSpeed: 30,
			range: 100,
			batteryCapacity: 96,
			passengerCapacity: 4,
			cargoCapacity: 200,
			weight: 920,
			dimensions: { length: 3.5, width: 1.6, height: 1.9 },
			autonomyLevel: 4,
			firmwareVersion: '2.4.1',
			sensors: ['LIDAR', 'CAMERA', 'RADAR', 'GPS', 'IMU', 'ULTRASONIC'],
			features: ['Autonomous Navigation', 'Passenger Comfort', 'Climate Control', 'USB Charging'],
			totalDeployed: 18,
			activeUnits: 17,
			avgUtilization: 68.3,
			totalDistance: 89765,
			unitPrice: 52000,
			monthlyLease: 1400
		},
		{
			id: 'model-003',
			name: 'APROFLEET UTILITY',
			modelCode: 'AFU-150',
			variant: 'Standard',
			status: 'active',
			releaseDate: '2023-03-20',
			maxSpeed: 20,
			range: 60,
			batteryCapacity: 48,
			passengerCapacity: 2,
			cargoCapacity: 800,
			weight: 780,
			dimensions: { length: 3.0, width: 1.5, height: 1.7 },
			autonomyLevel: 3,
			firmwareVersion: '2.3.5',
			sensors: ['CAMERA', 'RADAR', 'GPS', 'IMU', 'ULTRASONIC'],
			features: ['Semi-Autonomous', 'Heavy Duty', 'Tool Storage', 'Towing Capable'],
			totalDeployed: 7,
			activeUnits: 6,
			avgUtilization: 55.2,
			totalDistance: 34567,
			unitPrice: 38000,
			monthlyLease: 950
		},
		{
			id: 'model-004',
			name: 'APROFLEET SPORT',
			modelCode: 'AFS-600',
			variant: 'Performance',
			status: 'beta',
			releaseDate: '2024-09-01',
			maxSpeed: 40,
			range: 120,
			batteryCapacity: 120,
			passengerCapacity: 2,
			cargoCapacity: 150,
			weight: 950,
			dimensions: { length: 3.4, width: 1.5, height: 1.7 },
			autonomyLevel: 5,
			firmwareVersion: '3.0.0-beta.2',
			sensors: ['LIDAR', 'CAMERA', 'RADAR', 'GPS', 'IMU', 'ULTRASONIC', 'V2X'],
			features: ['Full Autonomy', 'Sport Mode', 'Advanced AI', 'V2X Communication'],
			totalDeployed: 0,
			activeUnits: 0,
			avgUtilization: 0,
			totalDistance: 0,
			unitPrice: 68000,
			monthlyLease: 1850
		}
	];

	let selectedModel: VehicleModel | null = null;
	let searchTerm = '';
	let statusFilter: VehicleModel['status'] | 'all' = 'all';
	let sortBy: 'name' | 'deployed' | 'price' | 'range' = 'name';
	let sortDirection: 'asc' | 'desc' = 'asc';

	$: filteredModels = vehicleModels
		.filter(model => {
			const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				model.modelCode.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'deployed':
					comparison = a.totalDeployed - b.totalDeployed;
					break;
				case 'price':
					comparison = a.unitPrice - b.unitPrice;
					break;
				case 'range':
					comparison = a.range - b.range;
					break;
			}
			return sortDirection === 'asc' ? comparison : -comparison;
		});

	$: totalModels = vehicleModels.length;
	$: activeModels = vehicleModels.filter(m => m.status === 'active').length;
	$: totalDeployed = vehicleModels.reduce((sum, m) => sum + m.totalDeployed, 0);
	$: avgPrice = vehicleModels.reduce((sum, m) => sum + m.unitPrice, 0) / vehicleModels.length;

	function getStatusSymbol(status: VehicleModel['status']): string {
		switch (status) {
			case 'active': return '■';
			case 'beta': return '◆';
			case 'development': return '⬚';
			case 'discontinued': return '✖';
		}
	}

	function getAutonomyLabel(level: number): string {
		const labels = {
			1: 'DRIVER ASSIST',
			2: 'PARTIAL AUTO',
			3: 'CONDITIONAL AUTO',
			4: 'HIGH AUTO',
			5: 'FULL AUTO'
		};
		return labels[level as keyof typeof labels] || 'UNKNOWN';
	}

	function toggleSort(field: typeof sortBy) {
		if (sortBy === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortDirection = 'asc';
		}
	}

	function handleModelClick(model: VehicleModel) {
		selectedModel = model;
	}

	function closeModal() {
		selectedModel = null;
	}
</script>

<div class="models-page">
	<!-- Page Header -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">VEHICLE MODEL MANAGEMENT</h1>
			<p class="page-subtitle">Product Portfolio & Deployment Statistics</p>
		</div>
		<button class="btn-primary">+ ADD NEW MODEL</button>
	</div>

	<!-- Summary Cards -->
	<div class="summary-cards">
		<div class="summary-card">
			<div class="card-label">TOTAL MODELS</div>
			<div class="card-value">{totalModels}</div>
			<div class="card-detail">{activeModels} ACTIVE MODELS</div>
		</div>

		<div class="summary-card">
			<div class="card-label">TOTAL DEPLOYED</div>
			<div class="card-value">{totalDeployed}</div>
			<div class="card-detail">ACROSS ALL MODELS</div>
		</div>

		<div class="summary-card">
			<div class="card-label">AVG UNIT PRICE</div>
			<div class="card-value">${(avgPrice / 1000).toFixed(0)}K</div>
			<div class="card-detail">MANUFACTURER PRICING</div>
		</div>

		<div class="summary-card">
			<div class="card-label">LATEST FIRMWARE</div>
			<div class="card-value">2.4.1</div>
			<div class="card-detail">PRODUCTION VERSION</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="filters-section">
		<div class="search-box">
			<label for="search">SEARCH:</label>
			<input
				id="search"
				type="text"
				bind:value={searchTerm}
				placeholder="Model name or code..."
			/>
		</div>

		<div class="filter-group">
			<label for="status-filter">STATUS:</label>
			<select id="status-filter" bind:value={statusFilter}>
				<option value="all">ALL</option>
				<option value="active">ACTIVE</option>
				<option value="beta">BETA</option>
				<option value="development">DEVELOPMENT</option>
				<option value="discontinued">DISCONTINUED</option>
			</select>
		</div>

		<div class="results-count">
			SHOWING {filteredModels.length} OF {vehicleModels.length}
		</div>
	</div>

	<!-- Models Grid -->
	<div class="models-grid">
		{#each filteredModels as model}
			<button class="model-card" on:click={() => handleModelClick(model)}>
				<div class="card-header">
					<div class="model-name">{model.name}</div>
					<div class="model-status">
						<span class="status-symbol">{getStatusSymbol(model.status)}</span>
						{model.status.toUpperCase()}
					</div>
				</div>

				<div class="model-code">{model.modelCode}</div>

				<div class="specs-grid">
					<div class="spec-item">
						<div class="spec-label">MAX SPEED</div>
						<div class="spec-value">{model.maxSpeed} KM/H</div>
					</div>
					<div class="spec-item">
						<div class="spec-label">RANGE</div>
						<div class="spec-value">{model.range} KM</div>
					</div>
					<div class="spec-item">
						<div class="spec-label">BATTERY</div>
						<div class="spec-value">{model.batteryCapacity} KWH</div>
					</div>
					<div class="spec-item">
						<div class="spec-label">PASSENGERS</div>
						<div class="spec-value">{model.passengerCapacity}</div>
					</div>
				</div>

				<div class="autonomy-badge">
					LEVEL {model.autonomyLevel}: {getAutonomyLabel(model.autonomyLevel)}
				</div>

				<div class="deployment-stats">
					<div class="stat">
						<span class="stat-label">DEPLOYED:</span>
						<span class="stat-value">{model.totalDeployed} UNITS</span>
					</div>
					<div class="stat">
						<span class="stat-label">ACTIVE:</span>
						<span class="stat-value">{model.activeUnits} UNITS</span>
					</div>
				</div>

				<div class="pricing">
					<div class="price-item">
						<span class="price-label">PURCHASE:</span>
						<span class="price-value">${model.unitPrice.toLocaleString()}</span>
					</div>
					<div class="price-item">
						<span class="price-label">LEASE:</span>
						<span class="price-value">${model.monthlyLease}/MO</span>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>

<!-- Detail Modal -->
{#if selectedModel}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		on:click={closeModal}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="modal-content"
			role="dialog"
			aria-modal="true"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<div class="modal-header">
				<h2 class="modal-title">{selectedModel.name}</h2>
				<button class="close-btn" on:click={closeModal}>✖</button>
			</div>

			<div class="modal-body">
				<div class="detail-section">
					<div class="section-title">BASIC INFORMATION</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">MODEL CODE</div>
							<div class="detail-value">{selectedModel.modelCode}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">VARIANT</div>
							<div class="detail-value">{selectedModel.variant}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">STATUS</div>
							<div class="detail-value">
								<span class="status-symbol">{getStatusSymbol(selectedModel.status)}</span>
								{selectedModel.status.toUpperCase()}
							</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">RELEASE DATE</div>
							<div class="detail-value">{selectedModel.releaseDate}</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">TECHNICAL SPECIFICATIONS</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">MAX SPEED</div>
							<div class="detail-value">{selectedModel.maxSpeed} KM/H</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">RANGE</div>
							<div class="detail-value">{selectedModel.range} KM</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">BATTERY</div>
							<div class="detail-value">{selectedModel.batteryCapacity} KWH</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">WEIGHT</div>
							<div class="detail-value">{selectedModel.weight} KG</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">PASSENGERS</div>
							<div class="detail-value">{selectedModel.passengerCapacity}</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">CARGO</div>
							<div class="detail-value">{selectedModel.cargoCapacity} KG</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">LENGTH</div>
							<div class="detail-value">{selectedModel.dimensions.length} M</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">WIDTH</div>
							<div class="detail-value">{selectedModel.dimensions.width} M</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">HEIGHT</div>
							<div class="detail-value">{selectedModel.dimensions.height} M</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">AUTONOMY & SENSORS</div>
					<div class="autonomy-info">
						<div class="autonomy-level">
							LEVEL {selectedModel.autonomyLevel}: {getAutonomyLabel(selectedModel.autonomyLevel)}
						</div>
						<div class="firmware-version">
							FIRMWARE: {selectedModel.firmwareVersion}
						</div>
					</div>
					<div class="sensors-list">
						{#each selectedModel.sensors as sensor}
							<span class="sensor-chip">{sensor}</span>
						{/each}
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">FEATURES</div>
					<div class="features-list">
						{#each selectedModel.features as feature}
							<div class="feature-item">■ {feature}</div>
						{/each}
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">DEPLOYMENT & PERFORMANCE</div>
					<div class="detail-grid">
						<div class="detail-item">
							<div class="detail-label">TOTAL DEPLOYED</div>
							<div class="detail-value">{selectedModel.totalDeployed} UNITS</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">ACTIVE UNITS</div>
							<div class="detail-value">{selectedModel.activeUnits} UNITS</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">AVG UTILIZATION</div>
							<div class="detail-value">{selectedModel.avgUtilization.toFixed(1)}%</div>
						</div>
						<div class="detail-item">
							<div class="detail-label">TOTAL DISTANCE</div>
							<div class="detail-value">{selectedModel.totalDistance.toLocaleString()} KM</div>
						</div>
					</div>
				</div>

				<div class="detail-section">
					<div class="section-title">PRICING</div>
					<div class="pricing-detail">
						<div class="pricing-row">
							<span class="pricing-label">UNIT PRICE (PURCHASE):</span>
							<span class="pricing-value">${selectedModel.unitPrice.toLocaleString()}</span>
						</div>
						<div class="pricing-row">
							<span class="pricing-label">MONTHLY LEASE:</span>
							<span class="pricing-value">${selectedModel.monthlyLease.toLocaleString()}/MONTH</span>
						</div>
					</div>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeModal}>CLOSE</button>
				<button class="btn-primary">EDIT MODEL</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.models-page {
		padding: var(--space-6);
		max-width: 1600px;
		margin: 0 auto;
	}

	/* Page Header */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin: 0 0 var(--space-2) 0;
	}

	.page-subtitle {
		font-size: var(--text-sm);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
		margin: 0;
	}

	.btn-primary {
		padding: var(--space-3) var(--space-4);
		background: var(--color-black);
		color: var(--color-white);
		border: none;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.btn-primary:hover {
		background: var(--color-gray-60);
	}

	.btn-primary:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.btn-secondary {
		padding: var(--space-3) var(--space-4);
		background: var(--color-white);
		color: var(--color-black);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
	}

	.btn-secondary:hover {
		background: var(--color-gray-04);
	}

	.btn-secondary:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	/* Summary Cards */
	.summary-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.summary-card {
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		min-height: 120px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-2);
	}

	.card-value {
		font-size: var(--text-3xl);
		font-weight: var(--font-semibold);
		font-variant-numeric: tabular-nums;
		margin-bottom: var(--space-1);
	}

	.card-detail {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wide);
	}

	/* Filters */
	.filters-section {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		align-items: center;
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-gray-04);
	}

	.search-box {
		flex: 1;
		min-width: 250px;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.search-box label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.search-box input {
		flex: 1;
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		font-size: var(--text-sm);
		background: var(--color-white);
		transition: border-color var(--duration-fast) var(--easing-linear);
	}

	.search-box input:focus {
		outline: none;
		border-color: var(--color-black);
		border-width: var(--border-width-2);
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.filter-group label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
	}

	.filter-group select {
		padding: var(--space-2);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		font-size: var(--text-sm);
		min-width: 150px;
		cursor: pointer;
		transition: border-color var(--duration-fast) var(--easing-linear);
	}

	.filter-group select:focus {
		outline: none;
		border-color: var(--color-black);
		border-width: var(--border-width-2);
	}

	.results-count {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
		margin-left: auto;
	}

	/* Models Grid */
	.models-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-5);
	}

	.model-card {
		/* Override global button styles */
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		height: auto;
		width: 100%;

		gap: var(--space-3);
		padding: var(--space-4);
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		text-align: left;
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing-linear);
		text-transform: none;
		white-space: normal;
		letter-spacing: normal;
		font-weight: var(--font-normal);
		font-size: var(--text-base);
	}

	.model-card:hover {
		border-color: var(--color-black);
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.model-card:focus {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.model-card:focus:not(:focus-visible) {
		outline: none;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding-bottom: var(--space-3);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.model-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
	}

	.model-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	.status-symbol {
		font-size: 10px;
	}

	.model-code {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--color-gray-40);
	}

	.specs-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.spec-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.spec-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.spec-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.autonomy-badge {
		padding: var(--space-2);
		background: var(--color-black);
		color: var(--color-white);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		text-align: center;
	}

	.deployment-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-12);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.stat-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.pricing {
		display: flex;
		justify-content: space-between;
	}

	.price-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.price-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.price-value {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
	}

	.modal-content {
		background: var(--color-white);
		border: var(--border-width-2) solid var(--color-black);
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: var(--border-width-2) solid var(--color-black);
	}

	.modal-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: var(--text-lg);
		cursor: pointer;
		padding: var(--space-2);
		transition: transform var(--duration-fast) var(--easing-linear);
	}

	.close-btn:hover {
		transform: scale(1.1);
	}

	.close-btn:focus-visible {
		outline: var(--ring-width) solid var(--ring-color-on-white);
		outline-offset: 2px;
	}

	.modal-body {
		padding: var(--space-4);
		overflow-y: auto;
		flex: 1;
	}

	.detail-section {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: var(--border-width) solid var(--color-gray-12);
	}

	.detail-section:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.detail-label {
		font-size: var(--text-xs);
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.detail-value {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		font-family: monospace;
	}

	.autonomy-info {
		display: flex;
		justify-content: space-between;
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
		margin-bottom: var(--space-3);
	}

	.autonomy-level {
		font-weight: var(--font-semibold);
	}

	.firmware-version {
		font-family: monospace;
		color: var(--color-gray-40);
	}

	.sensors-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.sensor-chip {
		padding: var(--space-1) var(--space-2);
		border: var(--border-width) solid var(--color-black);
		font-size: var(--text-xs);
		font-family: monospace;
		letter-spacing: var(--tracking-wide);
	}

	.features-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-item {
		font-size: var(--text-sm);
		padding-left: var(--space-2);
	}

	.pricing-detail {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-gray-04);
		border: var(--border-width) solid var(--color-gray-12);
	}

	.pricing-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pricing-label {
		font-size: var(--text-sm);
		letter-spacing: var(--tracking-wide);
	}

	.pricing-value {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		font-family: monospace;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-3);
		padding: var(--space-4);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	/* Responsive Media Queries */
	@media (max-width: 1024px) {
		.models-page {
			padding: var(--space-4);
		}

		.page-header {
			flex-direction: column;
			gap: var(--space-3);
			align-items: flex-start;
		}

		.summary-cards {
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		}

		.models-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		}

		.detail-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.models-page {
			padding: var(--space-3);
		}

		.page-title {
			font-size: var(--text-xl);
		}

		.summary-cards {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-3);
		}

		.filters-section {
			flex-direction: column;
			align-items: stretch;
		}

		.search-box {
			min-width: 100%;
		}

		.results-count {
			margin-left: 0;
		}

		.models-grid {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}

		.specs-grid {
			grid-template-columns: 1fr;
		}

		.modal-content {
			max-width: 100%;
			max-height: 100vh;
		}

		.detail-grid {
			grid-template-columns: 1fr;
		}

		.modal-footer {
			flex-direction: column-reverse;
		}

		.modal-footer button {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.models-page {
			padding: var(--space-2);
		}

		.page-title {
			font-size: var(--text-lg);
		}

		.page-subtitle {
			font-size: var(--text-xs);
		}

		.summary-cards {
			grid-template-columns: 1fr;
			gap: var(--space-2);
		}

		.summary-card {
			min-height: 100px;
			padding: var(--space-3);
		}

		.card-value {
			font-size: var(--text-2xl);
		}

		.btn-primary,
		.btn-secondary {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}
	}
</style>
