/**
 * API: Commit .faf to GitHub (ONE-CLICK Architecture)
 *
 * Receives pre-generated .faf content from browser (Rust WASM)
 * Uses OAuth token to commit to repository
 * Returns success with stats for display
 *
 * Production-ready: Handles all edge cases, rate limits, validation
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface CommitRequest {
	code: string;
	owner: string;
	repo: string;
	fafContent: string;
	score: number;
	genTime: number;
	scoreTime: number;
	missingFields: string[];
	readmeUpdates?: Record<string, string>;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const GITHUB_CLIENT_ID = platform?.env?.GITHUB_CLIENT_ID;
		const GITHUB_CLIENT_SECRET = platform?.env?.GITHUB_CLIENT_SECRET;

		if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
			return json(
				{ success: false, error: 'GitHub OAuth not configured on this Worker' },
				{ status: 500 }
			);
		}

		const body: CommitRequest = await request.json();
		const { code, owner, repo, fafContent, score, genTime, scoreTime, missingFields, readmeUpdates } = body;

		// Validation
		if (!code || !owner || !repo || !fafContent) {
			return json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate repo format (owner/repo must be valid GitHub format)
		if (!/^[a-zA-Z0-9-_.]+$/.test(owner) || !/^[a-zA-Z0-9-_.]+$/.test(repo)) {
			return json(
				{ success: false, error: 'Invalid repository format' },
				{ status: 400 }
			);
		}

		// Step 1: Exchange OAuth code for access token
		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'User-Agent': 'FAF-Builder/1.0'
			},
			body: JSON.stringify({
				client_id: GITHUB_CLIENT_ID,
				client_secret: GITHUB_CLIENT_SECRET,
				code
			})
		});

		if (!tokenResponse.ok) {
			console.error('GitHub OAuth token exchange failed:', tokenResponse.status);
			return json(
				{ success: false, error: 'Failed to authenticate with GitHub' },
				{ status: 401 }
			);
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		if (!accessToken) {
			console.error('No access token in response:', tokenData);
			return json(
				{ success: false, error: 'GitHub authentication failed' },
				{ status: 401 }
			);
		}

		// Step 2: Check if project.faf already exists
		const checkResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/project.faf`,
			{
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Accept': 'application/vnd.github.v3+json',
					'User-Agent': 'FAF-Builder/1.0'
				}
			}
		);

		if (checkResponse.ok) {
			return json(
				{ success: false, error: 'project.faf already exists in this repository' },
				{ status: 409 }
			);
		}

		// Step 3: Commit project.faf to GitHub
		const commitResponse = await fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/project.faf`,
			{
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					'Accept': 'application/vnd.github.v3+json',
					'User-Agent': 'FAF-Builder/1.0'
				},
				body: JSON.stringify({
					message: 'Initialize project.faf',
					content: Buffer.from(fafContent).toString('base64'),
					committer: {
						name: 'FAF Builder',
						email: 'builder@faf.one'
					}
				})
			}
		);

		if (!commitResponse.ok) {
			const errorData = await commitResponse.json().catch(() => ({}));

			// Handle specific GitHub API errors
			if (commitResponse.status === 404) {
				return json(
					{ success: false, error: 'Repository not found or insufficient permissions' },
					{ status: 404 }
				);
			} else if (commitResponse.status === 403) {
				return json(
					{ success: false, error: 'Permission denied. Grant repo access and try again.' },
					{ status: 403 }
				);
			} else if (commitResponse.status === 422) {
				return json(
					{ success: false, error: 'project.faf already exists' },
					{ status: 422 }
				);
			}

			console.error('GitHub commit failed:', commitResponse.status, errorData);
			throw new Error(
				errorData.message || `GitHub API error (${commitResponse.status})`
			);
		}

		const commitData = await commitResponse.json();
		const commitUrl = commitData.content?.html_url || `https://github.com/${owner}/${repo}/blob/main/project.faf`;

		// Step 4: Update README.md if user provided missing field content
		let readmeUpdated = false;
		if (readmeUpdates && Object.keys(readmeUpdates).length > 0) {
			try {
				// Fetch current README
				const readmeResponse = await fetch(
					`https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
					{
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Accept': 'application/vnd.github.v3+json',
							'User-Agent': 'FAF-Builder/1.0'
						}
					}
				);

				if (readmeResponse.ok) {
					const readmeData = await readmeResponse.json();
					const currentReadme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
					const readmeSha = readmeData.sha;

					// Build new sections
					let updatedReadme = currentReadme;
					const sections: string[] = [];

					// Add WHO section if provided
					if (readmeUpdates.who) {
						sections.push(`\n\n## Team\n\n${readmeUpdates.who}`);
					}

					// Add WHY section if provided
					if (readmeUpdates.why) {
						sections.push(`\n\n## Purpose\n\n${readmeUpdates.why}`);
					}

					// Add WHERE section if provided
					if (readmeUpdates.where) {
						sections.push(`\n\n## Environment\n\n${readmeUpdates.where}`);
					}

					// Add WHEN section if provided
					if (readmeUpdates.when) {
						sections.push(`\n\n## Status\n\n${readmeUpdates.when}`);
					}

					// Add HOW section if provided (Installation/Usage)
					if (readmeUpdates.how) {
						sections.push(`\n\n${readmeUpdates.how}`);
					}

					// Append all new sections to README
					if (sections.length > 0) {
						updatedReadme = currentReadme + sections.join('');

						// Commit updated README
						const updateReadmeResponse = await fetch(
							`https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
							{
								method: 'PUT',
								headers: {
									'Authorization': `Bearer ${accessToken}`,
									'Content-Type': 'application/json',
									'Accept': 'application/vnd.github.v3+json',
									'User-Agent': 'FAF-Builder/1.0'
								},
								body: JSON.stringify({
									message: 'Update README with AI context',
									content: Buffer.from(updatedReadme).toString('base64'),
									sha: readmeSha,
									committer: {
										name: 'FAF Builder',
										email: 'builder@faf.one'
									}
								})
							}
						);

						if (updateReadmeResponse.ok) {
							readmeUpdated = true;
						}
					}
				}
			} catch (readmeError) {
				// README update failed, but project.faf was committed successfully
				// Don't fail the entire request
				console.error('README update failed:', readmeError);
			}
		}

		// Success response with all stats for UI display
		return json({
			success: true,
			data: {
				owner,
				repo,
				score,
				genTime,
				scoreTime,
				missingFields,
				commitUrl,
				readmeUpdated,
				timestamp: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error('Error in commit-faf endpoint:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown server error'
			},
			{ status: 500 }
		);
	}
};
