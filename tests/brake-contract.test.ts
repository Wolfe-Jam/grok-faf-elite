import { test, expect } from '@playwright/test';
import { seedFaf, buildExport } from '../src/lib/faf-export';
import { scoreFaf, fillSeed } from './helpers';

/**
 * 🛑 BRAKE — must never fail. Locks the .faf single truth the builder depends on
 * (faf-format-single-truth-33-slot): an `intent` .faf has 9 active slots; a full
 * human run = a REAL 100%; slotignored is canonical (kept, not stripped); the
 * export adds only canonical fields and never changes the score; the dial % and
 * the exported file's real score agree (FAF don't lie). Scored with the exact
 * cascade.wasm the app ships.
 */
test.describe('🛑 Brake — scoring contract (single truth)', () => {
	test('blank seed scores low; a full human run scores 100%', async () => {
		const blank = seedFaf();
		expect(await scoreFaf(blank)).toBeLessThan(20);
		const full = fillSeed(blank);
		expect(await scoreFaf(full)).toBe(100);
	});

	test('it is the 8 human answers that reach 100% (intent = 9 active, main_language slotignored)', async () => {
		// fill everything EXCEPT main_language (which the seed slotignores) → still 100
		expect(await scoreFaf(fillSeed(seedFaf()))).toBe(100);
	});

	test('the seed keeps slotignored (canonical N/A marker), not stripped to empty', () => {
		expect(seedFaf()).toContain('slotignored');
		expect(seedFaf()).toContain('type: intent');
	});
});

test.describe('🛑 Brake — export transform', () => {
	const stamp = '2026-06-05T00:00:00.000Z';

	test('export adds only canonical fields and keeps the score at 100%', async () => {
		const full = fillSeed(seedFaf());
		const out = buildExport(full, { pct: 100, stamp });
		expect(out).toContain('app_type: intent');
		expect(out).toContain(`generated: ${stamp}`);
		expect(out).toContain('context: |');
		expect(out).toContain('slotignored'); // kept, not stripped
		// the scored slots are untouched → still a real 100%
		expect(await scoreFaf(out)).toBe(100);
	});

	test('FAF don\'t lie: the % stamped in the primer equals the file\'s real score', async () => {
		const full = fillSeed(seedFaf());
		const real = await scoreFaf(full);
		const out = buildExport(full, { pct: real, stamp });
		expect(out).toContain(`${real}% complete for that type`);
		expect(await scoreFaf(out)).toBe(real);
	});

	test('dropdown target rides in context: only when chosen', () => {
		const full = fillSeed(seedFaf());
		expect(buildExport(full, { pct: 100, stamp })).not.toContain('intended type:');
		const withTarget = buildExport(full, { pct: 100, target: 'mobile', stamp });
		expect(withTarget).toContain('intended type: mobile');
		expect(withTarget).toContain('set app_type: mobile');
	});

	test('export never invents non-canonical top-level keys', () => {
		const out = buildExport(fillSeed(seedFaf()), { pct: 100, stamp });
		for (const bad of ['source:', 'human_contribution:', 'ai_readiness:']) {
			expect(out).not.toContain(bad);
		}
	});
});
