<script lang="ts">
	/**
	 * ScoreDial — AI-Readiness gauge (half-circle) with an animated climb.
	 * 0 at 9 o'clock → arc sweeps over the top → 100 at 3 o'clock. The trophy
	 * sits IN the bowl, its base resting on the diameter line (the flat base of
	 * the semicircle). The % and label are written BELOW the graphic. Number +
	 * arc tween to the target for a smooth rise. At 100% dotFAF lights up.
	 * NB: class is "gauge" not "ring" — `ring` is a Tailwind utility (box-shadow).
	 */
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let { score = 0, size = 200 }: { score?: number; size?: number } = $props();

	const R = 52;
	const C = 2 * Math.PI * R;
	const HALF = 0.5;
	const ARC = 'rotate(180 60 60)';

	const target = $derived(Math.max(0, Math.min(100, Math.round(score))));
	const tw = new Tween(0, { duration: 800, easing: cubicOut });
	$effect(() => { tw.set(target); });

	const pct = $derived(Math.round(tw.current));
	const trackDash = `${HALF * C} ${C}`;
	const progDash = $derived(`${((tw.current / 100) * HALF * C).toFixed(2)} ${C}`);
	const isMax = $derived(pct >= 100);
	// colour warms up EARLY — visible from the very first answer
	const arcColor = $derived(
		pct >= 100 ? '#4ade80' :      // green = go (Happy AI)
		pct >= 50 ? '#FF6B35' :       // orange — warmed up by halfway
		pct >= 8 ? '#00D4D4' :        // cyan — colour from answer #1
		'#6b7280'                     // grey only at the very start
	);
	// trophy is VISIBLE from the start (no faint ghost) and reaches full
	// colour by ~70% — so each answer notches the contrast up noticeably
	const trophyFilter = $derived(
		`grayscale(${Math.max(0, 0.9 - 1.3 * pct / 100).toFixed(2)}) ` +
		`saturate(${(0.85 + 0.75 * pct / 100).toFixed(2)}) ` +
		`brightness(${(0.74 + 0.4 * pct / 100).toFixed(2)}) ` +
		`opacity(${(0.5 + 0.5 * pct / 100).toFixed(2)})`
	);

	// a visual "notch up" each time the score actually increases (per answer)
	let notch = $state(0);
	let prevTarget = 0;
	$effect(() => {
		if (target > prevTarget) notch++;
		prevTarget = target;
	});
</script>

<div class="dial" style="width:{size}px">
	<!-- arc + trophy share the same box; trophy base rests on the diameter -->
	<div class="graphic">
		<svg viewBox="0 0 120 65" class="gauge" class:lit={isMax}>
			<circle
				cx="60" cy="60" r={R} fill="none" stroke="#1f1f1f" stroke-width="9"
				stroke-linecap="round" stroke-dasharray={trackDash} transform={ARC} />
			<circle
				cx="60" cy="60" r={R} fill="none"
				stroke={arcColor} stroke-width="9" stroke-linecap="round"
				stroke-dasharray={progDash} transform={ARC} class="arc" />
		</svg>
		<!-- trophy brightens as you climb; at 100% it becomes dotFAF — same spot, no shift -->
		{#if isMax}
			<div class="dotfaf"><img src="/dotfaf-happy.png" alt="dotFAF — your AI is happy" /></div>
		{:else}
			{#key notch}
				<div class="trophy" style="filter:{trophyFilter}">🏆</div>
			{/key}
		{/if}
	</div>

	<!-- text below the graphic -->
	<div class="text">
		<div class="pct" style="color:{arcColor}">{pct}%</div>
		<div class="lbl">AI-Readiness</div>
	</div>
</div>

<style>
	.dial { position: relative; display: flex; flex-direction: column; align-items: center; }
	.graphic { position: relative; width: 100%; }
	.gauge { width: 100%; height: auto; display: block; }
	.gauge.lit { animation: pop .5s ease; }
	@keyframes pop { 50% { transform: scale(1.03); } }
	.arc { transition: stroke .4s ease; }

	/* trophy base rests on the diameter line (bottom of the semicircle) */
	.trophy {
		position: absolute; left: 50%; bottom: 1px; transform: translateX(-50%);
		font-size: 42px; line-height: 1; transition: filter .5s ease;
		animation: notchpop .35s ease;   /* a pop on each answer (re-keyed by `notch`) */
	}
	@keyframes notchpop {
		0%   { transform: translateX(-50%) scale(1); }
		45%  { transform: translateX(-50%) scale(1.18); }
		100% { transform: translateX(-50%) scale(1); }
	}
	/* at 100% dotFAF takes the trophy's exact spot — no new element, no shift */
	.dotfaf { position: absolute; left: 50%; bottom: 1px; transform: translateX(-50%); }
	.dotfaf img { display: block; width: 46px; height: 46px; animation: pop-in .45s ease both; }
	@keyframes pop-in { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }

	.text { display: flex; flex-direction: column; align-items: center; gap: 1px; margin-top: 8px; }
	.pct { font: 700 24px -apple-system, system-ui, sans-serif; }
	.lbl { font: 600 9px -apple-system, system-ui, sans-serif; color: #9aa0a6; letter-spacing: .1em; text-transform: uppercase; }
</style>
