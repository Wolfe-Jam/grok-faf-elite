# builder.faf.one

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black)](https://builder.faf.one)
[![FAF](https://img.shields.io/badge/FAF-98%25-orange)](https://faf.one)
[![Version](https://img.shields.io/badge/version-0.7.0-blue)](https://github.com/Wolfe-Jam/grok-faf-elite/releases)

**Instant AI context for your repos.** Paste a GitHub URL, get perfect .faf in one click.

F1-Inspired championship-grade toolchain: Rust WASM (211KB generation) + Zig WASM (2.7KB scoring).

## Features

- **One-Click Generation**: Paste GitHub URL → Generate .faf in ~3ms
- **Dual WASM Engine**: Rust generator + Zig scorer (71,428 scores/sec)
- **Real-Time Scoring**: 0-100% AI-readiness score instantly
- **GitHub OAuth**: Commit directly to your repo or download
- **Multi-Language Support**: Python, JavaScript, Rust, Go, Java, C++, and more
- **Type Detection**: Auto-detects web-app, library, ml-research, cli-tool, etc.

## Tech Stack

**Frontend:**
- SvelteKit 5 with Svelte 5 runes ($state, $props, $effect)
- Tailwind CSS 4 with @theme
- TypeScript strict mode

**WASM Toolchain:**
- Rust WASM (faf-wasm-sdk v1.2.2) - 211KB generator
- Zig WASM (xai-faf-ghost) - 2.7KB scorer, 14μs scoring time

**Infrastructure:**
- Vercel Edge deployment
- GitHub OAuth integration
- GitHub API (repo metadata, README fetching)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Type Check

```bash
npm run check
```

## Performance

**Bundle Sizes:**
- Client bundle: ~14 kB (5.3 kB gzip)
- CSS: ~21 kB (4.5 kB gzip)
- Rust WASM: 211 KB (one-time load, cached forever)
- Zig WASM: 2.7 KB

**Speed:**
- .faf Generation: ~3ms (Rust WASM)
- Scoring: ~14μs (Zig WASM, 71,428 scores/second)
- Build time: <5s
- Total end-to-end: <100ms (including GitHub API)

## Links

- [grok-faf-mcp on npm](https://www.npmjs.com/package/grok-faf-mcp)
- [MCP Server URL](https://mcpaas.live/grok/mcp/v1) — hosted on Cloudflare Workers, sub-ms cold start. Discovery: [/info](https://mcpaas.live/grok/mcp/v1/info)
- [FAF Format](https://faf.one)
- [GitHub](https://github.com/Wolfe-Jam/grok-faf-elite)

## License

MIT - Free forever. Juice UP your repos!
