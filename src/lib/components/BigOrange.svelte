<script lang="ts">
	let hover = $state(false);
</script>

<div
	class="relative animate-pulse-glow"
	role="img"
	aria-label="Big Orange Logo"
	onmouseenter={() => hover = true}
	onmouseleave={() => hover = false}
>
	<!-- Orange Body -->
	<div class="w-32 h-32 rounded-full relative z-10 flex items-center justify-center overflow-hidden animate-pulse-heart">
		<div class="absolute inset-0 bg-primary shadow-[0_0_50px_rgba(255,165,0,0.3)]"></div>
		<div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
	</div>
	<!-- Green Leaf -->
	<div
		class="absolute -top-6 right-0 z-20 transition-transform duration-200"
		class:rotate-[25deg]={hover}
		class:rotate-[15deg]={!hover}
	>
		<svg class="w-20 h-20 text-green-500 fill-green-500 drop-shadow-md" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
			<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
			<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" />
		</svg>
	</div>
</div>
