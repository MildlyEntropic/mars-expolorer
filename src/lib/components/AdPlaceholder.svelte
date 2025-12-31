<script lang="ts">
	// Carbon Ads placeholder component
	// To activate: Replace this with actual Carbon Ads script
	// Sign up at https://www.carbonads.net/

	interface Props {
		location?: 'footer' | 'sidebar';
	}

	let { location = 'footer' }: Props = $props();
</script>

{#if location === 'footer'}
	<!-- Footer ad: horizontal banner -->
	<div class="carbon-ads-placeholder flex items-center justify-center py-4">
		<!--
			To integrate Carbon Ads:
			1. Sign up at https://www.carbonads.net/
			2. Get your script tag
			3. Replace this div with:
			<script
				async
				type="text/javascript"
				src="//cdn.carbonads.com/carbon.js?serve=YOUR_CODE&placement=YOUR_SITE"
				id="_carbonads_js">
			</script>
		-->
		<div class="text-gray-600 text-xs">
			<!-- Placeholder - remove when ad is live -->
		</div>
	</div>
{:else}
	<!-- Sidebar ad: vertical/square -->
	<div class="carbon-ads-placeholder hidden lg:block">
		<!-- Same Carbon integration as above -->
		<div class="text-gray-600 text-xs">
			<!-- Placeholder - remove when ad is live -->
		</div>
	</div>
{/if}

<style>
	/* Carbon Ads default styling override to match dark theme */
	:global(#carbonads) {
		font-family: inherit;
		max-width: 330px;
		border-radius: 8px;
		background: rgb(31 41 55 / 0.5);
		border: 1px solid rgb(55 65 81);
		padding: 1rem;
	}

	:global(#carbonads a) {
		color: rgb(249 115 22);
		text-decoration: none;
	}

	:global(#carbonads a:hover) {
		color: rgb(251 146 60);
	}

	:global(.carbon-text) {
		color: rgb(156 163 175);
		font-size: 0.875rem;
	}

	:global(.carbon-poweredby) {
		color: rgb(107 114 128);
		font-size: 0.75rem;
	}
</style>
