import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PDS_BASE = 'https://planetarydata.jpl.nasa.gov/img/data/mer';

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
	for (let i = 0; i < retries; i++) {
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

			const response = await fetch(url, { signal: controller.signal });
			clearTimeout(timeout);

			if (response.ok) {
				return response;
			}

			// If server error, retry
			if (response.status >= 500 && i < retries - 1) {
				await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
				continue;
			}

			return response;
		} catch (e) {
			if (i === retries - 1) throw e;
			await new Promise(r => setTimeout(r, 1000 * (i + 1)));
		}
	}
	throw new Error('Failed after retries');
}

export const GET: RequestHandler = async ({ url }) => {
	const imageUrl = url.searchParams.get('url');

	if (!imageUrl) {
		throw error(400, 'Missing url parameter');
	}

	// Validate the URL is from PDS
	if (!imageUrl.startsWith(PDS_BASE)) {
		throw error(400, 'Invalid image URL');
	}

	try {
		const response = await fetchWithRetry(imageUrl);

		if (!response.ok) {
			throw error(response.status, `Failed to fetch image: ${response.status}`);
		}

		const imageBuffer = await response.arrayBuffer();
		const contentType = response.headers.get('content-type') || 'image/jpeg';

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
			}
		});
	} catch (e) {
		console.error('Failed to proxy image:', imageUrl, e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to fetch image');
	}
};
