<script lang="ts">
	/**
	 * OAuth Callback - ONE-CLICK Architecture
	 *
	 * Retrieves pre-generated .faf from sessionStorage
	 * Commits to GitHub using OAuth token
	 * Shows success with performance stats
	 */

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { buildScoreShareUrl } from '$lib/share';

	let status = $state('Committing to GitHub...');
	let error = $state('');
	let success = $state(false);
	let result = $state<{
		score: number;
		genTime: number;
		scoreTime: number;
		missingFields: string[];
		commitUrl: string;
		owner: string;
		repo: string;
		readmeUpdated?: boolean;
	} | null>(null);

	function getTierEmoji(s: number): string {
		if (s >= 105) return '🍊';
		if (s >= 100) return '🏆';
		if (s >= 99) return '🥇';
		if (s >= 95) return '🥈';
		if (s >= 85) return '🥉';
		if (s >= 70) return '🟢';
		return '🟡';
	}

	function getTierName(s: number): string {
		if (s >= 105) return 'Big Orange';
		if (s >= 100) return 'Trophy';
		if (s >= 99) return 'Gold';
		if (s >= 95) return 'Silver';
		if (s >= 85) return 'Bronze';
		if (s >= 70) return 'Green';
		return 'Yellow';
	}

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');

		if (!code) {
			error = 'Missing authorization code';
			return;
		}

		try {
			// Retrieve generated .faf from sessionStorage
			const storedData = sessionStorage.getItem('faf_generation');
			if (!storedData) {
				throw new Error('Generation data not found. Please try again.');
			}

			const generationData = JSON.parse(storedData);
			const { owner, repo, fafContent, score, genTime, scoreTime, missingFields, readmeUpdates } = generationData;

			// Commit to GitHub using the pre-generated .faf
			const response = await fetch('/api/commit-faf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					owner,
					repo,
					fafContent,
					score,
					genTime,
					scoreTime,
					missingFields,
					readmeUpdates
				})
			});

			const commitResult = await response.json();

			if (commitResult.success) {
				success = true;
				result = {
					score: commitResult.data.score,
					genTime: commitResult.data.genTime,
					scoreTime: commitResult.data.scoreTime,
					missingFields: commitResult.data.missingFields,
					commitUrl: commitResult.data.commitUrl,
					owner: commitResult.data.owner,
					repo: commitResult.data.repo,
					readmeUpdated: commitResult.data.readmeUpdated
				};
				status = commitResult.data.readmeUpdated ? '✅ project.faf & README.md committed!' : '✅ project.faf committed!';

				// Clear sessionStorage
				sessionStorage.removeItem('faf_generation');
			} else {
				error = commitResult.error || 'Failed to commit project.faf';
			}
		} catch (err) {
			console.error('Callback error:', err);
			error = err instanceof Error ? err.message : 'Unknown error';
		}
	});

	function shareToX() {
		if (!result) return;
		window.open(
			buildScoreShareUrl({
				repo: result.repo,
				score: result.score,
				tierEmoji: getTierEmoji(result.score),
				extra: `Generated in ${result.genTime.toFixed(2)}ms by Rust WASM\nScored in ${result.scoreTime.toFixed(2)}μs by Zig WASM`
			}),
			'_blank'
		);
	}
</script>

