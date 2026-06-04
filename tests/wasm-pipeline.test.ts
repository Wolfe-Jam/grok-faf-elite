import { test, expect } from '@playwright/test';

/**
 * Verifies the live DOUBLE-WHAMMY pipeline end-to-end, in-browser:
 *   faf-wasm-gen (Rust) generates a v3.3 / 33-slot .faf
 *   → the Zig ghost scores it to a sane number.
 *
 * This is the core value path of builder.faf.one and was previously untested
 * (the rewire from faf-wasm-sdk@1.x → faf-wasm-gen@2.0.0 exposed the gap).
 */
test('faf-wasm-gen generates v3.3 .faf and the Zig ghost scores it', async ({ page }) => {
	await page.goto('/');
	// app.html puts the Rust gen module on window; wait for it.
	await page.waitForFunction(
		() => (window as any).__FAF_WASM_MODULE__ !== undefined && (window as any).__FAF_WASM_INIT__ !== undefined,
		{ timeout: 15000 }
	);

	const result = await page.evaluate(async () => {
		const init = (window as any).__FAF_WASM_INIT__;
		const mod = (window as any).__FAF_WASM_MODULE__;
		// init the Rust gen wasm (idempotent enough for a probe), then generate.
		await init('/faf_wasm_gen_bg.wasm');
		const faf: string = mod.generate_faf(
			'demo-repo',
			'owner',
			undefined,
			'# Demo\n\n## Usage\n\ncargo install demo-repo',
			undefined,
			'Rust'
		);

		// Score with the same ZEPH cascade the app uses (ABI: score(offset,len), grow).
		const resp = await fetch('/cascade.wasm');
		const buf = await resp.arrayBuffer();
		const zig = await WebAssembly.instantiate(buf, { env: { abort: () => {} } });
		const exp: any = zig.instance.exports;
		const enc = new TextEncoder().encode(faf);
		const OFF = 65536;
		const need = OFF + enc.length;
		if (exp.memory.buffer.byteLength < need) exp.memory.grow(Math.ceil((need - exp.memory.buffer.byteLength) / 65536));
		new Uint8Array(exp.memory.buffer).set(enc, OFF);
		const score: number = exp.score(OFF, enc.length);

		return { faf, score };
	});

	// Generation: current format + real content
	expect(result.faf).toContain('faf_version: "3.3"');
	expect(result.faf).toContain('human_context:');
	expect(result.faf).toContain('name: demo-repo');

	// Scoring: the Feb Zig ghost must produce a SANE score for the new format
	expect(typeof result.score).toBe('number');
	expect(Number.isFinite(result.score)).toBe(true);
	expect(result.score).toBeGreaterThan(0);
	expect(result.score).toBeLessThanOrEqual(100);
});
