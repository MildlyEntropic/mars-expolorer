<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let jwstImages: SpaceImage[] = $state(data.jwstImages || []);
	let hubbleImages: SpaceImage[] = $state(data.hubbleImages || []);
	let selectedImage: SpaceImage | null = $state(null);

	// Tab state
	let activeTab: 'jwst' | 'hubble' = $state('jwst');

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	let currentImages = $derived(activeTab === 'jwst' ? jwstImages : hubbleImages);
</script>

<svelte:head>
	<title>Telescopes - Cosmic Mirror</title>
	<meta name="description" content="Browse stunning images from the James Webb Space Telescope and Hubble Space Telescope. Explore the universe through NASA's most powerful observatories." />
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
					<span class="text-xs tracking-[0.2em] text-violet-400/70 uppercase">Telescopes</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/30 uppercase">Deep Space Observation</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Telescope Selector -->
		<div class="flex justify-center gap-2">
			<button
				type="button"
				class="px-4 py-2 text-xs tracking-wider uppercase transition-all {activeTab === 'jwst' ? 'bg-violet-500/20 border border-violet-500/50 text-violet-400' : 'bg-white/[0.02] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'}"
				onclick={() => activeTab = 'jwst'}
			>
				James Webb
			</button>
			<button
				type="button"
				class="px-4 py-2 text-xs tracking-wider uppercase transition-all {activeTab === 'hubble' ? 'bg-violet-500/20 border border-violet-500/50 text-violet-400' : 'bg-white/[0.02] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'}"
				onclick={() => activeTab = 'hubble'}
			>
				Hubble
			</button>
		</div>

		<!-- Image Grid -->
		<section class="space-y-6">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Images</span>
				<div class="h-px flex-1 bg-white/5"></div>
				<span class="text-[10px] tracking-wider text-white/30">
					{currentImages.length} from {activeTab === 'jwst' ? 'JWST' : 'Hubble'}
				</span>
			</div>

			{#if currentImages.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-white/30">
					<svg class="w-10 h-10 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<p class="text-xs tracking-wider uppercase">No images available</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
					{#each currentImages as image (image.id)}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 hover:border-violet-500/30 cursor-pointer text-left transition-all duration-300"
							onclick={() => handleImageClick(image)}
						>
							<img
								src={image.thumbnail_src || image.img_src}
								alt={image.title}
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div class="absolute bottom-0 left-0 right-0 p-3 space-y-1">
									<p class="text-white/90 text-xs font-medium line-clamp-2">{image.title}</p>
									{#if image.date}
										<p class="text-white/50 text-[10px] tracking-wider">{image.date}</p>
									{/if}
								</div>
							</div>

							<!-- Corner accent on hover -->
							<div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-violet-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-violet-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>
			{/if}
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/30 text-center">
				Images: <a href="https://webbtelescope.org" target="_blank" rel="noopener noreferrer" class="text-violet-400/50 hover:text-violet-400/70 transition-colors">NASA/ESA/CSA/STScI</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
