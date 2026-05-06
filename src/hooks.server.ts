// Stats middleware — fire-and-forget Redis counters in shared faf-vercel-apps DB.
// Pattern mirrors faf-mcp / claude-faf-mcp / grok-faf-mcp. Prefix `elite:` per
// architecture doctrine — grok-faf-elite is the Grok premium UI tier (1-click
// FAST⚡AF, scoring) sitting on top of grok-faf-mcp.
//
// Uses process.env directly — SvelteKit + adapter-vercel runs on Node Serverless,
// process.env IS available at runtime. ($env/dynamic/private had timing issues here.)

import type { Handle } from '@sveltejs/kit';

const BLOCKED_UA_PATTERNS = [/YellowMCP/i, /Chiark/i, /TacaraBot/i];

export const handle: Handle = async ({ event, resolve }) => {
	// Bot-block — agent-quality-index scanners hold Fluid Compute slots without
	// providing adoption value. Block before any work or stats writes.
	const blockUa = event.request.headers.get('user-agent') || '';
	if (BLOCKED_UA_PATTERNS.some((re) => re.test(blockUa))) {
		return new Response('Forbidden', { status: 403 });
	}

	const PREFIX = 'elite';
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;

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
