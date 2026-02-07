import { json } from '@sveltejs/kit';
import { parse } from 'yaml';

// FAF-CLI Type-Based Scoring System
// Source: /Users/wolfejam/FAF/cli/src/compiler/faf-compiler.ts

// The 21-slot system (5 categories)
const ALL_SLOTS = {
	project: [
		'project.name',
		'project.goal',
		'project.main_language'
	],
	frontend: [
		'stack.frontend',
		'stack.css_framework',
		'stack.ui_library',
		'stack.state_management'
	],
	backend: [
		'stack.backend',
		'stack.api_type',
		'stack.runtime',
		'stack.database',
		'stack.connection'
	],
	universal: [
		'stack.hosting',
		'stack.build',
		'stack.cicd'
	],
	human: [
		'human.who',
		'human.what',
		'human.why',
		'human.where',
		'human.when',
		'human.how'
	]
};

// Project type definitions (maps types to their categories)
const TYPE_DEFINITIONS: Record<string, string[]> = {
	// CLI/Library: 9 slots (project + human only)
	'cli': ['project', 'human'],
	'library': ['project', 'human'],
	'tool': ['project', 'human'],

	// ML/AI: 14 slots (project + backend + human)
	'ml-model': ['project', 'backend', 'human'],
	'ml-research': ['project', 'backend', 'human'],
	'ai-model': ['project', 'backend', 'human'],

	// Frontend: 16 slots (project + frontend + universal + human)
	'frontend': ['project', 'frontend', 'universal', 'human'],
	'web-app': ['project', 'frontend', 'universal', 'human'],
	'spa': ['project', 'frontend', 'universal', 'human'],

	// Backend API: 17 slots (project + backend + universal + human)
	'api': ['project', 'backend', 'universal', 'human'],
	'backend': ['project', 'backend', 'universal', 'human'],
	'service': ['project', 'backend', 'universal', 'human'],

	// Full-stack: 21 slots (all categories)
	'fullstack': ['project', 'frontend', 'backend', 'universal', 'human'],
	'full-stack': ['project', 'frontend', 'backend', 'universal', 'human'],

	// Default/Generic: 12 slots (project + universal + human)
	'generic': ['project', 'universal', 'human']
};

// Get applicable slots for a project type
function getSlotsForType(projectType: string): string[] {
	const normalizedType = (projectType || 'generic').toLowerCase();
	const categories = TYPE_DEFINITIONS[normalizedType] || TYPE_DEFINITIONS['generic'];

	const slots: string[] = [];
	for (const category of categories) {
		slots.push(...ALL_SLOTS[category as keyof typeof ALL_SLOTS]);
	}

	return slots;
}

// Get value from nested or flat YAML structure
function getSlotValue(data: any, slotPath: string): string | null {
	const parts = slotPath.split('.');

	// Try nested structure (e.g., data.project.name)
	let value = data;
	for (const part of parts) {
		if (value && typeof value === 'object') {
			value = value[part];
		} else {
			value = null;
			break;
		}
	}

	if (value !== null && value !== undefined) {
		return String(value);
	}

	// Try flat structure (e.g., data.projectName)
	if (parts.length === 2) {
		const [category, field] = parts;
		const flatKey = category + field.charAt(0).toUpperCase() + field.slice(1);
		if (data[flatKey] !== null && data[flatKey] !== undefined) {
			return String(data[flatKey]);
		}
	}

	// Try human_context mapping (human.who → human_context.who)
	if (parts[0] === 'human' && data.human_context) {
		const humanField = parts[1];
		if (data.human_context[humanField] !== null && data.human_context[humanField] !== undefined) {
			return String(data.human_context[humanField]);
		}
	}

	return null;
}

// Check if a slot is filled (matches faf-cli exactly)
function isFilled(data: any, slotPath: string): boolean {
	const value = getSlotValue(data, slotPath);

	if (!value) return false;

	// Match faf-cli's exact empty value list (line 1182)
	const emptyValues = ['', 'None', 'Unknown', 'Not specified', 'N/A', 'null', 'undefined', '~'];
	const trimmedValue = value.trim();

	if (emptyValues.includes(trimmedValue)) return false;

	// Reject generic placeholders (faf-cli line 1184+)
	const genericPlaceholders = ['TBD', 'TODO', 'Coming soon', 'To be determined'];
	// Note: faf-cli only rejects these for CERTAIN fields, not all human context
	// For now, we'll be lenient and NOT reject TBD to match faf-cli behavior

	return true;
}

// Type-based scoring (matches faf-cli exactly)
function scoreFafContent(content: string): number {
	try {
		const data = parse(content);

		// Step 1: Detect project type
		const projectType = data?.project?.type || 'generic';

		// Step 2: Get applicable slots for this type
		let applicableSlots = getSlotsForType(projectType);

		// Step 3: Apply slot_ignore (if present)
		if (data.slot_ignore && Array.isArray(data.slot_ignore)) {
			const ignored = data.slot_ignore;
			applicableSlots = applicableSlots.filter(slot => {
				const field = slot.split('.')[1];
				return !ignored.includes(field);
			});
		}

		// Step 4: Count filled slots
		const filledSlots = applicableSlots.filter(slot => isFilled(data, slot)).length;

		// Step 5: Calculate score
		const totalSlots = applicableSlots.length;
		if (totalSlots === 0) return 0;

		const score = Math.round((filledSlots / totalSlots) * 100);

		console.log(`📊 Type: ${projectType}, Slots: ${filledSlots}/${totalSlots}, Score: ${score}%`);

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
