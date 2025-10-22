<script lang="ts">
	export let data: Array<{ label: string; value: number }> = [];
	export let height = 200;
	export let title = '';
	export let lineStyle: 'solid' | 'dashed' | 'dotted' = 'solid';
	export let showGrid = true;
	export let showLabels = true;

	const padding = { top: 20, right: 20, bottom: 30, left: 40 };
	const width = 600;

	$: chartWidth = width - padding.left - padding.right;
	$: chartHeight = height - padding.top - padding.bottom;

	$: maxValue = Math.max(...data.map(d => d.value), 0);
	$: minValue = Math.min(...data.map(d => d.value), 0);
	$: valueRange = maxValue - minValue || 1;

	// Calculate points for the line
	$: points = data.map((d, i) => {
		const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
		const y = padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
		return { x, y, label: d.label, value: d.value };
	});

	// Create path data for the line
	$: pathData = points.map((p, i) =>
		`${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
	).join(' ');

	// Create area path (fill under the line)
	$: areaPathData = points.length > 0
		? `M ${points[0].x} ${padding.top + chartHeight} ` +
		  points.map(p => `L ${p.x} ${p.y}`).join(' ') +
		  ` L ${points[points.length - 1].x} ${padding.top + chartHeight} Z`
		: '';

	// Y-axis ticks
	$: yTicks = Array.from({ length: 5 }, (_, i) => {
		const value = minValue + (valueRange / 4) * i;
		const y = padding.top + chartHeight - (i / 4) * chartHeight;
		return { value, y };
	});

	// X-axis ticks
	$: xTicks = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i, arr) => {
		const index = data.indexOf(d);
		const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
		return { label: d.label, x };
	});

	function getStrokeDasharray(): string {
		switch (lineStyle) {
			case 'dashed': return '5,5';
			case 'dotted': return '2,3';
			default: return '0';
		}
	}

	function formatValue(value: number): string {
		if (value >= 1000) {
			return (value / 1000).toFixed(1) + 'K';
		}
		return value.toFixed(0);
	}
</script>

<div class="usage-chart" style="--chart-height: {height}px">
	{#if title}
		<div class="chart-title">{title}</div>
	{/if}

	<svg
		width={width}
		height={height}
		viewBox="0 0 {width} {height}"
		preserveAspectRatio="xMidYMid meet"
	>
		<!-- Grid lines -->
		{#if showGrid}
			<!-- Horizontal grid lines -->
			{#each yTicks as tick}
				<line
					x1={padding.left}
					y1={tick.y}
					x2={width - padding.right}
					y2={tick.y}
					stroke="rgba(0,0,0,0.08)"
					stroke-width="1"
				/>
			{/each}

			<!-- Vertical grid lines -->
			{#each points.filter((_, i) => i % Math.ceil(points.length / 6) === 0) as point}
				<line
					x1={point.x}
					y1={padding.top}
					x2={point.x}
					y2={padding.top + chartHeight}
					stroke="rgba(0,0,0,0.08)"
					stroke-width="1"
				/>
			{/each}
		{/if}

		<!-- Area fill -->
		<path
			d={areaPathData}
			fill="rgba(0,0,0,0.04)"
			stroke="none"
		/>

		<!-- Line path -->
		<path
			d={pathData}
			fill="none"
			stroke="black"
			stroke-width="2"
			stroke-dasharray={getStrokeDasharray()}
			stroke-linejoin="round"
			stroke-linecap="round"
		/>

		<!-- Data points -->
		{#each points as point}
			<circle
				cx={point.x}
				cy={point.y}
				r="3"
				fill="white"
				stroke="black"
				stroke-width="2"
			/>
		{/each}

		<!-- Y-axis -->
		<line
			x1={padding.left}
			y1={padding.top}
			x2={padding.left}
			y2={padding.top + chartHeight}
			stroke="black"
			stroke-width="1"
		/>

		<!-- X-axis -->
		<line
			x1={padding.left}
			y1={padding.top + chartHeight}
			x2={width - padding.right}
			y2={padding.top + chartHeight}
			stroke="black"
			stroke-width="1"
		/>

		{#if showLabels}
			<!-- Y-axis labels -->
			{#each yTicks as tick}
				<text
					x={padding.left - 5}
					y={tick.y}
					text-anchor="end"
					dominant-baseline="middle"
					class="axis-label"
				>
					{formatValue(tick.value)}
				</text>
			{/each}

			<!-- X-axis labels -->
			{#each xTicks as tick}
				<text
					x={tick.x}
					y={padding.top + chartHeight + 15}
					text-anchor="middle"
					class="axis-label"
				>
					{tick.label}
				</text>
			{/each}
		{/if}
	</svg>

	<!-- Legend -->
	<div class="chart-legend">
		<div class="legend-item">
			<div class="legend-line" style="border-top-style: {lineStyle === 'solid' ? 'solid' : lineStyle}"></div>
			<span class="legend-label">VALUE</span>
		</div>
		{#if data.length > 0}
			<div class="legend-stat">
				<span class="legend-stat-label">MAX:</span>
				<span class="legend-stat-value">{formatValue(maxValue)}</span>
			</div>
			<div class="legend-stat">
				<span class="legend-stat-label">MIN:</span>
				<span class="legend-stat-value">{formatValue(minValue)}</span>
			</div>
			<div class="legend-stat">
				<span class="legend-stat-label">AVG:</span>
				<span class="legend-stat-value">
					{formatValue(data.reduce((acc, d) => acc + d.value, 0) / data.length)}
				</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.usage-chart {
		width: 100%;
		border: var(--border-width) solid var(--color-gray-20);
		background: var(--color-white);
		padding: var(--space-3);
	}

	.chart-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		letter-spacing: var(--tracking-wider);
		margin-bottom: var(--space-3);
		text-align: center;
	}

	svg {
		width: 100%;
		height: auto;
		display: block;
	}

	:global(.axis-label) {
		font-size: 10px;
		font-family: monospace;
		fill: var(--color-gray-40);
	}

	.chart-legend {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: var(--border-width) solid var(--color-gray-12);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.legend-line {
		width: 24px;
		height: 0;
		border-top: 2px solid var(--color-black);
	}

	.legend-label {
		font-size: var(--text-xs);
		letter-spacing: var(--tracking-wider);
	}

	.legend-stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
	}

	.legend-stat-label {
		color: var(--color-gray-40);
		letter-spacing: var(--tracking-wider);
	}

	.legend-stat-value {
		font-family: monospace;
		font-weight: var(--font-medium);
	}
</style>