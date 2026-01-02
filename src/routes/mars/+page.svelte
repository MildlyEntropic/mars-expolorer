<script lang="ts">
	import { onMount } from 'svelte';
	import type { Photo, RoverName } from '$lib/types/mars';
	import { fetchPhotos, fetchRoverInfo } from '$lib/api/nasa';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import RoverSelector from '$lib/components/RoverSelector.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';

	let { data } = $props();

	// State
	let selectedRover: RoverName = $state('perseverance');
	let sol: number | null = $state(null);
	let solMin: number | null = $state(null);
	let solMax: number | null = $state(null);
	let dateStart: string = $state('');
	let dateEnd: string = $state('');
	let camera: string = $state('');
	let search: string = $state('');
	let maxSol: number = $state(data.maxSol || 0);

	let photos: Photo[] = $state(data.initialPhotos || []);
	let selectedPhoto: Photo | null = $state(null);

	let loadingPhotos: boolean = $state(false);
	let error: string | null = $state(null);

	let page: number = $state(0);
	let hasMore: boolean = $state(true);

	onMount(async () => {
		if (maxSol === 0) {
			await loadRoverInfo();
		}
	});

	async function loadRoverInfo() {
		try {
			const rover = await fetchRoverInfo(selectedRover);
			maxSol = rover.max_sol;
		} catch (e) {
			console.error('Failed to load rover info:', e);
		}
	}

	function getSearchOptions() {
		return {
			rover: selectedRover,
			sol: sol ?? undefined,
			solMin: solMin ?? undefined,
			solMax: solMax ?? undefined,
			dateStart: dateStart || undefined,
			dateEnd: dateEnd || undefined,
			camera: camera || undefined,
			search: search || undefined
		};
	}

	async function searchPhotos() {
		loadingPhotos = true;
		error = null;
		page = 0;
		hasMore = true;

		try {
			photos = await fetchPhotos({
				...getSearchOptions(),
				page: 0
			});

			if (photos.length < 25) {
				hasMore = false;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load photos';
			photos = [];
		} finally {
			loadingPhotos = false;
		}
	}

	async function loadMore() {
		if (loadingPhotos || !hasMore) return;

		loadingPhotos = true;
		page += 1;

		try {
			const morePhotos = await fetchPhotos({
				...getSearchOptions(),
				page
			});

			if (morePhotos.length < 25) {
				hasMore = false;
			}

			photos = [...photos, ...morePhotos];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load more photos';
		} finally {
			loadingPhotos = false;
		}
	}

	function handleRoverChange(rover: RoverName) {
		selectedRover = rover;
		camera = '';
		photos = [];
		error = null;
		loadRoverInfo();
	}

	function handlePhotoClick(photo: Photo) {
		selectedPhoto = photo;
	}

	function closeLightbox() {
		selectedPhoto = null;
	}

	function clearFilters() {
		sol = null;
		solMin = null;
		solMax = null;
		dateStart = '';
		dateEnd = '';
		camera = '';
		search = '';
	}
</script>

<svelte:head>
	<title>Mars - Cosmic Mirror</title>
	<meta name="description" content="Browse photos from NASA's Mars rovers: Perseverance, Curiosity, Opportunity, and Spirit. Filter by sol, date, and camera." />
</svelte:head>

<div class="min-h-screen bg-black relative">
	<!-- Background grid -->
	<div class="fixed inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-3 text-white/40 hover:text-white/70 transition-colors group">
					<svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
					</svg>
					<span class="text-xs tracking-wider uppercase">Back</span>
				</a>
				<div class="flex items-center gap-4">
					<span class="text-xs tracking-[0.2em] text-red-400/70 uppercase">Mars</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/30 uppercase">Rover Imagery</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Rover Selector -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-red-400 uppercase">Select Rover</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>
			<RoverSelector selected={selectedRover} onSelect={handleRoverChange} />
		</section>

		<!-- Filters -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Filters</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>
			<FilterPanel
				rover={selectedRover}
				{sol}
				{solMin}
				{solMax}
				{dateStart}
				{dateEnd}
				{camera}
				{search}
				{maxSol}
				onSolChange={(s) => sol = s}
				onSolMinChange={(s) => solMin = s}
				onSolMaxChange={(s) => solMax = s}
				onDateStartChange={(d) => dateStart = d}
				onDateEndChange={(d) => dateEnd = d}
				onCameraChange={(c) => camera = c}
				onSearchChange={(s) => search = s}
				onClearFilters={clearFilters}
			/>
		</section>

		<!-- Search Button -->
		<button
			type="button"
			class="px-6 py-2.5 bg-red-500/20 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/30 text-red-400 text-xs tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
			onclick={searchPhotos}
			disabled={loadingPhotos}
		>
			{loadingPhotos ? 'Loading...' : 'Search Photos'}
		</button>

		<!-- Error Message -->
		{#if error}
			<div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-xs tracking-wider">
				{error}
			</div>
		{/if}

		<!-- Results -->
		<section class="space-y-6">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Results</span>
				<div class="h-px flex-1 bg-white/5"></div>
				<span class="text-[10px] tracking-wider text-white/30">
					{#if photos.length > 0}
						{photos.length} photos · {selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1)}
					{:else}
						Recent from Perseverance
					{/if}
				</span>
			</div>

			<PhotoGrid {photos} onPhotoClick={handlePhotoClick} />

			<!-- Load More -->
			{#if hasMore && photos.length > 0}
				<div class="flex justify-center pt-4">
					<button
						type="button"
						class="px-6 py-2.5 bg-white/[0.02] border border-white/10 hover:border-white/20 text-white/50 hover:text-white/70 text-xs tracking-wider uppercase transition-all disabled:opacity-50"
						onclick={loadMore}
						disabled={loadingPhotos}
					>
						{loadingPhotos ? 'Loading...' : 'Load More'}
					</button>
				</div>
			{/if}
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/30 text-center">
				Data: <a href="https://mars.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-red-400/50 hover:text-red-400/70 transition-colors">NASA Mars Exploration</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox photo={selectedPhoto} onClose={closeLightbox} />
