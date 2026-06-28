// No-op server-load function. The mere presence of this file forces SvelteKit
// to invoke the server runtime for the homepage on every request — which means
// hooks.server.ts fires, which means our Redis stats counters increment.
//
// Without this file, +page.svelte (pure client-side with onMount + WASM) gets
// served as a static asset bundle, bypassing the server runtime entirely.
// Hook never fires, counters never increment.
//
// Diagnosed 2026-05-03 after Safari real-user testing showed only internal
// favicon-crawler hits firing the hook. See task #31 in the project task list.

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Parse the ?repo= query param at SSR time so the OG meta tag in
	// +page.svelte renders the per-repo dynamic OG image. Social-card
	// crawlers (X / LinkedIn / Slack) don't execute JS — they only see
	// the SSR'd HTML, so this MUST happen server-side.
	const repoParam = url.searchParams.get('repo');

	// Validate shape: "owner/repo" with safe chars only. Anything else
	// falls back to the default OG image.
	let repo: string | null = null;
	if (repoParam && /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(repoParam)) {
		repo = repoParam;
	}

	return { ssrAt: Date.now(), repo };
};
