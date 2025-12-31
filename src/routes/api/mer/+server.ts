import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PDS_BASE = 'https://planetarydata.jpl.nasa.gov/img/data/mer';

const MER_CAMERAS: Record<string, { dir: string; name: string }> = {
	PANCAM: { dir: 'po', name: 'Panoramic Camera' },
	NAVCAM: { dir: 'no', name: 'Navigation Camera' },
	FHAZ: { dir: 'ho', name: 'Front Hazard Avoidance Camera' },
	RHAZ: { dir: 'mo', name: 'Rear Hazard Avoidance Camera' }
};

export const GET: RequestHandler = async ({ url }) => {
	const rover = url.searchParams.get('rover');
	const solParam = url.searchParams.get('sol');
	const camera = url.searchParams.get('camera') || 'PANCAM';
	const pageParam = url.searchParams.get('page') || '0';

	if (!rover || !solParam) {
		throw error(400, 'Missing rover or sol parameter');
	}

	const sol = parseInt(solParam, 10);
	const page = parseInt(pageParam, 10);

	if (isNaN(sol) || sol < 1) {
		throw error(400, 'Invalid sol parameter');
	}

	// MER1 = Opportunity, MER2 = Spirit
	const merNum = rover === 'spirit' ? '2' : '1';
	const roverPath = rover === 'spirit' ? 'spirit' : 'opportunity';
	const roverDisplayName = rover === 'spirit' ? 'Spirit' : 'Opportunity';

	const cameraInfo = MER_CAMERAS[camera] || MER_CAMERAS.PANCAM;
	const cameraDir = `mer${merNum}${cameraInfo.dir}_0xxx`;

	// Format sol number with leading zeros
	const solStr = `sol${sol.toString().padStart(4, '0')}`;

	// Build the browse URL
	const browseUrl = `${PDS_BASE}/${roverPath}/${cameraDir}/browse/${solStr}/rdr/`;

	try {
		const response = await fetch(browseUrl);

		if (!response.ok) {
			if (response.status === 404) {
				return json({ photos: [], total: 0 });
			}
			throw error(response.status, `PDS archive error: ${response.status}`);
		}

		const html = await response.text();

		// Parse JPG filenames and their sizes from directory listing
		// Format: <a href="filename.jpg">...</a>...</td><td...>SIZE</td>
		const rowRegex = /<a href="([^"]+\.jpg)">[^<]+<\/a><\/td><td[^>]*>[^<]*<\/td><td[^>]*>\s*([0-9.]+)(K?)/gi;
		const validFiles: string[] = [];
		let match;
		while ((match = rowRegex.exec(html)) !== null) {
			const filename = match[1];
			const sizeNum = parseFloat(match[2]);
			const hasK = match[3] === 'K';
			// Size in KB (if K suffix) or bytes
			const sizeKB = hasK ? sizeNum : sizeNum / 1024;
			// Filter out tiny files (thumbnails, corrupted) - keep files > 10KB
			if (sizeKB > 10) {
				validFiles.push(filename);
			}
		}

		// Remove duplicates
		const uniqueFiles = [...new Set(validFiles)];

		// Pagination: 25 images per page
		const startIdx = page * 25;
		const endIdx = startIdx + 25;
		const pageFiles = uniqueFiles.slice(startIdx, endIdx);

		// Convert to Photo objects
		const photos = pageFiles.map((filename, idx) => {
			const directUrl = `${browseUrl}${filename}`;
			// Proxy the image through our server to avoid CORS issues
			const imgUrl = `/api/mer-image?url=${encodeURIComponent(directUrl)}`;
			const imageId = filename.replace('.jpg', '').replace('.img', '');

			// Generate unique hash for ID
			let hash = 0;
			for (let i = 0; i < imageId.length; i++) {
				const char = imageId.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash;
			}

			return {
				id: Math.abs(hash) + idx,
				sol: sol,
				camera: {
					id: 0,
					name: camera,
					rover_id: rover === 'spirit' ? 2 : 1,
					full_name: cameraInfo.name
				},
				img_src: imgUrl,
				earth_date: '',
				rover: {
					id: rover === 'spirit' ? 2 : 1,
					name: roverDisplayName,
					landing_date: '2004-01-04',
					launch_date: '2003-06-10',
					status: 'complete',
					max_sol: rover === 'spirit' ? 2208 : 5111,
					max_date: rover === 'spirit' ? '2010-03-22' : '2018-06-10',
					total_photos: 0,
					cameras: []
				}
			};
		});

		return json({
			photos,
			total: uniqueFiles.length,
			hasMore: endIdx < uniqueFiles.length
		});
	} catch (e) {
		console.error('Failed to fetch MER photos:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to fetch MER photos');
	}
};
