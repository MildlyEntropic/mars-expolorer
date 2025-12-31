<script lang="ts">
	import type { Photo } from '$lib/types/mars';
	import { formatSol } from '$lib/api/nasa';

	interface Props {
		photos: Photo[];
		loading: boolean;
		onPhotoClick?: (photo: Photo) => void;
	}

	let { photos, loading, onPhotoClick }: Props = $props();

	let scrollContainer: HTMLDivElement;
	let canScrollLeft = $state(false);
	let canScrollRight = $state(true);

	function updateScrollButtons() {
		if (!scrollContainer) return;
		canScrollLeft = scrollContainer.scrollLeft > 0;
		canScrollRight = scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
	}

	function scrollLeft() {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
	}

	function scrollRight() {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
	}

	$effect(() => {
		if (photos.length > 0 && scrollContainer) {
			updateScrollButtons();
		}
	});
</script>

<section class="space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-white">Latest from Mars</h2>
			<p class="text-gray-500 text-sm">Past 24 hours</p>
		</div>

		{#if photos.length > 0}
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={scrollLeft}
					disabled={!canScrollLeft}
					class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
					aria-label="Scroll left"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
				<button
					type="button"
					onclick={scrollRight}
					disabled={!canScrollRight}
					class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
					aria-label="Scroll right"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		{/if}
	</div>

	{#if loading}
		<div class="flex gap-4 overflow-hidden">
			{#each Array(8) as _}
				<div class="flex-shrink-0 w-48 h-48 bg-gray-800 rounded-lg animate-pulse"></div>
			{/each}
		</div>
	{:else if photos.length === 0}
		<p class="text-gray-400">No recent photos available</p>
	{:else}
		<div
			bind:this={scrollContainer}
			onscroll={updateScrollButtons}
			class="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
			style="scrollbar-width: none; -ms-overflow-style: none;"
		>
			{#each photos as photo (photo.id)}
				<button
					type="button"
					class="group relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-lg bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 snap-start"
					onclick={() => onPhotoClick?.(photo)}
				>
					<img
						src={photo.img_src}
						alt="Mars surface from {photo.camera.full_name}"
						class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
						loading="lazy"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
						<div class="absolute bottom-0 left-0 right-0 p-3">
							<p class="text-white text-sm font-medium truncate">{photo.camera.full_name}</p>
							<p class="text-gray-300 text-xs">{formatSol(photo.sol)}</p>
						</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</section>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
