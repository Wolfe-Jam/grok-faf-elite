// No-op server-load function. The mere presence of this file forces SvelteKit
// to invoke the server runtime for the homepage on every request — which means
// hooks.server.ts fires, which means our Redis stats counters increment.
//
// Without this file, +page.svelte (pure client-side with onMount + WASM) gets
// served as a static asset bundle, bypassing the server runtime entirely.
// Hook never fires, counters never increment.
//
// Diagnosed 2026-05-03 after Safari real-user testing showed only Vercel-internal
// favicon-crawler hits firing the hook. See task #31 in the project task list.

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { ssrAt: Date.now() };
};
