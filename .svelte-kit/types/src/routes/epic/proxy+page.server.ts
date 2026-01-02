// @ts-nocheck
import type { PageServerLoad } from './$types';

const EPIC_API = 'https://api.nasa.gov/EPIC/api';
const EPIC_ARCHIVE = 'https://api.nasa.gov/EPIC/archive';
const DEMO_API_KEY = 'DEMO_KEY';

export interface EPICImage {
	identifier: string;
	caption: string;
	image: string;
	version: string;
	centroid_coordinates: {
		lat: number;
		lon: number;
	};
	dscovr_j2000_position: {
		x: number;
		y: number;
		z: number;
	};
	lunar_j2000_position: {
		x: number;
		y: number;
		z: number;
	};
	sun_j2000_position: {
		x: number;
		y: number;
		z: number;
	};
	attitude_quaternions: {
		q0: number;
		q1: number;
		q2: number;
		q3: number;
	};
	date: string;
	coords: {
		centroid_coordinates: {
			lat: number;
			lon: number;
		};
		dscovr_j2000_position: {
			x: number;
			y: number;
			z: number;
		};
		lunar_j2000_position: {
			x: number;
			y: number;
			z: number;
		};
		sun_j2000_position: {
			x: number;
			y: number;
			z: number;
		};
		attitude_quaternions: {
			q0: number;
			q1: number;
			q2: number;
			q3: number;
		};
	};
}

export interface ProcessedEPICImage {
	id: string;
	caption: string;
	date: string;
	imageUrl: string;
	thumbnailUrl: string;
	centroid: {
		lat: number;
		lon: number;
	};
}

function getImageUrl(image: EPICImage, collection: string = 'natural'): string {
	const date = image.date.split(' ')[0].replace(/-/g, '/');
	return `${EPIC_ARCHIVE}/${collection}/${date}/png/${image.image}.png?api_key=${DEMO_API_KEY}`;
}

function getThumbnailUrl(image: EPICImage, collection: string = 'natural'): string {
	const date = image.date.split(' ')[0].replace(/-/g, '/');
	return `${EPIC_ARCHIVE}/${collection}/${date}/thumbs/${image.image}.jpg?api_key=${DEMO_API_KEY}`;
}

async function fetchEPICImages(collection: string = 'natural'): Promise<ProcessedEPICImage[]> {
	try {
		const response = await fetch(`${EPIC_API}/${collection}?api_key=${DEMO_API_KEY}`);
		if (!response.ok) return [];

		const data: EPICImage[] = await response.json();

		return data.map(image => ({
			id: image.identifier,
			caption: image.caption,
			date: image.date,
			imageUrl: getImageUrl(image, collection),
			thumbnailUrl: getThumbnailUrl(image, collection),
			centroid: image.centroid_coordinates
		}));
	} catch {
		return [];
	}
}

async function fetchAvailableDates(collection: string = 'natural'): Promise<string[]> {
	try {
		const response = await fetch(`${EPIC_API}/${collection}/available?api_key=${DEMO_API_KEY}`);
		if (!response.ok) return [];

		const data = await response.json();
		return data.slice(0, 30); // Last 30 available dates
	} catch {
		return [];
	}
}

export const load = async ({ setHeaders }: Parameters<PageServerLoad>[0]) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	const [naturalImages, enhancedImages] = await Promise.all([
		fetchEPICImages('natural').catch(() => []),
		fetchEPICImages('enhanced').catch(() => [])
	]);

	return {
		naturalImages,
		enhancedImages
	};
};
