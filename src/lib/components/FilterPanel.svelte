<script lang="ts">
	import { ROVER_CAMERAS, type RoverName } from '$lib/types/mars';

	interface Props {
		rover: RoverName;
		sol: number | null;
		solMin: number | null;
		solMax: number | null;
		dateStart: string;
		dateEnd: string;
		camera: string;
		search: string;
		maxSol: number;
		onSolChange: (sol: number | null) => void;
		onSolMinChange: (sol: number | null) => void;
		onSolMaxChange: (sol: number | null) => void;
		onDateStartChange: (date: string) => void;
		onDateEndChange: (date: string) => void;
		onCameraChange: (camera: string) => void;
		onSearchChange: (search: string) => void;
		onClearFilters: () => void;
	}

	let {
		rover,
		sol,
		solMin,
		solMax,
		dateStart,
		dateEnd,
		camera,
		search,
		maxSol,
		onSolChange,
		onSolMinChange,
		onSolMaxChange,
		onDateStartChange,
		onDateEndChange,
		onCameraChange,
		onSearchChange,
		onClearFilters
	}: Props = $props();

	const cameras = $derived(ROVER_CAMERAS[rover] || []);

	// MER rovers (Spirit/Opportunity) don't have searchable metadata
	const isMERRover = $derived(rover === 'spirit' || rover === 'opportunity');

	const SEARCH_EXAMPLES: Record<RoverName, string[]> = {
		perseverance: ['rock', 'wheel', 'horizon', 'drill', 'sample'],
		curiosity: ['rock', 'wheel', 'sand', 'crater', 'mountain'],
		opportunity: [],
		spirit: []
	};

	const searchExamples = $derived(SEARCH_EXAMPLES[rover] || []);

	let solMode: 'single' | 'range' = $state('single');

	function handleSolInput(e: Event, callback: (sol: number | null) => void) {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		if (value === '') {
			callback(null);
		} else {
			const num = parseInt(value, 10);
			if (!isNaN(num) && num >= 0) {
				callback(num);
			}
		}
	}

	function switchSolMode(mode: 'single' | 'range') {
		solMode = mode;
		// Clear the other mode's values
		if (mode === 'single') {
			onSolMinChange(null);
			onSolMaxChange(null);
		} else {
			onSolChange(null);
		}
	}

	const hasActiveFilters = $derived(
		sol !== null ||
		solMin !== null ||
		solMax !== null ||
		dateStart !== '' ||
		dateEnd !== '' ||
		camera !== '' ||
		search !== ''
	);
</script>

<div class="bg-gray-900/50 rounded-xl p-4 space-y-4">
	<!-- Sol Filter -->
	<div class="space-y-2">
		<div class="flex items-center gap-4">
			<span class="text-gray-400 text-sm font-medium">Sol (Mars Day)</span>
			<div class="flex items-center gap-2">
				<label class="flex items-center gap-1 cursor-pointer">
					<input
						type="radio"
						name="sol-mode"
						checked={solMode === 'single'}
						onchange={() => switchSolMode('single')}
						class="text-orange-500 focus:ring-orange-500"
					/>
					<span class="text-gray-300 text-sm">Single</span>
				</label>
				<label class="flex items-center gap-1 cursor-pointer">
					<input
						type="radio"
						name="sol-mode"
						checked={solMode === 'range'}
						onchange={() => switchSolMode('range')}
						class="text-orange-500 focus:ring-orange-500"
					/>
					<span class="text-gray-300 text-sm">Range</span>
				</label>
			</div>
			{#if maxSol > 0}
				<span class="text-gray-500 text-xs">max: {maxSol.toLocaleString()}</span>
			{/if}
		</div>

		{#if solMode === 'single'}
			<input
				type="number"
				min="0"
				max={maxSol}
				value={sol ?? ''}
				oninput={(e) => handleSolInput(e, onSolChange)}
				placeholder="Leave empty for latest"
				class="w-full max-w-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
					focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
			/>
		{:else}
			<div class="flex items-center gap-2">
				<input
					type="number"
					min="0"
					max={maxSol}
					value={solMin ?? ''}
					oninput={(e) => handleSolInput(e, onSolMinChange)}
					placeholder="From"
					class="w-32 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
						focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
				/>
				<span class="text-gray-500">to</span>
				<input
					type="number"
					min="0"
					max={maxSol}
					value={solMax ?? ''}
					oninput={(e) => handleSolInput(e, onSolMaxChange)}
					placeholder="To"
					class="w-32 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
						focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
				/>
			</div>
		{/if}
	</div>

	<!-- Date Filter -->
	<div class="space-y-2">
		<span class="text-gray-400 text-sm font-medium">Earth Date Range</span>
		<div class="flex flex-wrap items-center gap-2">
			<input
				type="date"
				value={dateStart}
				onchange={(e) => onDateStartChange((e.target as HTMLInputElement).value)}
				class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
					focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
			/>
			<span class="text-gray-500">to</span>
			<input
				type="date"
				value={dateEnd}
				onchange={(e) => onDateEndChange((e.target as HTMLInputElement).value)}
				class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
					focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
			/>
		</div>
	</div>

	<!-- Camera and Search Row -->
	<div class="flex flex-wrap gap-4">
		<!-- Camera Select -->
		<div class="space-y-2">
			<label for="camera-select" class="text-gray-400 text-sm font-medium">Camera</label>
			<select
				id="camera-select"
				value={camera}
				onchange={(e) => onCameraChange((e.target as HTMLSelectElement).value)}
				class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
					focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
			>
				<option value="">All Cameras</option>
				{#each cameras as cam}
					<option value={cam.abbrev}>{cam.full_name}</option>
				{/each}
			</select>
		</div>

		<!-- Text Search -->
		<div class="flex-1 min-w-[200px] space-y-2">
			<label for="search-input" class="text-gray-400 text-sm font-medium">Text Search</label>
			{#if isMERRover}
				<div class="text-gray-500 text-xs italic py-1.5">
					Text search not available for legacy rovers (no metadata in archive)
				</div>
			{:else}
				<input
					id="search-input"
					type="text"
					value={search}
					oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
					placeholder="Search captions, metadata..."
					class="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
						focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
				/>
				<div class="flex flex-wrap gap-1.5">
					<span class="text-gray-500 text-xs">Try:</span>
					{#each searchExamples as example}
						<button
							type="button"
							onclick={() => onSearchChange(example)}
							class="text-xs text-orange-400 hover:text-orange-300 hover:underline transition-colors"
						>
							{example}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Clear Filters -->
	{#if hasActiveFilters}
		<button
			type="button"
			onclick={onClearFilters}
			class="text-gray-400 hover:text-white text-sm underline transition-colors"
		>
			Clear all filters
		</button>
	{/if}
</div>
