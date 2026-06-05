<script lang="ts">
	/**
	 * builder.faf.one — the interview IS the app.
	 * A fixed score dial on top, one interview chat box below it, and a quiet
	 * repo-URL path underneath (paste a repo to score + seed the interview).
	 * Answer the gaps, the dial climbs, you leave with a 100% .faf.
	 */
	import { onMount } from 'svelte';
	import ScoreDial from '$lib/components/ScoreDial.svelte';
	import Interview from '$lib/components/Interview.svelte';
	import { initWasm, isWasmReady, generateAndScore, scoreFaf } from '$lib/wasm-loader';
	import { seedFaf, buildExport } from '$lib/faf-export';

	let faf = $state(seedFaf());
	let score = $state(0);
	let wasmReady = $state(false);
	let demoMode = $state(true);

	// natural demo completion → leave the success screen up (with its "click to
	// start" CTA); just exit demo mode and give it a full idle window.
	function demoFinished() {
		demoMode = false;
		lastActivity = Date.now();
	}
	let repoUrl = $state('');
	let repoOwner = $state('');
	let repoName = $state('');
	let scoring = $state(false);
	let scoreError = $state('');
	let copied = $state(false);
	// true once the user has taken their .faf (download or copy) — only then do we
	// surface "New project", so the success moment stays focused on the win.
	let grabbed = $state(false);

	// Optional "what are you building?" — bonus intent. Does NOT change scoring
	// (the file stays app_type: intent → 100%); the pick is recorded in the
	// context: primer as the TARGET the AI firms up when it fills the real stack.
	// "" = Not sure yet = pure intent. Values are canonical app_types (slots.ts).
	const APP_TYPE_OPTIONS = [
		{ label: 'Not sure yet', value: '' },
		{ label: 'Website', value: 'website' },
		{ label: 'Frontend app', value: 'frontend' },
		{ label: 'Mobile app', value: 'mobile' },
		{ label: 'Browser extension', value: 'extension' },
		{ label: 'CLI tool', value: 'cli' },
		{ label: 'Library', value: 'library' },
		{ label: 'SDK', value: 'sdk' },
		{ label: 'Backend / API', value: 'backend' },
		{ label: 'MCP server', value: 'mcp' },
		{ label: 'Fullstack app', value: 'fullstack' },
		{ label: 'SaaS', value: 'saas' },
		{ label: 'Data science', value: 'data-science' }
	];
	let targetType = $state('');

	// ?nodemo=1 disables the attract demo (and its re-fire) — a test seam for
	// deterministic E2E. Set before wasmReady so the Interview mounts with it off.
	let noDemo = false;
	onMount(async () => {
		noDemo = new URLSearchParams(window.location.search).has('nodemo');
		if (noDemo) demoMode = false;
		try { await initWasm(); } catch (e) { console.error(e); }
		wasmReady = true;
	});

	// attract loop: after 30s of no activity, re-fire the demo — but ONLY from a
	// safe state (untouched start, score===0, or the finished success screen,
	// score>=100), never mid-interview (would wipe a visitor's answers).
	let lastActivity = Date.now();
	const bump = () => { lastActivity = Date.now(); };
	onMount(() => {
		const id = setInterval(() => {
			if (noDemo) return; // test seam: never re-fire the demo
			if (demoMode || Date.now() - lastActivity < 30000) return;
			if (score === 0 || score >= 100) { faf = seedFaf(); demoMode = true; lastActivity = Date.now(); }
		}, 4000);
		return () => clearInterval(id);
	});

	async function scoreRepo() {
		const m = repoUrl.trim().match(/github\.com\/([^/\s]+)\/([^/\s?#]+)/i);
		if (!m) { scoreError = 'Paste a GitHub repo URL.'; return; }
		const owner = m[1];
		const repo = m[2].replace(/\.git$/, '');
		demoMode = false; // stop the demo if it's still running
		scoring = true; scoreError = '';
		try {
			if (!isWasmReady()) await initWasm();
			const raw = (f: string) =>
				fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${f}`)
					.then((r) => (r.ok ? r.text() : null))
					.catch(() => null);
			const [readme, pkg] = await Promise.all([raw('README.md'), raw('package.json')]);
			const result = await generateAndScore(owner, repo, null, readme, pkg);
			faf = result.fafContent;
			score = result.score;
			repoOwner = owner;
			repoName = repo;
		} catch (e) {
			scoreError = 'Could not score that repo — is it public?';
		} finally {
			scoring = false;
		}
	}

	// barge-in / "click to start" / repo "start fresh" → a clean blank interview
	function startFresh() {
		faf = seedFaf();
		demoMode = false;
		lastActivity = Date.now();
		repoUrl = '';
		repoOwner = '';
		repoName = '';
		scoreError = '';
		grabbed = false;
	}

	// Export = the .faf the receiving AI gets. Score the real file, then run the
	// pure transform (src/lib/faf-export). Keeps slotignored (canonical), adds
	// app_type/generated/context only. See faf-format-single-truth-33-slot.
	async function exportFaf(text: string): Promise<string> {
		let pct = 100;
		try { pct = Math.round((await scoreFaf(text)).score); } catch { /* wasm not ready */ }
		return buildExport(text, { pct, target: targetType, stamp: new Date().toISOString() });
	}

	async function downloadFaf() {
		const out = await exportFaf(faf);
		const blob = new Blob([out], { type: 'text/yaml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'project.faf';
		a.click();
		URL.revokeObjectURL(url);
		grabbed = true;
	}

	async function copyFaf() {
		try {
			await navigator.clipboard.writeText(await exportFaf(faf));
			copied = true;
			grabbed = true;
			setTimeout(() => (copied = false), 1500);
		} catch { /* clipboard blocked */ }
	}
</script>

<svelte:head>
	<title>builder.faf.one — make your AI happy</title>
</svelte:head>

<!-- any activity resets the idle clock (so the attract loop only fires when truly idle) -->
<svelte:window onmousemove={bump} onkeydown={bump} ontouchstart={bump} onscroll={bump} onpointerdown={bump} />

<div class="mx-auto max-w-md px-4 pb-20">
	<!-- score: fixed at the top, always in view -->
	<div class="sticky top-0 z-10 flex justify-center bg-background/90 pt-8 pb-3 backdrop-blur">
		<ScoreDial {score} size={188} />
	</div>

	<!-- the interview = the app -->
	<div class="mt-4">
		{#if wasmReady}
			<Interview bind:faf showDial={false} onScore={(s) => (score = s)} demo={demoMode} onDemoEnd={demoFinished} onDemoReset={() => (faf = seedFaf())} onStart={startFresh} />
		{:else}
			<p class="text-center text-sm text-muted-foreground">Warming up the engines…</p>
		{/if}
	</div>

	<!-- optional: what are you building? bonus intent → guides the AI's re-type.
	     "Not sure yet" keeps it pure intent. Does not change the score. -->
	<div class="mt-8 flex items-center justify-center gap-2 text-sm">
		<label for="apptype" class="text-muted-foreground">Building?</label>
		<select
			id="apptype"
			bind:value={targetType}
			class="rounded-lg border border-white/20 bg-black px-2 py-1.5 text-white focus:border-primary/60 focus:outline-none"
		>
			{#each APP_TYPE_OPTIONS as o}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select>
	</div>

	<!-- take your .faf — quiet secondary actions -->
	<div class="mt-4 flex justify-center gap-3">
		<button onclick={downloadFaf} class="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10">
			Download .faf
		</button>
		<button onclick={copyFaf} class="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10">
			{copied ? '✓ Copied' : 'Copy'}
		</button>
	</div>

	<!-- New project = the next step *after* you've taken your .faf, never before -->
	{#if grabbed}
		<div class="mt-4 flex justify-center">
			<button onclick={startFresh} class="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-white">
				New project ▸
			</button>
		</div>
	{/if}

	<!-- quiet repo path, below -->
	<div class="mt-10 border-t border-white/10 pt-6">
		{#if repoOwner}
			<p class="text-center text-sm text-muted-foreground">
				Seeded from
				<a href="https://github.com/{repoOwner}/{repoName}" target="_blank" rel="noopener" class="text-primary hover:underline">
					{repoOwner}/{repoName} ↗
				</a>
				· <button onclick={startFresh} class="underline underline-offset-2 hover:text-white">start fresh</button>
			</p>
		{:else}
			<p class="mb-3 text-center text-lg font-semibold text-white">Got a repo? <span class="font-normal text-muted-foreground">Score it to start.</span></p>
			<div class="flex gap-2">
				<input
					bind:value={repoUrl}
					placeholder="github.com/you/repo"
					onkeydown={(e) => e.key === 'Enter' && scoreRepo()}
					class="flex-1 rounded-lg border border-white/15 bg-black px-3 py-2.5 text-base text-white focus:border-primary/60 focus:outline-none"
				/>
				<button onclick={scoreRepo} disabled={scoring} class="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10 disabled:opacity-50">
					{scoring ? '…' : 'Score'}
				</button>
			</div>
			{#if scoreError}<p class="mt-2 text-center text-xs text-red-400">{scoreError}</p>{/if}
		{/if}
	</div>

	<!-- footer: the trust signal (why .faf is real) + home + legal -->
	<footer class="mt-12 border-t border-white/10 pt-6 text-center">
		<p class="text-xs text-muted-foreground">
			Why trust <span class="font-medium text-white">.faf</span>?
			<a href="https://www.iana.org/assignments/media-types/application/vnd.faf+yaml" target="_blank" rel="noopener" class="hover:text-white hover:underline">IANA-registered</a>
			AI-context format since Oct 2025.
		</p>
		<p class="mt-2 text-xs text-muted-foreground">
			<a href="https://faf.one" target="_blank" rel="noopener" class="hover:text-white hover:underline">faf.one</a>
			<span class="px-1 text-white/20">·</span>
			<a href="https://faf.one/privacy" target="_blank" rel="noopener" class="hover:text-white hover:underline">Privacy</a>
			<span class="px-1 text-white/20">·</span>
			<a href="https://faf.one/terms" target="_blank" rel="noopener" class="hover:text-white hover:underline">Terms</a>
		</p>
	</footer>
</div>
