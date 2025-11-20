<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		title: string;
		children: Snippet;
	}

	let { open, onclose, title, children }: Props = $props();
	let dialogEl: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialogEl) return;

		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) {
			onclose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	class="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent p-0 m-auto
		max-w-lg w-full open:animate-in open:fade-in-0 open:zoom-in-95"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	onclose={onclose}
>
	<div class="bg-muted border border-muted-foreground/20 rounded-xl p-6 shadow-2xl">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-bold text-foreground">{title}</h2>
			<button
				onclick={onclose}
				class="w-8 h-8 rounded-lg flex items-center justify-center
					hover:bg-muted-foreground/10 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-primary/50"
				aria-label="Close modal"
				type="button"
			>
				<svg class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="text-foreground">
			{@render children()}
		</div>
	</div>
</dialog>

<style>
	@keyframes animate-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	dialog[open] {
		animation: animate-in 0.2s ease-out;
	}
</style>
