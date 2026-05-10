<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/wasm-loader';

	let { children } = $props();

	onMount(async () => {
		// Load WASM modules upfront (Rust 300KB + Zig 2.7KB)
		try {
			await initWasm();
		} catch (err) {
			console.error('WASM init failed:', err);
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

	<!-- og:image / twitter:image are rendered SOLELY by +page.svelte.
	     Reason: cross-platform crawlers (X / FB / LinkedIn / Slack) handle
	     duplicate og:image tags inconsistently — some take the first, some
	     the last. Single source = consistent rendering. The layout still
	     owns og:type / og:description / twitter:card / twitter:description
	     because those don't vary per-repo. -->
	<meta property="og:type" content="website" />
	<meta property="og:description" content="The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie." />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:description" content="The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie." />
</svelte:head>

<!-- Version badge -->
<div class="fixed top-4 left-4 z-50">
	<a href="https://github.com/Wolfe-Jam/grok-faf-elite/releases"
	   class="inline-flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors text-sm font-mono">
		<span class="text-xs">v0.8</span>
	</a>
</div>

{@render children()}
