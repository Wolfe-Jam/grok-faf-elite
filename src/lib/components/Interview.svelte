<script lang="ts">
	/**
	 * Interview — the easy way to climb the dial to 100%.
	 * Discovers EVERY empty slot in the .faf and asks them one at a time, in
	 * plain English, human-Ws first, then the stack gaps. Each question carries
	 * a good suggestion: Tab fills it (to edit), Enter accepts it (to fly
	 * through). Re-scores after each answer so the dial climbs live. Works from
	 * a blank seed (New Project) or a scored repo's .faf (fill its gaps).
	 *
	 * Props:
	 *   faf      (bindable) — the .faf text it reads + edits
	 *   showDial            — render its own dial, or rely on the page's dial
	 *   onScore            — called with each new score so the page dial can climb
	 */
	import { onMount } from 'svelte';
	import ScoreDial from './ScoreDial.svelte';
	import { scoreFaf } from '$lib/wasm-loader';

	let {
		faf = $bindable(''),
		showDial = true,
		onScore = (_s: number) => {},
		demo = false,
		onDemoEnd = () => {}
	}: {
		faf?: string;
		showDial?: boolean;
		onScore?: (s: number) => void;
		demo?: boolean;
		onDemoEnd?: () => void;
	} = $props();

	type Q = { key: string; q: string; hint: string; suggest?: string };
	// Ordered human-Ws first (only a human knows the why/who), then project
	// basics, then the stack. Each has a sensible suggestion to Tab/Enter.
	const CATALOG: Q[] = [
		{ key: 'name',  q: "What's it called?",          hint: "Enter your project's name.",            suggest: 'My Project' },
		{ key: 'who',   q: 'Who is this for?',           hint: 'The people who use it — not you, them.', suggest: 'Developers & builders' },
		{ key: 'what',  q: 'What does it do?',           hint: 'One plain sentence.',                    suggest: 'A fast tool that does one thing well' },
		{ key: 'why',   q: 'Why does it exist?',         hint: "What's broken today that this fixes?",   suggest: 'Existing tools were too slow and heavy' },
		{ key: 'where', q: 'Where does it run or ship?', hint: 'npm · the edge · a browser · a server…', suggest: 'npm' },
		{ key: 'when',  q: 'When would you use it?',     hint: 'The moment it helps.',                   suggest: 'When starting a new project' },
		{ key: 'how',   q: 'How do you get started?',    hint: 'Install / first step.',                  suggest: 'npm install, then run' },
		{ key: 'goal',  q: 'In one line, the goal?',     hint: 'What it sets out to do.',                suggest: 'Make it simple and fast' },
		{ key: 'main_language', q: 'Main language?',     hint: 'TypeScript · Rust · Python…',            suggest: 'TypeScript' },
		{ key: 'frontend',        q: 'Frontend framework?',  hint: 'React · Svelte · Vue — or none', suggest: 'React' },
		{ key: 'css_framework',   q: 'CSS / styling?',        hint: 'Tailwind · plain CSS — or none', suggest: 'Tailwind' },
		{ key: 'ui_library',      q: 'UI component library?', hint: 'shadcn · MUI — or none',         suggest: 'none' },
		{ key: 'state_management',q: 'State management?',      hint: 'Redux · stores — or none',       suggest: 'none' },
		{ key: 'backend',         q: 'Backend / framework?',  hint: 'Express · FastAPI — or none',    suggest: 'none' },
		{ key: 'api_type',        q: 'API type?',              hint: 'REST · GraphQL · MCP…',          suggest: 'REST' },
		{ key: 'runtime',         q: 'Runtime?',               hint: 'Node · Bun · Deno · browser',    suggest: 'Node' },
		{ key: 'database',        q: 'Database?',              hint: 'Postgres · SQLite — or none',    suggest: 'none' },
		{ key: 'connection',      q: 'DB layer / ORM?',        hint: 'Prisma · Drizzle — or none',     suggest: 'none' },
		{ key: 'hosting',         q: 'Where is it hosted?',    hint: 'Cloudflare · Vercel · AWS…',     suggest: 'Cloudflare' },
		{ key: 'build',           q: 'Build tool?',            hint: 'Vite · npm · cargo…',            suggest: 'Vite' },
		{ key: 'cicd',            q: 'CI / CD?',                hint: 'GitHub Actions — or none',       suggest: 'GitHub Actions' },
		{ key: 'package_manager', q: 'Package manager?',       hint: 'npm · pnpm · bun · cargo',       suggest: 'npm' },
		{ key: 'monorepo_tool',   q: 'Monorepo tool?',         hint: 'Turborepo · Nx — or none',       suggest: 'none' },
		{ key: 'workspaces',      q: 'Workspaces?',            hint: 'layout — or none',               suggest: 'none' },
		{ key: 'admin',           q: 'Admin panel?',           hint: 'tool — or none',                 suggest: 'none' },
		{ key: 'cache',           q: 'Cache?',                  hint: 'Redis — or none',                suggest: 'none' },
		{ key: 'search',          q: 'Search?',                 hint: 'Algolia — or none',              suggest: 'none' },
		{ key: 'storage',         q: 'Object storage?',         hint: 'S3 · R2 — or none',              suggest: 'none' }
	];
	const CAT = new Map(CATALOG.map((c) => [c.key, c]));
	const humanize = (k: string) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

	let score = $state(0);
	let answer = $state('');
	let skipped = $state<string[]>([]);

	function emptySlots(text: string): string[] {
		const re = /^ {2}([a-z_]+):[ \t]*(?:""|'')?[ \t]*$/gm;
		const out: string[] = [];
		let m: RegExpExecArray | null;
		while ((m = re.exec(text)) !== null) out.push(m[1]);
		return out;
	}

	const queue = $derived.by(() => {
		const empties = emptySlots(faf).filter((k) => !skipped.includes(k));
		const known = CATALOG.filter((c) => empties.includes(c.key));
		const extra = empties
			.filter((k) => !CAT.has(k))
			.map((k): Q => ({ key: k, q: `${humanize(k)}?`, hint: '' }));
		return [...known, ...extra];
	});
	const current = $derived(queue[0] ?? null);
	const done = $derived(queue.length === 0);

	$effect(() => { rescore(faf); });
	async function rescore(text: string) {
		try { score = (await scoreFaf(text)).score; onScore(score); } catch { /* wasm not ready */ }
	}

	function setSlot(text: string, key: string, val: string): string {
		const clean = val.replace(/["\n]/g, ' ').trim();
		const re = new RegExp(`^(  ${key}:).*$`, 'm');
		return re.test(text) ? text.replace(re, `$1 ${clean}`) : text;
	}
	function isEmpty(text: string, key: string): boolean {
		const m = text.match(new RegExp(`^  ${key}:[ \\t]*(.*)$`, 'm'));
		const v = m?.[1]?.trim() ?? '';
		return v === '' || v === '""';
	}

	async function submit() {
		const val = (answer.trim() || current?.suggest || '').trim();
		if (!val || !current) return;
		faf = setSlot(faf, current.key, val);
		// "What does it do?" IS the project goal — fill it too, but only if blank.
		if (current.key === 'what' && isEmpty(faf, 'goal')) faf = setSlot(faf, 'goal', val);
		answer = '';
		await rescore(faf);
	}
	function skip() {
		if (!current) return;
		skipped = [...skipped, current.key];
		answer = '';
	}

	// ---- self-running demo: the app shows you the loop, then hands off ----
	let demoing = $state(false);
	let aborted = false;
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	let showTip = $state(true);
	onMount(() => {
		try { if (localStorage.getItem('faf_tip_dismissed')) showTip = false; } catch { /* no storage */ }
	});
	// run the attract-mode demo whenever `demo` turns on — initial load AND the
	// idle re-fire (demoActivated is a plain flag so the effect tracks only `demo`).
	let demoActivated = false;
	$effect(() => {
		if (demo && !demoActivated) { demoActivated = true; runDemo(); }
		if (!demo) demoActivated = false;
	});
	function dismissTip() {
		showTip = false;
		try { localStorage.setItem('faf_tip_dismissed', '1'); } catch { /* no storage */ }
	}

	async function runDemo() {
		demoing = true;
		aborted = false;
		await sleep(700); // let wasm warm + the first score settle
		while (current && !aborted && demo) {
			const text = current.suggest ?? '';
			for (let i = 1; i <= text.length && !aborted && demo; i++) {
				answer = text.slice(0, i); // typewriter
				await sleep(34);
			}
			if (aborted || !demo) break;
			await sleep(420);
			if (aborted || !demo) break;
			await submit(); // dial climbs
			await sleep(600);
		}
		demoing = false;
		if (aborted || !demo) return; // user took over, or the page switched demo off
		await sleep(1900); // bask at 100% — Trophy 🏆 + dotFAF, "Happy AI"
		onDemoEnd();        // hand off for the real user
	}

	function takeOver() {
		if (!demoing) return;
		aborted = true;
		demoing = false;
		answer = '';
		onDemoEnd();
	}

	function onKey(e: KeyboardEvent) {
		if (demoing) { takeOver(); return; }
		if (e.key === 'Enter') {
			e.preventDefault();
			submit(); // uses the typed answer, or the suggestion if empty
		} else if (e.key === 'Tab' && !answer.trim() && current?.suggest) {
			e.preventDefault();
			answer = current.suggest; // fill, so they can edit before Enter
		}
	}

	// ---- success-screen sequence: "happy" → typewriter the what-next ----
	const DONE_SEQ = [
		'Your AI is happy',
		"We've created a project.faf file for you, behind the scenes — copy & paste it into your AI tool now",
		'Download, or copy & paste your .faf'
	];
	let doneText = $state('');
	let doneToken = 0;
	$effect(() => {
		if (done) { runDoneSequence(); }
		else { doneToken++; doneText = ''; } // cancel any running sequence on reset
	});
	async function runDoneSequence() {
		const my = ++doneToken;
		doneText = DONE_SEQ[0];           // "Your AI is happy" — holds a moment
		await sleep(2200); if (my !== doneToken) return;
		await typewrite(DONE_SEQ[1], my); if (my !== doneToken) return;
		await sleep(1500); if (my !== doneToken) return;
		await typewrite(DONE_SEQ[2], my);
	}
	async function typewrite(text: string, my: number) {
		doneText = '';
		for (let i = 1; i <= text.length; i++) {
			if (my !== doneToken) return;
			doneText = text.slice(0, i);
			await sleep(52); // calm reading pace
		}
	}
</script>

<svelte:window onkeydown={() => { if (demoing) takeOver(); }} />

<div class="interview">
	{#if showDial}
		<ScoreDial {score} size={184} />
	{/if}

	{#if !done && current}
		<div class="q" onpointerdown={takeOver}>
			<label for="ans" class="ask">{current.q}</label>
			{#if current.hint}<p class="hint">{current.hint}</p>{/if}
			<input
				id="ans"
				bind:value={answer}
				placeholder={current.suggest ?? 'Type your answer…'}
				onkeydown={onKey}
				readonly={demoing}
				autocomplete="off"
			/>
			{#if demoing}
				<button class="clickstart" onclick={takeOver}>Click to start ▸</button>
			{:else}
				{#if showTip && current.suggest}
					<p class="tabhint">
						<kbd>Tab</kbd> to fill · <kbd>Enter</kbd> to accept
						<button class="tipx" onclick={dismissTip} aria-label="Hide tip">×</button>
					</p>
				{/if}
				<div class="actions">
					<button class="next" onclick={submit} disabled={!answer.trim() && !current.suggest}>Next →</button>
					<button class="skip" onclick={skip}>Skip</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="done">
			<p class="donetext">{doneText}</p>
		</div>
	{/if}
</div>

<style>
	/* constant height + top-aligned so the headline stays put and the page
	   below never shifts between question and success states */
	.interview { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 14px; text-align: center; min-height: 210px; }
	.q { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; max-width: 380px; }
	.ask { font: 700 26px system-ui; color: #fff; line-height: 1.25; }
	.hint { margin: 0; font: 400 14px system-ui; color: #9aa0a6; }
	input {
		width: 100%; margin-top: 8px; padding: 13px 15px; border-radius: 10px;
		background: #000; border: 1px solid #333; color: #fff; font: 400 17px system-ui;
	}
	input:focus { outline: none; border-color: #00D4D4; }
	.tabhint { margin: 2px 0 0; font: 400 12px system-ui; color: #6b7079; }
	.tabhint kbd {
		font: 600 11px ui-monospace, monospace; color: #c8ccd2;
		background: #1a1a1a; border: 1px solid #333; border-radius: 4px; padding: 1px 5px;
	}
	.clickstart {
		margin-top: 8px; padding: 11px 26px; border-radius: 999px;
		border: 1.5px solid #FF6B35; background: rgba(255, 107, 53, .08); color: #FF6B35;
		font: 700 15px system-ui; cursor: pointer; animation: cta-pulse 1.5s ease-in-out infinite;
	}
	.clickstart:hover { background: rgba(255, 107, 53, .18); }
	@keyframes cta-pulse {
		0%   { box-shadow: 0 0 0 0 rgba(255, 107, 53, .5); }
		70%  { box-shadow: 0 0 0 14px rgba(255, 107, 53, 0); }
		100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
	}
	.tipx {
		margin-left: 6px; border: none; background: none; cursor: pointer;
		color: #6b7079; font: 600 13px system-ui; line-height: 1; padding: 0 2px;
	}
	.tipx:hover { color: #fff; }
	.actions { display: flex; align-items: center; gap: 16px; margin-top: 6px; }
	.next {
		padding: 11px 26px; border-radius: 10px; border: none;
		background: #fff; color: #000; font: 700 16px system-ui; cursor: pointer;
	}
	.next:hover { background: #e6e6e6; }
	.next:disabled { opacity: .35; cursor: default; }
	.skip {
		padding: 10px 4px; border: none; background: none; color: #9aa0a6;
		font: 500 15px system-ui; cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
	}
	.skip:hover { color: #fff; }
	.done { display: flex; flex-direction: column; align-items: center; padding-top: 6px; }
	.donetext { margin: 0; font: 600 18px system-ui; color: #fff; line-height: 1.45; max-width: 360px; min-height: 1.45em; }
</style>
