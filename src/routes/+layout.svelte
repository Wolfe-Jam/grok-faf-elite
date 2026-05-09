<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/wasm-loader';

	let { children } = $props();

	onMount(async () => {
		// Load WASM modules upfront (Rust 300KB + Zig 2.7KB)
		try {
			await initWasm();
			console.log('✅ DOUBLE-WHAMMY loaded: Rust + Zig WASM ready');
		} catch (err) {
			console.error('❌ WASM init failed:', err);
		}

		// Service worker
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js');
		}
	});
</script>

<svelte:head>
	<title>builder.faf.one — Score your repo's AI-readiness</title>
	<meta name="description" content="The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie." />
	<meta name="theme-color" content="#0a0a0a" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />

	<!-- Default OG meta lives here. +page.svelte overrides og:image and
	     twitter:image when ?repo=<owner>/<repo> is in the URL — dynamic
	     per-repo card is rendered by mcpaas.live/og/<owner>/<repo>.png. -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://builder.faf.one" />
	<meta property="og:title" content="builder.faf.one — Score your repo's AI-readiness" />
	<meta property="og:description" content="The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie." />
	<meta property="og:image" content="https://mcpaas.live/og/Wolfe-Jam/faf-cli.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="builder.faf.one — Score your repo's AI-readiness" />
	<meta name="twitter:description" content="The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie." />
	<meta name="twitter:image" content="https://mcpaas.live/og/Wolfe-Jam/faf-cli.png" />
</svelte:head>

<!-- Version badge -->
<div class="fixed top-4 left-4 z-50">
	<a href="https://github.com/Wolfe-Jam/grok-faf-elite/releases"
	   class="inline-flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors text-sm font-mono">
		<span class="text-xs">v0.8</span>
	</a>
</div>

{@render children()}
