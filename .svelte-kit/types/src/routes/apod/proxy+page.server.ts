// @ts-nocheck
import type { PageServerLoad } from './$types';
import type { SpaceImage, APODImage } from '$lib/types/mars';

const APOD_API = 'https://api.nasa.gov/planetary/apod';
const DEMO_API_KEY = 'DEMO_KEY';

async function fetchAPOD(): Promise<SpaceImage | null> {
	try {
		const response = await fetch(`${APOD_API}?api_key=${DEMO_API_KEY}`);
		if (!response.ok) return null;

		const data: APODImage = await response.json();

		// Skip videos for now - just show images
		if (data.media_type === 'video') return null;

		return {
			id: `apod-${data.date}`,
			title: data.title,
			description: data.explanation,
			img_src: data.hdurl || data.url,
			thumbnail_src: data.url,
			date: data.date,
			source: 'apod',
			sourceDetails: 'Astronomy Picture of the Day',
			credits: data.copyright || 'NASA'
		};
	} catch {
		return null;
	}
}

async function fetchRecentAPOD(count: number = 30): Promise<SpaceImage[]> {
	try {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - count);

		const response = await fetch(
			`${APOD_API}?api_key=${DEMO_API_KEY}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
		);
		if (!response.ok) return [];

		const data: APODImage[] = await response.json();

		return data
			.filter(item => item.media_type === 'image')
			.reverse()
			.map(item => ({
				id: `apod-${item.date}`,
				title: item.title,
				description: item.explanation,
				img_src: item.hdurl || item.url,
				thumbnail_src: item.url,
				date: item.date,
				source: 'apod' as const,
				sourceDetails: 'Astronomy Picture of the Day',
				credits: item.copyright || 'NASA'
			}));
	} catch {
		return [];
	}
}

export const load = async ({ setHeaders }: Parameters<PageServerLoad>[0]) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	const [todayApod, recentApod] = await Promise.all([
		fetchAPOD().catch(() => null),
		fetchRecentAPOD(30).catch(() => [])
	]);

	return {
		todayApod,
		recentApod
	};
};
