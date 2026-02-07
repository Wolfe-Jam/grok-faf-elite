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
	<title>Grok-FAF-Elite</title>
	<meta name="description" content="Score your repo's AI-readiness. Aim for 100% 🏆 Gold Code" />
	<meta name="theme-color" content="#FF8C00" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://zero-faf-builder-amg.vercel.app" />
	<meta property="og:title" content="Make Your Repos AI-Ready" />
	<meta property="og:description" content="Score your AI-readiness. Aim for 100% 🏆 Gold Code — AI Fully Optimized" />
	<meta property="og:image" content="https://zero-faf-builder-amg.vercel.app/og-image.png" />

	<!-- Twitter/X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Make Your Repos AI-Ready" />
	<meta name="twitter:description" content="Score your AI-readiness. Aim for 100% 🏆 Gold Code" />
	<meta name="twitter:image" content="https://zero-faf-builder-amg.vercel.app/og-image.png" />
</svelte:head>

<!-- Version badge -->
<div class="fixed top-4 left-4 z-50">
	<a href="https://github.com/Wolfe-Jam/grok-faf-elite/releases"
	   class="inline-flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors text-sm font-mono">
		<span class="text-xs">v0.7</span>
	</a>
</div>

{@render children()}
