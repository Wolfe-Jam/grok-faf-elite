// X (Twitter) web-intent share helpers — no auth, no API, no tokens.
// Doctrine: web intent is the default share path. The user edits before
// posting, which is a feature (varies the corpus, no automation flags).
//
// Web intent supports `?text=...&url=...` separately — when url is its own
// param, X renders a card preview below the tweet (logo, page title).

const BUILDER_URL = 'https://builder.faf.one';
const HASHTAGS = ['FAF', 'GoldCode', 'AIReadiness'];

export interface ScoreShareInput {
	repo: string; // "owner/name" or just "name"
	score: number;
	tierEmoji: string;
	extra?: string; // optional extra body (e.g. timing data, commit URL)
}

/** Build the canonical FAF score-share intent URL. */
export function buildScoreShareUrl(input: ScoreShareInput): string {
	const lines = [
		`${input.repo} scored ${input.score}% on FAF AI-readiness! ${input.tierEmoji}`,
		'',
		input.score >= 100 ? 'Gold Code achieved!' : 'On the path to Gold Code!'
	];
	if (input.extra) {
		lines.push('', input.extra);
	}
	lines.push('', '#' + HASHTAGS.join(' #'));
	return buildShareUrl(lines.join('\n'), BUILDER_URL);
}

/** Generic intent builder — pass any text; URL is optional and rendered as a card. */
export function buildShareUrl(text: string, url?: string): string {
	const params = new URLSearchParams();
	params.set('text', text);
	if (url) params.set('url', url);
	return `https://x.com/intent/tweet?${params.toString()}`;
}
