import { readFileSync } from 'node:fs';

/**
 * Score a .faf string with the EXACT cascade.wasm the app ships (static/), so
 * tests assert against the same scorer the dial uses — no drift. ABI: write the
 * input at INPUT_OFFSET (grow if needed), then score(offset, len).
 */
const OFF = 65536;
let exportsPromise: Promise<any> | null = null;

async function scorer(): Promise<any> {
	if (!exportsPromise) {
		exportsPromise = (async () => {
			const buf = readFileSync(new URL('../static/cascade.wasm', import.meta.url));
			const { instance } = await WebAssembly.instantiate(buf, { env: { abort: () => {} } });
			return instance.exports;
		})();
	}
	return exportsPromise;
}

export async function scoreFaf(text: string): Promise<number> {
	const ex = await scorer();
	const enc = new TextEncoder().encode(text);
	const need = OFF + enc.length;
	if (ex.memory.buffer.byteLength < need) {
		ex.memory.grow(Math.ceil((need - ex.memory.buffer.byteLength) / 65536));
	}
	new Uint8Array(ex.memory.buffer).set(enc, OFF);
	return ex.score(OFF, enc.length) as number;
}

/** Fill the builder seed's human slots (name, goal, who..how) with a value. */
export function fillSeed(seed: string, value = 'x'): string {
	return seed
		.replace(/^(  name:).*$/m, `$1 ${value}`)
		.replace(/^(  goal:).*$/m, `$1 ${value}`)
		.replace(/^(  who:).*$/m, `$1 ${value}`)
		.replace(/^(  what:).*$/m, `$1 ${value}`)
		.replace(/^(  why:).*$/m, `$1 ${value}`)
		.replace(/^(  where:).*$/m, `$1 ${value}`)
		.replace(/^(  when:).*$/m, `$1 ${value}`)
		.replace(/^(  how:).*$/m, `$1 ${value}`);
}
