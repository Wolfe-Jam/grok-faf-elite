<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js');
		}
	});
</script>

<svelte:head>
	<title>Grok-FAF-Elite</title>
	<meta name="description" content="Score your repo's AI-readiness. Aim for Big 🍊 105%" />
	<meta name="theme-color" content="#FF8C00" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://zero-faf-builder-amg.vercel.app" />
	<meta property="og:title" content="Make Your Repos AI-Ready" />
	<meta property="og:description" content="Score your AI-readiness. Aim for Big 🍊 105% — The Michelin Star for Repos" />
	<meta property="og:image" content="https://zero-faf-builder-amg.vercel.app/icon-512.png" />

	<!-- Twitter/X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Make Your Repos AI-Ready" />
	<meta name="twitter:description" content="Score your AI-readiness. Aim for Big 🍊 105%" />
	<meta name="twitter:image" content="https://zero-faf-builder-amg.vercel.app/icon-512.png" />
</svelte:head>

{@render children()}
