/**
 * WASM Loader - DOUBLE-WHAMMY Architecture
 *
 * Rust WASM (300KB): Generate project.faf
 * Zig WASM (2.7KB): Score project.faf (14μs, 71K scores/sec)
 */

import init, { generate_faf, generate_faf_minimal } from 'faf-wasm-sdk';

let rustWasmReady = false;
let zigWasmReady = false;
let zigWasmExports: any = null;

export interface GenerationResult {
	fafContent: string;
	score: number;
	genTime: number;
	scoreTime: number;
	missingFields: string[];
}

/**
 * Initialize both Rust and Zig WASM modules
 */
export async function initWasm(): Promise<void> {
	try {
		// Load Rust WASM using package's init with custom path
		await init('/faf_wasm_sdk_bg.wasm');
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

		console.log('✅ DOUBLE-WHAMMY loaded: Rust + Zig WASM ready');
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
	if (!rustWasmReady || !zigWasmReady) {
		throw new Error('WASM not initialized - call initWasm() first');
	}

	const startGen = performance.now();
	let fafContent: string;

	try {
		if (readme || packageJson) {
			fafContent = generate_faf(
				repo,
				owner,
				description || undefined,
				readme || undefined,
				packageJson || undefined
			);
		} else {
			fafContent = generate_faf_minimal(
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
	const { score, time: scoreTime } = scoreWithZig(fafContent);
	const missingFields = analyzeMissingFields(fafContent);

	return { fafContent, score, genTime, scoreTime, missingFields };
}

export function scoreFaf(fafContent: string): { score: number; time: number } {
	if (!zigWasmReady) throw new Error('Zig WASM not initialized');
	return scoreWithZig(fafContent);
}
