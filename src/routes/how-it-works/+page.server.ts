// No-op server-load — forces SSR so hooks.server.ts fires (stats counter +
// bot-block both run). Same pattern as the homepage; see +page.server.ts at
// route root for the full reasoning.

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { ssrAt: Date.now() };
};
