import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NASA_API_KEY } from '$env/static/private';

const APOD_API = 'https://api.nasa.gov/planetary/apod';
const API_KEY = NASA_API_KEY || 'DEMO_KEY';

// Simple proxy to NASA APOD API - keeps API key server-side
export const GET: RequestHandler = async ({ url }) => {
	const startDate = url.searchParams.get('start_date');
	const endDate = url.searchParams.get('end_date');

	try {
		let apiUrl = `${APOD_API}?api_key=${API_KEY}`;

		if (startDate && endDate) {
			apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
		}

		const response = await fetch(apiUrl);

		if (!response.ok) {
			return json({ error: 'NASA API error' }, { status: response.status });
		}

		const data = await response.json();
		return json(data);
	} catch (err) {
		console.error('APOD proxy error:', err);
		return json({ error: 'Failed to fetch' }, { status: 500 });
	}
};
