<script lang="ts">
	import { ROVERS, type RoverName } from '$lib/types/mars';

	interface Props {
		selected: RoverName;
		onSelect: (rover: RoverName) => void;
	}

	let { selected, onSelect }: Props = $props();
</script>

<div class="flex flex-wrap gap-3">
	{#each ROVERS as rover}
		<button
			type="button"
			class="px-4 py-2 rounded-lg text-left transition-all duration-200
				{selected === rover.name
					? 'bg-orange-600 text-white'
					: 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}
				{!rover.available ? 'opacity-50 cursor-not-allowed' : ''}"
			onclick={() => rover.available && onSelect(rover.name)}
			disabled={!rover.available}
		>
			<div class="flex items-center gap-2">
				<span class="font-medium">{rover.displayName}</span>
				{#if !rover.available}
					<span class="text-xs opacity-70">(unavailable)</span>
				{/if}
			</div>
			<div class="text-xs {selected === rover.name ? 'text-orange-200' : 'text-gray-500'}">
				{rover.dateRange}
			</div>
		</button>
	{/each}
</div>
