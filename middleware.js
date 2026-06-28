// Bot-block at the Cloudflare edge — fires BEFORE the SvelteKit adapter, so this
// runs whether the route prerenders or SSRs. The hooks.server.ts block-by-UA
// stays in place as a belt-and-braces second layer for SSR routes.
//
// Background: hooks.server.ts only fires on server-rendered routes. SvelteKit
// has skipped firing it on this project across 3 prior fix attempts
// (prerender=false at layout, +page.server.ts no-op load, $env→process.env).
// Edge middleware is independent of all that.

export const config = {
  matcher: ['/((?!_next/|_vercel/|.*\\.(?:ico|png|svg|jpg|jpeg|webp|wasm|woff2?|css|js|map)$).*)'],
};

const BLOCKED_UA_PATTERNS = [/YellowMCP/i, /Chiark/i, /TacaraBot/i];

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    return new Response('Forbidden', { status: 403 });
  }
}
