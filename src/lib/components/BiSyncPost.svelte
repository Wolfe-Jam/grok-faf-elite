<script lang="ts">
	let message = $state('');
	let posting = $state(false);
	let result = $state<{ success: boolean; tweetId?: string; error?: string } | null>(null);
	let charCount = $derived(message.length);

	const defaultTemplate = `🍊 Just synced my project with FAF!

Zero faff from day zero — AI-ready context in one click.

Try it: https://grok-faf-mcp.vercel.app

#FAF #AI #DevTools`;

	function useTemplate() {
		message = defaultTemplate;
	}

	async function postToX() {
		if (!message.trim() || charCount > 280) return;

		posting = true;
		result = null;

		try {
			const response = await fetch('/api/post', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: message })
			});

			result = await response.json();

			if (result?.success) {
				message = '';
			}
		} catch (err) {
			result = {
				success: false,
				error: err instanceof Error ? err.message : 'Failed to post'
			};
		} finally {
			posting = false;
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<p class="text-sm text-muted-foreground">
			Share your bi-sync on X
		</p>
		<button
			onclick={useTemplate}
			class="text-xs text-primary hover:underline"
			type="button"
		>
			Use template
		</button>
	</div>

	<div class="relative">
		<textarea
			bind:value={message}
			placeholder="What's happening with your project?"
			rows="4"
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

	{#if result}
		<div
			class="p-3 rounded-lg text-sm {result.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}"
		>
			{#if result.success}
				Posted successfully!
				{#if result.tweetId}
					<a
						href={`https://x.com/i/web/status/${result.tweetId}`}
						target="_blank"
						rel="noopener"
						class="underline ml-1"
					>
						View tweet
					</a>
				{/if}
			{:else}
				{result.error || 'Failed to post'}
			{/if}
		</div>
	{/if}

	<button
		onclick={postToX}
		disabled={posting || !message.trim() || charCount > 280}
		class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
			hover:bg-primary/90 transition-colors duration-200
			focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted
			disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{posting ? 'Posting...' : 'Post to X'}
	</button>
</div>
