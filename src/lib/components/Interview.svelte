<script lang="ts">
	/**
	 * Interview — the 6-Ws flow that climbs the dial to 100%.
	 * Works from a repo-seeded .faf (fills the gaps) OR a blank one (no repo →
	 * start here). Asks ONLY the empty Ws, one at a time, in plain English
	 * (faf.one/6ws wording), re-scoring after each answer so the dial climbs live.
	 */
	import ScoreDial from './ScoreDial.svelte';
	import { scoreFaf } from '$lib/wasm-loader';

	let { faf = $bindable('') }: { faf?: string } = $props();

	const WS = [
		{ key: 'who',   q: 'Who is this for?',      hint: 'The people who will use it — not you, them.' },
		{ key: 'what',  q: 'What does it do?',       hint: 'One plain sentence.' },
		{ key: 'why',   q: 'Why does it exist?',     hint: "What's broken today that this fixes?" },
		{ key: 'where', q: 'Where does it run?',     hint: 'npm · the edge · a browser · a server…' },
		{ key: 'when',  q: 'When would you use it?', hint: 'The moment it helps.' },
		{ key: 'how',   q: 'How do you get started?', hint: 'Install / first step.' },
		{ key: 'main_language', q: "What's it built in?", hint: 'TypeScript · Rust · Python — "undecided" is a fine answer.' }
	];

	let score = $state(0);
	let answer = $state('');

	function isEmpty(text: string, key: string): boolean {
		// [ \t]* not \s* — \s matches newlines, so `who:\n  what:` would read
		// "what:" as who's value and the slot would look filled when it's blank.
		const m = text.match(new RegExp(`^  ${key}:[ \\t]*(.*)$`, 'm'));
		const v = m?.[1]?.trim() ?? '';
		return v === '' || v === '""';
	}
	const queue = $derived(WS.filter((w) => isEmpty(faf, w.key)));
	const current = $derived(queue[0] ?? null);
	const done = $derived(queue.length === 0);

	$effect(() => { rescore(faf); });
	async function rescore(text: string) {
		try { score = (await scoreFaf(text)).score; } catch { /* wasm not ready */ }
	}

	function setSlot(text: string, key: string, val: string): string {
		const clean = val.replace(/["\n]/g, ' ').trim();
		const re = new RegExp(`^(  ${key}:).*$`, 'm');
		return re.test(text) ? text.replace(re, `$1 ${clean}`) : text;
	}

	async function submit() {
		if (!answer.trim() || !current) return;
		faf = setSlot(faf, current.key, answer);
		// "What does it do?" IS the project goal — fill it too, but only if blank
		// (so a repo-distilled goal is never overwritten by the short human answer).
		if (current.key === 'what' && isEmpty(faf, 'goal')) faf = setSlot(faf, 'goal', answer);
		answer = '';
		await rescore(faf);
	}
</script>

<div class="interview">
	<ScoreDial {score} size={184} />

	{#if !done && current}
		<div class="q">
			<p class="count">{queue.length} question{queue.length === 1 ? '' : 's'} from a happy AI</p>
			<label for="ans" class="ask">{current.q}</label>
			<p class="hint">{current.hint}</p>
			<input
				id="ans"
				bind:value={answer}
				placeholder="Type your answer…"
				onkeydown={(e) => e.key === 'Enter' && submit()}
				autocomplete="off"
			/>
			<button class="next" onclick={submit} disabled={!answer.trim()}>Next →</button>
		</div>
	{:else}
		<p class="done">That's your context — your AI's in tune. Save the <code>.faf</code> to your repo.</p>
	{/if}
</div>

<style>
	.interview { display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
	.q { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; max-width: 360px; }
	.count { margin: 0; font: 600 11px system-ui; color: #FF6B35; letter-spacing: .04em; text-transform: uppercase; }
	.ask { font: 700 18px system-ui; color: #fff; }
	.hint { margin: 0; font: 400 12px system-ui; color: #9aa0a6; }
	input {
		width: 100%; margin-top: 6px; padding: 10px 12px; border-radius: 8px;
		background: #000; border: 1px solid #333; color: #fff; font: 400 14px system-ui;
	}
	input:focus { outline: none; border-color: #00D4D4; }
	.next {
		margin-top: 4px; padding: 8px 18px; border-radius: 8px; border: none;
		background: #FF6B35; color: #000; font: 700 14px system-ui; cursor: pointer;
	}
	.next:disabled { opacity: .4; cursor: default; }
	.done { font: 600 14px system-ui; color: #fff; max-width: 320px; }
	.done code { color: #FF6B35; }
</style>