<main class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
	<div class="max-w-2xl w-full">
		{#if error}
			<!-- Error State -->
			<div class="text-center">
				<div class="text-6xl mb-4">❌</div>
				<h1 class="text-2xl font-bold text-red-500 mb-4">Error</h1>
				<p class="text-muted-foreground mb-6">{error}</p>
				<a
					href="/"
					class="inline-block py-2 px-4 bg-primary text-black font-semibold rounded-lg
						hover:bg-primary/90 transition-colors duration-200"
				>
					Back to Home
				</a>
			</div>
		{:else if success && result}
			<!-- Success State: ONE-CLICK Complete -->
			<div class="space-y-6">
				<!-- Success Header -->
				<div class="text-center">
					<div class="text-6xl mb-4">{getTierEmoji(result.score)}</div>
					<h1 class="text-3xl font-bold text-foreground mb-2">
						{result.readmeUpdated ? '✅ project.faf & README.md committed!' : '✅ project.faf committed!'}
					</h1>
					<p class="text-xl text-primary font-semibold">
						{result.score}% {getTierName(result.score)}
					</p>
					{#if result.readmeUpdated}
						<p class="text-sm text-muted-foreground mt-2">
							README updated with missing context sections
						</p>
					{/if}
				</div>

				<!-- Performance Stats (DOUBLE-WHAMMY) -->
				<div class="bg-primary/10 border-2 border-primary/30 rounded-xl p-6">
					<p class="text-sm font-bold text-primary mb-3 text-center">⚡ DOUBLE-WHAMMY Performance</p>
					<div class="text-sm text-foreground space-y-2">
						<div class="flex items-center justify-between">
							<span>🦀 Rust WASM Generation:</span>
							<span class="font-bold">{result.genTime.toFixed(2)}ms</span>
						</div>
						<div class="flex items-center justify-between">
							<span>⚡ Zig WASM Scoring:</span>
							<span class="font-bold">{result.scoreTime.toFixed(2)}μs</span>
						</div>
						<div class="border-t border-primary/20 pt-2 mt-2 text-xs text-muted-foreground text-center">
							71,428 scores/second • 213.7KB total bundle
						</div>
					</div>
					<a
						href={result.commitUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-4 block text-center text-sm text-primary hover:underline font-semibold"
					>
						View project.faf on GitHub →
					</a>
				</div>

				<!-- Missing Fields (if any) -->
				{#if result.missingFields.length > 0}
					<div class="bg-muted-foreground/10 border border-muted-foreground/20 rounded-xl p-6">
						<h3 class="text-lg font-bold text-foreground mb-3">
							Missing Context ({result.missingFields.length} fields)
						</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Add these to your README for better AI context:
						</p>
						<ul class="text-sm text-foreground space-y-2">
							{#each result.missingFields as field}
								<li class="flex items-start gap-2">
									<span class="text-primary">•</span>
									<span>
										<strong>{field.toUpperCase()}:</strong>
										{#if field === 'who'}
											Who built this? (team, company, contributors)
										{:else if field === 'what'}
											What does this repo do? (one-line description)
										{:else if field === 'why'}
											Why does it exist? (purpose, problem it solves)
										{:else if field === 'where'}
											Where is it used? (production, staging, local)
										{:else if field === 'when'}
											When was it created? (timeline, roadmap)
										{:else if field === 'how'}
											How to use it? (installation, getting started)
										{/if}
									</span>
								</li>
							{/each}
						</ul>
						<div class="mt-4 bg-black rounded-lg p-3 font-mono text-xs text-green-400">
							$ cd {result.repo} && faf go
						</div>
						<p class="text-xs text-muted-foreground text-center mt-2">
							Run this to improve your score to 100%
						</p>
					</div>
				{/if}

				<!-- Improvement Prompt (< 100%) -->
				{#if result.score < 100}
					<div class="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-center">
						<h2 class="text-2xl font-bold text-foreground mb-2">💯 Want 100%?</h2>
						<p class="text-sm text-muted-foreground mb-4">
							Use faf-cli locally for full context analysis:
						</p>
						<div class="bg-black rounded-lg p-4 font-mono text-sm text-green-400 inline-block text-left">
							<div>$ cd {result.repo}</div>
							<div>$ faf go</div>
							<div class="text-xs text-gray-500 mt-2"># Answer questions → Gold Code (100%)</div>
						</div>
					</div>
				{:else}
					<!-- Already 100% -->
					<div class="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-center">
						<h2 class="text-2xl font-bold text-primary mb-2">🏆 Gold Code Achieved!</h2>
						<p class="text-muted-foreground">Your repo is 100% AI-ready. Perfect score.</p>
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex gap-3">
					<button
						onclick={shareToX}
						class="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-lg border border-white/20
							hover:bg-black/80 transition-colors duration-200
							focus:outline-none focus:ring-2 focus:ring-white/50
							flex items-center justify-center gap-2"
					>
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
						Share to X
					</button>
					<a
						href="/"
						class="flex-1 py-3 px-4 bg-primary text-black font-semibold rounded-lg
							hover:bg-primary/90 transition-colors duration-200 text-center"
					>
						Try Another Repo
					</a>
				</div>
			</div>
		{:else}
			<!-- Loading State -->
			<div class="text-center">
				<div class="text-6xl mb-4 animate-spin">🍊</div>
				<h1 class="text-2xl font-bold text-foreground mb-4">{status}</h1>
				<div class="text-sm text-muted-foreground space-y-3">
					<p>Committing project.faf to GitHub...</p>
					<div class="bg-black rounded-lg p-4 font-mono text-xs text-green-400 inline-block text-left">
						<div class="animate-pulse">✓ Generated with Rust WASM (3ms)</div>
						<div class="animate-pulse" style="animation-delay: 0.2s">✓ Scored with Zig WASM (14μs)</div>
						<div class="animate-pulse" style="animation-delay: 0.4s">→ Committing to main branch...</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
