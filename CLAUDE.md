# CLAUDE.md - Grok-FAF-Elite

## Project Identity
- **Name**: grok-faf-elite
- **Purpose**: Instant AI context for your Repos
- **Edition**: F1-Inspired Elite Edition for elite devs
- **AI-Readiness**: 95%

## Tech Stack
- **Framework**: SvelteKit 5 with Svelte 5 runes
- **Styling**: Tailwind CSS 4 with @theme
- **Language**: TypeScript (strict mode)
- **Deployment**: Cloudflare Workers via @sveltejs/adapter-cloudflare (migrated 2026-05-06 from Vercel — adapter-vercel hooks.server.ts never fired reliably across 4 fix attempts)
- **Domain**: builder.faf.one (CF custom domain on the Worker)
- **Testing**: Playwright E2E

## Architecture
```
src/
├── lib/components/
│   ├── BigOrange.svelte    # Animated logo
│   ├── ActionButton.svelte # Reusable button with icon snippets
│   └── Modal.svelte        # Native dialog-based modal
├── routes/
│   ├── +layout.svelte      # App shell
│   └── +page.svelte        # Main page with 3 paths
└── app.css                 # Tailwind theme + animations
```

## Three User Paths
1. **New Project**: Create fresh FAF-ready project from template
2. **GitHub**: Add FAF to existing repository
3. **Direct URL**: Get MCP server URL for Grok

## Development Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run check    # TypeScript check
npm run test     # Run E2E tests
npm run preview  # Preview production build
```

## Performance
- Client bundle: 14 kB (5.3 kB gzip)
- CSS: 21 kB (4.5 kB gzip)
- Build time: 4-5s
- Zero TypeScript errors
- 9/9 E2E tests passing

## Brand
- Primary: Championship Orange oklch(0.75 0.18 50)
- Background: #000000
- Foreground: #ffffff

## Integrations
- grok-faf-mcp (npm: 75+ downloads)
- MCP Server: https://grok-faf-mcp.vercel.app/sse

## Hidden Pages (URL-only, no nav links)
- `/assets` - Visual assets dashboard (diagrams, GIFs, screenshots index)
- `/diagrams` - Diagram index
- `/diagrams/daaft-banner` - 5:2 X Article banner
- `/diagrams/daaft-flow` - DAAFT vs SMART flow comparison

**Full asset index:** `/Users/wolfejam/FAF-GOLD/PLANET-FAF/docs/VISUAL-ASSETS-INDEX.md`

---
**STATUS: BI-SYNC ACTIVE** - Synchronized with project.faf
---

**STATUS: BI-SYNC ACTIVE 🔗 - Synchronized with .faf context!**

*Last Sync: 2026-01-28T00:38:13.567Z*
*Sync Engine: F1-Inspired Software Engineering*
*🏎️⚡️_championship_sync*
