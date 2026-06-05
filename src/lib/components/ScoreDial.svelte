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
	const arcColor = $derived(
		pct >= 100 ? '#FFB000' :
		pct >= 85 ? '#FF6B35' :
		pct >= 55 ? '#00D4D4' :
		'#6b7280'
	);
	const trophyFilter = $derived(
		`grayscale(${(1 - pct / 100).toFixed(2)}) ` +
		`saturate(${(0.6 + 0.9 * pct / 100).toFixed(2)}) ` +
		`brightness(${(0.6 + 0.5 * pct / 100).toFixed(2)}) ` +
		`opacity(${(0.32 + 0.68 * pct / 100).toFixed(2)})`
	);
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
		<div class="trophy" class:ignite={isMax} style="filter:{trophyFilter}">🏆</div>
	</div>

	<!-- text below the graphic -->
	<div class="text">
		<div class="pct" style="color:{arcColor}">{pct}%</div>
		<div class="lbl">AI-Readiness</div>
	</div>

	{#if isMax}
		<div class="happy">
			<img src="/dotfaf-happy.png" alt="dotFAF — your AI is happy" width="60" height="60" />
			<p>You made your AI happy</p>
		</div>
	{/if}
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
	}
	.trophy.ignite { animation: glow 1.6s ease-in-out infinite alternate; }
	@keyframes glow {
		from { transform: translateX(-50%) scale(1);    filter: grayscale(0) saturate(1.5) brightness(1) opacity(1); }
		to   { transform: translateX(-50%) scale(1.1);  filter: grayscale(0) saturate(1.6) brightness(1.15) opacity(1) drop-shadow(0 0 10px #FFB000); }
	}

	.text { display: flex; flex-direction: column; align-items: center; gap: 1px; margin-top: 8px; }
	.pct { font: 700 24px -apple-system, system-ui, sans-serif; }
	.lbl { font: 600 9px -apple-system, system-ui, sans-serif; color: #9aa0a6; letter-spacing: .1em; text-transform: uppercase; }

	.happy { margin-top: 10px; text-align: center; animation: rise .5s ease both; }
	.happy img { display: block; margin: 0 auto 4px; animation: bob 2s ease-in-out infinite; }
	.happy p { margin: 0; font: 700 13px -apple-system, system-ui, sans-serif; color: #FF6B35; }
	@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
	@keyframes bob  { 50% { transform: translateY(-4px); } }
</style>
