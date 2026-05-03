// Stats middleware — fire-and-forget Redis counters in shared faf-vercel-apps DB.
// Pattern mirrors faf-mcp / claude-faf-mcp / grok-faf-mcp. Prefix `elite:` per
// architecture doctrine — grok-faf-elite is the Grok premium UI tier (1-click
// FAST⚡AF, scoring) sitting on top of grok-faf-mcp.
//
// SvelteKit-specific: uses $env/dynamic/private for runtime Vercel envs
// (process.env may be bundled out by the Vite build).

import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	const PREFIX = 'elite';
	const url = env.UPSTASH_REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN;

	if (url && token) {
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

	return resolve(event);
};
