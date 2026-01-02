<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let todayApod: SpaceImage | null = $state(data.todayApod);
	let recentApod: SpaceImage[] = $state(data.recentApod || []);
	let selectedImage: SpaceImage | null = $state(null);

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}
</script>

<svelte:head>
	<title>APOD - Cosmic Mirror</title>
	<meta name="description" content="Explore NASA's Astronomy Picture of the Day archive. A different image of our universe each day." />
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
					<span class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">APOD</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/30 uppercase">Astronomy Picture of the Day</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-12">
		<!-- Today's APOD -->
		{#if todayApod}
			<section class="space-y-4">
				<div class="flex items-center gap-4">
					<span class="text-[10px] tracking-[0.3em] text-amber-400 uppercase">Today's Image</span>
					<div class="h-px flex-1 bg-white/5"></div>
					<span class="text-[10px] tracking-wider text-white/30">{todayApod.date}</span>
				</div>

				<button
					type="button"
					class="relative w-full overflow-hidden bg-white/[0.02] border border-amber-500/20 hover:border-amber-500/40 cursor-pointer group text-left transition-all duration-300"
					onclick={() => handleImageClick(todayApod!)}
				>
					<!-- Corner accents -->
					<div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/50"></div>
					<div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/50"></div>
					<div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/50"></div>
					<div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/50"></div>

					<div class="aspect-video md:aspect-[21/9] relative">
						<img
							src={todayApod.img_src}
							alt={todayApod.title}
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-8">
							<div class="space-y-3">
								<h3 class="text-white text-2xl md:text-3xl font-light tracking-wide">{todayApod.title}</h3>
								<p class="text-white/50 text-sm leading-relaxed line-clamp-2 max-w-3xl">{todayApod.description}</p>
								{#if todayApod.credits}
									<p class="text-white/30 text-xs tracking-wider uppercase">Credit: {todayApod.credits}</p>
								{/if}
							</div>
						</div>

						<!-- View indicator -->
						<div class="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
							<span class="text-[10px] tracking-wider text-white/70 uppercase">View Full</span>
						</div>
					</div>
				</button>
			</section>
		{/if}

		<!-- Recent Archive -->
		{#if recentApod.length > 0}
			<section class="space-y-6">
				<div class="flex items-center gap-4">
					<span class="text-[10px] tracking-[0.3em] text-white/40 uppercase">Archive</span>
					<div class="h-px flex-1 bg-white/5"></div>
					<span class="text-[10px] tracking-wider text-white/30">{recentApod.length - 1} images</span>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{#each recentApod.slice(1) as image (image.id)}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 cursor-pointer text-left transition-all duration-300"
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
									<p class="text-white/50 text-[10px] tracking-wider">{image.date}</p>
									<p class="text-white/90 text-xs font-medium line-clamp-2">{image.title}</p>
								</div>
							</div>

							<!-- Corner accent on hover -->
							<div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>
			</section>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/30 text-center">
				Data: <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-amber-400/50 hover:text-amber-400/70 transition-colors">NASA APOD</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
