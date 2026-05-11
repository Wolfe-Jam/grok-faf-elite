/**
 * GET /api/trophy-count — reads the live Trophy cohort counter from Upstash.
 *
 * Counter is incremented by /api/commit-faf when a repo commits at score === 100.
 * Cumulative key: `elite:stats:trophy_count`. Per-day key: `elite:stats:trophy_count:YYYY-MM-DD`.
 *
 * Returns:
 *   { count: number, today: number }   — both numbers, 0 if Upstash unset
 *
 * Failures (Upstash down, creds missing) return { count: 0, today: 0 } rather
 * than 500 — homepage shows nothing if the counter can't be read, never breaks
 * the page render.
 *
 * Cache: 60s edge / 5min CDN — counter changes infrequently but freshness
 * matters for the social-proof signal.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const url = platform?.env?.UPSTASH_REDIS_REST_URL;
	const token = platform?.env?.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) {
		return json({ count: 0, today: 0 }, {
			headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' }
		});
	}

	const today = new Date().toISOString().slice(0, 10);

	try {
		// Pipeline GET both keys at once — single Upstash round-trip.
		const res = await fetch(`${url}/pipeline`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				['GET', 'elite:stats:trophy_count'],
				['GET', `elite:stats:trophy_count:${today}`]
			])
		});

		if (!res.ok) {
			return json({ count: 0, today: 0 }, {
				headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' }
			});
		}

		const data = await res.json() as Array<{ result: string | null }>;
		const count = Number(data?.[0]?.result ?? 0) || 0;
		const todayCount = Number(data?.[1]?.result ?? 0) || 0;

		return json({ count, today: todayCount }, {
			headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' }
		});
	} catch {
		return json({ count: 0, today: 0 }, {
			headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' }
		});
	}
};
