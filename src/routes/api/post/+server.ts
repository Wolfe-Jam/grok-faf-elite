import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { postToX, getXCredentials } from '$lib/x-api';

export const POST: RequestHandler = async ({ request }) => {
	const credentials = getXCredentials();

	if (!credentials) {
		return json(
			{
				success: false,
				error: 'X API credentials not configured'
			},
			{ status: 500 }
		);
	}

	try {
		const body = await request.json();
		const { text } = body;

		if (!text || typeof text !== 'string') {
			return json(
				{
					success: false,
					error: 'Missing or invalid text parameter'
				},
				{ status: 400 }
			);
		}

		if (text.length > 280) {
			return json(
				{
					success: false,
					error: 'Tweet exceeds 280 character limit'
				},
				{ status: 400 }
			);
		}

		const result = await postToX(text, credentials);

		if (!result.success) {
			return json(result, { status: 500 });
		}

		return json(result);
	} catch (err) {
		return json(
			{
				success: false,
				error: err instanceof Error ? err.message : 'Failed to process request'
			},
			{ status: 500 }
		);
	}
};
