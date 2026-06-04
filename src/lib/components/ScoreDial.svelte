<script lang="ts">
	/**
	 * ScoreDial — AI-Readiness gauge (F1 speedometer).
	 * The arc sweeps 0→100; the TROPHY sits in the centre and gains colour +
	 * brightness as you climb — grey ghost at 0, full gold + glow at 100, where
	 * dotFAF (Dorothy Faff) lights up: "you made your AI happy".
	 * NON-JUDGMENTAL: a low number is "more road ahead", never "you failed".
	 */
	let { score = 0, size = 200 }: { score?: number; size?: number } = $props();

	const R = 52;
	const C = 2 * Math.PI * R;
	const pct = $derived(Math.max(0, Math.min(100, Math.round(score))));
	const dash = $derived((C * pct) / 100);
	const isMax = $derived(pct >= 100);
	// arc colour climbs the tier ladder (cool → warm → gold)
	const arcColor = $derived(
		pct >= 100 ? '#FFB000' :      // trophy gold
		pct >= 85 ? '#FF6B35' :       // orange (bronze+)
		pct >= 55 ? '#00D4D4' :       // cyan (green/yellow)
		'#6b7280'                     // grey (low — calm, not alarming)
	);
	// the trophy gains COLOUR + BRIGHTNESS + PRESENCE as the score climbs:
	// grey + dim ghost at 0 → vivid gold at 100.
	const trophyFilter = $derived(
		`grayscale(${(1 - pct / 100).toFixed(2)}) ` +
		`saturate(${(0.6 + 0.9 * pct / 100).toFixed(2)}) ` +
		`brightness(${(0.6 + 0.5 * pct / 100).toFixed(2)}) ` +
		`opacity(${(0.32 + 0.68 * pct / 100).toFixed(2)})`
	);
</script>

<div class="dial" style="width:{size}px">
	<div class="ringwrap" style="height:{size}px">
		<svg viewBox="0 0 120 120" class="ring" class:lit={isMax}>
			<!-- track -->
			<circle cx="60" cy="60" r={R} fill="none" stroke="#1f1f1f" stroke-width="9" />
			<!-- progress arc -->
			<circle
				cx="60" cy="60" r={R} fill="none"
				stroke={arcColor} stroke-width="9" stroke-linecap="round"
				stroke-dasharray="{dash} {C}" transform="rotate(-90 60 60)"
				class="arc" />
		</svg>

		<!-- centre: trophy fills the ring, brightening with the score -->
		<div class="center">
			<div class="trophy" class:ignite={isMax} style="filter:{trophyFilter}">🏆</div>
			<div class="pct" style="color:{arcColor}">{pct}%</div>
			<div class="lbl">AI-Readiness</div>
		</div>
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
	.ringwrap { position: relative; width: 100%; }
	.ring { width: 100%; height: 100%; display: block; }
	.ring.lit { animation: pop .5s ease; }
	@keyframes pop { 50% { transform: scale(1.03); } }
	.arc { transition: stroke-dasharray .6s cubic-bezier(.4,0,.2,1), stroke .4s ease; }

	.center {
		position: absolute; inset: 0;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		gap: 1px; pointer-events: none;
	}
	.trophy { font-size: 54px; line-height: 1; transition: filter .5s ease; }
	.trophy.ignite { animation: glow 1.6s ease-in-out infinite alternate; }
	@keyframes glow {
		from { transform: scale(1); filter: grayscale(0) saturate(1.5) brightness(1) opacity(1); }
		to   { transform: scale(1.08); filter: grayscale(0) saturate(1.6) brightness(1.15) opacity(1) drop-shadow(0 0 10px #FFB000); }
	}
	.pct { font: 700 22px -apple-system, system-ui, sans-serif; margin-top: 3px; }
	.lbl { font: 600 7px -apple-system, system-ui, sans-serif; color: #9aa0a6; letter-spacing: .1em; text-transform: uppercase; }

	.happy { margin-top: 10px; text-align: center; animation: rise .5s ease both; }
	.happy img { display: block; margin: 0 auto 4px; animation: bob 2s ease-in-out infinite; }
	.happy p { margin: 0; font: 700 13px -apple-system, system-ui, sans-serif; color: #FF6B35; }
	@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
	@keyframes bob  { 50% { transform: translateY(-4px); } }
</style>
