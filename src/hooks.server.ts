// Stats middleware — fire-and-forget Redis counters in shared analytics DB.
// Pattern mirrors faf-mcp / claude-faf-mcp / grok-faf-mcp. Prefix `elite:` per
// architecture doctrine — grok-faf-elite is the Grok premium UI tier (1-click
// FAST⚡AF, scoring) sitting on top of grok-faf-mcp.
//
// Cloudflare Workers — env comes through event.platform.env (typed via app.d.ts).
// On `vite dev` (no platform binding), platform is undefined; the no-creds path
// just skips the counter write — same behavior as before when secrets were unset.

import type { Handle } from '@sveltejs/kit';

const BLOCKED_UA_PATTERNS = [/YellowMCP/i, /Chiark/i, /TacaraBot/i];

export const handle: Handle = async ({ event, resolve }) => {
	// Bot-block — agent-quality-index scanners that don't represent adoption.
	const blockUa = event.request.headers.get('user-agent') || '';
	if (BLOCKED_UA_PATTERNS.some((re) => re.test(blockUa))) {
		return new Response('Forbidden', { status: 403 });
	}

	const PREFIX = 'elite';
	const url = event.platform?.env?.UPSTASH_REDIS_REST_URL;
	const token = event.platform?.env?.UPSTASH_REDIS_REST_TOKEN;

	let debug = 'no-creds';
	if (url && token) {
		debug = 'attempted';
		const today = new Date().toISOString().slice(0, 10);
		const ua = event.request.headers.get('user-agent') || 'unknown';

		fetch(`${url}/pipeline`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				['INCR', `${PREFIX}:stats:page_views`],
				['INCR', `${PREFIX}:stats:page_views:${today}`],
				['HINCRBY', `${PREFIX}:stats:sse_connections:detail`, ua, 1]
			])
		}).catch(() => {}); // silent — observability never breaks the request path
	}

	const response = await resolve(event);
	// DEBUG: tells us via curl whether the hook ran. Remove after diagnosis.
	response.headers.set('x-faf-hook', debug);
	return response;
};
