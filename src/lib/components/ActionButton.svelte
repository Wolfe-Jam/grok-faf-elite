<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		icon: Snippet;
		label: string;
		description: string;
		disabled?: boolean;
	}

	let { onclick, icon, label, description, disabled = false }: Props = $props();
</script>

<button
	class="group relative w-full p-6 bg-muted rounded-xl border border-muted-foreground/20
		hover:border-primary/50 hover:bg-muted/80 transition-all duration-200
		disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-muted-foreground/20
		focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
	{onclick}
	{disabled}
	type="button"
>
	<div class="flex items-start gap-4">
		<div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center
			group-hover:bg-primary/20 transition-colors duration-200">
			<span class="text-primary w-5 h-5">
				{@render icon()}
			</span>
		</div>
		<div class="text-left">
			<h3 class="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
				{label}
			</h3>
			<p class="text-sm text-muted-foreground mt-1">
				{description}
			</p>
		</div>
	</div>
	<div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
		<svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	</div>
</button>
