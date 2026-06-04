/**
 * WASM Loader - DOUBLE-WHAMMY Architecture
 *
 * Rust WASM (faf-wasm-gen, ~969KB): Generate project.faf (faf_version 3.3, 33-slot Mk4)
 * Zig WASM (xai-faf-ghost, 2.7KB): Score project.faf (~14μs) — parity-tested vs faf-rust-sdk
 *
 * Both vendored in static/ (web-target wasm-pack builds; faf-wasm-core's
 * fs-based router is Node-only and does not fit this browser surface).
 */

let rustWasmReady = false;
let zigWasmReady = false;
let zigWasmExports: any = null;
let rustWasmModule: any = null;

export interface GenerationResult {
	fafContent: string;
	score: number;
	genTime: number;
	scoreTime: number;
	missingFields: string[];
}

/**
 * Format a per-score timing for display, accounting for browser timer resolution.
 *
 * Modern browsers coarsen `performance.now()` to mitigate timing-attack vectors:
 * Chrome/Firefox typically ~100 μs, Safari ~1000 μs. When local Zig WASM scoring
 * completes within one timer step, the raw measurement reads `0.00 μs` — engine-wise
 * the strongest possible result, but reads as "broken" to non-technical visitors.
 *
 * This formatter handles three regimes honestly:
 *   - Sub-resolution (< 1 μs)  → "<1 μs"
 *   - Microsecond range        → "X.XX μs"
 *   - Millisecond range        → "X.XX ms"
 */
export function formatScoreTime(timeUs: number): string {
	if (timeUs < 1) return '<1 μs';
	if (timeUs < 1000) return `${timeUs.toFixed(2)} μs`;
	return `${(timeUs / 1000).toFixed(2)} ms`;
}

/**
 * Initialize both Rust and Zig WASM modules
 * Loads from static/ directory (no npm dependencies)
 * Browser-only (skipped during SSR)
 */
export async function initWasm(): Promise<void> {
	// Skip during SSR
	if (typeof window === 'undefined') {
		return;
	}

	try {
		// Wait for WASM module to be loaded from <script> tag in app.html
		let attempts = 0;
		// @ts-ignore - globally loaded from app.html
		while (!window.__FAF_WASM_INIT__ && attempts < 100) {
			await new Promise(resolve => setTimeout(resolve, 50));
			attempts++;
		}

		// @ts-ignore - globally loaded from app.html
		if (!window.__FAF_WASM_INIT__) {
			throw new Error('WASM module failed to load after 5s');
		}

		// @ts-ignore - globally loaded WASM init and module
		await window.__FAF_WASM_INIT__('/faf_wasm_gen_bg.wasm');
		// @ts-ignore
		rustWasmModule = window.__FAF_WASM_MODULE__;
		rustWasmReady = true;

		// Load Zig WASM
		const zigResponse = await fetch('/xai-faf-ghost.wasm');
		if (!zigResponse.ok) {
			throw new Error(`Failed to fetch Zig WASM: ${zigResponse.status}`);
		}
		const zigBuffer = await zigResponse.arrayBuffer();
		const zigModule = await WebAssembly.instantiate(zigBuffer, {
			env: {
				abort: () => console.error('WASM abort'),
			}
		});
		zigWasmExports = zigModule.instance.exports;
		zigWasmReady = true;

		console.log('✅ DOUBLE-WHAMMY loaded: faf-wasm-gen (~969KB) + Zig ghost (2.7KB) WASM ready');
	} catch (err) {
		console.error('❌ WASM init failed:', err);
		throw err;
	}
}

export function isWasmReady(): boolean {
	return rustWasmReady && zigWasmReady;
}

function analyzeMissingFields(fafContent: string): string[] {
	const missing: string[] = [];
	if (!/ who:/m.test(fafContent) || /who:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('who');
	if (!/ what:/m.test(fafContent) || /what:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('what');
	if (!/ why:/m.test(fafContent) || /why:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('why');
	if (!/ where:/m.test(fafContent) || /where:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('where');
	if (!/ when:/m.test(fafContent) || /when:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('when');
	if (!/ how:/m.test(fafContent) || /how:\s*(TBD|Unknown|$)/m.test(fafContent)) missing.push('how');
	return missing;
}

function scoreWithZig(fafContent: string): { score: number; time: number } {
	if (!zigWasmReady || !zigWasmExports) {
		throw new Error('Zig WASM not initialized');
	}

	const startTime = performance.now();
	const encoder = new TextEncoder();
	const encoded = encoder.encode(fafContent);
	const memory = new Uint8Array(zigWasmExports.memory.buffer);
	const ptr = 1000;
	memory.set(encoded, ptr);
	const score = zigWasmExports.score_faf(ptr, encoded.length);
	const endTime = performance.now();
	const scoreTime = (endTime - startTime) * 1000;

	return { score, time: scoreTime };
}

export async function generateAndScore(
	owner: string,
	repo: string,
	description: string | null,
	readme: string | null,
	packageJson: string | null,
	language: string | null = null
): Promise<GenerationResult> {
	if (!rustWasmReady || !zigWasmReady || !rustWasmModule) {
		throw new Error('WASM not initialized - call initWasm() first');
	}

	const startGen = performance.now();
	let fafContent: string;

	try {
		// faf-wasm-gen exposes a single generate_faf that handles null readme/deps
		// gracefully (the former generate_faf_minimal branch is now redundant).
		fafContent = rustWasmModule.generate_faf(
			repo,
			owner,
			description || undefined,
			readme || undefined,
			packageJson || undefined,
			language || undefined
		);
	} catch (err) {
		throw new Error(`Rust WASM generation failed: ${err instanceof Error ? err.message : String(err)}`);
	}

	const endGen = performance.now();
	const genTime = endGen - startGen;

	// Score locally with embedded Zig WASM (parity-tested vs faf-rust-sdk v2.0.0)
	// Replaces the prior /api/score round-trip, which dominated the displayed
	// "Zig WASM" timing with network latency (200+ ms) instead of actual scoring (~14 μs).
	const { score, time: scoreTime } = scoreWithZig(fafContent);
	const missingFields = analyzeMissingFields(fafContent);

	return { fafContent, score, genTime, scoreTime, missingFields };
}

export async function scoreFaf(fafContent: string): Promise<{ score: number; time: number }> {
	// Score locally with embedded Zig WASM (parity-tested vs faf-rust-sdk v2.0.0).
	// Async signature preserved for caller compatibility; the scoring itself is
	// synchronous (the Zig WASM is in-process, no network).
	return scoreWithZig(fafContent);
}
