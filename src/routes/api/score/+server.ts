import { json } from '@sveltejs/kit';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { parse } from 'yaml';

// Simple slot-based scoring (matches faf-cli logic)
function scoreFafContent(content: string): number {
	try {
		const data = parse(content);

		let filledSlots = 0;
		const totalSlots = 12;

		// Core project fields (3 slots)
		if (data?.project?.name) filledSlots++;
		if (data?.project?.goal) filledSlots++;
		if (data?.project?.main_language) filledSlots++;

		// Human context - 6 Ws (6 slots)
		const context = data?.human_context;
		if (context?.who && context.who !== 'TBD' && context.who !== 'Unknown') filledSlots++;
		if (context?.what && context.what !== 'TBD' && context.what !== 'Unknown') filledSlots++;
		if (context?.why && context.why !== 'TBD' && context.why !== 'Unknown') filledSlots++;
		if (context?.where && context.where !== 'TBD' && context.where !== 'Unknown') filledSlots++;
		if (context?.when && context.when !== 'TBD' && context.when !== 'Unknown') filledSlots++;
		if (context?.how && context.how !== 'TBD' && context.how !== 'Unknown') filledSlots++;

		// Stack section (expanded fields) (3 slots)
		const stack = data?.stack;
		if (stack?.backend || stack?.primary || stack?.runtime) filledSlots++;
		if (stack?.cicd || stack?.testing) filledSlots++;
		if (stack?.package_manager || stack?.packageManager) filledSlots++;

		// Calculate percentage
		const score = Math.round((filledSlots / totalSlots) * 100);

		return score;
	} catch (error) {
		console.error('❌ Scoring error:', error);
		return 0;
	}
}

export async function POST({ request }) {
	try {
		const { fafContent } = await request.json();

		if (!fafContent) {
			return json({ error: 'Missing fafContent' }, { status: 400 });
		}

		console.log('📄 Scoring .faf content with TypeScript engine');

		// Score using TypeScript logic
		const score = scoreFafContent(fafContent);

		console.log('✅ Score calculated:', score);

		return json({
			score,
			source: 'faf-typescript-engine',
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('❌ API error:', error);
		return json({
			error: 'Internal server error',
			details: error instanceof Error ? error.message : String(error)
		}, { status: 500 });
	}
}
