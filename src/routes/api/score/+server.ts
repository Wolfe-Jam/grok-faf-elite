import { json } from '@sveltejs/kit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

export async function POST({ request }) {
	try {
		const { fafContent } = await request.json();

		if (!fafContent) {
			return json({ error: 'Missing fafContent' }, { status: 400 });
		}

		// Write .faf to temp file
		const tempFile = join(tmpdir(), `faf-score-${Date.now()}.faf`);
		await writeFile(tempFile, fafContent, 'utf-8');

		console.log('📄 Scoring with faf-cli:', tempFile);

		try {
			// Run faf-cli score
			const { stdout, stderr } = await execAsync(`faf score ${tempFile} --json`, {
				timeout: 10000,
				maxBuffer: 1024 * 1024 // 1MB
			});

			// Parse JSON output
			let result;
			try {
				result = JSON.parse(stdout);
			} catch (parseError) {
				// If --json not supported, parse text output
				console.log('faf-cli output:', stdout);

				// Extract score from text output (e.g., "Score: 43/100")
				const scoreMatch = stdout.match(/Score:\s*(\d+)\/100/i) ||
				                  stdout.match(/(\d+)%/);

				if (scoreMatch) {
					const score = parseInt(scoreMatch[1], 10);
					result = { score };
				} else {
					throw new Error('Could not parse faf-cli output');
				}
			}

			// Cleanup temp file
			await unlink(tempFile).catch(() => {});

			console.log('✅ faf-cli score:', result.score);

			return json({
				score: result.score || 0,
				source: 'faf-cli',
				timestamp: new Date().toISOString()
			});

		} catch (execError) {
			// Cleanup on error
			await unlink(tempFile).catch(() => {});

			console.error('❌ faf-cli error:', execError);

			return json({
				error: 'faf-cli execution failed',
				details: execError instanceof Error ? execError.message : String(execError)
			}, { status: 500 });
		}

	} catch (error) {
		console.error('❌ API error:', error);
		return json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
}
