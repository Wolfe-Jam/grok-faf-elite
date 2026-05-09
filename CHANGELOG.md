# Changelog

All notable changes to builder.faf.one (grok-faf-elite) will be documented in this file.

## [0.9.1] - 2026-05-08 — OG image wire-up + URL/meta freshness

### Changed
- **`+layout.svelte`** — fixed stale `zero-faf-builder-amg.vercel.app` URL across `og:url`, `og:image`, `twitter:image`. Default site OG meta now points at `https://builder.faf.one` and `https://mcpaas.live/og/Wolfe-Jam/faf-cli.png` (faf-cli's Trophy card as the canonical default preview).
- **Description copy** in default OG / Twitter meta updated to current positioning: *"The first IANA-registered Context score for repos. 100% 🏆 = AI Optimised. FAF don't lie."* (per `memory/trophy-is-ai-optimised-certification.md` and `memory/faf-dont-lie-deterministic-scoring.md`).
- **Theme color** `#FF8C00` → `#0a0a0a` to match the actual dark FAF aesthetic on the page.

### Added
- **`+page.server.ts`** parses `?repo=<owner>/<repo>` query param at SSR time, validates shape (`/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/`), passes to the page as `data.repo`. Social card crawlers don't run JS, so per-repo OG meta MUST be in the SSR'd HTML.
- **`+page.svelte`** `<svelte:head>` block conditionally overrides `og:url`, `og:title`, `og:image`, `twitter:title`, `twitter:image` when `data.repo` is set. The OG image points at `https://mcpaas.live/og/<owner>/<repo>.png` — the dynamic per-repo card endpoint shipped in mcpaas-cf v1.5.15.

### Result
Sharing `https://builder.faf.one/?repo=Wolfe-Jam/faf-cli` on X / Slack / Discord / LinkedIn now renders a 1200×630 card with the repo's tier emoji, score, and FAF brand line — instead of a plain link. Every shared score becomes a card preview.

### Doctrine
- Memory: `trophy-is-ai-optimised-certification.md` — OG card is the "everybody knows" layer made visible
- Memory: `faf-dont-lie-deterministic-scoring.md` — same positioning across the score page, the badge, and now the OG card



## [0.9.0] - 2026-05-06 — Cloudflare migration + tier doctrine + web-intent share

### Changed (the big one — platform migration)
- **Migrated from Vercel + `@sveltejs/adapter-vercel` to Cloudflare Workers + `@sveltejs/adapter-cloudflare`.**
  `hooks.server.ts` had not fired reliably under adapter-vercel across 4 prior fix attempts
  (`prerender = false` at layout, `+page.server.ts` no-op load, `process.env` over `$env/dynamic`,
  root `middleware.js`). Under adapter-cloudflare it fires every request — proven by the
  `x-faf-hook: attempted` response header.
- `process.env.*` → `event.platform.env.*` across `hooks.server.ts`, `src/lib/x-api.ts`,
  and the API route handlers (`add-faf`, `commit-faf`, `post`).
- `$env/static/private` imports retired — `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` now read
  from `event.platform.env` at runtime (no build-time secret baking).
- `src/app.d.ts` — `App.Platform.env` typed for the 4 runtime secrets.
- `wrangler.jsonc` added with `nodejs_compat` (for Node `crypto` in OAuth signing).
- Custom domain `builder.faf.one` cut from Vercel to a Cloudflare Worker custom domain
  (cert auto-issued by CF, DNS proxied through CF).
- Vercel project for `xai-faf-elite` / `grok-faf-elite` deleted — single source of truth
  is now the Cloudflare Worker.

### Changed (tier doctrine alignment)
- All tier-emoji ladders aligned with `~/FAF/cli/src/core/tiers.ts` (the source of truth).
  Trophy 🏆 is the ONLY emoji; sub-Trophy uses clean Unicode geometric symbols (★ ◆ ◇ ● ○ ♡).
  Retired emojis (🥇 🥈 🥉 🟢 🟡 🔴 🤍) and `>= 105 → 🍊` ghost branches are gone from:
  - `src/lib/tiers.ts` (NEW — ports faf-cli's TIERS verbatim)
  - `src/routes/+page.svelte` (homepage YOUR SCORE display)
  - `src/lib/components/ScoreRepo.svelte` (score result component)
  - `src/routes/auth/callback/+page.svelte` (post-OAuth tier display)
  - `src/routes/diagrams/builder-flow/+page.svelte` (marketing diagram)

### Added
- `src/lib/share.ts` — single source for web-intent X share URLs. Two helpers:
  `buildScoreShareUrl(input)` for Trophy-aware score shares, and `buildShareUrl(text, url?)`
  for free-form shares. Intent URL uses `?text=...&url=...` separately so X renders a
  card preview below the tweet.

### Removed
- `src/lib/x-api.ts` (124 LOC) — dead OAuth 1.0a code, never had a UI caller.
- `src/routes/api/post/+server.ts` (58 LOC) — the endpoint nothing called.
- `src/lib/components/ScoreRepo.svelte.old` — stale Feb backup.
- 4 X-token entries in `src/app.d.ts Platform.env` (no longer used).

### Fixed
- `src/lib/components/BiSyncPost.svelte` default share template — stale URL
  `https://zero-faf-builder-amg.vercel.app` corrected to `https://builder.faf.one`.

### Bot-block (Edge layer)
- `hooks.server.ts` now blocks `YellowMCP-HealthChecker`, `YellowMCP-SecurityScanner`,
  `Chiark`, and `TacaraBot` UAs with 403 before any work or stats writes.
  This is the same block deployed across the 4 Vercel-hosted MCP apps tonight.

### Doctrine references (memory)
- `memory/trophy-is-ai-optimised-certification.md` — Trophy 🏆 = "100% AI Optimised" functional cert.
- `memory/faf-dont-lie-deterministic-scoring.md` — score positioning ("FAF don't lie").
- `memory/feedback-tier-symbols.md` — tier symbols doctrine (already locked 2026-04-29).
- `memory/builder-faf-one-evolution-arc.md` — "today scorer, tomorrow builder. Don't rename."
- `memory/builder-faf-one-grok-pivot-history.md` — repo-name origin (grok-faf-elite → builder pivot).

## [0.8.0] - 2026-02-07

### Fixed
- **ML Framework Detection**: Now detects JAX/PyTorch/TensorFlow from README when no dependency file exists
- **main_language Accuracy**: Uses GitHub API language instead of stack detection
- **Type Detection**: Correctly identifies ml-research projects (was: library for all)

### Tests
- All test suite passing (4/4 tests)
- Grok-1 now generates correctly: Python/JAX/ml-research (was: Unknown/Unknown/library)

### Technical
- Phase 1-3 complete per DOUBLE-WHAMMY plan
- Rust WASM generator: 318KB optimized build
- Systematic execution of planned phases

## [0.7.0] - 2026-02-07

### Added
- WASM test marker for deployment verification
- Improved project.faf documentation
- Updated dependencies to latest versions

### Changed
- Updated to faf-wasm-sdk v1.2.2
- Enhanced project description and features
- Bumped AI-readiness score to 98%

### Technical
- Direct WASM copy to static/ (no npm caching issues)
- Version alignment across package.json and project.faf

## [0.6.0] - 2026-02-07

### Added
- GitHub OAuth integration for committing .faf files
- Environment variables setup for Vercel deployment

### Fixed
- Generic type slot count (9 → 12 slots)
- Test suite now 100% passing (4/4 tests)
- RESTAPI project scoring accuracy

## [0.5.0] - 2026-02-06

### Added
- Rust WASM generator (211KB, ~3ms generation)
- Zig WASM scorer (2.7KB, ~14μs scoring)
- DOUBLE-WHAMMY architecture (generate + score in browser)
- Real-time scoring display
- Download .faf functionality

### Features
- One-click .faf generation for any GitHub repo
- Automatic language and type detection
- Multi-language support (Python, JavaScript, Rust, Go, etc.)
- Project type detection (web-app, library, ml-research, etc.)

## [0.1.0] - 2026-01-28

### Initial Release
- Basic UI for FAF builder
- GitHub API integration
- SvelteKit 5 + Svelte 5 runes
- Tailwind CSS 4
- Vercel deployment
