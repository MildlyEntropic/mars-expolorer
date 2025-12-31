import type { Photo, RoverName } from '$lib/types/mars';

// NASA's official Mars image APIs (no API key needed!)
const MARS2020_API = 'https://mars.nasa.gov/rss/api/';
const MSL_API = 'https://mars.nasa.gov/api/v1/raw_image_items/';

// Camera mappings for the official API
const CAMERA_FILTERS: Record<string, string> = {
	// Perseverance cameras
	'NAVCAM_LEFT': 'NAVCAM_LEFT',
	'NAVCAM_RIGHT': 'NAVCAM_RIGHT',
	'MCZ_LEFT': 'MCZ_LEFT',
	'MCZ_RIGHT': 'MCZ_RIGHT',
	'FRONT_HAZCAM_LEFT_A': 'FRONT_HAZCAM_LEFT_A',
	'FRONT_HAZCAM_RIGHT_A': 'FRONT_HAZCAM_RIGHT_A',
	'REAR_HAZCAM_LEFT': 'REAR_HAZCAM_LEFT',
	'REAR_HAZCAM_RIGHT': 'REAR_HAZCAM_RIGHT',
	'SKYCAM': 'SKYCAM',
	'SHERLOC_WATSON': 'SHERLOC_WATSON',
	// Curiosity cameras
	'FHAZ': 'FHAZ',
	'RHAZ': 'RHAZ',
	'MAST': 'MAST',
	'CHEMCAM': 'CHEMCAM',
	'MAHLI': 'MAHLI',
	'MARDI': 'MARDI',
	'NAVCAM': 'NAV'
};

interface Mars2020Image {
	imageid: string;
	sol: number;
	camera: {
		filter_name: string;
		camera_type: string;
		instrument: string;
	};
	image_files: {
		small: string;
		medium: string;
		large: string;
		full_res: string;
	};
	date_taken_utc: string;
	sample_type: string;
}

interface Mars2020Response {
	images: Mars2020Image[];
	total_images: number;
	page: number;
	per_page: string;
}

interface MSLImage {
	id: number;
	imageid: string;
	sol: number;
	instrument: string;
	url: string;
	date_taken_mars: string;
	date_taken_utc: string;
	created_at: string;
}

interface MSLResponse {
	items: MSLImage[];
	total: number;
	page: number;
	per_page: number;
}

export interface FetchPhotosOptions {
	rover: RoverName;
	sol?: number;
	solMin?: number;
	solMax?: number;
	dateStart?: string;
	dateEnd?: string;
	camera?: string;
	search?: string;
	page?: number;
}

function mars2020ToPhoto(img: Mars2020Image): Photo {
	// Use a hash of the full imageid to ensure uniqueness
	let hash = 0;
	for (let i = 0; i < img.imageid.length; i++) {
		const char = img.imageid.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return {
		id: Math.abs(hash),
		sol: img.sol,
		camera: {
			id: 0,
			name: img.camera?.instrument || 'Unknown',
			rover_id: 5,
			full_name: img.camera?.instrument || 'Unknown Camera'
		},
		img_src: img.image_files?.large || img.image_files?.medium || img.image_files?.full_res,
		earth_date: img.date_taken_utc?.split('T')[0] || '',
		rover: {
			id: 5,
			name: 'Perseverance',
			landing_date: '2021-02-18',
			launch_date: '2020-07-30',
			status: 'active',
			max_sol: 0,
			max_date: '',
			total_photos: 0,
			cameras: []
		}
	};
}

function mslToPhoto(img: MSLImage): Photo {
	return {
		id: img.id,
		sol: img.sol,
		camera: {
			id: 0,
			name: img.instrument || 'Unknown',
			rover_id: 4,
			full_name: img.instrument || 'Unknown Camera'
		},
		img_src: img.url,
		earth_date: img.date_taken_utc?.split('T')[0] || img.created_at?.split('T')[0] || '',
		rover: {
			id: 4,
			name: 'Curiosity',
			landing_date: '2012-08-06',
			launch_date: '2011-11-26',
			status: 'active',
			max_sol: 0,
			max_date: '',
			total_photos: 0,
			cameras: []
		}
	};
}

export async function fetchPhotos(options: FetchPhotosOptions): Promise<Photo[]> {
	const { rover } = options;

	if (rover === 'perseverance') {
		return fetchPerseverancePhotos(options);
	} else if (rover === 'curiosity') {
		return fetchCuriosityPhotos(options);
	} else if (rover === 'spirit' || rover === 'opportunity') {
		return fetchMERPhotos(options);
	}

	throw new Error(`${rover} data is not available`);
}

async function fetchPerseverancePhotos(options: FetchPhotosOptions): Promise<Photo[]> {
	const { sol, solMin, solMax, dateStart, dateEnd, camera, search, page = 0 } = options;

	const params = new URLSearchParams({
		feed: 'raw_images',
		category: 'mars2020',
		feedtype: 'json',
		num: '25',
		page: page.toString()
	});

	let conditionIndex = 2;

	// Sol filtering (single sol takes precedence over range)
	if (sol !== undefined) {
		params.set(`condition_${conditionIndex++}`, `${sol}:sol:gte`);
		params.set(`condition_${conditionIndex++}`, `${sol}:sol:lte`);
	} else {
		if (solMin !== undefined) {
			params.set(`condition_${conditionIndex++}`, `${solMin}:sol:gte`);
		}
		if (solMax !== undefined) {
			params.set(`condition_${conditionIndex++}`, `${solMax}:sol:lte`);
		}
	}

	// Date filtering
	if (dateStart) {
		params.set(`condition_${conditionIndex++}`, `${dateStart}:date_taken:gte`);
	}
	if (dateEnd) {
		params.set(`condition_${conditionIndex++}`, `${dateEnd}:date_taken:lte`);
	}

	// Search: combine camera and text search
	const searchTerms: string[] = [];
	if (camera) searchTerms.push(camera);
	if (search) searchTerms.push(search);
	if (searchTerms.length > 0) {
		params.set('search', searchTerms.join(' '));
	}

	const url = `${MARS2020_API}?${params}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`NASA API error: ${response.status}`);
	}

	const data: Mars2020Response = await response.json();
	return (data.images || []).map(mars2020ToPhoto);
}

async function fetchCuriosityPhotos(options: FetchPhotosOptions): Promise<Photo[]> {
	const { sol, solMin, solMax, dateStart, dateEnd, camera, search, page = 0 } = options;

	const params = new URLSearchParams({
		order: 'sol desc,date_taken desc',
		per_page: '25',
		page: page.toString(),
		condition_1: 'msl:mission'
	});

	let conditionIndex = 2;

	// Sol filtering (single sol takes precedence over range)
	if (sol !== undefined) {
		params.set(`condition_${conditionIndex++}`, `${sol}:sol:gte`);
		params.set(`condition_${conditionIndex++}`, `${sol}:sol:lte`);
	} else {
		if (solMin !== undefined) {
			params.set(`condition_${conditionIndex++}`, `${solMin}:sol:gte`);
		}
		if (solMax !== undefined) {
			params.set(`condition_${conditionIndex++}`, `${solMax}:sol:lte`);
		}
	}

	// Date filtering
	if (dateStart) {
		params.set(`condition_${conditionIndex++}`, `${dateStart}:date_taken:gte`);
	}
	if (dateEnd) {
		params.set(`condition_${conditionIndex++}`, `${dateEnd}:date_taken:lte`);
	}

	// Search: combine camera and text search
	const searchTerms: string[] = [];
	if (camera) {
		const cameraFilter = CAMERA_FILTERS[camera] || camera;
		searchTerms.push(cameraFilter);
	}
	if (search) searchTerms.push(search);
	if (searchTerms.length > 0) {
		params.set('search', searchTerms.join(' '));
	}

	const url = `${MSL_API}?${params}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`NASA API error: ${response.status}`);
	}

	const data: MSLResponse = await response.json();
	return (data.items || []).map(mslToPhoto);
}

