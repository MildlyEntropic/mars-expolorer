<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Google AdSense component
	// To activate:
	// 1. Sign up at https://www.google.com/adsense/
	// 2. Replace YOUR_PUB_ID with your ca-pub-XXXXXXX ID
	// 3. Replace YOUR_AD_SLOT with your ad unit slot ID

	interface Props {
		location?: 'footer' | 'sidebar';
	}

	let { location = 'footer' }: Props = $props();

	// Google AdSense IDs
	const AD_CLIENT = 'ca-pub-1831808995712219'; // Your publisher ID
	const AD_SLOT = 'XXXXXXXXXX'; // Your ad slot ID

	let adLoaded = $state(false);

	onMount(() => {
		// Only load ads in production and if IDs are configured
		if (browser && AD_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX') {
			try {
				((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
				adLoaded = true;
			} catch (e) {
				console.error('AdSense error:', e);
			}
		}
	});
</script>

<svelte:head>
	{#if browser && AD_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX'}
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={AD_CLIENT}"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

{#if location === 'footer'}
	<!-- Footer ad: horizontal banner -->
	<div class="adsense-container flex items-center justify-center py-4">
		{#if AD_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX'}
			<ins
				class="adsbygoogle"
				style="display:block"
				data-ad-client={AD_CLIENT}
				data-ad-slot={AD_SLOT}
				data-ad-format="horizontal"
				data-full-width-responsive="true"
			></ins>
		{:else}
			<div class="text-gray-500 text-xs">
				<!-- Ad placeholder - configure AdSense IDs to activate -->
			</div>
		{/if}
	</div>
{:else}
	<!-- Sidebar ad: vertical/square -->
	<div class="adsense-container hidden lg:block">
		{#if AD_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX'}
			<ins
				class="adsbygoogle"
				style="display:block"
				data-ad-client={AD_CLIENT}
				data-ad-slot={AD_SLOT}
				data-ad-format="auto"
				data-full-width-responsive="true"
			></ins>
		{:else}
			<div class="text-gray-500 text-xs">
				<!-- Ad placeholder - configure AdSense IDs to activate -->
			</div>
		{/if}
	</div>
{/if}

<style>
	.adsense-container {
		min-height: 90px;
	}

	:global(.adsbygoogle) {
		background: transparent;
	}
</style>
