import { expect, test } from '@playwright/test';

test.describe('Grok-FAF-Elite', () => {
	test('homepage loads with correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('Grok-FAF-Elite');
	});

	test('displays hero section with BigOrange', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('img', { name: 'Big Orange Logo' })).toBeVisible();
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Grok-FAF-Elite');
		await expect(page.getByText('Zero faff from day zero')).toBeVisible();
	});

	test('displays all three action buttons', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: /New Project/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /Add to GitHub Repo/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /Direct MCP URL/i })).toBeVisible();
	});

	test('New Project modal opens and shows commands', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /New Project/i }).click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText('New FAF Project')).toBeVisible();
		await expect(dialog.getByLabel('Project Name')).toBeVisible();
		await expect(dialog.getByText('npx create-faf-app')).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Copy Commands' })).toBeVisible();
	});

	test('GitHub modal opens and generates commands from URL', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /Add to GitHub Repo/i }).click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		// Enter a GitHub URL
		await dialog.getByLabel('GitHub Repository URL').fill('https://github.com/test/repo');

		// Commands should appear
		await expect(dialog.getByText('git clone https://github.com/test/repo')).toBeVisible();
		await expect(dialog.getByText('npx grok-faf-mcp init')).toBeVisible();
	});

	test('Direct URL modal shows MCP server URL', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /Direct MCP URL/i }).click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText('https://grok-faf-mcp.vercel.app/sse')).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Copy URL' })).toBeVisible();
	});

	test('modal closes with close button', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /New Project/i }).click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await dialog.getByRole('button', { name: 'Close modal' }).click();
		await expect(dialog).not.toBeVisible();
	});

	test('modal closes with Escape key', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /Direct MCP URL/i }).click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
	});

	test('footer links are present', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: 'grok-faf-mcp' })).toHaveAttribute(
			'href',
			'https://www.npmjs.com/package/grok-faf-mcp'
		);
		await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
			'href',
			'https://github.com/wolfe-jam/grok-faf-elite'
		);
	});
});