// MER (Spirit & Opportunity) - fetch via server-side proxy to avoid CORS
async function fetchMERPhotos(options: FetchPhotosOptions): Promise<Photo[]> {
	const { rover, sol, solMin, camera, page = 0 } = options;

	// Determine which sol to fetch
	let targetSol: number;
	if (sol !== undefined) {
		targetSol = sol;
	} else if (solMin !== undefined) {
		targetSol = solMin;
	} else {
		// Default to a known good sol with images
		targetSol = 1;
	}

	const cameraKey = camera || 'PANCAM';

	const params = new URLSearchParams({
		rover: rover,
		sol: targetSol.toString(),
		camera: cameraKey,
		page: page.toString()
	});

	try {
		const response = await fetch(`/api/mer?${params}`);
		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();
		return data.photos || [];
	} catch (error) {
		console.error('Failed to fetch MER photos:', error);
		return [];
	}
}

export async function fetchLatestPhotos(rover: RoverName): Promise<Photo[]> {
	// Get date 24 hours ago
	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const yesterdayStr = yesterday.toISOString().split('T')[0];

	if (rover === 'perseverance') {
		const params = new URLSearchParams({
			feed: 'raw_images',
			category: 'mars2020',
			feedtype: 'json',
			num: '50',
			condition_2: `${yesterdayStr}:date_taken:gte`
		});

		const response = await fetch(`${MARS2020_API}?${params}`);
		if (!response.ok) {
			throw new Error(`NASA API error: ${response.status}`);
		}

		const data: Mars2020Response = await response.json();
		return (data.images || []).map(mars2020ToPhoto);
	} else if (rover === 'curiosity') {
		const params = new URLSearchParams({
			order: 'sol desc,date_taken desc',
			per_page: '50',
			page: '0',
			condition_1: 'msl:mission',
			condition_2: `${yesterdayStr}:date_taken:gte`
		});

		const response = await fetch(`${MSL_API}?${params}`);
		if (!response.ok) {
			throw new Error(`NASA API error: ${response.status}`);
		}

		const data: MSLResponse = await response.json();
		return (data.items || []).map(mslToPhoto);
	}

	throw new Error(`${rover} data is no longer available`);
}

export async function fetchRoverInfo(rover: RoverName): Promise<{ max_sol: number }> {
	// MER rovers have known max sols (missions ended)
	if (rover === 'spirit') {
		return { max_sol: 2208 };
	} else if (rover === 'opportunity') {
		return { max_sol: 5111 };
	}

	// For active rovers, fetch latest photo to get current max sol
	try {
		const photos = await fetchLatestPhotos(rover);
		if (photos.length > 0) {
			return { max_sol: photos[0].sol };
		}
	} catch {
		// Ignore errors
	}

	// Fallback values
	if (rover === 'perseverance') {
		return { max_sol: 1400 };
	} else if (rover === 'curiosity') {
		return { max_sol: 4100 };
	}
	return { max_sol: 0 };
}

export function formatEarthDate(date: string): string {
	if (!date) return 'Unknown';
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function formatSol(sol: number): string {
	return `Sol ${sol.toLocaleString()}`;
}
