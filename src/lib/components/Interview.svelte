<script lang="ts">
	/**
	 * Interview — the easy way to climb the dial to 100%.
	 * Discovers EVERY empty slot in the .faf and asks them one at a time, in
	 * plain English, human-Ws first (the part only a person knows), then the
	 * stack gaps. Re-scores after each answer so the dial climbs live. Works
	 * from a blank seed (no repo → New Project) OR a scored repo's .faf (fill
	 * the gaps it found). Honest: never fabricates — skip what you don't know.
	 *
	 * Props:
	 *   faf      (bindable) — the .faf text it reads + edits
	 *   showDial            — render its own dial (New Project) or not (repo path,
	 *                         where the page already shows the main dial)
	 *   onScore            — called with each new score so the page dial can climb
	 */
	import ScoreDial from './ScoreDial.svelte';
	import { scoreFaf } from '$lib/wasm-loader';

	let {
		faf = $bindable(''),
		showDial = true,
		onScore = (_s: number) => {}
	}: { faf?: string; showDial?: boolean; onScore?: (s: number) => void } = $props();

	// Nice questions for the known slots, ordered human-Ws first (highest value —
	// only a human knows the why/who), then project basics, then the stack.
	const CATALOG = [
		{ key: 'name',  q: "What's it called?",         hint: "Enter your project's name." },
		{ key: 'who',   q: 'Who is this for?',          hint: 'The people who use it — not you, them.' },
		{ key: 'what',  q: 'What does it do?',           hint: 'One plain sentence.' },
		{ key: 'why',   q: 'Why does it exist?',         hint: "What's broken today that this fixes?" },
		{ key: 'where', q: 'Where does it run or ship?', hint: 'npm · the edge · a browser · a server…' },
		{ key: 'when',  q: 'When would you use it?',     hint: 'The moment it helps.' },
		{ key: 'how',   q: 'How do you get started?',    hint: 'Install / first step.' },
		{ key: 'goal',  q: 'In one line, the goal?',     hint: 'What it sets out to do.' },
		{ key: 'main_language', q: 'Main language?',     hint: 'TypeScript · Rust · Python…' },
		{ key: 'frontend',        q: 'Frontend framework?',  hint: 'React · Svelte · Vue — or none' },
		{ key: 'css_framework',   q: 'CSS / styling?',        hint: 'Tailwind · plain CSS — or none' },
		{ key: 'ui_library',      q: 'UI component library?', hint: 'shadcn · MUI — or none' },
		{ key: 'state_management',q: 'State management?',      hint: 'Redux · stores — or none' },
		{ key: 'backend',         q: 'Backend / framework?',  hint: 'Express · FastAPI — or none' },
		{ key: 'api_type',        q: 'API type?',              hint: 'REST · GraphQL · MCP…' },
		{ key: 'runtime',         q: 'Runtime?',               hint: 'Node · Bun · Deno · browser' },
		{ key: 'database',        q: 'Database?',              hint: 'Postgres · SQLite — or none' },
		{ key: 'connection',      q: 'DB layer / ORM?',        hint: 'Prisma · Drizzle — or none' },
		{ key: 'hosting',         q: 'Where is it hosted?',    hint: 'Cloudflare · Vercel · AWS…' },
		{ key: 'build',           q: 'Build tool?',            hint: 'Vite · npm · cargo…' },
		{ key: 'cicd',            q: 'CI / CD?',                hint: 'GitHub Actions — or none' },
		{ key: 'package_manager', q: 'Package manager?',       hint: 'npm · pnpm · bun · cargo' },
		{ key: 'monorepo_tool',   q: 'Monorepo tool?',         hint: 'Turborepo · Nx — or none' },
		{ key: 'workspaces',      q: 'Workspaces?',            hint: 'layout — or none' },
		{ key: 'admin',           q: 'Admin panel?',           hint: 'tool — or none' },
		{ key: 'cache',           q: 'Cache?',                  hint: 'Redis — or none' },
		{ key: 'search',          q: 'Search?',                 hint: 'Algolia — or none' },
		{ key: 'storage',         q: 'Object storage?',         hint: 'S3 · R2 — or none' }
	];
	const CAT = new Map(CATALOG.map((c) => [c.key, c]));
	const humanize = (k: string) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

	let score = $state(0);
	let answer = $state('');
	let skipped = $state<string[]>([]);

	// every 2-space slot whose value is blank (slotignored/filled lines have a
	// value, so they don't match — they're skipped automatically).
	function emptySlots(text: string): string[] {
		const re = /^ {2}([a-z_]+):[ \t]*(?:""|'')?[ \t]*$/gm;
		const out: string[] = [];
		let m: RegExpExecArray | null;
		while ((m = re.exec(text)) !== null) out.push(m[1]);
		return out;
	}

	// queue ordered by CATALOG (human-Ws first), then any unknown empty slots
	const queue = $derived.by(() => {
		const empties = emptySlots(faf).filter((k) => !skipped.includes(k));
		const known = CATALOG.filter((c) => empties.includes(c.key));
		const extra = empties
			.filter((k) => !CAT.has(k))
			.map((k) => ({ key: k, q: `${humanize(k)}?`, hint: '' }));
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
		if (!answer.trim() || !current) return;
		faf = setSlot(faf, current.key, answer);
		// "What does it do?" IS the project goal — fill it too, but only if blank.
		if (current.key === 'what' && isEmpty(faf, 'goal')) faf = setSlot(faf, 'goal', answer);
		answer = '';
		await rescore(faf);
	}
	function skip() {
		if (!current) return;
		skipped = [...skipped, current.key];
		answer = '';
	}
</script>

<div class="interview">
	{#if showDial}
		<ScoreDial {score} size={184} />
	{/if}

	{#if !done && current}
		<div class="q">
			<p class="count">{queue.length} question{queue.length === 1 ? '' : 's'} to a happy AI</p>
			<label for="ans" class="ask">{current.q}</label>
			{#if current.hint}<p class="hint">{current.hint}</p>{/if}
			<input
				id="ans"
				bind:value={answer}
				placeholder="Type your answer…"
				onkeydown={(e) => e.key === 'Enter' && submit()}
				autocomplete="off"
			/>
			<div class="actions">
				<button class="next" onclick={submit} disabled={!answer.trim()}>Next →</button>
				<button class="skip" onclick={skip}>Skip</button>
			</div>
		</div>
	{:else}
		<p class="done">That's your context — your AI's in tune. Save the <code>.faf</code> to your repo.</p>
	{/if}
</div>

<style>
	.interview { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
	.q { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; max-width: 360px; }
	.count { margin: 0; font: 600 12px system-ui; color: #FF6B35; letter-spacing: .04em; text-transform: uppercase; }
	.ask { font: 700 26px system-ui; color: #fff; line-height: 1.25; }
	.hint { margin: 0; font: 400 14px system-ui; color: #9aa0a6; }
	input {
		width: 100%; margin-top: 8px; padding: 13px 15px; border-radius: 10px;
		background: #000; border: 1px solid #333; color: #fff; font: 400 17px system-ui;
	}
	input:focus { outline: none; border-color: #00D4D4; }
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
	.done { font: 600 14px system-ui; color: #fff; max-width: 320px; }
	.done code { color: #FF6B35; }
</style>
