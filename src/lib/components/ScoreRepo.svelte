<script lang="ts">
	/**
	 * ScoreRepo - ONE-CLICK FAF Builder
	 *
	 * STEP A: Generate + Score + Commit (or Download)
	 * STEP B: Improve to 100% if needed
	 */

	import { onMount } from 'svelte';
	import { isWasmReady, generateAndScore } from '$lib/wasm-loader';

	// Props
	interface Props {
		initialUrl?: string;
		formData?: Record<string, string>;  // Form data for README enhancement (recalculation)
		onScoreComplete?: (data: {
			score: number;
			repoName: string;
			repoOwner: string;
			genTime: number;
			scoreTime: number;
			missingFields: string[];
			fafContent: string;
		}) => void;
	}
	let { initialUrl = 'https://github.com/Wolfe-Jam/test-faf-demo', formData, onScoreComplete }: Props = $props();

	// State
	let loading = $state(false);
	let score = $state<number | null>(null);
	let fafContent = $state('');
	let repoOwner = $state('');
	let repoName = $state('');
	let genTime = $state(0);
	let scoreTime = $state(0);
	let missingFields = $state<string[]>([]);
	let error = $state('');
	let showDownloadTip = $state(false);

	// Tier system
	function getTier(s: number): { emoji: string; name: string; color: string; note?: string } {
		if (s >= 105) return { emoji: '🍊', name: 'Big Orange', color: 'text-orange-500', note: 'The Michelin Star for Repos' };
		if (s >= 100) return { emoji: '🏆', name: 'Trophy', color: 'text-yellow-400', note: 'Gold Code - Perfect Score!' };
		if (s >= 99) return { emoji: '🥇', name: 'Gold', color: 'text-yellow-300' };
		if (s >= 95) return { emoji: '🥈', name: 'Silver', color: 'text-gray-300' };
		if (s >= 85) return { emoji: '🥉', name: 'Bronze', color: 'text-amber-600' };
		if (s >= 70) return { emoji: '🟢', name: 'Green', color: 'text-green-500' };
		if (s >= 55) return { emoji: '🟡', name: 'Yellow', color: 'text-yellow-500' };
		return { emoji: '🔴', name: 'Needs Work', color: 'text-red-500' };
	}

	const tier = $derived(score !== null ? getTier(score) : null);

	// Auto-run on mount
	onMount(() => {
		generateAndScoreRepo();
	});

	/**
	 * STEP A: Generate and score
	 */
	async function generateAndScoreRepo() {
		if (!initialUrl.trim()) return;

		loading = true;
		error = '';
		score = null;

		try {
			// Parse GitHub URL
			const url = new URL(initialUrl);
			const pathParts = url.pathname.split('/').filter(Boolean);
			if (pathParts.length < 2) {
				throw new Error('Invalid GitHub URL');
			}

			repoOwner = pathParts[0];
			repoName = pathParts[1];

			// Check WASM ready
			if (!isWasmReady()) {
				throw new Error('WASM not loaded yet - please wait');
			}

			// Fetch repo metadata
			const repoResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`);
			if (!repoResponse.ok) {
				throw new Error(repoResponse.status === 404 ? 'Repository not found' : `GitHub API error: ${repoResponse.status}`);
			}

			const repoData = await repoResponse.json();
			const description = repoData.description || null;
			const language = repoData.language || null;

			// Fetch README
			const readmeResponse = await fetch(
				`https://api.github.com/repos/${repoOwner}/${repoName}/readme`,
				{ headers: { 'Accept': 'application/vnd.github.v3.raw' } }
			);
			let readme = readmeResponse.ok ? await readmeResponse.text() : null;

			// Enhance README with form data if provided (for recalculation)
			if (formData && readme) {
				const sections: string[] = [];
				if (formData.who) sections.push(`\n\n## Team\n\n${formData.who}`);
				if (formData.what) sections.push(`\n\n## What\n\n${formData.what}`);
				if (formData.why) sections.push(`\n\n## Purpose\n\n${formData.why}`);
				if (formData.where) sections.push(`\n\n## Environment\n\n${formData.where}`);
				if (formData.when) sections.push(`\n\n## Timeline\n\n${formData.when}`);
				if (formData.how) sections.push(`\n\n## How\n\n${formData.how}`);
				const enhancement = sections.join('');
				readme += enhancement;
				console.log('📝 Enhanced README with form data:', Object.keys(formData));
				console.log('📝 Added to README:', enhancement);
				console.log('📖 Final README length:', readme.length);
			}

			// Fetch dependency file based on language
			let dependencyFile = null;
			let dependencyType = 'unknown';

			// Python: Try requirements.txt, pyproject.toml, setup.py
			if (language === 'Python') {
				const pythonFiles = ['requirements.txt', 'pyproject.toml', 'setup.py'];
				for (const file of pythonFiles) {
					const response = await fetch(
						`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${file}`
					);
					if (response.ok) {
						dependencyFile = await response.text();
						dependencyType = file;
						console.log(`✅ Found ${file} for Python project`);
						break;
					}
				}
			}
			// JavaScript/TypeScript: package.json
			else if (language === 'JavaScript' || language === 'TypeScript') {
				const response = await fetch(
					`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/package.json`
				);
				if (response.ok) {
					dependencyFile = await response.text();
					dependencyType = 'package.json';
					console.log('✅ Found package.json for JavaScript/TypeScript project');
				}
			}
			// Rust: Cargo.toml
			else if (language === 'Rust') {
				const response = await fetch(
					`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/Cargo.toml`
				);
				if (response.ok) {
					dependencyFile = await response.text();
					dependencyType = 'Cargo.toml';
					console.log('✅ Found Cargo.toml for Rust project');
				}
			}
			// Go: go.mod
			else if (language === 'Go') {
				const response = await fetch(
					`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/go.mod`
				);
				if (response.ok) {
					dependencyFile = await response.text();
					dependencyType = 'go.mod';
					console.log('✅ Found go.mod for Go project');
				}
			}
			// Ruby: Gemfile
			else if (language === 'Ruby') {
				const response = await fetch(
					`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/Gemfile`
				);
				if (response.ok) {
					dependencyFile = await response.text();
					dependencyType = 'Gemfile';
					console.log('✅ Found Gemfile for Ruby project');
				}
			}

			if (!dependencyFile) {
				console.log(`⚠️ No dependency file found for ${language || 'unknown'} project`);
			}

			// Generate with RUST-WASM + Score with ZIG-WASM
			console.log('🦀 Calling RUST-WASM to generate project.faf...');
			const result = await generateAndScore(repoOwner, repoName, description, readme, dependencyFile, language);
			console.log('✅ WASM complete:', {
				score: result.score,
				genTime: result.genTime + 'ms',
				scoreTime: result.scoreTime + 'μs',
				contentLength: result.fafContent.length + ' bytes'
			});

			// Store results
			fafContent = result.fafContent;
			score = result.score;
			genTime = result.genTime;
			scoreTime = result.scoreTime;
			missingFields = result.missingFields;

			// Notify parent of score completion
			if (onScoreComplete) {
				onScoreComplete({
					score: result.score,
					repoName,
					repoOwner,
					genTime: result.genTime,
					scoreTime: result.scoreTime,
					missingFields: result.missingFields,
					fafContent: result.fafContent
				});
			}

		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate project.faf';
		} finally {
			loading = false;
		}
	}

	/**
	 * Add to GitHub via OAuth
	 */
	function addToGitHub() {
		// Store data for OAuth callback
		sessionStorage.setItem('faf_generation', JSON.stringify({
			owner: repoOwner,
			repo: repoName,
			fafContent,
			score,
			genTime,
			scoreTime,
			missingFields
		}));

		// Trigger OAuth
		const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
		const redirectUri = `${window.location.origin}/auth/callback`;
		const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

		window.location.href = authUrl;
	}

	/**
	 * Download file as fallback
	 */
	function downloadFile() {
		const blob = new Blob([fafContent], { type: 'application/vnd.faf+yaml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'project.faf';
		a.click();
		URL.revokeObjectURL(url);
	}

	/**
	 * Share on X
	 */
	function shareToX() {
		if (score === null || !tier) return;

		const text = encodeURIComponent(
			`${repoName} scored ${score}% on FAF AI-readiness! ${tier.emoji}

${score >= 100 ? 'Gold Code achieved!' : 'On the path to Gold Code!'}

Check your score: https://builder.faf.one

#FAF #GoldCode #AIReadiness`
		);

		window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
	}
</script>

<div class="space-y-4">
	{#if loading}
		<!-- Loading State (no spinners - too fast!) -->
		<div class="text-center py-8">
			<p class="text-lg font-semibold text-foreground">Initializing... RUST-WASM executed faf init</p>
			<p class="text-sm text-muted-foreground mt-2">Making your repo AI-ready...</p>
		</div>

	{:else if error}
		<!-- Error State -->
		<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
			<p class="text-sm font-semibold text-red-400">{error}</p>
		</div>

	{:else if score !== null}
		<!-- Result Display -->
		<div class="text-center py-6">
			<div class="text-6xl mb-4">{tier?.emoji}</div>
			<div class="text-xl font-bold text-foreground mb-3">{repoOwner}/{repoName}</div>
			<div class="text-5xl font-bold {tier?.color} mb-2">{score}%</div>
			<div class="text-lg text-muted-foreground">{tier?.name}</div>
			{#if tier?.note}
				<div class="text-xs text-primary mt-1">{tier.note}</div>
			{/if}
		</div>

		<!-- Performance Stats -->
		<div class="p-4 rounded-lg bg-black border border-white/10">
			<p class="text-sm font-bold text-primary mb-2">✅⚡ DOUBLE-WHAMMY Performance:</p>
			<div class="text-xs text-foreground space-y-1">
				<div>🦀⚡️ Generated in {genTime.toFixed(2)}ms by Rust WASM (312KB)</div>
				<div>👻⚡ Scored in {scoreTime.toFixed(2)}μs by Zig WASM (2.7KB)</div>
				<div class="text-muted-foreground mt-2">71,428 scores/second • 314.7KB total</div>
			</div>
		</div>

		<!-- Missing Fields (STEP B - Improvement) -->
		{#if missingFields.length > 0 && score < 100}
			<div class="p-4 rounded-lg bg-black border border-white/10">
				<p class="text-sm font-bold text-foreground mb-2">
					Missing Context ({missingFields.length} fields to reach 100%):
				</p>
				<ul class="text-xs text-muted-foreground space-y-1">
					{#each missingFields as field}
						<li>• {field.toUpperCase()}: Add to README for better AI context</li>
					{/each}
				</ul>
				<p class="text-xs text-primary mt-3">
					💡 Tip: Improve your README with these details, then regenerate!
				</p>
			</div>
		{/if}

		<!-- Progress bar -->
		<div class="w-full bg-muted-foreground/20 rounded-full h-3 overflow-hidden">
			<div
				class="h-full rounded-full transition-all duration-500 bg-green-500"
				style="width: {Math.min(score, 100)}%"
			></div>
		</div>

		<!-- Action Buttons -->
		<div class="space-y-3 pt-4">
			<!-- Primary: Add to GitHub -->
			<button
				onclick={addToGitHub}
				class="w-full py-3 px-4 bg-primary text-black font-bold rounded-lg
					hover:bg-primary/90 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background
					cursor-pointer"
			>
				🚀 Add to GitHub
			</button>

			<!-- Secondary: Download -->
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<button
						onclick={downloadFile}
						class="flex-1 py-3 px-4 bg-[#1a1a1a] text-white font-semibold rounded-lg border border-white/10
							hover:bg-[#252525] transition-colors duration-200
							focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-background
							cursor-pointer"
					>
						💾 Download project.faf
					</button>
					<button
						onclick={() => showDownloadTip = !showDownloadTip}
						class="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10
							hover:bg-white/5 transition-colors duration-200 cursor-pointer
							focus:outline-none focus:ring-2 focus:ring-primary/50"
						title="Save location help"
					>
						💡
					</button>
				</div>
				{#if showDownloadTip}
					<div class="text-xs text-foreground bg-black border border-primary/30 rounded-lg p-3 animate-in fade-in duration-200">
						<p class="font-semibold mb-1 text-primary">📍 Save location:</p>
						<p class="text-muted-foreground">Save <code class="text-primary">project.faf</code> in your repo root folder (where README.md is located)</p>
						<p class="text-muted-foreground mt-2 text-[10px]">
							Tip: Enable "Ask where to save" in browser settings to choose location
						</p>
					</div>
				{/if}
			</div>

			<!-- Share on X -->
			<button
				onclick={shareToX}
				class="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg border border-white/20
					hover:bg-black/80 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background
					flex items-center justify-center gap-2 cursor-pointer"
			>
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
				</svg>
				Share Your Score
			</button>
		</div>
	{/if}
</div>
