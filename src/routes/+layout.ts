// Force SSR on every request so hooks.server.ts fires for stats tracking.
// Without this, SvelteKit may auto-prerender the homepage (no server-only
// features detected) and serve static HTML — bypassing the hook entirely.
export const prerender = false;
