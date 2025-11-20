import crypto from 'crypto';

interface XCredentials {
	apiKey: string;
	apiSecret: string;
	accessToken: string;
	accessTokenSecret: string;
}

interface PostResult {
	success: boolean;
	tweetId?: string;
	error?: string;
}

/**
 * Generate OAuth 1.0a signature for X API
 */
function generateOAuthSignature(
	method: string,
	url: string,
	params: Record<string, string>,
	credentials: XCredentials
): string {
	const signatureBaseString = [
		method.toUpperCase(),
		encodeURIComponent(url),
		encodeURIComponent(
			Object.keys(params)
				.sort()
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
				.join('&')
		)
	].join('&');

	const signingKey = `${encodeURIComponent(credentials.apiSecret)}&${encodeURIComponent(credentials.accessTokenSecret)}`;

	return crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64');
}

/**
 * Generate OAuth 1.0a Authorization header
 */
function generateOAuthHeader(
	method: string,
	url: string,
	credentials: XCredentials
): string {
	const oauthParams: Record<string, string> = {
		oauth_consumer_key: credentials.apiKey,
		oauth_nonce: crypto.randomBytes(16).toString('hex'),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
		oauth_token: credentials.accessToken,
		oauth_version: '1.0'
	};

	const signature = generateOAuthSignature(method, url, oauthParams, credentials);
	oauthParams.oauth_signature = signature;

	const headerString = Object.keys(oauthParams)
		.sort()
		.map((key) => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
		.join(', ');

	return `OAuth ${headerString}`;
}

/**
 * Post a tweet to X using API v2
 */
export async function postToX(text: string, credentials: XCredentials): Promise<PostResult> {
	const url = 'https://api.twitter.com/2/tweets';

	try {
		const authHeader = generateOAuthHeader('POST', url, credentials);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: authHeader,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.detail || data.title || 'Failed to post tweet'
			};
		}

		return {
			success: true,
			tweetId: data.data?.id
		};
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : 'Unknown error'
		};
	}
}

/**
 * Get credentials from environment variables
 */
export function getXCredentials(): XCredentials | null {
	const apiKey = process.env.X_API_KEY;
	const apiSecret = process.env.X_API_SECRET;
	const accessToken = process.env.X_ACCESS_TOKEN;
	const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

	if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
		return null;
	}

	return { apiKey, apiSecret, accessToken, accessTokenSecret };
}
