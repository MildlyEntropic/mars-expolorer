<script lang="ts">
	import type { ProcessedEPICImage } from './+page.server';

	let { data } = $props();

	let naturalImages: ProcessedEPICImage[] = $state(data.naturalImages || []);
	let enhancedImages: ProcessedEPICImage[] = $state(data.enhancedImages || []);
	let activeTab: 'natural' | 'enhanced' = $state('natural');
	let selectedImage: ProcessedEPICImage | null = $state(null);

	let displayImages = $derived(activeTab === 'natural' ? naturalImages : enhancedImages);

	function handleImageClick(image: ProcessedEPICImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>EPIC - Cosmic Mirror</title>
	<meta name="description" content="View full disc imagery of Earth from NASA's EPIC camera aboard the DSCOVR satellite." />
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
					<span class="text-xs tracking-[0.2em] text-cyan-400/70 uppercase">EPIC</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/30 uppercase">Earth Polychromatic Imaging Camera</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Description -->
		<div class="max-w-2xl mx-auto text-center">
			<p class="text-white/40 text-sm leading-relaxed">
				Full disc imagery from the DSCOVR satellite at the L1 Lagrange point, approximately 1.5 million kilometers from Earth.
			</p>
		</div>

		<!-- Tab Switcher -->
		<div class="flex justify-center gap-2">
			<button
				type="button"
				class="px-4 py-2 text-xs tracking-wider uppercase transition-all {activeTab === 'natural' ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'bg-white/[0.02] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'}"
				onclick={() => activeTab = 'natural'}
			>
				Natural Color
			</button>
			<button
				type="button"
				class="px-4 py-2 text-xs tracking-wider uppercase transition-all {activeTab === 'enhanced' ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'bg-white/[0.02] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'}"
				onclick={() => activeTab = 'enhanced'}
			>
				Enhanced Color
			</button>
		</div>

		<!-- Image Grid -->
		<section class="space-y-6">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Images</span>
				<div class="h-px flex-1 bg-white/5"></div>
				<span class="text-[10px] tracking-wider text-white/30">{displayImages.length} available</span>
			</div>

			{#if displayImages.length > 0}
				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{#each displayImages as image (image.id)}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 cursor-pointer text-left transition-all duration-300"
							onclick={() => handleImageClick(image)}
						>
							<img
								src={image.thumbnailUrl}
								alt={image.caption}
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div class="absolute bottom-0 left-0 right-0 p-3">
									<p class="text-white/70 text-[10px] tracking-wider">{formatDate(image.date)}</p>
								</div>
							</div>

							<!-- Corner accent on hover -->
							<div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-20 text-white/30">
					<p class="text-xs tracking-wider uppercase">No images available</p>
				</div>
			{/if}
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/30 text-center">
				Data: <a href="https://epic.gsfc.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-cyan-400/50 hover:text-cyan-400/70 transition-colors">NASA EPIC</a>
			</p>
		</div>
	</footer>
</div>

<!-- Lightbox -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<!-- Corner accents -->
		<div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
		<div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50"></div>
		<div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50"></div>
		<div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>

		<button
			type="button"
			class="absolute top-6 right-6 text-white/40 hover:text-white/70 transition-colors"
			onclick={closeLightbox}
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<div class="max-w-4xl w-full space-y-6">
			<img
				src={selectedImage.imageUrl}
				alt={selectedImage.caption}
				class="w-full h-auto max-h-[70vh] object-contain"
			/>
			<div class="text-center space-y-2">
				<p class="text-white/90 text-sm tracking-wider">{formatDate(selectedImage.date)}</p>
				<p class="text-white/40 text-xs leading-relaxed">{selectedImage.caption}</p>
				<p class="text-white/30 text-[10px] tracking-wider uppercase">
					Centroid: {selectedImage.centroid.lat.toFixed(2)}° lat, {selectedImage.centroid.lon.toFixed(2)}° lon
				</p>
			</div>
		</div>
	</div>
{/if}
