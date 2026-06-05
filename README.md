# builder.faf.one

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-deployed-orange)](https://builder.faf.one)
[![FAF](https://img.shields.io/badge/FAF-Trophy%20100%25-orange)](https://faf.one)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/Wolfe-Jam/grok-faf-elite)

**Make your AI happy.** 🏆

**AI thrives on facts — and `.faf` provides them.** Your AI does its best work when it understands your project, so **builder.faf.one** helps you create one small file — `project.faf` — that tells any AI what you're building, who it's for, and why. Hand it over, and your AI stops guessing.

→ **Try it: [builder.faf.one](https://builder.faf.one)**

## How it works

A few quick questions. As you answer, a score climbs toward 100%.

1. **Start typing** — or paste a GitHub link and we'll fill in what we can.
2. **Answer a few questions** — who it's for, what it does, why it exists. Press **Tab** to accept a suggestion, **Enter** to move on.
3. **Reach 100%** — download your `project.faf` and give it to your AI: Claude, Grok, Gemini, Cursor — any of them.

That's it. Your AI is now on the same page as you.

## What's a .faf?

One small file with the facts about your project, written so any AI can read it. Think of it as a quick briefing you hand your AI before it starts — so it works *with* you instead of guessing.

<details>
<summary><b>What are the facts?</b></summary>

<br>

Your project's **structured data** — who it's for, what it does, why it exists, where it runs, and the stack it's built on.

<details>
<summary>How? <i>(deep dive)</i></summary>

<br>

A `.faf` is clean **YAML** organized into **slots**:

- **The 6 Ws** — who · what · why · where · when · how (the human context only you know)
- **The stack** — language, framework, runtime, database, hosting, build, CI…

Each filled slot is one fact your AI no longer has to guess. Slots that don't apply are marked `slotignored` — correctly scoped out, not missing. The score is simply *filled ÷ applicable*.

And it's an **open standard**: `.faf` is **[IANA-registered](https://faf.one)** (`application/vnd.faf+yaml`), so it's portable across any AI, tool, or editor. One file, human- and machine-readable.

</details>

</details>

The score isn't marking your code. It's how ready your project is for AI:

- a **low** score means *"your AI would have to guess here"*
- **100%** means it won't have to. 🏆

---

## For developers

builder.faf.one runs the real FAF engines right in your browser — no server round-trip:

- **Zig → WASM scorer** — 2.7 KB, ~14 µs per score. The same deterministic score the FAF CLI gives.
- **Rust → WASM generator** — turns a GitHub repo into a `.faf`.
- **Parity-verified** — the Rust and Zig engines agree on every score. The score doesn't lie.

**The fastest way to smarter code.** ⚡

### Develop

```bash
npm install
npm run dev      # dev server
npm run build    # production build (Cloudflare Workers)
npm run check    # TypeScript
npm run test     # Playwright E2E
```

### Stack

SvelteKit 5 (Svelte 5 runes) · Tailwind CSS 4 · TypeScript (strict) · Cloudflare Workers · Rust + Zig → WASM.

This repo dogfoods its own context — see [`project.faf`](./project.faf), Trophy 100%. 🏆

## Links

- **[builder.faf.one](https://builder.faf.one)** — the builder
- [FAF format](https://faf.one) — the standard
- [grok-faf-mcp on npm](https://www.npmjs.com/package/grok-faf-mcp)
- [MCP server](https://mcpaas.live/grok/mcp/v1) — Cloudflare Workers, sub-ms cold start

## License

MIT — free forever. Make your AI happy. 🏆
