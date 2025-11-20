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
	<meta name="description" content="Zero faff from day zero — Grok-ready in one click" />
	<meta name="theme-color" content="#FF8C00" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="icon" href="/icon.svg" type="image/svg+xml" />
</svelte:head>

{@render children()}
