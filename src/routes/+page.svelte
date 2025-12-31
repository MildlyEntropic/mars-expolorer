<script lang="ts">
	import { onMount } from 'svelte';
	import type { Photo, RoverName } from '$lib/types/mars';
	import { fetchLatestPhotos, fetchPhotos, fetchRoverInfo } from '$lib/api/nasa';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import RoverSelector from '$lib/components/RoverSelector.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import LatestPhotos from '$lib/components/LatestPhotos.svelte';
	import SupportSidebar from '$lib/components/SupportSidebar.svelte';
	import AdPlaceholder from '$lib/components/AdPlaceholder.svelte';

	// State
	let selectedRover: RoverName = $state('perseverance');
	let sol: number | null = $state(null);
	let solMin: number | null = $state(null);
	let solMax: number | null = $state(null);
	let dateStart: string = $state('');
	let dateEnd: string = $state('');
	let camera: string = $state('');
	let search: string = $state('');
	let maxSol: number = $state(0);

	let latestPhotos: Photo[] = $state([]);
	let photos: Photo[] = $state([]);
	let selectedPhoto: Photo | null = $state(null);

	let loadingLatest: boolean = $state(true);
	let loadingPhotos: boolean = $state(false);
	let error: string | null = $state(null);

	let page: number = $state(0);
	let hasMore: boolean = $state(true);

	// Fetch latest photos on mount
	onMount(async () => {
		await loadLatestPhotos();
		await loadRoverInfo();
	});

	async function loadLatestPhotos() {
		loadingLatest = true;
		try {
			latestPhotos = await fetchLatestPhotos('perseverance');
		} catch (e) {
			console.error('Failed to load latest photos:', e);
		} finally {
			loadingLatest = false;
		}
	}

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

<div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
	<!-- Header -->
	<header class="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
					<span class="text-white text-lg">🔴</span>
				</div>
				<div>
					<h1 class="text-xl font-bold text-white">Mars Explorer</h1>
					<p class="text-gray-400 text-sm">Browse NASA rover imagery</p>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8 space-y-10">
		<!-- Latest Photos Section -->
		<LatestPhotos
			photos={latestPhotos}
			loading={loadingLatest}
			onPhotoClick={handlePhotoClick}
		/>

		<!-- Divider -->
		<div class="border-t border-gray-800"></div>

		<!-- Browse Section with Sidebar -->
		<div class="flex gap-8">
			<!-- Main Content -->
			<section class="flex-1 min-w-0 space-y-6">
				<h2 class="text-2xl font-bold text-white">Browse Photos</h2>

				<!-- Rover Selector -->
				<div>
					<p class="text-gray-400 text-sm mb-2">Select Rover</p>
					<RoverSelector selected={selectedRover} onSelect={handleRoverChange} />
				</div>

				<!-- Filters -->
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

				<!-- Search Button -->
				<button
					type="button"
					class="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={searchPhotos}
					disabled={loadingPhotos}
				>
					{loadingPhotos ? 'Loading...' : 'Search Photos'}
				</button>

				<!-- Error Message -->
				{#if error}
					<div class="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg">
						{error}
					</div>
				{/if}

				<!-- Results -->
				{#if photos.length > 0 || loadingPhotos}
					<div class="space-y-6">
						<p class="text-gray-400">
							{#if photos.length > 0}
								Showing {photos.length} photos
							{/if}
						</p>

						<PhotoGrid {photos} onPhotoClick={handlePhotoClick} />

						<!-- Load More -->
						{#if hasMore && photos.length > 0}
							<div class="flex justify-center pt-6">
								<button
									type="button"
									class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
									onclick={loadMore}
									disabled={loadingPhotos}
								>
									{loadingPhotos ? 'Loading...' : 'Load More'}
								</button>
							</div>
						{/if}
					</div>
				{/if}
			</section>

			<!-- Sidebar (desktop only) -->
			<SupportSidebar />
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-800 mt-20">
		<div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
			<!-- Ad Placeholder -->
			<AdPlaceholder location="footer" />

			<p class="text-gray-500 text-sm text-center">
				Data provided by <a href="https://mars.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300">NASA Mars Exploration</a>.
				Images courtesy of NASA/JPL-Caltech.
			</p>
		</div>
	</footer>
</div>

<!-- Lightbox -->
<Lightbox photo={selectedPhoto} onClose={closeLightbox} />
