<script lang="ts">
	// Support/About sidebar component
	// Shows on desktop only, alongside the photo grid
</script>

<aside class="hidden xl:block w-64 shrink-0 space-y-6">
	<!-- About Section -->
	<div class="bg-gray-900/50 rounded-xl p-4 space-y-3">
		<h3 class="text-white font-medium">About</h3>
		<p class="text-gray-400 text-sm leading-relaxed">
			Mars Explorer provides a clean, modern interface for browsing NASA's Mars rover imagery.
		</p>
		<div class="flex items-center gap-2 text-xs text-gray-500">
			<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
			</svg>
			<span>NASA Open Data</span>
		</div>
	</div>

	<!-- Quick Links -->
	<div class="bg-gray-900/50 rounded-xl p-4 space-y-3">
		<h3 class="text-white font-medium">Resources</h3>
		<ul class="space-y-2">
			<li>
				<a
					href="https://mars.nasa.gov"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
					NASA Mars Program
				</a>
			</li>
			<li>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm transition-colors"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					View Source
				</a>
			</li>
		</ul>
	</div>

	<!-- Support -->
	<div class="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-800/50 rounded-xl p-4 space-y-3">
		<h3 class="text-white font-medium">Support This Project</h3>
		<p class="text-gray-300 text-sm">
			Help keep Mars Explorer running and ad-light.
		</p>
		<a
			href="https://ko-fi.com"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
				<path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
			</svg>
			Buy me a coffee
		</a>
	</div>

	<!-- Data Attribution -->
	<div class="text-gray-500 text-xs space-y-1">
		<p>All imagery: NASA/JPL-Caltech</p>
		<p>Not affiliated with NASA</p>
	</div>
</aside>
