/**
 * WASM Loader - DOUBLE-WHAMMY Architecture
 *
 * Rust WASM (312KB): Generate project.faf
 * Zig WASM (2.7KB): Score project.faf (14μs, 71K scores/sec)
 *
 * Both loaded from static/ directory (no npm dependencies)
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
 * Initialize both Rust and Zig WASM modules
 * Loads from static/ directory (no npm dependencies)
 * Browser-only (skipped during SSR)
 */
export async function initWasm(): Promise<void> {
	// Skip during SSR
	if (typeof window === 'undefined') {
		console.log('⏭️  Skipping WASM init during SSR');
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
		await window.__FAF_WASM_INIT__('/faf_wasm_sdk_bg.wasm');
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

		console.log('✅ DOUBLE-WHAMMY loaded: Rust (312KB) + Zig (2.7KB) WASM ready');
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
		if (readme || packageJson) {
			fafContent = rustWasmModule.generate_faf(
				repo,
				owner,
				description || undefined,
				readme || undefined,
				packageJson || undefined,
				language || undefined  // NEW: Pass language parameter
			);
		} else {
			fafContent = rustWasmModule.generate_faf_minimal(
				repo,
				owner,
				description || undefined,
				language || undefined
			);
		}
	} catch (err) {
		throw new Error(`Rust WASM generation failed: ${err instanceof Error ? err.message : String(err)}`);
	}

	const endGen = performance.now();
	const genTime = endGen - startGen;

	console.log('🚀 ABOUT TO CALL API /api/score');

	// Score with server-side faf-cli (matches production tool!)
	const scoreStart = performance.now();
	const scoreResponse = await fetch('/api/score', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ fafContent })
	});

	if (!scoreResponse.ok) {
		throw new Error(`Scoring failed: ${scoreResponse.status}`);
	}

	const scoreData = await scoreResponse.json();
	const scoreTime = (performance.now() - scoreStart) * 1000; // Convert to μs for consistency

	const score = scoreData.score;
	const missingFields = analyzeMissingFields(fafContent);

	console.log('✅ Server-side faf-cli score:', score);

	return { fafContent, score, genTime, scoreTime, missingFields };
}

export async function scoreFaf(fafContent: string): Promise<{ score: number; time: number }> {
	const startTime = performance.now();

	const response = await fetch('/api/score', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ fafContent })
	});

	if (!response.ok) {
		throw new Error(`Scoring failed: ${response.status}`);
	}

	const data = await response.json();
	const time = (performance.now() - startTime) * 1000; // Convert to μs

	return { score: data.score, time };
}
