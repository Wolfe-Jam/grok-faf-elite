<script lang="ts">
	let message = $state('');
	let charCount = $derived(message.length);

	const defaultTemplate = `Just scored my repo on FAF AI-readiness! 🏆

Score yours: https://zero-faf-builder-amg.vercel.app

@grok @xai
#AI #DevTools #dotFaffed #GoldCode`;

	function useTemplate() {
		message = defaultTemplate;
	}

	function shareToX() {
		if (!message.trim()) return;
		const text = encodeURIComponent(message);
		window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
	}

	// Load template on mount
	$effect(() => {
		if (!message) {
			message = defaultTemplate;
		}
	});
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<p class="text-sm text-muted-foreground">
			Compose your post
		</p>
		<button
			onclick={useTemplate}
			class="text-xs text-primary hover:underline"
			type="button"
		>
			Reset template
		</button>
	</div>

	<div class="relative">
		<textarea
			bind:value={message}
			placeholder="What's happening with your project?"
			rows="6"
			class="w-full px-4 py-3 bg-background border border-muted-foreground/20 rounded-lg
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
				text-foreground placeholder-muted-foreground resize-none"
		></textarea>
		<span
			class="absolute bottom-3 right-3 text-xs"
			class:text-muted-foreground={charCount <= 280}
			class:text-red-500={charCount > 280}
		>
			{charCount}/280
		</span>
	</div>

	<button
		onclick={shareToX}
		disabled={!message.trim() || charCount > 280}
		class="w-full py-3 px-4 bg-black text-white font-bold rounded-lg border border-white/20
			hover:bg-black/80 hover:border-white/40 transition-all duration-200
			focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background
			disabled:opacity-50 disabled:cursor-not-allowed
			flex items-center justify-center gap-2"
	>
		<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
		Post to X
	</button>
</div>
