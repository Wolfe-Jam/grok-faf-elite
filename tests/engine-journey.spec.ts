import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { scoreFaf } from './helpers';

/**
 * 🏎️ ENGINE — the real user journey in a real browser. Uses ?nodemo=1 so the
 * attract demo is off and the flow is deterministic. The star test downloads the
 * .faf and validates it with the same cascade.wasm the dial uses (UI → export →
 * canonical .faf, end to end).
 */

// (label fragment, answer) for the 8-question intent interview, in ask order.
const ANSWERS: [string, string][] = [
	['called', 'WJTTC Test Project'],
	['Your goal', 'A fast tool to prove the journey'],
	['Who is this for', 'Developers'],
	['What does it do', 'Captures project intent'],
	['Why does it exist', 'Eliminate context setup tax'],
	['Where does it', 'npm'],
	['When would', 'Starting a new project'],
	['How do you get', 'npm install, then run']
];

async function runInterview(page: Page) {
	await page.goto('/?nodemo=1');
	const input = page.locator('#ans');
	for (const [label, answer] of ANSWERS) {
		await expect(page.locator('.ask')).toContainText(label, { timeout: 20000 });
		await input.fill(answer);
		await input.press('Enter');
	}
}

test('reaches 100% and shows the success copy', async ({ page }) => {
	await runInterview(page);
	await expect(page.locator('.pct')).toContainText('100%', { timeout: 10000 });
	await expect(page.getByText('Your Context is optimised for AI to code')).toBeVisible({ timeout: 10000 });
});

test('★ Download produces a real .faf that validates at 100%', async ({ page }) => {
	await runInterview(page);
	await expect(page.locator('.pct')).toContainText('100%', { timeout: 10000 });

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		page.getByRole('button', { name: 'Download .faf' }).click()
	]);
	expect(download.suggestedFilename()).toBe('project.faf');
	const text = readFileSync(await download.path(), 'utf8');

	// canonical, aligned to the single truth
	expect(text).toContain('app_type: intent');
	expect(text).toContain('generated:');
	expect(text).toContain('context: |');
	expect(text).toContain('slotignored'); // kept, not stripped
	// and it scores a real 100% in the same scorer the dial uses
	expect(await scoreFaf(text)).toBe(100);
});

test('Copy puts the .faf on the clipboard (✓ Copied)', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await runInterview(page);
	await page.getByRole('button', { name: /^Copy$/ }).click();
	await expect(page.getByText('✓ Copied')).toBeVisible({ timeout: 5000 });
});

test('the "Building?" dropdown rides the chosen type into the .faf', async ({ page }) => {
	await runInterview(page);
	await page.locator('#apptype').selectOption('mobile');

	const [download] = await Promise.all([
		page.waitForEvent('download'),
		page.getByRole('button', { name: 'Download .faf' }).click()
	]);
	const text = readFileSync(await download.path(), 'utf8');
	expect(text).toContain('intended type: mobile');
	expect(text).toContain('set app_type: mobile');
	// scoring is unchanged by the bonus target — still a real 100%
	expect(await scoreFaf(text)).toBe(100);
});
