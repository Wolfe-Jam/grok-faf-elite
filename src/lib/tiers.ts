// Tier system — ported from faf-cli @ src/core/tiers.ts (the source of truth).
//
// Doctrine:
//   - 🏆 TROPHY is the ONLY emoji. Earned at 100% (the score maximum).
//   - All other tiers use clean Unicode geometric symbols, NOT emoji.
//   - Big Orange 🍊 is an HONOR (not a score tier) — multi-criteria, AI-awarded.
//     Don't add it back as a score branch. See memory/faf-big-orange-honor-not-score.md.
//
// Symbols (verbatim from faf-cli):
//   🏆 trophy (earned at 100%)
//   ★ filled star (gold — orange)
//   ◆ filled diamond (silver — cyan)
//   ◇ open diamond (bronze — cyan)
//   ● filled circle (green/yellow — weight differentiates)
//   ○ open circle (red — dim)
//   ♡ heart (white — empty, good luck)

export interface Tier {
	name: string;
	symbol: string;
	threshold: number;
	cssClass: string;
}

export const TIERS: Tier[] = [
	{ name: 'Trophy', symbol: '🏆', threshold: 100, cssClass: 'text-orange-400 font-bold' },
	{ name: 'Gold', symbol: '★', threshold: 99, cssClass: 'text-orange-400 font-bold' },
	{ name: 'Silver', symbol: '◆', threshold: 95, cssClass: 'text-cyan-400' },
	{ name: 'Bronze', symbol: '◇', threshold: 85, cssClass: 'text-cyan-400' },
	{ name: 'Green', symbol: '●', threshold: 70, cssClass: 'text-green-500 font-bold' },
	{ name: 'Yellow', symbol: '●', threshold: 55, cssClass: 'text-yellow-500' },
	{ name: 'Red', symbol: '○', threshold: 1, cssClass: 'text-red-500 opacity-70' },
	{ name: 'White', symbol: '♡', threshold: 0, cssClass: 'text-muted-foreground opacity-50' }
];

/** Get tier info for a given score (0-100). */
export function getTier(score: number): Tier {
	for (const tier of TIERS) {
		if (score >= tier.threshold) return tier;
	}
	return TIERS[TIERS.length - 1]; // White
}

/** True only at 100% — the only place the trophy emoji belongs. */
export function isTrophy(score: number): boolean {
	return score >= 100;
}
