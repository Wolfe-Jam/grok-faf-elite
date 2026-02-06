<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import BigOrange from '$lib/components/BigOrange.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import BiSyncPost from '$lib/components/BiSyncPost.svelte';
	import ScoreRepo from '$lib/components/ScoreRepo.svelte';
	import { isWasmReady } from '$lib/wasm-loader';

	// Environment configuration
	const mcpServerUrl = 'https://grok-faf-mcp.vercel.app/sse';
	const templateRepoUrl = 'https://github.com/wolfe-jam/grok-faf-elite';

	// Modal states
	let showNewProject = $state(false);
	let showGithub = $state(false);
	let showDirectUrl = $state(false);
	let showBiSync = $state(false);
	let showScore = $state(false);
	let showHelp = $state(false);

	// Form inputs
	let projectName = $state('my-faf-project');
	let githubUrl = $state('');
	let scoreRepoUrl = $state('https://github.com/Wolfe-Jam/test-faf-demo');

	// Recent URLs (dropdown memory)
	let recentUrls = $state<string[]>([]);
	let showRecentDropdown = $state(false);
	let showLiveExample = $state(true);

	// Real score display (updated after scoring)
	let currentScore = $state<number | null>(null);
	let currentRepoName = $state<string>('');
	let currentRepoOwner = $state<string>('');
	let currentGenTime = $state<number>(0);
	let currentScoreTime = $state<number>(0);
	let currentMissingFields = $state<string[]>([]);
	let currentFafContent = $state<string>('');
	let isPanelExpanded = $state(false);
	let showDownloadTip = $state(false);
	let showMissingFieldsTip = $state(false);
	let showReadmeForm = $state(false);
	let readmeUpdates = $state<Record<string, string>>({});
	let howCheckboxes = $state<string[]>([]);
	let howOtherText = $state('');

	// Reactive check for form data (Svelte 5 needs $derived for deep object reactivity)
	let hasFormData = $derived(Object.keys(readmeUpdates).length > 0);

	// Button should be black when form is open OR has data
	let shouldRecalculate = $derived.by(() => {
		const result = showReadmeForm || hasFormData;
		console.log('🔍 shouldRecalculate:', { showReadmeForm, hasFormData, result, showScore });
		return result;
	});

	// Load recent URLs from localStorage on mount
	import { onMount } from 'svelte';
	onMount(() => {
		const saved = localStorage.getItem('faf_recent_urls');
		if (saved) {
			try {
				recentUrls = JSON.parse(saved);
			} catch {}
		}
	});

	// Save URL to recent list
	function saveToRecent(url: string) {
		if (!url || !url.includes('github.com')) return;
		// Remove if already exists
		recentUrls = recentUrls.filter(u => u !== url);
		// Add to front, limit to 10
		recentUrls = [url, ...recentUrls].slice(0, 10);
		// Save to localStorage
		localStorage.setItem('faf_recent_urls', JSON.stringify(recentUrls));
	}

	// Select from recent
	function selectRecent(url: string) {
		scoreRepoUrl = url;
		showRecentDropdown = false;
		if (!isWasmReady()) {
			alert('⏳ WASM loading... Please wait a moment and try again.');
			return;
		}
		saveToRecent(url);
		showScore = true;
	}

	// Download project.faf
	function downloadFile() {
		const blob = new Blob([currentFafContent], { type: 'application/vnd.faf+yaml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'project.faf';
		a.click();
		URL.revokeObjectURL(url);
	}

	// Share on X
	function shareToX() {
		if (currentScore === null) return;
		const tier = currentScore >= 100 ? '🏆' : currentScore >= 85 ? '🥉' : currentScore >= 70 ? '🟢' : '🟡';
		const text = encodeURIComponent(
			`${currentRepoOwner}/${currentRepoName} scored ${currentScore}% on FAF AI-readiness! ${tier}

${currentScore >= 100 ? 'Gold Code achieved!' : 'On the path to Gold Code!'}

Check your score: https://builder.faf.one

#FAF #GoldCode #AIReadiness`
		);
		window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
	}

	// Get placeholder text for README form fields
	function getPlaceholder(field: string): string {
		const placeholders: Record<string, string> = {
			who: 'Built by @username | Maintained by CompanyName team | Contributors welcome',
			what: 'A lightning-fast [tool type] that [key benefit]. Works with [tech stack]. Supports [features].',
			why: 'This project solves [problem] by [solution]. Built because existing tools didn\'t [key feature]. Designed for [use case].',
			where: 'Runs on Node.js 18+ | Browser compatible | Deployed at [url] | Works in production/staging/local',
			when: 'Active development since 2024 | v1.0 stable | Roadmap: [upcoming features] | Last updated: [date]',
			how: 'Mobile app | Website | CLI tool | REST API | Chrome extension'
		};
		return placeholders[field] || '';
	}

	// Clipboard feedback
	let copiedNew = $state(false);
	let copiedGithub = $state(false);
	let copiedUrl = $state(false);

	// Generate commands
	function getNewProjectCommand(): string {
		const name = projectName.trim() || 'my-faf-project';
		return `npx create-faf-app ${name}\ncd ${name}\nnpm run dev`;
	}

	function getGithubCommands(): string {
		if (!githubUrl.trim()) return '';
		try {
			const url = new URL(githubUrl);
			const pathParts = url.pathname.split('/').filter(Boolean);
			const repoName = pathParts[1] || 'repo';
			return `git clone ${githubUrl}\ncd ${repoName}\nnpx grok-faf-mcp init\ngit add . && git commit -m "Add FAF" && git push`;
		} catch {
			return '';
		}
	}

	// Copy to clipboard
	async function copyToClipboard(text: string, setter: (v: boolean) => void) {
		try {
			await navigator.clipboard.writeText(text);
			setter(true);
			setTimeout(() => setter(false), 2000);
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			setter(true);
			setTimeout(() => setter(false), 2000);
		}
	}
</script>

<main class="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
	<!-- Score Display Panel - Expandable with smooth animations -->
	<div class="w-full max-w-md mb-8">
		<div class="bg-muted/30 border-2 border-white/10 rounded-xl overflow-hidden min-h-[320px]">
			{#if currentScore !== null}
				<!-- Compact Header (Always Visible) -->
				<button
					onclick={() => isPanelExpanded = !isPanelExpanded}
					class="w-full p-6 text-center hover:bg-white/5 transition-colors duration-200 cursor-pointer"
				>
					<p class="text-xs text-muted-foreground mb-3">YOUR SCORE</p>
					<div class="text-5xl mb-2">{currentScore >= 100 ? '🏆' : currentScore >= 85 ? '🥉' : currentScore >= 70 ? '🟢' : '🟡'}</div>
					<div class="text-4xl font-bold {currentScore >= 100 ? 'text-green-500' : currentScore >= 70 ? 'text-green-500' : 'text-yellow-500'} mb-1">{currentScore}%</div>
					<div class="text-sm text-muted-foreground mb-1">{currentScore >= 100 ? 'Gold Code' : currentScore >= 85 ? 'Bronze' : currentScore >= 70 ? 'Green' : 'Yellow'}</div>
					<div class="text-xs text-foreground mb-3">{currentRepoOwner}/{currentRepoName}</div>

					<!-- Progress bar -->
					<div class="w-full bg-muted-foreground/20 rounded-full h-2 mb-3 overflow-hidden">
						<div class="h-full rounded-full bg-green-500 transition-all duration-500" style="width: {Math.min(currentScore, 100)}%"></div>
					</div>

					<!-- Toggle Triangle (Right Side) -->
					<div class="flex justify-end">
						<div class="text-white text-lg transition-transform duration-300" style="transform: rotate({isPanelExpanded ? '180deg' : '0deg'})">
							▼
						</div>
					</div>
				</button>

				<!-- Expandable Details Section -->
				{#if isPanelExpanded}
					<div transition:slide={{ duration: 400, easing: quintOut }} class="border-t border-muted-foreground/20">
						<div class="p-6 space-y-4">
							<!-- DOUBLE-WHAMMY Performance -->
							<div class="p-4 rounded-lg bg-black border border-white/10">
								<p class="text-sm font-bold text-primary mb-2">✅⚡ DOUBLE-WHAMMY Performance:</p>
								<div class="text-xs text-foreground space-y-1">
									<div>🦀⚡️ Generated in {currentGenTime.toFixed(2)}ms by Rust WASM (312KB)</div>
									<div>👻⚡ Scored in {currentScoreTime.toFixed(2)}μs by Zig WASM (2.7KB)</div>
									<div class="text-muted-foreground mt-2">71,428 scores/second • 314.7KB total</div>
								</div>
							</div>

							<!-- Missing Fields (if any) -->
							{#if currentMissingFields.length > 0 && currentScore < 100}
								<div class="space-y-2">
									<div class="p-4 rounded-lg bg-black border border-white/10">
										<div class="flex items-start justify-between mb-2">
											<p class="text-sm font-bold text-foreground">
												Missing Context ({currentMissingFields.length} fields to reach 100%):
											</p>
											<button
												onclick={() => showMissingFieldsTip = !showMissingFieldsTip}
												class="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-white/10
													hover:bg-white/5 transition-colors duration-200 cursor-pointer
													focus:outline-none focus:ring-2 focus:ring-primary/50"
												title="Show examples"
											>
												💡
											</button>
										</div>
										<ul class="text-xs text-muted-foreground space-y-1">
											{#each currentMissingFields as field}
												<li>• {field.toUpperCase()}: Add to README for better AI context</li>
											{/each}
										</ul>
									</div>

									<!-- Example Snackbar (All 6 W's) -->
									{#if showMissingFieldsTip}
										<div transition:slide={{ duration: 300 }} class="relative text-xs text-foreground bg-black border border-primary/30 rounded-lg p-4 select-text">
											<button
												onclick={() => showMissingFieldsTip = false}
												class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
												title="Close"
											>
												✕
											</button>
											<p class="font-semibold mb-3 text-primary">💡 The 6 W's - Examples of what AI loves:</p>
											<div class="space-y-3 text-muted-foreground select-text">
												<!-- WHO -->
												<div>
													<p class="font-semibold text-foreground mb-1">WHO (Team/Author):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"Built by @username | Maintained by CompanyName team | Contributors welcome"
													</div>
												</div>

												<!-- WHAT -->
												<div>
													<p class="font-semibold text-foreground mb-1">WHAT (Description):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"A lightning-fast [tool type] that [key benefit]. Works with [tech stack]. Supports [features]."
													</div>
												</div>

												<!-- WHY -->
												<div>
													<p class="font-semibold text-foreground mb-1">WHY (Purpose):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"This project solves [problem] by [solution]. Built because existing tools didn't [key feature]. Designed for [use case]."
													</div>
												</div>

												<!-- WHERE -->
												<div>
													<p class="font-semibold text-foreground mb-1">WHERE (Environment):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"Runs on Node.js 18+ | Browser compatible | Deployed at [url] | Works in production/staging/local"
													</div>
												</div>

												<!-- WHEN -->
												<div>
													<p class="font-semibold text-foreground mb-1">WHEN (Timeline/Status):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"Active development since 2024 | v1.0 stable | Roadmap: [upcoming features] | Last updated: [date]"
													</div>
												</div>

												<!-- HOW -->
												<div>
													<p class="font-semibold text-foreground mb-1">HOW (App Type):</p>
													<div class="bg-muted/20 rounded p-2 text-[10px] select-text">
														"Website | SaaS | Desktop app | Mobile app | CLI tool | Chrome extension | MCP server | REST API"
													</div>
												</div>
											</div>
											<p class="text-[10px] text-muted-foreground mt-3">
												Add these sections to your README, then regenerate for 100% Gold Code! 🏆
											</p>
										</div>
									{/if}
								</div>
							{/if}

							<!-- README Improvement Form (if missing fields) -->
							{#if currentMissingFields.length > 0 && currentScore < 100}
								<div class="p-4 rounded-lg bg-black border border-primary/30">
									{#if !showReadmeForm}
										<!-- Use Case Question -->
										<p class="text-sm font-bold text-foreground mb-3 text-center">
											Do we have your USE-CASE covered?
										</p>
										<div class="flex gap-3 mb-3">
											<button
												onclick={() => {
													// User says YES - just commit as-is (form stays hidden)
													showReadmeForm = false;
												}}
												class="flex-1 py-2 px-4 bg-green-500/20 border border-green-500 text-green-400 font-semibold rounded-lg
													hover:bg-green-500/30 transition-colors duration-200 cursor-pointer"
											>
												✅ YES
											</button>
											<button
												onclick={() => showReadmeForm = true}
												class="flex-1 py-2 px-4 bg-primary/20 border border-primary text-primary font-semibold rounded-lg
													hover:bg-primary/30 transition-colors duration-200 cursor-pointer"
											>
												📝 NO, tell us!
											</button>
										</div>
										<p class="text-xs text-muted-foreground text-center">
											Missing: {currentMissingFields.map(f => f.toUpperCase()).join(', ')}
										</p>
									{:else}
										<!-- Form Header -->
										<div class="flex items-center justify-between mb-3">
											<p class="text-sm font-bold text-primary">📝 Auto-Improve README to 100%</p>
											<button
												onclick={() => showReadmeForm = false}
												class="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
											>
												✕ Cancel
											</button>
										</div>
										<p class="text-xs text-muted-foreground mb-3">
											Fill in missing sections below. We'll update your README automatically when you commit.
										</p>
									{/if}

									{#if showReadmeForm}
										<div transition:slide={{ duration: 300 }} class="space-y-3">
											{#each currentMissingFields as field}
												<div>
													<label class="block text-xs font-semibold text-foreground mb-1">
														{field.toUpperCase()}:
														<span class="text-muted-foreground font-normal">
															{#if field === 'who'}
																(Team/Author)
															{:else if field === 'what'}
																(Project Description)
															{:else if field === 'why'}
																(Purpose/Mission)
															{:else if field === 'where'}
																(Environment)
															{:else if field === 'when'}
																(Timeline/Status)
															{:else if field === 'how'}
																(App Type)
															{/if}
														</span>
													</label>

													{#if field === 'how'}
														<!-- Checkboxes for HOW -->
														<div class="space-y-2">
															{#each ['Website', 'SaaS', 'Desktop app', 'Mobile app', 'CLI tool', 'Chrome extension', 'MCP server', 'REST API'] as appType}
																<label class="flex items-center gap-2 text-xs text-foreground cursor-pointer">
																	<input
																		type="checkbox"
																		value={appType}
																		checked={howCheckboxes.includes(appType)}
																		onchange={(e) => {
																			if (e.currentTarget.checked) {
																				howCheckboxes = [...howCheckboxes, appType];
																			} else {
																				howCheckboxes = howCheckboxes.filter(t => t !== appType);
																			}
																			const allTypes = [...howCheckboxes];
																			if (howOtherText) allTypes.push(howOtherText);
																			readmeUpdates[field] = allTypes.join(' | ');
																		}}
																		class="w-4 h-4 rounded border-white/10 bg-muted/20 text-primary
																			focus:ring-2 focus:ring-primary/50 cursor-pointer"
																	/>
																	{appType}
																</label>
															{/each}

															<!-- Other option with text input -->
															<div class="flex items-start gap-2">
																<input
																	type="checkbox"
																	checked={howOtherText !== ''}
																	onchange={(e) => {
																		if (!e.currentTarget.checked) {
																			howOtherText = '';
																			readmeUpdates[field] = howCheckboxes.join(' | ');
																		}
																	}}
																	class="mt-1 w-4 h-4 rounded border-white/10 bg-muted/20 text-primary
																		focus:ring-2 focus:ring-primary/50 cursor-pointer"
																/>
																<div class="flex-1">
																	<label class="text-xs text-foreground">Other:</label>
																	<input
																		type="text"
																		bind:value={howOtherText}
																		oninput={() => {
																			const allTypes = [...howCheckboxes];
																			if (howOtherText) allTypes.push(howOtherText);
																			readmeUpdates[field] = allTypes.join(' | ');
																		}}
																		placeholder="Your app type"
																		class="w-full mt-1 p-2 bg-muted/20 border border-white/10 rounded text-xs text-foreground
																			focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
																	/>
																</div>
															</div>
														</div>
													{:else}
														<!-- Textarea for other fields -->
														<textarea
															id="readme-{field}"
															bind:value={readmeUpdates[field]}
															placeholder={getPlaceholder(field)}
															class="w-full p-2 bg-muted/20 border border-white/10 rounded text-xs text-foreground
																focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30
																font-mono resize-none"
															rows={2}
														></textarea>
													{/if}
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}

							<!-- Action Buttons -->
							<div class="space-y-3">
								<!-- Recalculate Score (NEW - only shows when form open or has data) -->
								{#if shouldRecalculate}
									<button
										onclick={async () => {
											console.log('🔄 Recalculating with form data...');
											try {
												// Fetch original README
												const readmeResponse = await fetch(
													`https://raw.githubusercontent.com/${currentRepoOwner}/${currentRepoName}/main/README.md`
												);
												let enhancedReadme = readmeResponse.ok ? await readmeResponse.text() : '';

												// Append form data sections
												const sections: string[] = [];
												if (readmeUpdates.who) sections.push(`\n\n## Team\n\n${readmeUpdates.who}`);
												if (readmeUpdates.what) sections.push(`\n\n## What\n\n${readmeUpdates.what}`);
												if (readmeUpdates.why) sections.push(`\n\n## Purpose\n\n${readmeUpdates.why}`);
												if (readmeUpdates.where) sections.push(`\n\n## Environment\n\n${readmeUpdates.where}`);
												if (readmeUpdates.when) sections.push(`\n\n## Timeline\n\n${readmeUpdates.when}`);
												if (readmeUpdates.how) sections.push(`\n\n## How\n\n${readmeUpdates.how}`);
												enhancedReadme += sections.join('');

												// Fetch package.json
												const packageResponse = await fetch(
													`https://raw.githubusercontent.com/${currentRepoOwner}/${currentRepoName}/main/package.json`
												);
												const packageJson = packageResponse.ok ? await packageResponse.text() : null;

												// Fresh generation
												const { generateAndScore } = await import('$lib/wasm-loader');
												const result = await generateAndScore(
													currentRepoOwner,
													currentRepoName,
													null,
													enhancedReadme,
													packageJson
												);

												// Update display
												currentFafContent = result.fafContent;
												currentScore = result.score;
												currentGenTime = result.genTime;
												currentScoreTime = result.scoreTime;
												currentMissingFields = result.missingFields;

												console.log('✅ Recalculated score:', currentScore + '%');
											} catch (err) {
												console.error('⚠️ Recalculation failed:', err);
											}
										}}
										class="w-full py-3 px-6 bg-black text-white font-bold rounded-xl
											hover:bg-black/80 transition-colors duration-200
											focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
									>
										🔄 Recalculate Score
									</button>
								{/if}

								<!-- Add to GitHub -->
								<button
									onclick={async () => {
										// If user filled form, regenerate with enhanced README for accurate score
										if (hasFormData) {
											console.log('🔄 Regenerating with form data for fresh score...');
											try {
												// Fetch original README
												const readmeResponse = await fetch(
													`https://raw.githubusercontent.com/${currentRepoOwner}/${currentRepoName}/main/README.md`
												);
												let enhancedReadme = readmeResponse.ok ? await readmeResponse.text() : '';

												// Append form data as new sections
												const sections: string[] = [];
												if (readmeUpdates.who) sections.push(`\n\n## Team\n\n${readmeUpdates.who}`);
												if (readmeUpdates.what) sections.push(`\n\n## What\n\n${readmeUpdates.what}`);
												if (readmeUpdates.why) sections.push(`\n\n## Purpose\n\n${readmeUpdates.why}`);
												if (readmeUpdates.where) sections.push(`\n\n## Environment\n\n${readmeUpdates.where}`);
												if (readmeUpdates.when) sections.push(`\n\n## Timeline\n\n${readmeUpdates.when}`);
												if (readmeUpdates.how) sections.push(`\n\n## How\n\n${readmeUpdates.how}`);
												enhancedReadme += sections.join('');

												// Fetch package.json
												const packageResponse = await fetch(
													`https://raw.githubusercontent.com/${currentRepoOwner}/${currentRepoName}/main/package.json`
												);
												const packageJson = packageResponse.ok ? await packageResponse.text() : null;

												// Fresh generation with enhanced README
												const { generateAndScore } = await import('$lib/wasm-loader');
												const result = await generateAndScore(
													currentRepoOwner,
													currentRepoName,
													null,
													enhancedReadme,
													packageJson
												);

												// Update with fresh results
												currentFafContent = result.fafContent;
												currentScore = result.score;
												currentGenTime = result.genTime;
												currentScoreTime = result.scoreTime;
												currentMissingFields = result.missingFields;

												console.log('✅ Fresh score:', currentScore + '%');
											} catch (err) {
												console.error('⚠️ Regeneration failed, using original:', err);
											}
										}

										// Store for OAuth callback
										sessionStorage.setItem('faf_generation', JSON.stringify({
											owner: currentRepoOwner,
											repo: currentRepoName,
											fafContent: currentFafContent,
											score: currentScore,
											genTime: currentGenTime,
											scoreTime: currentScoreTime,
											missingFields: currentMissingFields,
											readmeUpdates: readmeUpdates
										}));
										// Redirect to OAuth
										const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
										const redirectUri = `${window.location.origin}/auth/callback`;
										window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
									}}
									class="w-full py-3 px-4 bg-[#6e5494] text-white font-bold rounded-lg
										hover:bg-[#5a4379] transition-colors duration-200
										focus:outline-none focus:ring-2 focus:ring-[#6e5494]/50
										cursor-pointer flex items-center justify-center gap-2"
								>
									<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
									</svg>
									Add to GitHub
								</button>

								<!-- Download -->
								<div class="space-y-2">
									<div class="flex items-center gap-2">
										<button
											onclick={downloadFile}
											class="flex-1 py-3 px-4 bg-[#1a1a1a] text-white font-semibold rounded-lg border border-white/10
												hover:bg-[#252525] transition-colors duration-200
												focus:outline-none focus:ring-2 focus:ring-white/20
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
										<div transition:slide={{ duration: 300 }} class="text-xs text-foreground bg-black border border-primary/30 rounded-lg p-3">
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
										focus:outline-none focus:ring-2 focus:ring-white/50
										flex items-center justify-center gap-2 cursor-pointer"
								>
									<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
									Share Your Score
								</button>
							</div>
						</div>
					</div>
				{/if}

			{:else if !showLiveExample}
				<!-- 0% Ready State -->
				<div class="p-6 text-center">
					<p class="text-xs text-muted-foreground mb-3">READY TO SCORE</p>
					<div class="text-5xl mb-2">⚪</div>
					<div class="text-4xl font-bold text-white mb-1">0%</div>
					<div class="text-sm text-muted-foreground mb-1">Enter repo URL to score</div>
					<div class="w-full bg-muted-foreground/20 rounded-full h-2 mt-4 overflow-hidden">
						<div class="h-full rounded-full bg-muted-foreground/50" style="width: 0%"></div>
					</div>
				</div>

			{:else}
				<!-- Default 100% Example -->
				<div class="p-6 text-center">
					<p class="text-sm font-bold text-white mb-3">1-Click> CONTEXT!</p>
					<div class="text-5xl mb-2">🏆</div>
					<div class="text-4xl font-bold text-green-500 mb-1">100%</div>
					<div class="text-sm text-muted-foreground mb-1">Gold Code - AI Fully Optimized</div>
					<a
						href="https://github.com/Wolfe-Jam/grok-faf-elite"
						target="_blank"
						rel="noopener"
						class="text-xs text-primary hover:underline"
					>
						grok-faf-elite
					</a>
					<div class="w-full bg-muted-foreground/20 rounded-full h-2 mt-4 overflow-hidden">
						<div class="h-full rounded-full bg-green-500" style="width: 100%"></div>
					</div>
				</div>
			{/if}
		</div>
		<!-- Repo URL Input - TRUE 1-CLICK -->
		<div class="mt-4 relative">
			<input
				type="text"
				bind:value={scoreRepoUrl}
				onfocus={() => {
					showScore = false; // Clear old results for fresh start
					showLiveExample = false; // Reset to 0%
					if (recentUrls.length > 0) showRecentDropdown = true;
				}}
				oninput={() => {
					showLiveExample = false; // Reset to 0% when typing
				}}
				onblur={() => setTimeout(() => showRecentDropdown = false, 200)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						if (!isWasmReady()) {
							alert('⏳ WASM loading... Please wait a moment and try again.');
							return;
						}
						saveToRecent(scoreRepoUrl);
						showScore = true;
						showRecentDropdown = false;
					}
				}}
				autocomplete="off"
				spellcheck="false"
				class="w-full px-4 py-3 pr-12 bg-background border-2 border-muted-foreground/50 rounded-lg
					focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50
					text-white text-sm font-medium
					transition-all duration-200 cursor-text"
				aria-label="GitHub Repository URL"
			/>
			{#if scoreRepoUrl}
				<button
					type="button"
					onclick={() => scoreRepoUrl = ''}
					class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
						bg-muted-foreground/20 hover:bg-muted-foreground/30
						flex items-center justify-center
						transition-colors duration-200
						focus:outline-none focus:ring-2 focus:ring-primary/50"
					aria-label="Clear URL"
				>
					<svg class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			{/if}

			<!-- Recent URLs Dropdown -->
			{#if showRecentDropdown && recentUrls.length > 0}
				<div class="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-sm">
					<div class="px-3 py-2 text-xs text-muted-foreground border-b border-white/10">
						Recent repos
					</div>
					<div class="max-h-64 overflow-y-auto">
						{#each recentUrls as url}
							<button
								type="button"
								onclick={() => selectRecent(url)}
								class="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-white/5 transition-colors duration-150 flex items-center gap-2 cursor-pointer"
							>
								<svg class="w-4 h-4 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								<span class="truncate">{url.replace('https://github.com/', '')}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Primary CTA (Always Orange - Initial Scoring Only) -->
	<div class="w-full max-w-md mb-4">
		<button
			onclick={async () => {
				if (!isWasmReady()) {
					alert('⏳ WASM loading... Please wait a moment and try again.');
					return;
				}

				// Save to recent and trigger scoring
				saveToRecent(scoreRepoUrl);
				showScore = true;
			}}
			class="w-full py-4 px-6 font-bold text-lg rounded-xl transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background cursor-pointer
				bg-primary text-black hover:bg-primary/90 focus:ring-primary/50"
		>
			Score Your Repo
		</button>
	</div>

	<!-- Share on X - Right after score -->
	<div class="w-full max-w-md mb-8">
		<button
			onclick={() => showBiSync = true}
			class="w-full py-3 px-6 bg-black text-white font-semibold rounded-xl border border-white/20
				hover:bg-black/80 hover:border-white/40 transition-all duration-200
				focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background
				flex items-center justify-center gap-2"
		>
			<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
			</svg>
			Share Your Score
		</button>
	</div>

	<!-- Secondary Actions -->
	<div class="w-full max-w-xl space-y-4">

		<ActionButton
			onclick={() => showNewProject = true}
			label="New Project"
			description="Create a fresh FAF-ready project from template"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 5v14M5 12h14" />
				</svg>
			{/snippet}
		</ActionButton>

		<ActionButton
			onclick={() => showGithub = true}
			label="Add to GitHub Repo"
			description="Add FAF to an existing GitHub repository"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
				</svg>
			{/snippet}
		</ActionButton>

		<ActionButton
			onclick={() => showDirectUrl = true}
			label="Direct MCP URL"
			description="Get the grok-faf-mcp server URL for Grok"
		>
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
				</svg>
			{/snippet}
		</ActionButton>

		<!-- Tagline -->
		<p class="text-center text-primary font-semibold mt-6">
			Get dotFaffed — context-on-demand, 1-click FAST⚡️AF
		</p>
	</div>

	<!-- Footer -->
	<footer class="mt-12 text-center text-sm text-muted-foreground">
		<p>
			Powered by <a href="https://www.npmjs.com/package/grok-faf-mcp" target="_blank" rel="noopener" class="text-primary hover:underline">grok-faf-mcp</a>
			 ·
			<a href={templateRepoUrl} target="_blank" rel="noopener" class="text-primary hover:underline">GitHub</a>
		</p>
		<p class="mt-8 text-xs italic text-muted-foreground/70">
			"AI context needed a file format, so I built one" — wolfejam, .faf inventor
		</p>
		<p class="mt-4 text-xs italic text-muted-foreground/70">
			"It's so logical if it didn't exist, AI would have built it itself" — Claude
		</p>
	<p class="mt-6 text-sm text-white">
		Built for Grok <span class="text-green-500">💚</span> Dedicated to <a href="https://x.com/elonmusk" target="_blank" rel="noopener" class="text-white hover:underline">@elonmusk</a> and <a href="https://x.com/xai" target="_blank" rel="noopener" class="text-white hover:underline">@xAI</a>
	</p>
		<p class="mt-6">
			<a href="https://faf.one" target="_blank" rel="noopener" class="text-primary hover:underline">faf.one</a>
		</p>
	</footer>
</main>

<!-- New Project Modal -->
<Modal open={showNewProject} onclose={() => showNewProject = false} title="New FAF Project">
	<div class="space-y-4">
		<!-- Commands first - ready to go -->
		<pre class="bg-black rounded-lg p-4 text-sm overflow-x-auto font-mono"><code class="text-green-400">{getNewProjectCommand()}</code></pre>

		<button
			onclick={() => copyToClipboard(getNewProjectCommand(), (v) => copiedNew = v)}
			class="w-full py-3 px-4 bg-primary text-black font-bold rounded-lg
				hover:bg-primary/90 transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
		>
			{copiedNew ? '✓ Copied!' : 'Copy & Go'}
		</button>

		<!-- Edit name - secondary -->
		<div class="pt-2 border-t border-muted-foreground/20">
			<div class="flex items-center gap-2">
				<input
					id="projectName"
					type="text"
					bind:value={projectName}
					class="flex-1 px-3 py-2 bg-background border border-muted-foreground/20 rounded-lg text-sm
						focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
						text-foreground"
				/>
				<button
					onclick={() => projectName = 'my-faf-project'}
					class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
</Modal>

<!-- GitHub Modal -->
<Modal open={showGithub} onclose={() => showGithub = false} title="Add FAF to GitHub Repo">
	<div class="space-y-4">
		<div>
			<label for="githubUrl" class="block text-sm font-medium text-muted-foreground mb-2">
				GitHub Repository URL
			</label>
			<input
				id="githubUrl"
				type="url"
				bind:value={githubUrl}
				placeholder="https://github.com/username/repo"
				class="w-full px-4 py-2 bg-background border border-muted-foreground/20 rounded-lg
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
					text-foreground placeholder-muted-foreground"
			/>
		</div>
		{#if getGithubCommands()}
			<div>
				<p class="block text-sm font-medium text-muted-foreground mb-2">
					Run these commands
				</p>
				<pre class="bg-background border border-muted-foreground/20 rounded-lg p-4 text-sm overflow-x-auto"><code class="text-green-400">{getGithubCommands()}</code></pre>
			</div>
			<button
				onclick={() => copyToClipboard(getGithubCommands(), (v) => copiedGithub = v)}
				class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
					hover:bg-primary/90 transition-colors duration-200
					focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
			>
				{copiedGithub ? '✓ Copied!' : 'Copy Commands'}
			</button>
		{:else}
			<p class="text-sm text-muted-foreground text-center py-4">
				Enter a GitHub URL to generate commands
			</p>
		{/if}
	</div>
</Modal>

<!-- Direct URL Modal -->
<Modal open={showDirectUrl} onclose={() => showDirectUrl = false} title="MCP Server URL">
	<div class="space-y-4">
		<p class="text-sm text-muted-foreground">
			Use this URL to connect Grok directly to the FAF MCP server:
		</p>
		<div class="bg-background border border-muted-foreground/20 rounded-lg p-4">
			<code class="text-primary break-all">{mcpServerUrl}</code>
		</div>
		<button
			onclick={() => copyToClipboard(mcpServerUrl, (v) => copiedUrl = v)}
			class="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg
				hover:bg-primary/90 transition-colors duration-200
				focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-muted"
		>
			{copiedUrl ? '✓ Copied!' : 'Copy URL'}
		</button>
		<p class="text-xs text-muted-foreground">
			Add this URL in Grok's MCP settings to enable FAF context awareness.
		</p>
	</div>
</Modal>

<!-- Bi-Sync Post Modal -->
<Modal open={showBiSync} onclose={() => showBiSync = false} title="Share on X">
	<BiSyncPost />
</Modal>

<!-- Score Repo - Inline (no modal) -->
{#if showScore}
	<div class="hidden">
		{#key scoreRepoUrl}
			<ScoreRepo initialUrl={scoreRepoUrl} onScoreComplete={(data) => {
				currentScore = data.score;
				currentRepoName = data.repoName;
				currentRepoOwner = data.repoOwner;
				currentGenTime = data.genTime;
				currentScoreTime = data.scoreTime;
				currentMissingFields = data.missingFields;
				currentFafContent = data.fafContent;
				showScore = false;
				isPanelExpanded = true; // Auto-expand after scoring
			}} />
		{/key}
	</div>
{/if}

<!-- Help Modal -->
<Modal open={showHelp} onclose={() => showHelp = false} title="How This Works">
	<div class="space-y-6 text-sm">
		<!-- What is this? -->
		<div>
			<h3 class="font-bold text-primary mb-2">What is "Get dotFaffed"?</h3>
			<p class="text-muted-foreground">
				Adding AI context to your projects so Grok (and other AIs) can understand your codebase instantly.
				No more re-explaining your project every conversation.
			</p>
		</div>

		<!-- Why? -->
		<div>
			<h3 class="font-bold text-primary mb-2">Why do I need this?</h3>
			<ul class="list-disc list-inside space-y-1 text-muted-foreground">
				<li>Grok reads your project.faf file and knows everything about your repo</li>
				<li>Context persists forever - no drift, no re-explaining</li>
				<li>Works with Claude, Cursor, Gemini, and other AI tools</li>
				<li>Your AI-readiness score shows how well AIs can understand your code</li>
			</ul>
		</div>

		<!-- How to use -->
		<div>
			<h3 class="font-bold text-primary mb-2">How to use this site:</h3>

			<div class="space-y-3 ml-4">
				<!-- Score -->
				<div>
					<p class="font-semibold text-foreground">🏆 Score Your Repo</p>
					<p class="text-muted-foreground text-xs mt-1">
						Enter any GitHub repo URL to see its AI-readiness score (0-100%).
						Aim for 85%+ (Bronze tier) for production-ready AI context.
					</p>
				</div>

				<!-- Share -->
				<div>
					<p class="font-semibold text-foreground">𝕏 Share Your Score</p>
					<p class="text-muted-foreground text-xs mt-1">
						Post your AI-readiness score to X (Twitter) and show off your optimized codebase.
					</p>
				</div>

				<!-- New Project -->
				<div>
					<p class="font-semibold text-foreground">➕ New Project</p>
					<p class="text-muted-foreground text-xs mt-1">
						Start fresh with a FAF-ready project template. Comes with project.faf built-in.
					</p>
				</div>

				<!-- Add to GitHub -->
				<div>
					<p class="font-semibold text-foreground">📁 Add to GitHub Repo</p>
					<p class="text-muted-foreground text-xs mt-1">
						<strong>0% doesn't mean you have a bad Repo. It means AI knows nothing about it.</strong> It has to "figure it out" from scratch every time. FAF tells it what it is in 5ms.
					</p>
				</div>

				<!-- Direct URL -->
				<div>
					<p class="font-semibold text-foreground">🔗 Direct MCP URL</p>
					<p class="text-muted-foreground text-xs mt-1">
						Get the grok-faf-mcp server URL to connect Grok directly to FAF tools.
						Add to Grok's MCP settings for instant FAF awareness.
					</p>
				</div>
			</div>
		</div>

		<!-- Bottom tagline -->
		<div class="pt-4 border-t border-muted-foreground/20">
			<p class="text-xs text-muted-foreground italic text-center">
				Instant AI context for your Repos — FAST⚡️AF
			</p>
		</div>
	</div>
</Modal>
