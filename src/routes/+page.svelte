<script lang="ts">
	// Portal cards - modular, easy to add more
	const portals = [
		{
			title: 'APOD',
			subtitle: 'Astronomy Picture of the Day',
			description: 'Daily images from across the universe with professional explanations.',
			href: '/apod',
			accent: 'amber',
			icon: 'sun'
		},
		{
			title: 'MARS',
			subtitle: 'Rover Imagery',
			description: 'Surface photos from Perseverance, Curiosity, Opportunity & Spirit.',
			href: '/mars',
			accent: 'red',
			icon: 'planet'
		},
		{
			title: 'TELESCOPES',
			subtitle: 'Deep Space Observation',
			description: 'Imagery from James Webb and Hubble Space Telescopes.',
			href: '/telescopes',
			accent: 'violet',
			icon: 'star'
		},
		{
			title: 'EPIC',
			subtitle: 'Earth Polychromatic Imaging Camera',
			description: 'Full disc Earth imagery from the DSCOVR satellite.',
			href: '/epic',
			accent: 'cyan',
			icon: 'globe'
		}
	];

	const accentColors: Record<string, { border: string; text: string; glow: string; bg: string }> = {
		amber: { border: 'border-amber-500/30', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/20', bg: 'bg-amber-500/10' },
		red: { border: 'border-red-500/30', text: 'text-red-400', glow: 'group-hover:shadow-red-500/20', bg: 'bg-red-500/10' },
		violet: { border: 'border-violet-500/30', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/20', bg: 'bg-violet-500/10' },
		cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/20', bg: 'bg-cyan-500/10' }
	};
</script>

<div class="min-h-screen bg-black flex flex-col relative overflow-hidden">
	<!-- Background grid effect -->
	<div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>

	<!-- Subtle vignette -->
	<div class="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 pointer-events-none"></div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-light tracking-[0.3em] text-white/90 uppercase">Cosmic Mirror</h1>
					<p class="text-xs tracking-[0.2em] text-white/30 uppercase mt-1">NASA Imagery Portal</p>
				</div>
				<div class="flex items-center gap-4">
					<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
					<span class="text-xs tracking-wider text-white/40 uppercase">Online</span>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Portal Grid -->
	<main class="relative z-10 flex-1 flex items-center px-8 py-12">
		<div class="w-full max-w-7xl mx-auto">
			<!-- Section label -->
			<div class="flex items-center gap-4 mb-8">
				<div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
				<span class="text-xs tracking-[0.3em] text-white/30 uppercase">Select Database</span>
				<div class="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent"></div>
			</div>

			<div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
				{#each portals as portal}
					{@const colors = accentColors[portal.accent]}
					<a
						href={portal.href}
						class="group relative bg-white/[0.02] backdrop-blur-sm border {colors.border} hover:border-white/20 transition-all duration-300 hover:shadow-lg {colors.glow} overflow-hidden"
					>
						<!-- Corner accents -->
						<div class="absolute top-0 left-0 w-4 h-4 border-t border-l {colors.border}"></div>
						<div class="absolute top-0 right-0 w-4 h-4 border-t border-r {colors.border}"></div>
						<div class="absolute bottom-0 left-0 w-4 h-4 border-b border-l {colors.border}"></div>
						<div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r {colors.border}"></div>

						<!-- Content -->
						<div class="p-6 space-y-4">
							<!-- Header row -->
							<div class="flex items-start justify-between">
								<div class="space-y-1">
									<h2 class="text-lg font-medium tracking-wider text-white/90 uppercase">
										{portal.title}
									</h2>
									<p class="text-[10px] tracking-wider {colors.text} uppercase">
										{portal.subtitle}
									</p>
								</div>
								<!-- Icon -->
								<div class="w-10 h-10 {colors.bg} flex items-center justify-center">
									{#if portal.icon === 'sun'}
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<circle cx="12" cy="12" r="5" stroke-width="1.5"/>
											<path stroke-width="1.5" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
										</svg>
									{:else if portal.icon === 'planet'}
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<circle cx="12" cy="12" r="9" stroke-width="1.5"/>
											<ellipse cx="12" cy="12" rx="9" ry="3" stroke-width="1" opacity="0.5"/>
										</svg>
									{:else if portal.icon === 'star'}
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-width="1.5" d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
										</svg>
									{:else}
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<circle cx="12" cy="12" r="9" stroke-width="1.5"/>
											<path stroke-width="1" d="M12 3a9 9 0 0 0 0 18M3 12h18" opacity="0.5"/>
										</svg>
									{/if}
								</div>
							</div>

							<!-- Divider -->
							<div class="h-px bg-white/5"></div>

							<!-- Description -->
							<p class="text-sm text-white/40 leading-relaxed">
								{portal.description}
							</p>

							<!-- Action row -->
							<div class="flex items-center justify-between pt-2">
								<span class="text-[10px] tracking-wider text-white/20 uppercase">Access</span>
								<div class="flex items-center gap-2 text-white/40 group-hover:text-white/70 transition-colors">
									<span class="text-xs tracking-wider uppercase">Enter</span>
									<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>

						<!-- Hover scan line effect -->
						<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
							<div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
				<p class="text-xs tracking-wider text-white/30">
					Data: <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-white/70 transition-colors">NASA</a> · Unofficial project
				</p>
				<a
					href="https://ko-fi.com/avactus"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 hover:border-white/20 text-white/50 hover:text-white/70 text-xs tracking-wider uppercase transition-all"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>
					Support
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes scan {
		0% { top: 0; }
		100% { top: 100%; }
	}
	.animate-scan {
		animation: scan 2s ease-in-out infinite;
	}
</style>
