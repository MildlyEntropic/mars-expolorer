<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const siteUrl = 'https://cosmicmirror.vercel.app';
	const siteName = 'Cosmic Mirror';
	const siteDescription = 'A gateway to NASA imagery. Explore Mars rovers, James Webb Space Telescope, Hubble, and Astronomy Picture of the Day. Browse thousands of real photos from Perseverance, Curiosity, JWST, and more.';
	const siteKeywords = 'NASA, space, Mars, rover, Perseverance, Curiosity, JWST, James Webb, Hubble, APOD, space telescope, astronomy, space photos, NASA images, space exploration, Mars photos, deep space, galaxies, nebula';
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{siteName} - NASA Space Imagery</title>
	<meta name="title" content="{siteName} - NASA Space Imagery" />
	<meta name="description" content={siteDescription} />
	<meta name="keywords" content={siteKeywords} />
	<meta name="author" content="Cosmic Mirror" />
	<meta name="robots" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="revisit-after" content="1 days" />

	<!-- Favicon -->
	<link rel="icon" href={favicon} />
	<link rel="icon" type="image/svg+xml" href={favicon} />

	<!-- Canonical URL -->
	<link rel="canonical" href={siteUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:title" content="{siteName} - NASA Space Imagery" />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content="{siteUrl}/og-image.svg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={siteUrl} />
	<meta name="twitter:title" content="{siteName} - NASA Space Imagery" />
	<meta name="twitter:description" content={siteDescription} />
	<meta name="twitter:image" content="{siteUrl}/og-image.svg" />

	<!-- Additional SEO -->
	<meta name="theme-color" content="#030712" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content={siteName} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "${siteName}",
		"description": "${siteDescription}",
		"url": "${siteUrl}",
		"applicationCategory": "EducationalApplication",
		"operatingSystem": "Any",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		},
		"author": {
			"@type": "Person",
			"name": "Cosmic Mirror"
		},
		"provider": {
			"@type": "Organization",
			"name": "NASA",
			"url": "https://nasa.gov"
		},
		"about": {
			"@type": "Thing",
			"name": "Space Exploration",
			"description": "NASA imagery from Mars rovers, James Webb Space Telescope, Hubble, and APOD"
		},
		"keywords": "${siteKeywords}"
	}
	</script>`}
</svelte:head>

{@render children()}
