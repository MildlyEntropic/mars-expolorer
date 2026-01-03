<script lang="ts">
	// Education sections with different yellow shades
	type SectionName = 'constellations' | 'galactic-tick' | 'solar-system' | 'hall-of-fame' | 'cosmic-ladder' | 'hr-diagram';
	let activeSection: SectionName = $state('galactic-tick');

	interface EducationSection {
		name: SectionName;
		displayName: string;
		subtitle: string;
		description: string;
	}

	const SECTIONS: EducationSection[] = [
		{
			name: 'galactic-tick',
			displayName: 'Galactic Tick',
			subtitle: 'Our Cosmic Journey',
			description: 'Track Earth\'s position in its 225-million-year orbit around the Milky Way'
		},
		{
			name: 'constellations',
			displayName: 'Constellations',
			subtitle: 'Cultural Star Patterns',
			description: 'Explore star patterns from cultures around the world'
		},
		{
			name: 'solar-system',
			displayName: 'Solar System',
			subtitle: 'Planetary Guide',
			description: 'Interactive guide to our cosmic neighborhood'
		},
		{
			name: 'hall-of-fame',
			displayName: 'Hall of Fame',
			subtitle: 'Space Pioneers',
			description: 'Honoring the humans and animals who paved the way'
		},
		{
			name: 'cosmic-ladder',
			displayName: 'Cosmic Ladder',
			subtitle: 'Distance Scale',
			description: 'How we measure the vastness of space'
		},
		{
			name: 'hr-diagram',
			displayName: 'HR Diagram',
			subtitle: 'Stellar Classification',
			description: 'Understanding star types and their life cycles'
		}
	];

	const selectedSection = $derived(SECTIONS.find(s => s.name === activeSection) as EducationSection);

	// Color schemes - all yellows/ambers/golds
	const sectionColors: Record<SectionName, {
		active: string;
		inactive: string;
		accent: string;
		border: string;
		text: string;
		statusBg: string;
	}> = {
		'galactic-tick': {
			active: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
			inactive: 'hover:border-amber-500/30',
			accent: 'text-amber-400',
			border: 'border-amber-500/30',
			text: 'text-amber-400/70',
			statusBg: 'bg-amber-500/20'
		},
		'constellations': {
			active: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
			inactive: 'hover:border-yellow-500/30',
			accent: 'text-yellow-400',
			border: 'border-yellow-500/30',
			text: 'text-yellow-400/70',
			statusBg: 'bg-yellow-500/20'
		},
		'solar-system': {
			active: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
			inactive: 'hover:border-orange-500/30',
			accent: 'text-orange-400',
			border: 'border-orange-500/30',
			text: 'text-orange-400/70',
			statusBg: 'bg-orange-500/20'
		},
		'hall-of-fame': {
			active: 'bg-lime-500/20 border-lime-500/50 text-lime-400',
			inactive: 'hover:border-lime-500/30',
			accent: 'text-lime-400',
			border: 'border-lime-500/30',
			text: 'text-lime-400/70',
			statusBg: 'bg-lime-500/20'
		},
		'cosmic-ladder': {
			active: 'bg-amber-600/20 border-amber-600/50 text-amber-300',
			inactive: 'hover:border-amber-600/30',
			accent: 'text-amber-300',
			border: 'border-amber-600/30',
			text: 'text-amber-300/70',
			statusBg: 'bg-amber-600/20'
		},
		'hr-diagram': {
			active: 'bg-yellow-600/20 border-yellow-600/50 text-yellow-300',
			inactive: 'hover:border-yellow-600/30',
			accent: 'text-yellow-300',
			border: 'border-yellow-600/30',
			text: 'text-yellow-300/70',
			statusBg: 'bg-yellow-600/20'
		}
	};

	const currentColors = $derived(sectionColors[activeSection]);

	// Galactic Tick calculations
	// A galactic tick is 1 centi-arcsecond of the Sun's orbit around the galactic center
	// This equals approximately 1.7361 years (633.7 days)
	const DAYS_PER_TICK = 633.7;
	const YEARS_PER_TICK = 1.7361;

	// Epoch: October 2, 1608 - when Hans Lippershey filed the telescope patent (Tick 1)
	const GALACTIC_TICK_EPOCH = new Date('1608-10-02T00:00:00Z');

	// Known tick dates for reference:
	// 240th: June 5, 2025
	// 241st: March 1, 2027
	// 242nd: November 24, 2028
	const TICK_240_DATE = new Date('2025-06-05T00:00:00Z');
	const TICK_241_DATE = new Date('2027-03-01T00:00:00Z');

	interface CountdownTime {
		months: number;
		weeks: number;
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		totalDays: number;
	}

	function calculateGalacticTick(): { tick: number; progress: number; nextTickDate: Date; nextTickNumber: number; countdown: CountdownTime } {
		const now = new Date();

		// Calculate current tick based on known reference point (Tick 240 = June 5, 2025)
		const msPerDay = 1000 * 60 * 60 * 24;
		const daysSinceTick240 = (now.getTime() - TICK_240_DATE.getTime()) / msPerDay;
		const ticksSinceTick240 = daysSinceTick240 / DAYS_PER_TICK;
		const currentTick = 240 + Math.floor(ticksSinceTick240);

		// Determine next tick date
		let nextTickDate: Date;
		let nextTickNumber: number;

		if (now < TICK_240_DATE) {
			nextTickDate = TICK_240_DATE;
			nextTickNumber = 240;
		} else if (now < TICK_241_DATE) {
			nextTickDate = TICK_241_DATE;
			nextTickNumber = 241;
		} else {
			// Calculate future ticks
			const ticksAfter240 = Math.ceil(ticksSinceTick240);
			nextTickNumber = 240 + ticksAfter240;
			nextTickDate = new Date(TICK_240_DATE.getTime() + (ticksAfter240 * DAYS_PER_TICK * msPerDay));
		}

		// Calculate progress to next tick
		const tickStartDate = new Date(nextTickDate.getTime() - (DAYS_PER_TICK * msPerDay));
		const progressDays = (now.getTime() - tickStartDate.getTime()) / msPerDay;
		const progress = Math.max(0, Math.min(100, (progressDays / DAYS_PER_TICK) * 100));

		// Calculate countdown
		const msUntilNextTick = nextTickDate.getTime() - now.getTime();
		const totalSeconds = Math.max(0, Math.floor(msUntilNextTick / 1000));
		const totalDays = Math.floor(totalSeconds / 86400);

		const months = Math.floor(totalDays / 30);
		const weeks = Math.floor((totalDays % 30) / 7);
		const days = totalDays % 7;
		const hours = Math.floor((totalSeconds % 86400) / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return {
			tick: currentTick,
			progress,
			nextTickDate,
			nextTickNumber,
			countdown: { months, weeks, days, hours, minutes, seconds, totalDays }
		};
	}

	let galacticData = $state(calculateGalacticTick());

	// Update countdown every second
	$effect(() => {
		const interval = setInterval(() => {
			galacticData = calculateGalacticTick();
		}, 1000);
		return () => clearInterval(interval);
	});

	// ============================================
	// SOLAR SYSTEM DATA
	// ============================================

	type SolarSystemCategory = 'sol' | 'planets' | 'dwarf-planets' | 'small-bodies';

	interface Moon {
		name: string;
		diameter: string;
		orbitalPeriod: string;
		discoveredBy?: string;
		discoveryYear?: number;
		description: string;
		notable?: string;
	}

	interface SolarSystemObject {
		name: string;
		type: 'star' | 'planet' | 'dwarf-planet' | 'asteroid' | 'comet' | 'kuiper' | 'trans-neptunian';
		subtype?: string; // e.g., 'Terrestrial', 'Gas Giant', 'Ice Giant'
		color: string; // Tailwind bg class

		// Physical characteristics
		diameter: string;
		mass: string;
		gravity?: string;
		density?: string;
		rotationPeriod?: string;
		axialTilt?: string;

		// Orbital characteristics
		distanceFromSun: string;
		orbitalPeriod: string;
		orbitalVelocity?: string;
		eccentricity?: string;
		inclination?: string;

		// Atmosphere/composition
		atmosphere?: string;
		composition?: string;
		surfaceTemp?: string;

		// Science data
		magneticField?: string;
		rings?: string;
		notableFeatures?: string[];

		// Humanities/culture
		etymology: string;
		mythologyOrigin?: string;
		culturalSignificance?: string;
		historicalObservations?: string;
		symbolism?: string;

		// Exploration
		missions?: { name: string; year: number; agency: string; type: string; notable?: string }[];
		upcomingMissions?: { name: string; year: number; agency: string }[];

		// Moons (for planets)
		moons?: Moon[];
		moonCount?: number;

		// Imagery
		nasaImageUrl?: string;
		nasaFactSheet?: string;
	}

	// Solar System Categories
	const SOLAR_SYSTEM_CATEGORIES: { id: SolarSystemCategory; name: string; subtitle: string; count: number }[] = [
		{ id: 'sol', name: 'Sol', subtitle: 'Our Star', count: 1 },
		{ id: 'planets', name: 'Planets', subtitle: '8 Major Worlds', count: 8 },
		{ id: 'dwarf-planets', name: 'Dwarf Planets', subtitle: 'IAU Recognized', count: 5 },
		{ id: 'small-bodies', name: 'Small Bodies', subtitle: 'Asteroids, Comets & More', count: 15 }
	];

	let selectedSolarCategory: SolarSystemCategory = $state('sol');
	let selectedSolarObject: SolarSystemObject | null = $state(null);

	// THE SUN
	const SOL: SolarSystemObject = {
		name: 'Sun',
		type: 'star',
		subtype: 'G-type Main Sequence (Yellow Dwarf)',
		color: 'bg-yellow-500',

		diameter: '1,392,700 km (109× Earth)',
		mass: '1.989 × 10³⁰ kg (333,000× Earth)',
		gravity: '274 m/s² (28× Earth)',
		density: '1.408 g/cm³',
		rotationPeriod: '25.05 days (equator) to 34.4 days (poles)',

		distanceFromSun: '0 (center of Solar System)',
		orbitalPeriod: '225-250 million years (galactic orbit)',
		orbitalVelocity: '220 km/s (around galactic center)',

		surfaceTemp: '5,778 K (surface) / 15.7 million K (core)',
		composition: '73.46% Hydrogen, 24.85% Helium, 1.69% heavier elements',
		magneticField: 'Complex, reverses every 11 years (solar cycle)',

		notableFeatures: [
			'Solar flares and coronal mass ejections',
			'Sunspots (cooler regions ~3,500 K)',
			'Corona visible during eclipses',
			'Solar wind extends past Pluto',
			'Contains 99.86% of Solar System mass',
			'Fusion converts 600M tons H to He per second'
		],

		etymology: 'From Latin "sōl", Proto-Indo-European *sóh₂wl̥. Related to Greek Helios.',
		mythologyOrigin: 'Nearly all ancient cultures deified the Sun. Ra (Egypt), Helios/Apollo (Greece), Sūrya (Hindu), Amaterasu (Japan), Inti (Inca), Tonatiuh (Aztec).',
		culturalSignificance: 'Central to calendars, agriculture, and religious practices worldwide. Solstices and equinoxes marked by monuments like Stonehenge.',
		historicalObservations: 'Chinese recorded sunspots by 28 BCE. Galileo proved Sun rotates (1612). Heliocentrism established by Copernicus (1543).',
		symbolism: 'Represents life, power, knowledge, divinity. The circle with center dot (☉) dates to ancient Egypt.',

		missions: [
			{ name: 'Parker Solar Probe', year: 2018, agency: 'NASA', type: 'Orbiter', notable: 'Closest approach to Sun ever (6.9 million km)' },
			{ name: 'Solar Orbiter', year: 2020, agency: 'ESA/NASA', type: 'Orbiter', notable: 'First images of solar poles' },
			{ name: 'SOHO', year: 1995, agency: 'ESA/NASA', type: 'Observatory', notable: 'Discovered 4,000+ comets' },
			{ name: 'SDO', year: 2010, agency: 'NASA', type: 'Observatory', notable: 'High-res Sun imaging 24/7' }
		],

		nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html'
	};

	// PLANETS
	const PLANETS_DATA: SolarSystemObject[] = [
		{
			name: 'Mercury',
			type: 'planet',
			subtype: 'Terrestrial',
			color: 'bg-gray-400',

			diameter: '4,879 km (0.38× Earth)',
			mass: '3.30 × 10²³ kg (0.055× Earth)',
			gravity: '3.7 m/s² (0.38× Earth)',
			density: '5.43 g/cm³',
			rotationPeriod: '58.65 Earth days',
			axialTilt: '0.034°',

			distanceFromSun: '57.9 million km (0.39 AU)',
			orbitalPeriod: '87.97 Earth days',
			orbitalVelocity: '47.4 km/s',
			eccentricity: '0.206 (most eccentric planet)',
			inclination: '7.0°',

			surfaceTemp: '-180°C to 430°C',
			atmosphere: 'Exosphere only: O₂, Na, H₂, He, K',
			magneticField: 'Weak (1% of Earth), dipolar',

			notableFeatures: [
				'Largest temperature swing of any planet',
				'Caloris Basin: 1,550 km impact crater',
				'Ice deposits in polar craters',
				'Most cratered planet',
				'Day longer than year (176 Earth days sunrise to sunrise)',
				'3:2 spin-orbit resonance'
			],

			etymology: 'Named for Roman messenger god Mercury (Greek: Hermes), due to rapid orbital motion.',
			mythologyOrigin: 'Mercury/Hermes was the swift messenger of the gods, guide of souls, patron of travelers and thieves.',
			culturalSignificance: 'Known since Sumerians (3rd millennium BCE). Called "the Jumping One" in Babylon.',
			historicalObservations: 'Copernicus never saw Mercury. Its phases confirmed by Galileo (1631). Mariner 10 first flyby (1974).',
			symbolism: 'Symbol ☿ represents caduceus (winged staff). Associated with communication, commerce, speed.',

			missions: [
				{ name: 'Mariner 10', year: 1974, agency: 'NASA', type: 'Flyby', notable: 'First Mercury images' },
				{ name: 'MESSENGER', year: 2011, agency: 'NASA', type: 'Orbiter', notable: 'Mapped entire surface' },
				{ name: 'BepiColombo', year: 2018, agency: 'ESA/JAXA', type: 'Orbiter', notable: 'En route, arrival 2025' }
			],

			moons: [],
			moonCount: 0,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html'
		},
		{
			name: 'Venus',
			type: 'planet',
			subtype: 'Terrestrial',
			color: 'bg-amber-300',

			diameter: '12,104 km (0.95× Earth)',
			mass: '4.87 × 10²⁴ kg (0.82× Earth)',
			gravity: '8.87 m/s² (0.90× Earth)',
			density: '5.24 g/cm³',
			rotationPeriod: '243 Earth days (retrograde)',
			axialTilt: '177.4° (nearly upside down)',

			distanceFromSun: '108.2 million km (0.72 AU)',
			orbitalPeriod: '224.7 Earth days',
			orbitalVelocity: '35.0 km/s',
			eccentricity: '0.007 (most circular orbit)',
			inclination: '3.4°',

			surfaceTemp: '465°C average (hottest planet)',
			atmosphere: '96.5% CO₂, 3.5% N₂. 92× Earth pressure.',
			composition: 'Silicate mantle, iron core',
			magneticField: 'None (too slow rotation)',

			notableFeatures: [
				'Hottest planet due to runaway greenhouse effect',
				'Spins backwards (retrograde rotation)',
				'Day longer than year',
				'Thick clouds of sulfuric acid',
				'Surface crushed by atmospheric pressure',
				'Maxwell Montes: highest peak (11 km)'
			],

			etymology: 'Named for Roman goddess of love and beauty (Greek: Aphrodite).',
			mythologyOrigin: 'Aphrodite/Venus arose from sea foam when Cronus castrated Uranus. Goddess of love, beauty, fertility.',
			culturalSignificance: 'Morning/Evening Star confused as two objects anciently. Mayans tracked Venus cycles obsessively.',
			historicalObservations: 'Galileo observed phases (1610), proving it orbits Sun. Lomonosov discovered atmosphere (1761).',
			symbolism: 'Symbol ♀ represents mirror of goddess. Associated with femininity, love, art, beauty.',

			missions: [
				{ name: 'Venera 7', year: 1970, agency: 'USSR', type: 'Lander', notable: 'First successful Venus landing' },
				{ name: 'Magellan', year: 1990, agency: 'NASA', type: 'Orbiter', notable: 'Radar-mapped 98% of surface' },
				{ name: 'Akatsuki', year: 2015, agency: 'JAXA', type: 'Orbiter', notable: 'Studying atmosphere' },
				{ name: 'VERITAS', year: 2031, agency: 'NASA', type: 'Orbiter', notable: 'Future high-res mapping' },
				{ name: 'DAVINCI', year: 2031, agency: 'NASA', type: 'Probe', notable: 'Atmospheric descent' }
			],

			moons: [],
			moonCount: 0,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html'
		},
		{
			name: 'Earth',
			type: 'planet',
			subtype: 'Terrestrial',
			color: 'bg-blue-500',

			diameter: '12,756 km',
			mass: '5.97 × 10²⁴ kg',
			gravity: '9.81 m/s²',
			density: '5.51 g/cm³',
			rotationPeriod: '23h 56m 4s',
			axialTilt: '23.44°',

			distanceFromSun: '149.6 million km (1 AU)',
			orbitalPeriod: '365.25 days',
			orbitalVelocity: '29.8 km/s',
			eccentricity: '0.017',
			inclination: '0° (reference plane)',

			surfaceTemp: '-89°C to 57°C (average 15°C)',
			atmosphere: '78% N₂, 21% O₂, 1% Ar, 0.04% CO₂',
			composition: 'Iron core, silicate mantle, thin crust',
			magneticField: 'Strong dipole, protects from solar wind',

			notableFeatures: [
				'Only known planet with life',
				'71% surface covered by liquid water',
				'Active plate tectonics',
				'Large stabilizing moon',
				'Strong magnetic field',
				'Goldilocks zone location'
			],

			etymology: 'From Germanic "Ertha" meaning ground/soil. Only planet not named after a deity.',
			mythologyOrigin: 'Gaia (Greek) / Terra (Roman) personified as primordial mother goddess who bore Titans.',
			culturalSignificance: 'Mother Earth concept universal. Axis tilt creates seasons, driving agriculture and festivals.',
			historicalObservations: 'Eratosthenes calculated circumference (240 BCE). First photo from space: 1946 (V-2 rocket).',
			symbolism: 'Symbol ⊕ or ♁ represents globe with meridian. Associated with fertility, stability, home.',

			missions: [
				{ name: 'ISS', year: 1998, agency: 'International', type: 'Station', notable: 'Continuous human presence since 2000' },
				{ name: 'Landsat', year: 1972, agency: 'NASA/USGS', type: 'Earth observation', notable: 'Longest continuous Earth imaging' },
				{ name: 'DSCOVR', year: 2015, agency: 'NASA', type: 'L1 Observatory', notable: 'Full-disk Earth images (EPIC)' }
			],

			moons: [
				{
					name: 'Moon (Luna)',
					diameter: '3,474 km',
					orbitalPeriod: '27.3 days',
					discoveredBy: 'N/A (visible)',
					description: 'Earth\'s only natural satellite, 5th largest in Solar System.',
					notable: 'Tidally locked; same face always toward Earth. 12 humans have walked on its surface.'
				}
			],
			moonCount: 1,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html'
		},
		{
			name: 'Mars',
			type: 'planet',
			subtype: 'Terrestrial',
			color: 'bg-red-500',

			diameter: '6,792 km (0.53× Earth)',
			mass: '6.42 × 10²³ kg (0.11× Earth)',
			gravity: '3.71 m/s² (0.38× Earth)',
			density: '3.93 g/cm³',
			rotationPeriod: '24h 37m (sol)',
			axialTilt: '25.2°',

			distanceFromSun: '227.9 million km (1.52 AU)',
			orbitalPeriod: '687 Earth days',
			orbitalVelocity: '24.1 km/s',
			eccentricity: '0.094',
			inclination: '1.85°',

			surfaceTemp: '-153°C to 20°C (average -65°C)',
			atmosphere: '95.3% CO₂, 2.7% N₂, 1.6% Ar. 0.6% Earth pressure.',
			composition: 'Iron oxide (rust) surface, basaltic crust',
			magneticField: 'Remnant crustal fields only',

			notableFeatures: [
				'Olympus Mons: tallest mountain (21.9 km)',
				'Valles Marineris: largest canyon (4,000 km)',
				'Polar ice caps (water and CO₂)',
				'Global dust storms',
				'Evidence of ancient rivers/lakes',
				'Two small moons: Phobos & Deimos'
			],

			etymology: 'Named for Roman god of war (Greek: Ares), due to blood-red color.',
			mythologyOrigin: 'Ares/Mars was god of war, son of Zeus/Jupiter. Romans considered Mars father of Romulus & Remus.',
			culturalSignificance: 'Red color associated with blood and war across cultures. Mars retrograde was ill omen.',
			historicalObservations: 'Schiaparelli saw "canali" (1877), misinterpreted as canals. Lowell popularized Mars civilization idea.',
			symbolism: 'Symbol ♂ represents shield and spear. Associated with masculinity, aggression, energy.',

			missions: [
				{ name: 'Perseverance', year: 2021, agency: 'NASA', type: 'Rover', notable: 'Collecting samples for return' },
				{ name: 'Ingenuity', year: 2021, agency: 'NASA', type: 'Helicopter', notable: 'First powered flight on another planet' },
				{ name: 'Curiosity', year: 2012, agency: 'NASA', type: 'Rover', notable: 'Still operating' },
				{ name: 'InSight', year: 2018, agency: 'NASA', type: 'Lander', notable: 'Detected marsquakes' },
				{ name: 'Mars Express', year: 2003, agency: 'ESA', type: 'Orbiter', notable: 'Still operating' }
			],

			moons: [
				{
					name: 'Phobos',
					diameter: '22.2 km',
					orbitalPeriod: '7h 39m',
					discoveredBy: 'Asaph Hall',
					discoveryYear: 1877,
					description: 'Larger, inner moon. Heavily cratered, may be captured asteroid.',
					notable: 'Orbiting closer to Mars; will crash or break apart in ~50 million years.'
				},
				{
					name: 'Deimos',
					diameter: '12.6 km',
					orbitalPeriod: '30.3 hours',
					discoveredBy: 'Asaph Hall',
					discoveryYear: 1877,
					description: 'Smaller, outer moon. Smoother surface than Phobos.',
					notable: 'Named for Greek god of dread (Ares\' companion).'
				}
			],
			moonCount: 2,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html'
		},
		{
			name: 'Jupiter',
			type: 'planet',
			subtype: 'Gas Giant',
			color: 'bg-orange-300',

			diameter: '142,984 km (11.2× Earth)',
			mass: '1.90 × 10²⁷ kg (318× Earth)',
			gravity: '24.8 m/s² (2.53× Earth)',
			density: '1.33 g/cm³',
			rotationPeriod: '9h 56m (fastest planet)',
			axialTilt: '3.13°',

			distanceFromSun: '778.5 million km (5.2 AU)',
			orbitalPeriod: '11.86 Earth years',
			orbitalVelocity: '13.1 km/s',
			eccentricity: '0.049',
			inclination: '1.3°',

			surfaceTemp: '-145°C (cloud tops)',
			atmosphere: '89.8% H₂, 10.2% He, traces of CH₄, NH₃, H₂O',
			composition: 'No solid surface. Metallic hydrogen mantle, possible rocky core.',
			magneticField: 'Strongest planetary field (20,000× Earth)',
			rings: 'Faint ring system (discovered 1979)',

			notableFeatures: [
				'Great Red Spot: 350+ year old storm',
				'Largest planet (2.5× all others combined)',
				'95 known moons',
				'Intense radiation belts',
				'Protects inner planets from asteroids',
				'Almost became a star (13× more massive needed)'
			],

			etymology: 'Named for Roman king of gods (Greek: Zeus).',
			mythologyOrigin: 'Zeus/Jupiter overthrew Titans, ruled Olympus. God of sky, thunder, justice.',
			culturalSignificance: 'Associated with kingship across cultures. Chinese called it "Year Star" (12-year cycle).',
			historicalObservations: 'Galileo discovered 4 largest moons (1610), proving not everything orbits Earth.',
			symbolism: 'Symbol ♃ represents thunderbolt or eagle. Associated with authority, expansion, luck.',

			missions: [
				{ name: 'Juno', year: 2016, agency: 'NASA', type: 'Orbiter', notable: 'Studying interior and magnetosphere' },
				{ name: 'Galileo', year: 1995, agency: 'NASA', type: 'Orbiter/Probe', notable: 'First Jupiter orbiter, probe into atmosphere' },
				{ name: 'Europa Clipper', year: 2024, agency: 'NASA', type: 'Orbiter', notable: 'Investigating Europa\'s ocean' },
				{ name: 'JUICE', year: 2023, agency: 'ESA', type: 'Orbiter', notable: 'Studying Galilean moons' }
			],

			moons: [
				{
					name: 'Ganymede',
					diameter: '5,268 km',
					orbitalPeriod: '7.15 days',
					discoveredBy: 'Galileo Galilei',
					discoveryYear: 1610,
					description: 'Largest moon in Solar System, larger than Mercury.',
					notable: 'Only moon with its own magnetic field. Has subsurface ocean.'
				},
				{
					name: 'Callisto',
					diameter: '4,821 km',
					orbitalPeriod: '16.7 days',
					discoveredBy: 'Galileo Galilei',
					discoveryYear: 1610,
					description: 'Most heavily cratered object in Solar System.',
					notable: 'May have subsurface ocean. Possible future base site (outside radiation belt).'
				},
				{
					name: 'Io',
					diameter: '3,643 km',
					orbitalPeriod: '1.77 days',
					discoveredBy: 'Galileo Galilei',
					discoveryYear: 1610,
					description: 'Most volcanically active body in Solar System.',
					notable: '400+ active volcanoes. Surface constantly reshaped. Sulfur-colored.'
				},
				{
					name: 'Europa',
					diameter: '3,122 km',
					orbitalPeriod: '3.55 days',
					discoveredBy: 'Galileo Galilei',
					discoveryYear: 1610,
					description: 'Ice-covered moon with subsurface ocean.',
					notable: 'Prime target for life search. Ocean may have 2× Earth\'s water.'
				}
			],
			moonCount: 95,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html'
		},
		{
			name: 'Saturn',
			type: 'planet',
			subtype: 'Gas Giant',
			color: 'bg-amber-200',

			diameter: '120,536 km (9.45× Earth)',
			mass: '5.68 × 10²⁶ kg (95× Earth)',
			gravity: '10.4 m/s² (1.06× Earth)',
			density: '0.69 g/cm³ (would float on water)',
			rotationPeriod: '10h 42m',
			axialTilt: '26.7°',

			distanceFromSun: '1.43 billion km (9.58 AU)',
			orbitalPeriod: '29.46 Earth years',
			orbitalVelocity: '9.7 km/s',
			eccentricity: '0.057',
			inclination: '2.5°',

			surfaceTemp: '-178°C (cloud tops)',
			atmosphere: '96.3% H₂, 3.25% He, traces of CH₄, NH₃',
			composition: 'Similar to Jupiter but less dense. Metallic hydrogen layer thinner.',
			magneticField: 'Strong (600× Earth)',
			rings: 'Most spectacular ring system (282,000 km diameter, but only 10m thick)',

			notableFeatures: [
				'Spectacular ring system (99.9% water ice)',
				'146 known moons',
				'Least dense planet (would float on water)',
				'Hexagonal storm at north pole',
				'Titan: moon with thick atmosphere',
				'Enceladus: moon with water geysers'
			],

			etymology: 'Named for Roman god of agriculture and time (Greek: Cronus).',
			mythologyOrigin: 'Cronus/Saturn was father of Zeus, Titan who ate his children. Ruler of Golden Age.',
			culturalSignificance: 'Saturn\'s slow orbit (29 years) linked it to time, age, limitation. Saturday named for Saturn.',
			historicalObservations: 'Galileo saw "ears" (1610). Huygens identified rings (1655). Cassini discovered ring gap (1675).',
			symbolism: 'Symbol ♄ represents scythe. Associated with time, discipline, endings, agriculture.',

			missions: [
				{ name: 'Cassini', year: 2004, agency: 'NASA/ESA/ASI', type: 'Orbiter', notable: '13 years of discoveries, ended 2017' },
				{ name: 'Huygens', year: 2005, agency: 'ESA', type: 'Lander', notable: 'Landed on Titan (first outer solar system landing)' },
				{ name: 'Dragonfly', year: 2034, agency: 'NASA', type: 'Rotorcraft', notable: 'Will fly on Titan' }
			],

			moons: [
				{
					name: 'Titan',
					diameter: '5,150 km',
					orbitalPeriod: '15.95 days',
					discoveredBy: 'Christiaan Huygens',
					discoveryYear: 1655,
					description: 'Second largest moon, only moon with dense atmosphere.',
					notable: 'Methane lakes and rivers. Earth-like weather cycle. Huygens landed here.'
				},
				{
					name: 'Enceladus',
					diameter: '504 km',
					orbitalPeriod: '1.37 days',
					discoveredBy: 'William Herschel',
					discoveryYear: 1789,
					description: 'Icy moon with subsurface ocean and geysers.',
					notable: 'Water plumes contain organic molecules. Prime astrobiology target.'
				},
				{
					name: 'Mimas',
					diameter: '396 km',
					orbitalPeriod: '0.94 days',
					discoveredBy: 'William Herschel',
					discoveryYear: 1789,
					description: 'Small moon with giant Herschel crater.',
					notable: 'Looks like Death Star from Star Wars.'
				},
				{
					name: 'Iapetus',
					diameter: '1,470 km',
					orbitalPeriod: '79.3 days',
					discoveredBy: 'Giovanni Cassini',
					discoveryYear: 1671,
					description: 'Two-toned moon: one side dark, one bright.',
					notable: 'Has a giant ridge along equator (20 km high).'
				}
			],
			moonCount: 146,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html'
		},
		{
			name: 'Uranus',
			type: 'planet',
			subtype: 'Ice Giant',
			color: 'bg-cyan-300',

			diameter: '51,118 km (4× Earth)',
			mass: '8.68 × 10²⁵ kg (14.5× Earth)',
			gravity: '8.87 m/s² (0.89× Earth)',
			density: '1.27 g/cm³',
			rotationPeriod: '17h 14m (retrograde)',
			axialTilt: '97.8° (rolls on its side)',

			distanceFromSun: '2.87 billion km (19.2 AU)',
			orbitalPeriod: '84 Earth years',
			orbitalVelocity: '6.8 km/s',
			eccentricity: '0.046',
			inclination: '0.77°',

			surfaceTemp: '-224°C (coldest atmosphere)',
			atmosphere: '82.5% H₂, 15.2% He, 2.3% CH₄ (gives blue color)',
			composition: 'Water, methane, ammonia ices over small rocky core',
			magneticField: 'Unusual: tilted 59° from rotation axis',
			rings: '13 faint rings (discovered 1977)',

			notableFeatures: [
				'Rotates on its side (97.8° tilt)',
				'Coldest planetary atmosphere',
				'28 known moons (all named from literature)',
				'Extreme seasons (42 years day/night at poles)',
				'Faint ring system',
				'First planet discovered with telescope'
			],

			etymology: 'Named for Greek god of the sky, father of Cronus/Saturn.',
			mythologyOrigin: 'Ouranos was primordial sky god, son/husband of Gaia (Earth). Castrated by son Cronus.',
			culturalSignificance: 'First planet discovered in modern era (1781). Almost named "Georgian Star" for King George III.',
			historicalObservations: 'Discovered by William Herschel (1781). Voyager 2 only close flyby (1986).',
			symbolism: 'Symbol ⛢ combines Sun and Mars symbols. Associated with innovation, rebellion, sudden change.',

			missions: [
				{ name: 'Voyager 2', year: 1986, agency: 'NASA', type: 'Flyby', notable: 'Only spacecraft to visit Uranus' },
				{ name: 'Uranus Orbiter', year: '2030s', agency: 'NASA (proposed)', type: 'Orbiter', notable: 'Top priority in Planetary Science Decadal Survey' }
			],
			upcomingMissions: [
				{ name: 'Uranus Orbiter & Probe', year: 2031, agency: 'NASA' }
			],

			moons: [
				{
					name: 'Titania',
					diameter: '1,578 km',
					orbitalPeriod: '8.7 days',
					discoveredBy: 'William Herschel',
					discoveryYear: 1787,
					description: 'Largest moon of Uranus.',
					notable: 'Named for Queen of Fairies from A Midsummer Night\'s Dream.'
				},
				{
					name: 'Oberon',
					diameter: '1,522 km',
					orbitalPeriod: '13.5 days',
					discoveredBy: 'William Herschel',
					discoveryYear: 1787,
					description: 'Second largest, outermost major moon.',
					notable: 'Named for King of Fairies. Has a large dark-floored crater.'
				},
				{
					name: 'Miranda',
					diameter: '472 km',
					orbitalPeriod: '1.4 days',
					discoveredBy: 'Gerard Kuiper',
					discoveryYear: 1948,
					description: 'Smallest rounded moon. Bizarre, fractured surface.',
					notable: 'Has Verona Rupes: 20 km cliff, tallest in Solar System.'
				},
				{
					name: 'Ariel',
					diameter: '1,158 km',
					orbitalPeriod: '2.5 days',
					discoveredBy: 'William Lassell',
					discoveryYear: 1851,
					description: 'Brightest of Uranian moons.',
					notable: 'Named from Pope\'s "Rape of the Lock" and Shakespeare\'s "The Tempest".'
				}
			],
			moonCount: 28,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html'
		},
		{
			name: 'Neptune',
			type: 'planet',
			subtype: 'Ice Giant',
			color: 'bg-blue-600',

			diameter: '49,528 km (3.88× Earth)',
			mass: '1.02 × 10²⁶ kg (17.1× Earth)',
			gravity: '11.2 m/s² (1.14× Earth)',
			density: '1.64 g/cm³',
			rotationPeriod: '16h 6m',
			axialTilt: '28.3°',

			distanceFromSun: '4.5 billion km (30.1 AU)',
			orbitalPeriod: '164.8 Earth years',
			orbitalVelocity: '5.4 km/s',
			eccentricity: '0.011',
			inclination: '1.77°',

			surfaceTemp: '-218°C',
			atmosphere: '80% H₂, 19% He, 1.5% CH₄',
			composition: 'Water, methane, ammonia ices. Possible ocean layer.',
			magneticField: 'Tilted 47° from axis, offset from center',
			rings: '5 faint rings (discovered 1984)',

			notableFeatures: [
				'Strongest winds in Solar System (2,100 km/h)',
				'Great Dark Spot (appeared and vanished)',
				'16 known moons',
				'First planet found by mathematical prediction',
				'Triton: large retrograde moon (captured)',
				'Farthest known planet'
			],

			etymology: 'Named for Roman god of the sea (Greek: Poseidon).',
			mythologyOrigin: 'Poseidon/Neptune ruled the oceans, caused earthquakes. Brother of Zeus and Hades.',
			culturalSignificance: 'Discovered same year as Marx\'s works and Morse code (1846). Symbol of scientific prediction.',
			historicalObservations: 'Predicted mathematically by Le Verrier, found by Galle (1846). Voyager 2 flyby (1989).',
			symbolism: 'Symbol ♆ represents trident. Associated with the unconscious, dreams, illusion, spirituality.',

			missions: [
				{ name: 'Voyager 2', year: 1989, agency: 'NASA', type: 'Flyby', notable: 'Only spacecraft to visit Neptune' }
			],

			moons: [
				{
					name: 'Triton',
					diameter: '2,707 km',
					orbitalPeriod: '5.9 days (retrograde)',
					discoveredBy: 'William Lassell',
					discoveryYear: 1846,
					description: 'Largest moon, orbits backwards. Likely captured Kuiper Belt object.',
					notable: 'Active nitrogen geysers. Surface at -235°C (coldest measured in Solar System).'
				},
				{
					name: 'Nereid',
					diameter: '340 km',
					orbitalPeriod: '360 days',
					discoveredBy: 'Gerard Kuiper',
					discoveryYear: 1949,
					description: 'Highly eccentric orbit.',
					notable: 'Most eccentric orbit of any moon (0.75).'
				},
				{
					name: 'Proteus',
					diameter: '420 km',
					orbitalPeriod: '1.12 days',
					discoveredBy: 'Voyager 2',
					discoveryYear: 1989,
					description: 'Second largest, dark and irregular.',
					notable: 'Not discovered from Earth due to proximity to Neptune\'s glare.'
				}
			],
			moonCount: 16,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html'
		}
	];

	// DWARF PLANETS
	const DWARF_PLANETS: SolarSystemObject[] = [
		{
			name: 'Pluto',
			type: 'dwarf-planet',
			subtype: 'Plutino (3:2 resonance with Neptune)',
			color: 'bg-amber-600',

			diameter: '2,377 km (0.19× Earth)',
			mass: '1.31 × 10²² kg (0.2% Earth)',
			gravity: '0.62 m/s² (0.06× Earth)',
			density: '1.85 g/cm³',
			rotationPeriod: '6.39 Earth days (retrograde)',
			axialTilt: '119.5°',

			distanceFromSun: '5.9 billion km (39.5 AU average)',
			orbitalPeriod: '248 Earth years',
			eccentricity: '0.249 (crosses Neptune\'s orbit)',
			inclination: '17.2°',

			surfaceTemp: '-230°C',
			atmosphere: 'Thin: N₂, CH₄, CO. Freezes when farther from Sun.',
			composition: '70% rock, 30% water ice. Nitrogen ice surface.',

			notableFeatures: [
				'Heart-shaped nitrogen glacier (Tombaugh Regio)',
				'5 moons including Charon (half Pluto\'s size)',
				'Orbit crosses inside Neptune\'s',
				'Red coloration from tholins',
				'Mountains of water ice',
				'Was a planet 1930-2006'
			],

			etymology: 'Named for Roman god of the underworld (Greek: Hades). Name suggested by 11-year-old Venetia Burney.',
			mythologyOrigin: 'Hades/Pluto ruled the dead. Abducted Persephone. Cerberus guarded his realm.',
			culturalSignificance: 'Discovered 1930, reclassified as dwarf planet 2006. Sparked public debate about planethood.',
			historicalObservations: 'Discovered by Clyde Tombaugh at Lowell Observatory. New Horizons flyby revealed complex world (2015).',
			symbolism: 'Symbol ♇ or ⯓. Associated with transformation, death/rebirth, hidden wealth.',

			missions: [
				{ name: 'New Horizons', year: 2015, agency: 'NASA', type: 'Flyby', notable: 'First close images of Pluto and Charon' }
			],

			moons: [
				{ name: 'Charon', diameter: '1,212 km', orbitalPeriod: '6.39 days', discoveredBy: 'James Christy', discoveryYear: 1978, description: 'Largest moon relative to its planet. Tidally locked.', notable: 'Pluto-Charon considered a binary system.' },
				{ name: 'Nix', diameter: '50 km', orbitalPeriod: '24.9 days', discoveredBy: 'HST', discoveryYear: 2005, description: 'Small, irregular moon.', notable: 'Tumbles chaotically due to Pluto-Charon gravity.' },
				{ name: 'Hydra', diameter: '65 km', orbitalPeriod: '38.2 days', discoveredBy: 'HST', discoveryYear: 2005, description: 'Outermost known moon.', notable: 'Rotates 89× per orbit.' }
			],
			moonCount: 5,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html'
		},
		{
			name: 'Eris',
			type: 'dwarf-planet',
			subtype: 'Scattered Disk Object',
			color: 'bg-gray-300',

			diameter: '2,326 km (slightly smaller than Pluto)',
			mass: '1.66 × 10²² kg (27% more massive than Pluto)',
			gravity: '0.82 m/s²',
			density: '2.52 g/cm³',
			rotationPeriod: '25.9 hours',

			distanceFromSun: '10.1 billion km (67.8 AU current, varies 38-97 AU)',
			orbitalPeriod: '559 Earth years',
			eccentricity: '0.44',
			inclination: '44.0°',

			surfaceTemp: '-243°C',
			atmosphere: 'Thin methane, may collapse when farther from Sun',
			composition: 'Rock and ice, methane ice surface',

			notableFeatures: [
				'Most massive known dwarf planet',
				'Discovery triggered Pluto\'s reclassification',
				'Extremely eccentric and inclined orbit',
				'One known moon: Dysnomia',
				'Brightest known TNO (albedo 0.96)'
			],

			etymology: 'Named for Greek goddess of strife and discord, for the controversy it caused.',
			mythologyOrigin: 'Eris started the Trojan War by throwing golden apple "for the fairest" among goddesses.',
			culturalSignificance: 'Discovery in 2005 forced IAU to define "planet", demoting Pluto in 2006.',
			historicalObservations: 'Discovered by Mike Brown\'s team (2005). Initially nicknamed "Xena".',
			symbolism: 'Associated with discord, competition, change. Has astrological symbol ⯰.',

			moons: [
				{ name: 'Dysnomia', diameter: '700 km', orbitalPeriod: '15.8 days', discoveredBy: 'Keck Observatory', discoveryYear: 2005, description: 'Only known moon of Eris.', notable: 'Named for Eris\'s daughter, goddess of lawlessness.' }
			],
			moonCount: 1,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/erisfact.html'
		},
		{
			name: 'Haumea',
			type: 'dwarf-planet',
			subtype: 'Classical Kuiper Belt Object',
			color: 'bg-pink-200',

			diameter: '1,632 km (elongated: 2,322 × 1,704 × 1,138 km)',
			mass: '4.01 × 10²¹ kg',
			gravity: '0.44 m/s²',
			density: '1.88 g/cm³',
			rotationPeriod: '3.92 hours (one of fastest in Solar System)',

			distanceFromSun: '6.5 billion km (43.3 AU average)',
			orbitalPeriod: '284 Earth years',
			eccentricity: '0.19',
			inclination: '28.2°',

			surfaceTemp: '-241°C',
			composition: 'Crystalline water ice surface, rocky interior',

			notableFeatures: [
				'Elongated egg shape from rapid rotation',
				'Has a ring (first dwarf planet known to)',
				'Two moons and collisional family',
				'Fastest rotating large body',
				'Almost pure water ice surface'
			],

			etymology: 'Named for Hawaiian goddess of fertility and childbirth.',
			mythologyOrigin: 'Haumea was mother of Pele and other Hawaiian deities. Her children came from different parts of her body.',
			culturalSignificance: 'Discovered 2004, recognized 2008. Its moons are named for Haumea\'s daughters.',

			moons: [
				{ name: 'Hi\'iaka', diameter: '310 km', orbitalPeriod: '49.5 days', discoveredBy: 'Keck', discoveryYear: 2005, description: 'Larger, outer moon.', notable: 'Named for goddess born from Haumea\'s mouth.' },
				{ name: 'Namaka', diameter: '170 km', orbitalPeriod: '18 days', discoveredBy: 'Keck', discoveryYear: 2005, description: 'Smaller, inner moon.', notable: 'Named for water spirit daughter.' }
			],
			moonCount: 2,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/haumeafact.html'
		},
		{
			name: 'Makemake',
			type: 'dwarf-planet',
			subtype: 'Classical Kuiper Belt Object',
			color: 'bg-orange-200',

			diameter: '1,430 km',
			mass: '3.1 × 10²¹ kg',
			gravity: '0.5 m/s²',
			density: '1.7 g/cm³',
			rotationPeriod: '22.5 hours',

			distanceFromSun: '6.85 billion km (45.8 AU average)',
			orbitalPeriod: '306 Earth years',
			eccentricity: '0.16',
			inclination: '28.96°',

			surfaceTemp: '-243°C',
			atmosphere: 'May have thin transient atmosphere near perihelion',
			composition: 'Methane, ethane, nitrogen ices. Reddish color.',

			notableFeatures: [
				'Second brightest KBO after Pluto',
				'Extremely red color',
				'One small moon',
				'No detected atmosphere',
				'Originally nicknamed "Easterbunny"'
			],

			etymology: 'Named for Rapa Nui (Easter Island) creator god.',
			mythologyOrigin: 'Makemake was chief god of Easter Island, creator of humanity, god of fertility and birds.',
			culturalSignificance: 'Discovered near Easter 2005, formally named 2008 to honor Rapa Nui culture.',

			moons: [
				{ name: 'MK2 (S/2015 (136472) 1)', diameter: '175 km', orbitalPeriod: '12.4 days', discoveredBy: 'HST', discoveryYear: 2015, description: 'Small, dark moon.', notable: 'Very dark compared to bright Makemake.' }
			],
			moonCount: 1,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/makemakefact.html'
		},
		{
			name: 'Ceres',
			type: 'dwarf-planet',
			subtype: 'Asteroid Belt Object',
			color: 'bg-gray-400',

			diameter: '939 km',
			mass: '9.39 × 10²⁰ kg (1.3% of Moon)',
			gravity: '0.28 m/s²',
			density: '2.16 g/cm³',
			rotationPeriod: '9.07 hours',

			distanceFromSun: '414 million km (2.77 AU)',
			orbitalPeriod: '4.6 Earth years',
			eccentricity: '0.076',
			inclination: '10.6°',

			surfaceTemp: '-105°C average',
			atmosphere: 'Transient water vapor plumes detected',
			composition: 'Clay minerals, ice. Differentiated with rocky core.',

			notableFeatures: [
				'Largest asteroid belt object',
				'Contains 1/3 of belt\'s total mass',
				'Bright spots (Occator crater salts)',
				'Was first asteroid discovered (1801)',
				'Has subsurface briny water',
				'Only dwarf planet in inner Solar System'
			],

			etymology: 'Named for Roman goddess of harvest and agriculture (Greek: Demeter).',
			mythologyOrigin: 'Ceres/Demeter was goddess of grain, fertility, seasons. Her grief caused winter when Persephone was in underworld.',
			culturalSignificance: 'First asteroid discovered (Piazzi, 1801). Word "cereal" derives from Ceres.',

			missions: [
				{ name: 'Dawn', year: 2015, agency: 'NASA', type: 'Orbiter', notable: 'First to orbit two extraterrestrial bodies (Vesta, then Ceres)' }
			],

			moonCount: 0,
			nasaFactSheet: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/ceresfact.html'
		}
	];

	// SMALL BODIES (Asteroids, Comets, Kuiper Belt Objects)
	const SMALL_BODIES: SolarSystemObject[] = [
		// ASTEROIDS
		{
			name: 'Vesta',
			type: 'asteroid',
			subtype: 'V-type Asteroid',
			color: 'bg-stone-400',

			diameter: '525 km (second largest asteroid)',
			mass: '2.59 × 10²⁰ kg',
			rotationPeriod: '5.34 hours',

			distanceFromSun: '353 million km (2.36 AU average)',
			orbitalPeriod: '3.63 Earth years',

			surfaceTemp: '-20°C (day) to -190°C (night)',
			composition: 'Basaltic rock. Differentiated with iron core.',

			notableFeatures: [
				'Brightest asteroid (visible to naked eye)',
				'Only asteroid with differentiated interior',
				'Giant south pole crater (Rheasilvia)',
				'Source of HED meteorites on Earth'
			],

			etymology: 'Named for Roman goddess of hearth and home (Greek: Hestia).',
			mythologyOrigin: 'Vesta/Hestia was eldest Olympian, goddess of hearth fire. Vestal Virgins tended her eternal flame.',

			missions: [
				{ name: 'Dawn', year: 2011, agency: 'NASA', type: 'Orbiter', notable: 'Orbited Vesta for 14 months' }
			]
		},
		{
			name: 'Pallas',
			type: 'asteroid',
			subtype: 'B-type Asteroid',
			color: 'bg-slate-400',

			diameter: '512 km (third largest asteroid)',
			mass: '2.04 × 10²⁰ kg',
			rotationPeriod: '7.81 hours',

			distanceFromSun: '414 million km (2.77 AU average)',
			orbitalPeriod: '4.62 Earth years',
			inclination: '34.8° (highest of large asteroids)',

			composition: 'Carbonaceous, hydrated minerals',

			notableFeatures: [
				'Highly inclined orbit makes it hard to reach',
				'Second asteroid discovered (1802)',
				'Possible source of CM chondrites'
			],

			etymology: 'Named for Pallas Athena, Greek goddess of wisdom.',
			mythologyOrigin: 'Athena took epithet "Pallas" after accidentally killing her friend Pallas during sparring.'
		},
		{
			name: 'Hygiea',
			type: 'asteroid',
			subtype: 'C-type Asteroid',
			color: 'bg-neutral-500',

			diameter: '434 km (fourth largest)',
			mass: '8.32 × 10¹⁹ kg',
			rotationPeriod: '27.6 hours',

			distanceFromSun: '470 million km (3.14 AU average)',
			orbitalPeriod: '5.56 Earth years',

			composition: 'Carbonaceous, primitive',

			notableFeatures: [
				'Nearly spherical (may qualify as dwarf planet)',
				'Darkest of "big four" asteroids',
				'Largest C-type asteroid'
			],

			etymology: 'Named for Hygieia, Greek goddess of health.',
			mythologyOrigin: 'Hygieia was daughter of Asclepius, god of medicine. Word "hygiene" derives from her name.'
		},
		{
			name: 'Bennu',
			type: 'asteroid',
			subtype: 'B-type Near-Earth Asteroid',
			color: 'bg-stone-600',

			diameter: '490 m (Empire State Building height)',
			mass: '7.8 × 10¹⁰ kg',
			rotationPeriod: '4.3 hours',

			distanceFromSun: '168 million km (1.13 AU average)',
			orbitalPeriod: '1.2 Earth years',

			composition: 'Carbon-rich, hydrated minerals, organic molecules',

			notableFeatures: [
				'Potentially hazardous (impact possible 2182)',
				'Sample returned to Earth (2023)',
				'Rubble-pile structure',
				'Contains water and organics'
			],

			etymology: 'Named by 9-year-old contest winner for Egyptian deity.',
			mythologyOrigin: 'Bennu was Egyptian bird deity linked to creation, rebirth, and the Sun god Ra.',

			missions: [
				{ name: 'OSIRIS-REx', year: 2020, agency: 'NASA', type: 'Sample Return', notable: 'Collected 121.6g sample, returned 2023' }
			]
		},
		{
			name: 'Ryugu',
			type: 'asteroid',
			subtype: 'C-type Near-Earth Asteroid',
			color: 'bg-stone-700',

			diameter: '900 m',
			mass: '4.5 × 10¹¹ kg',
			rotationPeriod: '7.63 hours',

			distanceFromSun: '180 million km (1.19 AU average)',
			orbitalPeriod: '1.3 Earth years',

			composition: 'Carbonaceous, very dark (albedo 0.02)',

			notableFeatures: [
				'Spinning-top shape',
				'Sample returned to Earth (2020)',
				'Extremely dark surface',
				'Rubble-pile, very porous'
			],

			etymology: 'Named for Dragon Palace from Japanese folk tale Urashima Tarō.',
			mythologyOrigin: 'In the tale, fisherman visits undersea Dragon Palace and returns with mysterious box.',

			missions: [
				{ name: 'Hayabusa2', year: 2018, agency: 'JAXA', type: 'Sample Return', notable: 'Returned 5.4g sample with amino acids' }
			]
		},
		// COMETS
		{
			name: 'Halley\'s Comet',
			type: 'comet',
			subtype: 'Short-period Halley-type',
			color: 'bg-cyan-200',

			diameter: '15 km × 8 km (nucleus)',
			mass: '2.2 × 10¹⁴ kg',
			rotationPeriod: '52 hours',

			distanceFromSun: '0.59 AU (perihelion) to 35.1 AU (aphelion)',
			orbitalPeriod: '75-79 years',
			eccentricity: '0.967',
			inclination: '162° (retrograde)',

			composition: 'Dirty snowball: water ice, dust, organics, CO, CO₂',

			notableFeatures: [
				'Most famous comet',
				'Visible to naked eye',
				'Recorded since 240 BCE',
				'Next perihelion: July 28, 2061',
				'Parent of Eta Aquariid and Orionid meteor showers'
			],

			etymology: 'Named for Edmond Halley who predicted its return.',
			mythologyOrigin: 'Comets historically seen as omens. Halley\'s appeared before Norman Conquest (1066), depicted in Bayeux Tapestry.',
			culturalSignificance: 'First comet proven periodic (1705). Mark Twain born and died with its appearances (1835, 1910).',

			missions: [
				{ name: 'Giotto', year: 1986, agency: 'ESA', type: 'Flyby', notable: 'First close-up of comet nucleus' },
				{ name: 'Vega 1 & 2', year: 1986, agency: 'USSR', type: 'Flyby', notable: 'Guided Giotto to target' }
			]
		},
		{
			name: 'Comet 67P/Churyumov-Gerasimenko',
			type: 'comet',
			subtype: 'Jupiter-family comet',
			color: 'bg-stone-500',

			diameter: '4.3 km × 4.1 km (duck-shaped)',
			mass: '9.98 × 10¹² kg',
			rotationPeriod: '12.4 hours',

			distanceFromSun: '1.24 AU (perihelion) to 5.68 AU (aphelion)',
			orbitalPeriod: '6.45 years',

			composition: 'Very dark (albedo 0.06), fluffy. Water, CO₂, organics.',

			notableFeatures: [
				'Bilobate "rubber duck" shape',
				'First comet orbited and landed on',
				'Extremely dark surface',
				'Very low density (0.47 g/cm³)',
				'Contains glycine (amino acid)'
			],

			etymology: 'Named for discoverers Klim Churyumov and Svetlana Gerasimenko (1969).',

			missions: [
				{ name: 'Rosetta', year: 2014, agency: 'ESA', type: 'Orbiter', notable: 'First comet orbiter, 2 year mission' },
				{ name: 'Philae', year: 2014, agency: 'ESA', type: 'Lander', notable: 'First comet landing (bounced 3 times)' }
			]
		},
		{
			name: 'Comet Hale-Bopp',
			type: 'comet',
			subtype: 'Long-period',
			color: 'bg-blue-200',

			diameter: '40-80 km (nucleus)',
			mass: 'Unknown (very large)',
			rotationPeriod: '11.5 hours',

			distanceFromSun: '0.91 AU (perihelion) to 370 AU (aphelion)',
			orbitalPeriod: '2,533 years',
			inclination: '89.4°',

			composition: 'Unusually active, high CO production',

			notableFeatures: [
				'Great Comet of 1997',
				'Visible for 18 months (record)',
				'Visible to naked eye even in cities',
				'Exceptionally large nucleus',
				'Double tail clearly visible'
			],

			etymology: 'Named for co-discoverers Alan Hale and Thomas Bopp (1995).',
			culturalSignificance: 'Most widely observed comet ever. Tragically linked to Heaven\'s Gate cult.'
		},
		// KUIPER BELT OBJECTS
		{
			name: 'Quaoar',
			type: 'kuiper',
			subtype: 'Classical Kuiper Belt Object (Cubewano)',
			color: 'bg-rose-300',

			diameter: '1,121 km',
			mass: '1.2 × 10²¹ kg',
			rotationPeriod: '17.7 hours',

			distanceFromSun: '6.5 billion km (43.7 AU average)',
			orbitalPeriod: '289 years',

			composition: 'Water ice, methane ice, crystalline ammonia',
			rings: 'Has a ring (discovered 2023)',

			notableFeatures: [
				'Has rings beyond Roche limit (unexplained)',
				'One moon: Weywot',
				'Named before discovery of Haumea/Makemake',
				'Third largest cubewano'
			],

			etymology: 'Named for Tongva people\'s creator god.',
			mythologyOrigin: 'Quaoar was creator deity of Tongva (Los Angeles area indigenous people), who sang and danced creation into being.'
		},
		{
			name: 'Sedna',
			type: 'trans-neptunian',
			subtype: 'Sednoid / Inner Oort Cloud',
			color: 'bg-red-300',

			diameter: '995 km',
			mass: '~1 × 10²¹ kg',
			rotationPeriod: '~10 hours',

			distanceFromSun: '76 AU (current) to 937 AU (aphelion)',
			orbitalPeriod: '11,400 years',
			eccentricity: '0.855',
			inclination: '11.9°',

			surfaceTemp: '-240°C',
			composition: 'Methane, nitrogen ices. Very red.',

			notableFeatures: [
				'Extremely distant elliptical orbit',
				'Perihelion beyond Neptune (76 AU)',
				'One of reddest objects in Solar System',
				'Orbit suggests Planet Nine influence',
				'Never close enough for Neptune interaction'
			],

			etymology: 'Named for Inuit goddess of the sea and marine animals.',
			mythologyOrigin: 'Sedna\'s father threw her from a boat; her severed fingers became sea creatures. She rules the cold ocean depths.',
			culturalSignificance: 'Discovered 2003. Its orbit helped inspire Planet Nine hypothesis.'
		},
		{
			name: 'Arrokoth (Ultima Thule)',
			type: 'kuiper',
			subtype: 'Classical Kuiper Belt Object (Cold)',
			color: 'bg-red-400',

			diameter: '36 km × 20 km (contact binary)',
			mass: '~7.5 × 10¹⁵ kg',
			rotationPeriod: '15.9 hours',

			distanceFromSun: '6.7 billion km (44.6 AU average)',
			orbitalPeriod: '298 years',
			eccentricity: '0.042 (very circular)',
			inclination: '2.45°',

			surfaceTemp: '-230°C',
			composition: 'Methanol, water ice, organics. Very red.',

			notableFeatures: [
				'Most distant object ever visited by spacecraft',
				'Snowman/pancake contact binary',
				'Primordial: unchanged since formation',
				'Very cold classical KBO (low inclination)',
				'Reddest object visited by spacecraft'
			],

			etymology: 'Arrokoth means "sky" in Powhatan language. Originally nicknamed "Ultima Thule".',
			culturalSignificance: 'New Horizons flyby (2019) showed most primitive solar system body yet seen.',

			missions: [
				{ name: 'New Horizons', year: 2019, agency: 'NASA', type: 'Flyby', notable: 'Most distant flyby in history (6.5 billion km)' }
			]
		},
		{
			name: 'Orcus',
			type: 'kuiper',
			subtype: 'Plutino (3:2 resonance)',
			color: 'bg-slate-300',

			diameter: '910 km',
			mass: '6.4 × 10²⁰ kg',
			rotationPeriod: 'Unknown (tidally locked to moon?)',

			distanceFromSun: '5.9 billion km (39.2 AU average)',
			orbitalPeriod: '247 years',

			composition: 'Water ice, ammonia, methane ices',

			notableFeatures: [
				'Anti-Pluto (opposite orbital phase)',
				'Large moon Vanth (half Orcus\' size)',
				'May be dwarf planet candidate',
				'Water ice and ammonia detected'
			],

			etymology: 'Named for Etruscan/Roman god of the underworld.',
			mythologyOrigin: 'Orcus was punisher of broken oaths, sometimes conflated with Pluto/Hades. Origin of word "ogre".',

			moons: [
				{ name: 'Vanth', diameter: '443 km', orbitalPeriod: '9.5 days', discoveredBy: 'HST', discoveryYear: 2005, description: 'Large moon, may be tidally locked.', notable: 'Named for Etruscan psychopomp who guides souls.' }
			]
		}
	];

	// Helper function to get objects by category
	function getSolarSystemObjects(category: SolarSystemCategory): SolarSystemObject[] {
		switch (category) {
			case 'sol': return [SOL];
			case 'planets': return PLANETS_DATA;
			case 'dwarf-planets': return DWARF_PLANETS;
			case 'small-bodies': return SMALL_BODIES;
			default: return [];
		}
	}

	function openSolarObject(obj: SolarSystemObject) {
		selectedSolarObject = obj;
	}

	function closeSolarObject() {
		selectedSolarObject = null;
	}

	// Hall of Fame - Space Pioneers
	const PIONEERS = {
		animals: [
			// Suborbital Flights
			{ name: 'Fruit Flies', species: 'Insects', year: 1947, mission: 'V-2 Rocket', country: 'USA', achievement: 'First animals in space', fate: 'Recovered alive via parachute', category: 'suborbital' },
			{ name: 'Albert II', species: 'Rhesus Monkey', year: 1949, mission: 'V-2 Blossom IV', country: 'USA', achievement: 'First primate in space', fate: 'Died on impact', category: 'suborbital' },
			{ name: 'Tsygan & Dezik', species: 'Dogs', year: 1951, mission: 'R-1 IIIA-1', country: 'USSR', achievement: 'First dogs in space', fate: 'Both recovered alive', category: 'suborbital' },
			{ name: 'Yorick (Albert VI)', species: 'Monkey & Mice', year: 1951, mission: 'Aerobee', country: 'USA', achievement: 'First primates to survive spaceflight', fate: 'Died hours after landing', category: 'suborbital' },
			{ name: 'Ham', species: 'Chimpanzee', year: 1961, mission: 'Mercury-Redstone 2', country: 'USA', achievement: 'First hominid in space (suborbital)', fate: 'Lived 22 more years at National Zoo', category: 'suborbital' },
			{ name: 'Félicette', species: 'Cat', year: 1963, mission: 'Véronique AG1', country: 'France', achievement: 'First and only cat in space', fate: 'Returned safely; statue in Paris', category: 'suborbital' },
			// Orbital Flights
			{ name: 'Laika', species: 'Dog', year: 1957, mission: 'Sputnik 2', country: 'USSR', achievement: 'First animal to orbit Earth', fate: 'Did not survive (overheating)', category: 'orbital' },
			{ name: 'Belka & Strelka', species: 'Dogs', year: 1960, mission: 'Sputnik 5', country: 'USSR', achievement: 'First animals to orbit and return alive', fate: 'Lived full lives; Strelka had puppies', category: 'orbital' },
			{ name: 'Enos', species: 'Chimpanzee', year: 1961, mission: 'Mercury-Atlas 5', country: 'USA', achievement: 'First chimp to orbit Earth', fate: 'Recovered safely; died a year later', category: 'orbital' },
			{ name: 'Zvezdochka', species: 'Dog', year: 1961, mission: 'Sputnik 10', country: 'USSR', achievement: 'Final test flight before Gagarin', fate: 'Recovered safely; named by Gagarin', category: 'orbital' },
			{ name: 'Veterok & Ugolyok', species: 'Dogs', year: 1966, mission: 'Cosmos 110', country: 'USSR', achievement: '22 days in orbit (record until Skylab)', fate: 'Recovered alive', category: 'orbital' },
			// Deep Space
			{ name: 'Tortoises', species: 'Horsfield Tortoises', year: 1968, mission: 'Zond 5', country: 'USSR', achievement: 'First animals around the Moon', fate: 'Returned safely to Earth', category: 'deep' },
			// Modern Era
			{ name: 'Tardigrades', species: 'Micro-animals', year: 2007, mission: 'FOTON-M3', country: 'ESA', achievement: 'First animals to survive vacuum of space', fate: 'Many survived direct space exposure', category: 'modern' },
			{ name: 'Nematode Worms', species: 'C. elegans', year: 2003, mission: 'STS-107 Columbia', country: 'USA', achievement: 'Survived shuttle breakup', fate: 'Found alive in debris', category: 'modern' }
		],
		firsts: [
			// Orbital Firsts
			{ name: 'Yuri Gagarin', year: 1961, mission: 'Vostok 1', country: 'USSR', achievement: 'First human in space', category: 'orbital', duration: '108 minutes' },
			{ name: 'Alan Shepard', year: 1961, mission: 'Freedom 7', country: 'USA', achievement: 'First American in space (suborbital)', category: 'orbital', duration: '15 minutes' },
			{ name: 'John Glenn', year: 1962, mission: 'Friendship 7', country: 'USA', achievement: 'First American to orbit Earth', category: 'orbital', duration: '4h 55m' },
			{ name: 'Valentina Tereshkova', year: 1963, mission: 'Vostok 6', country: 'USSR', achievement: 'First woman in space', category: 'orbital', duration: '2d 22h' },
			{ name: 'Yang Liwei', year: 2003, mission: 'Shenzhou 5', country: 'China', achievement: 'First Chinese taikonaut', category: 'orbital', duration: '21h 23m' },
			// EVA Firsts
			{ name: 'Alexei Leonov', year: 1965, mission: 'Voskhod 2', country: 'USSR', achievement: 'First spacewalk (EVA)', category: 'eva', duration: '12 minutes' },
			{ name: 'Ed White', year: 1965, mission: 'Gemini 4', country: 'USA', achievement: 'First American spacewalk', category: 'eva', duration: '23 minutes' },
			{ name: 'Svetlana Savitskaya', year: 1984, mission: 'Salyut 7', country: 'USSR', achievement: 'First woman to spacewalk', category: 'eva', duration: '3h 35m' },
			{ name: 'Kathryn Sullivan', year: 1984, mission: 'STS-41-G', country: 'USA', achievement: 'First American woman to spacewalk', category: 'eva', duration: '3h 29m' },
			// Lunar Firsts
			{ name: 'Frank Borman, Jim Lovell, Bill Anders', year: 1968, mission: 'Apollo 8', country: 'USA', achievement: 'First humans to orbit the Moon', category: 'lunar', duration: '20 orbits' },
			{ name: 'Neil Armstrong', year: 1969, mission: 'Apollo 11', country: 'USA', achievement: 'First human to walk on the Moon', category: 'lunar', duration: '2h 31m on surface' },
			{ name: 'Buzz Aldrin', year: 1969, mission: 'Apollo 11', country: 'USA', achievement: 'Second human on the Moon', category: 'lunar', duration: '2h 31m on surface' },
			{ name: 'Pete Conrad', year: 1969, mission: 'Apollo 12', country: 'USA', achievement: 'Third human on the Moon; precision landing', category: 'lunar', duration: '7h 45m on surface' },
			{ name: 'Alan Shepard', year: 1971, mission: 'Apollo 14', country: 'USA', achievement: 'Hit golf balls on the Moon', category: 'lunar', duration: '9h 21m on surface' },
			{ name: 'David Scott', year: 1971, mission: 'Apollo 15', country: 'USA', achievement: 'First lunar rover driver', category: 'lunar', duration: '18h 33m on surface' },
			{ name: 'Eugene Cernan', year: 1972, mission: 'Apollo 17', country: 'USA', achievement: 'Last human on the Moon (so far)', category: 'lunar', duration: '22h 4m on surface' },
			{ name: 'Harrison Schmitt', year: 1972, mission: 'Apollo 17', country: 'USA', achievement: 'Only scientist to walk on the Moon', category: 'lunar', duration: '22h 4m on surface' }
		],
		barriers: [
			// Diversity Firsts
			{ name: 'Sally Ride', year: 1983, mission: 'STS-7', country: 'USA', achievement: 'First American woman in space', note: 'Also first LGBTQ+ astronaut (revealed posthumously)' },
			{ name: 'Guion Bluford', year: 1983, mission: 'STS-8', country: 'USA', achievement: 'First African American in space', note: 'Flew on four Space Shuttle missions' },
			{ name: 'Judith Resnik', year: 1984, mission: 'STS-41-D', country: 'USA', achievement: 'Second American woman in space', note: 'Lost on Challenger (1986)' },
			{ name: 'Mae Jemison', year: 1992, mission: 'STS-47', country: 'USA', achievement: 'First African American woman in space', note: 'Physician, engineer, and dancer' },
			{ name: 'Franklin Chang-Díaz', year: 1986, mission: 'STS-61-C', country: 'USA', achievement: 'First Hispanic American in space', note: 'Tied record with 7 spaceflights' },
			{ name: 'Ellison Onizuka', year: 1985, mission: 'STS-51-C', country: 'USA', achievement: 'First Asian American in space', note: 'Lost on Challenger (1986)' },
			{ name: 'Rakesh Sharma', year: 1984, mission: 'Soyuz T-11', country: 'India', achievement: 'First Indian in space', note: 'Only Indian to fly in space' },
			{ name: 'Sultan bin Salman', year: 1985, mission: 'STS-51-G', country: 'Saudi Arabia', achievement: 'First Arab and Muslim in space', note: 'Also first royal in space' },
			{ name: 'Chiaki Mukai', year: 1994, mission: 'STS-65', country: 'Japan', achievement: 'First Japanese woman in space', note: 'Cardiovascular surgeon' },
			{ name: 'Ilan Ramon', year: 2003, mission: 'STS-107', country: 'Israel', achievement: 'First Israeli in space', note: 'Lost on Columbia disaster' },
			{ name: 'Yi So-yeon', year: 2008, mission: 'Soyuz TMA-12', country: 'South Korea', achievement: 'First Korean in space', note: 'Selected through reality TV contest' },
			{ name: 'Anousheh Ansari', year: 2006, mission: 'Soyuz TMA-9', country: 'Iran/USA', achievement: 'First female space tourist; first Iranian in space', note: 'Self-funded via Space Adventures' },
			{ name: 'Jessica Watkins', year: 2022, mission: 'SpaceX Crew-4', country: 'USA', achievement: 'First Black woman on long-duration spaceflight', note: 'Geologist and ISS crew member' },
			{ name: 'Victor Glover', year: 2020, mission: 'SpaceX Crew-1', country: 'USA', achievement: 'First Black astronaut on long-duration ISS mission', note: 'Also pilot of Crew Dragon' }
		],
		endurance: [
			// Long-Duration Records
			{ name: 'Valeri Polyakov', year: '1994-95', mission: 'Mir EO-4', country: 'Russia', achievement: 'Longest single spaceflight: 437 days', note: 'Medical doctor; studied long-duration effects' },
			{ name: 'Gennady Padalka', year: '1998-2015', mission: 'Multiple', country: 'Russia', achievement: 'Most total time in space: 879 days', note: 'Five spaceflights over 17 years' },
			{ name: 'Peggy Whitson', year: '2002-2017', mission: 'Multiple', country: 'USA', achievement: 'Most time in space by American: 665 days', note: 'First female ISS commander' },
			{ name: 'Scott Kelly', year: '2015-16', mission: 'Year in Space', country: 'USA', achievement: '340 days continuous (US record)', note: 'Twin study with brother Mark' },
			{ name: 'Christina Koch', year: '2019-20', mission: 'ISS Exp 59-61', country: 'USA', achievement: 'Longest single spaceflight by woman: 328 days', note: 'First all-female spacewalk' },
			{ name: 'Frank Rubio', year: '2022-23', mission: 'ISS Exp 68-69', country: 'USA', achievement: 'New US record: 371 days', note: 'Extended due to Soyuz leak' },
			{ name: 'Oleg Kononenko', year: '2024', mission: 'ISS Exp 70-71', country: 'Russia', achievement: 'First person to spend 1,000 days in space', note: 'Reached milestone on Feb 4, 2024' }
		],
		commanders: [
			// Notable Station Commanders
			{ name: 'Bill Shepherd', year: 2000, mission: 'ISS Exp 1', country: 'USA', achievement: 'First ISS Commander', note: 'Navy SEAL and astronaut' },
			{ name: 'Peggy Whitson', year: 2008, mission: 'ISS Exp 16', country: 'USA', achievement: 'First female ISS Commander', note: 'Commanded ISS twice' },
			{ name: 'Sunita Williams', year: 2012, mission: 'ISS Exp 33', country: 'USA', achievement: 'Second female ISS Commander', note: 'Set spacewalk record for women' },
			{ name: 'Samantha Cristoforetti', year: 2022, mission: 'ISS Exp 68', country: 'Italy', achievement: 'First European female ISS Commander', note: 'ESA astronaut' },
			{ name: 'Liu Yang', year: 2012, mission: 'Shenzhou 9', country: 'China', achievement: 'First Chinese woman in space', note: 'Fighter pilot' },
			{ name: 'Wang Yaping', year: 2021, mission: 'Shenzhou 13', country: 'China', achievement: 'First Chinese woman to spacewalk', note: 'Teacher in space' }
		],
		memorial: [
			// Fallen Astronauts
			{ name: 'Vladimir Komarov', year: 1967, mission: 'Soyuz 1', country: 'USSR', cause: 'Parachute failure on re-entry', note: 'First human spaceflight fatality' },
			{ name: 'Apollo 1 Crew', year: 1967, mission: 'Apollo 1', country: 'USA', cause: 'Launch pad fire', members: 'Gus Grissom, Ed White, Roger Chaffee' },
			{ name: 'Soyuz 11 Crew', year: 1971, mission: 'Soyuz 11', country: 'USSR', cause: 'Cabin depressurization', members: 'Dobrovolsky, Volkov, Patsayev', note: 'Only humans to die in space' },
			{ name: 'Challenger Crew', year: 1986, mission: 'STS-51-L', country: 'USA', cause: 'O-ring failure at launch', members: 'Scobee, Smith, McNair, Onizuka, Resnik, Jarvis, McAuliffe', note: 'First Teacher in Space died' },
			{ name: 'Columbia Crew', year: 2003, mission: 'STS-107', country: 'USA', cause: 'Heat shield damage on re-entry', members: 'Husband, McCool, Anderson, Brown, Chawla, Clark, Ramon', note: 'First Israeli astronaut died' }
		],
		astronomers: [
			// Ancient & Classical
			{ name: 'Aristarchus of Samos', era: 'c. 310–230 BCE', country: 'Greece', achievement: 'First heliocentric model', contribution: 'Proposed Sun-centered solar system 1,800 years before Copernicus', category: 'ancient' },
			{ name: 'Hipparchus', era: 'c. 190–120 BCE', country: 'Greece', achievement: 'Star catalog & magnitude system', contribution: 'Created first comprehensive star catalog; invented stellar magnitude scale still used today', category: 'ancient' },
			{ name: 'Ptolemy', era: 'c. 100–170 CE', country: 'Egypt (Roman)', achievement: 'Almagest & geocentric model', contribution: 'Definitive ancient astronomical text; dominated for 1,400 years', category: 'ancient' },
			{ name: 'Aryabhata', era: '476–550 CE', country: 'India', achievement: 'Earth rotation & eclipses', contribution: 'Proposed Earth rotates on axis; calculated accurate eclipse predictions', category: 'ancient' },
			{ name: 'Al-Sufi', era: '903–986 CE', country: 'Persia', achievement: 'Book of Fixed Stars', contribution: 'First recorded observation of Andromeda Galaxy; revised star catalog', category: 'ancient' },
			{ name: 'Ulugh Beg', era: '1394–1449', country: 'Timurid (Uzbekistan)', achievement: 'Samarkand Observatory', contribution: 'Most accurate star positions before telescopes; calculated year length to seconds', category: 'ancient' },
			// Scientific Revolution
			{ name: 'Nicolaus Copernicus', era: '1473–1543', country: 'Poland', achievement: 'Heliocentric revolution', contribution: 'De revolutionibus: Sun-centered model that launched modern astronomy', category: 'revolution' },
			{ name: 'Tycho Brahe', era: '1546–1601', country: 'Denmark', achievement: 'Precision naked-eye observations', contribution: 'Most accurate pre-telescope data; observed supernova 1572', category: 'revolution' },
			{ name: 'Johannes Kepler', era: '1571–1630', country: 'Germany', achievement: 'Laws of planetary motion', contribution: 'Three laws describing elliptical orbits; foundation of celestial mechanics', category: 'revolution' },
			{ name: 'Galileo Galilei', era: '1564–1642', country: 'Italy', achievement: 'Telescopic astronomy', contribution: 'First telescopic observations: Jupiter\'s moons, Saturn\'s rings, Venus phases, sunspots', category: 'revolution' },
			{ name: 'Christiaan Huygens', era: '1629–1695', country: 'Netherlands', achievement: 'Saturn\'s rings & Titan', contribution: 'Identified Saturn\'s rings; discovered Titan; invented pendulum clock', category: 'revolution' },
			{ name: 'Isaac Newton', era: '1643–1727', country: 'England', achievement: 'Universal gravitation', contribution: 'Principia: unified terrestrial and celestial mechanics; reflecting telescope', category: 'revolution' },
			{ name: 'Edmond Halley', era: '1656–1742', country: 'England', achievement: 'Cometary orbits', contribution: 'Predicted return of Halley\'s Comet; stellar proper motion; southern star catalog', category: 'revolution' },
			// 18th-19th Century
			{ name: 'William Herschel', era: '1738–1822', country: 'Germany/England', achievement: 'Discovered Uranus', contribution: 'Found Uranus, infrared radiation, many moons; mapped Milky Way structure', category: 'classical' },
			{ name: 'Caroline Herschel', era: '1750–1848', country: 'Germany/England', achievement: 'First professional female astronomer', contribution: 'Discovered 8 comets and several nebulae; first woman to receive salary for scientific work', category: 'classical' },
			{ name: 'Pierre-Simon Laplace', era: '1749–1827', country: 'France', achievement: 'Celestial mechanics', contribution: 'Mécanique Céleste: definitive work on planetary motions; nebular hypothesis', category: 'classical' },
			{ name: 'Friedrich Bessel', era: '1784–1846', country: 'Germany', achievement: 'First stellar parallax', contribution: 'First measurement of star distance (61 Cygni); predicted Neptune', category: 'classical' },
			{ name: 'Annie Jump Cannon', era: '1863–1941', country: 'USA', achievement: 'Stellar classification', contribution: 'Classified 350,000+ stars; created OBAFGKM spectral sequence', category: 'classical' },
			{ name: 'Henrietta Swan Leavitt', era: '1868–1921', country: 'USA', achievement: 'Period-luminosity relation', contribution: 'Cepheid variable discovery enabling measurement of cosmic distances', category: 'classical' },
			{ name: 'Cecilia Payne-Gaposchkin', era: '1900–1979', country: 'UK/USA', achievement: 'Stellar composition', contribution: 'Discovered stars are mainly hydrogen and helium; first female Harvard astronomy professor', category: 'classical' },
			// Modern Era
			{ name: 'Albert Einstein', era: '1879–1955', country: 'Germany/USA', achievement: 'General relativity', contribution: 'Spacetime curvature; predicted gravitational lensing, waves, black holes', category: 'modern' },
			{ name: 'Edwin Hubble', era: '1889–1953', country: 'USA', achievement: 'Expanding universe', contribution: 'Proved galaxies exist beyond Milky Way; discovered universe expansion', category: 'modern' },
			{ name: 'Georges Lemaître', era: '1894–1966', country: 'Belgium', achievement: 'Big Bang theory', contribution: 'First proposed expanding universe from "primeval atom" (Big Bang)', category: 'modern' },
			{ name: 'Subrahmanyan Chandrasekhar', era: '1910–1995', country: 'India/USA', achievement: 'Chandrasekhar limit', contribution: 'Maximum mass of white dwarfs; stellar evolution theory; Nobel 1983', category: 'modern' },
			{ name: 'Fred Hoyle', era: '1915–2001', country: 'UK', achievement: 'Stellar nucleosynthesis', contribution: 'Explained how elements form in stars; coined "Big Bang" (ironically, as critic)', category: 'modern' },
			{ name: 'Vera Rubin', era: '1928–2016', country: 'USA', achievement: 'Dark matter evidence', contribution: 'Galaxy rotation curves proving dark matter existence', category: 'modern' },
			{ name: 'Carl Sagan', era: '1934–1996', country: 'USA', achievement: 'Science communication', contribution: 'Cosmos series; planetary science; SETI advocate; inspired generations', category: 'modern' },
			{ name: 'Stephen Hawking', era: '1942–2018', country: 'UK', achievement: 'Black hole radiation', contribution: 'Hawking radiation; singularity theorems; A Brief History of Time', category: 'modern' },
			{ name: 'Jocelyn Bell Burnell', era: '1943–', country: 'UK', achievement: 'Pulsar discovery', contribution: 'Discovered first pulsar as graduate student (Nobel went to her supervisor)', category: 'modern' },
			// Contemporary
			{ name: 'Andrea Ghez', era: '1965–', country: 'USA', achievement: 'Sagittarius A* black hole', contribution: 'Proved supermassive black hole at Milky Way center; Nobel 2020', category: 'contemporary' },
			{ name: 'Reinhard Genzel', era: '1952–', country: 'Germany', achievement: 'Galactic center observations', contribution: 'Decades tracking stars orbiting Sgr A*; Nobel 2020', category: 'contemporary' },
			{ name: 'Kip Thorne', era: '1940–', country: 'USA', achievement: 'Gravitational waves', contribution: 'LIGO co-founder; gravitational wave detection; Nobel 2017', category: 'contemporary' },
			{ name: 'Jill Tarter', era: '1944–', country: 'USA', achievement: 'SETI research', contribution: 'Pioneered Search for Extraterrestrial Intelligence; inspired Contact', category: 'contemporary' },
			{ name: 'Neil deGrasse Tyson', era: '1958–', country: 'USA', achievement: 'Science communication', contribution: 'Hayden Planetarium director; Cosmos revival; public science advocate', category: 'contemporary' },
			{ name: 'Katie Bouman', era: '1989–', country: 'USA', achievement: 'Black hole imaging', contribution: 'Led algorithm development for first black hole image (M87*)', category: 'contemporary' }
		],
		unsungHeroes: [
			// Hidden Figures - NASA Human Computers
			{ name: 'Katherine Johnson', era: '1918–2020', role: 'Mathematician', organization: 'NASA Langley', achievement: 'Calculated trajectories for Mercury, Apollo 11, and Apollo 13', contribution: 'Her calculations were so trusted that John Glenn refused to fly until she personally verified the computer\'s numbers. Presidential Medal of Freedom 2015.', category: 'hidden-figures' },
			{ name: 'Dorothy Vaughan', era: '1910–2008', role: 'Mathematician & Programmer', organization: 'NASA Langley', achievement: 'First African American supervisor at NACA/NASA', contribution: 'Led the West Area Computing unit; became expert FORTRAN programmer; taught herself and her staff to program IBM computers.', category: 'hidden-figures' },
			{ name: 'Mary Jackson', era: '1921–2005', role: 'Engineer', organization: 'NASA Langley', achievement: 'NASA\'s first Black female engineer', contribution: 'Petitioned city of Hampton to attend whites-only classes; later became manager of Federal Women\'s Program, working to hire and promote women.', category: 'hidden-figures' },
			{ name: 'Christine Darden', era: '1942–', role: 'Aeronautical Engineer', organization: 'NASA Langley', achievement: 'Sonic boom minimization research', contribution: 'One of few Black women in engineering at NASA; pioneered supersonic flight research; authored over 50 papers.', category: 'hidden-figures' },
			{ name: 'Miriam Mann', era: '1907–1967', role: 'Mathematician', organization: 'NASA Langley', achievement: 'Removed "Colored Computers" cafeteria sign', contribution: 'Repeatedly took down segregation signs; mathematician who worked on trajectory calculations.', category: 'hidden-figures' },
			// Early Rocket Engineers
			{ name: 'Mary Sherman Morgan', era: '1921–2004', role: 'Rocket Scientist', organization: 'North American Aviation', achievement: 'Invented Hydyne rocket fuel', contribution: 'Only female engineer among 900 at NAA; her fuel powered Explorer 1 (America\'s first satellite). Kept secret for 50 years.', category: 'engineers' },
			{ name: 'JoAnn Morgan', era: '1940–', role: 'Engineer', organization: 'NASA Kennedy', achievement: 'Only woman in Apollo 11 firing room', contribution: 'First female senior executive at Kennedy Space Center; oversaw shuttle and space station programs.', category: 'engineers' },
			{ name: 'Margaret Hamilton', era: '1936–', role: 'Computer Scientist', organization: 'MIT/NASA', achievement: 'Apollo guidance software', contribution: 'Coined term "software engineering"; her code prevented Apollo 11 abort during landing. Presidential Medal of Freedom 2016.', category: 'engineers' },
			{ name: 'Poppy Northcutt', era: '1943–', role: 'Engineer', organization: 'TRW', achievement: 'First woman in Mission Control', contribution: 'Calculated return-to-Earth trajectories for Apollo missions; later became prominent women\'s rights advocate.', category: 'engineers' },
			// Mission Control & Support
			{ name: 'John Aaron', era: '1943–', role: 'Flight Controller', organization: 'NASA Mission Control', achievement: '"Steely-Eyed Missile Man"', contribution: 'Saved Apollo 12 (lightning strike: "SCE to AUX") and helped save Apollo 13; legendary problem-solver.', category: 'mission-control' },
			{ name: 'Sy Liebergot', era: '1936–', role: 'EECOM Controller', organization: 'NASA Mission Control', achievement: 'Apollo 13 crisis management', contribution: 'First to recognize oxygen tank explosion; led electrical system troubleshooting that helped bring crew home.', category: 'mission-control' },
			{ name: 'Jack Garman', era: '1944–2016', role: 'Computer Engineer', organization: 'NASA Mission Control', achievement: 'Apollo 11 computer alarms', contribution: 'Recognized 1202 alarm was safe to ignore during Apollo 11 landing, preventing an abort.', category: 'mission-control' },
			// Test Pilots & Support
			{ name: 'Jack King', era: '1931–2015', role: 'Public Affairs Officer', organization: 'NASA Kennedy', achievement: '"Voice of Apollo"', contribution: 'Countdown voice for Apollo launches; his "10, 9, 8..." became iconic sound of space age.', category: 'support' },
			{ name: 'Wally Funk', era: '1939–', role: 'Aviator', organization: 'Mercury 13', achievement: 'Passed astronaut tests in 1961', contribution: 'One of Mercury 13 women who passed NASA tests but were denied due to gender; finally flew to space in 2021 at age 82 on Blue Origin.', category: 'support' },
			{ name: 'Jerrie Cobb', era: '1931–2019', role: 'Aviator', organization: 'Mercury 13', achievement: 'First woman to pass astronaut tests', contribution: 'Scored higher than many male astronauts on tests; testified before Congress; became humanitarian pilot in Amazon.', category: 'support' },
			// International Contributors
			{ name: 'Maryam Mirzakhani', era: '1977–2017', role: 'Mathematician', organization: 'Stanford', achievement: 'First woman to win Fields Medal', contribution: 'Groundbreaking work on Riemann surfaces and their moduli spaces; theoretical mathematics with cosmological applications.', category: 'international' },
			{ name: 'Claudia Alexander', era: '1959–2015', role: 'Planetary Scientist', organization: 'NASA JPL', achievement: 'Rosetta Project Scientist', contribution: 'Led U.S. participation in ESA\'s Rosetta comet mission; research on magnetospheres of Jupiter and Saturn.', category: 'international' },
			{ name: 'Chien-Shiung Wu', era: '1912–1997', role: 'Physicist', organization: 'Columbia University', achievement: 'Disproved parity conservation', contribution: '"First Lady of Physics"; her experiment disproved a fundamental physics law (Nobel went to male colleagues who proposed theory).', category: 'international' }
		]
	};

	// Cosmic Distance Ladder
	const DISTANCE_METHODS = [
		{ name: 'Radar Ranging', range: '0 - 1 AU', description: 'Bouncing radio signals off nearby objects', accuracy: 'Very High', color: 'bg-amber-500' },
		{ name: 'Parallax', range: '1 - 1,000 parsecs', description: 'Measuring apparent shift as Earth orbits', accuracy: 'High', color: 'bg-yellow-500' },
		{ name: 'Main Sequence Fitting', range: '1,000 - 100,000 pc', description: 'Comparing star clusters to known distances', accuracy: 'Medium', color: 'bg-orange-500' },
		{ name: 'Cepheid Variables', range: '10,000 pc - 30 Mpc', description: 'Pulsating stars with known luminosity', accuracy: 'Medium-High', color: 'bg-amber-600' },
		{ name: 'Type Ia Supernovae', range: '1 Mpc - 1 Gpc', description: 'Exploding white dwarfs as standard candles', accuracy: 'Medium', color: 'bg-yellow-600' },
		{ name: 'Redshift (Hubble\'s Law)', range: '> 100 Mpc', description: 'Using expansion of universe to measure distance', accuracy: 'Variable', color: 'bg-orange-600' }
	];

	// Constellation Culture System
	type CultureId = 'iau' | 'greco-roman' | 'chinese' | 'hindu' | 'japanese' | 'polynesian' | 'first-nations' | 'mesoamerican' | 'aboriginal' | 'inuit' | 'celtic' | 'norse' | 'egyptian' | 'african' | 'slavic' | 'germanic' | 'iberian' | 'french';

	interface ConstellationCulture {
		id: CultureId;
		name: string;
		subtitle: string;
		description: string;
		count: number;
		source?: string; // URL to authoritative source
	}

	const CONSTELLATION_CULTURES: ConstellationCulture[] = [
		// Modern Standard (always first)
		{ id: 'iau', name: 'IAU Official', subtitle: '88 Modern Constellations', description: 'International Astronomical Union standard divisions', count: 88, source: 'https://www.iau.org/public/themes/constellations/' },
		// Rest alphabetically sorted
		{ id: 'aboriginal', name: 'Aboriginal', subtitle: 'Australian Sky Stories', description: 'World\'s oldest astronomical tradition', count: 20 },
		{ id: 'african', name: 'African', subtitle: 'Sub-Saharan Traditions', description: 'Dogon, Zulu, and pan-African sky lore', count: 15 },
		{ id: 'celtic', name: 'Celtic', subtitle: 'British & Irish', description: 'Stonehenge to the Mabinogi', count: 15 },
		{ id: 'chinese', name: 'Chinese', subtitle: '28 Lunar Mansions', description: 'The Èrshíbā Xiù system', count: 28 },
		{ id: 'egyptian', name: 'Egyptian', subtitle: 'Land of the Pharaohs', description: 'Pyramid builders and star watchers', count: 15 },
		{ id: 'first-nations', name: 'First Nations', subtitle: 'Indigenous Star Stories', description: 'North American traditions', count: 12 },
		{ id: 'french', name: 'French', subtitle: 'Gallic Traditions', description: 'French folk and astronomical heritage', count: 15 },
		{ id: 'germanic', name: 'Germanic', subtitle: 'Central European', description: 'German folk astronomy traditions', count: 15 },
		{ id: 'greco-roman', name: 'Greco-Roman', subtitle: 'Classical Mythology', description: 'Ancient Greek & Roman celestial myths', count: 88 },
		{ id: 'hindu', name: 'Hindu', subtitle: '27 Nakshatras', description: 'Vedic lunar mansions', count: 27 },
		{ id: 'iberian', name: 'Iberian', subtitle: 'Spanish & Portuguese', description: 'Iberian Peninsula star traditions', count: 15 },
		{ id: 'inuit', name: 'Inuit & Arctic', subtitle: 'Polar Sky Knowledge', description: 'Astronomy of the endless night', count: 20 },
		{ id: 'japanese', name: 'Japanese', subtitle: 'Traditional Patterns', description: 'Seiza and folk astronomy', count: 12 },
		{ id: 'mesoamerican', name: 'Mesoamerican', subtitle: 'Maya, Aztec & Inca', description: 'Calendrical astronomy of the Americas', count: 25 },
		{ id: 'norse', name: 'Norse', subtitle: 'Viking Age Astronomy', description: 'From the Eddas and sagas', count: 15 },
		{ id: 'polynesian', name: 'Polynesian', subtitle: 'Navigation Stars', description: 'Hawaiian star compass & wayfinding', count: 50 },
		{ id: 'slavic', name: 'Slavic', subtitle: 'Eastern European', description: 'Russian, Ukrainian, and Slavic mythology', count: 15 }
	];

	let selectedCulture: CultureId = $state('iau');
	let selectedConstellation: Constellation | null = $state(null);
	let constellationSort: 'alpha' | 'size' = $state('alpha');

	// Celestial reference systems - a constellation can be on one, both, or neither path
	// ecliptic = Sun's path (Western zodiac) - highlighted in gold/amber
	// equatorial = Celestial equator / Moon's path (Chinese Xiù) - highlighted in orange/yellow
	// The two paths cross at the equinoxes, so some constellations (like near Virgo/Pisces) are on BOTH

	interface Constellation {
		name: string;
		meaning: string;
		abbreviation?: string;
		stars: number | string;
		brightest: string;
		brightestMag?: number;
		ra: string; // Right Ascension
		dec: string; // Declination
		area?: number; // Square degrees
		quadrant?: string;
		onEcliptic?: boolean; // On the Sun's path (zodiac)
		onEquator?: boolean; // On/near the celestial equator (lunar mansions)
		mythology: string; // Brief description (used as fallback)
		// Rich mythology for dual-pane display
		mythologyDetails?: {
			figure?: string; // Who/what is this figure? (e.g., "Orion was a giant huntsman in Greek mythology")
			story?: string; // The narrative/legend
			celestialMeaning?: string; // Why is it where it is? Relationships to other constellations
			culturalSignificance?: string; // Practical/seasonal meanings (planting, navigation, etc.)
		};
		majorStars?: { name: string; designation: string; magnitude: number; distance: string; spectralType: string }[];
		shape?: string; // SVG path for simple shape representation
		diagramUrl?: string; // URL to constellation diagram image
	}

	// IAU Official 88 Constellations - Scientific/technical descriptions
	// Source: International Astronomical Union (https://www.iau.org/public/themes/constellations/)
	const IAU_OFFICIAL: Constellation[] = [
		// Zodiacal constellations (on ecliptic)
		{ name: 'Aries', meaning: 'The Ram', abbreviation: 'Ari', stars: 4, brightest: 'Hamal', brightestMag: 2.0, ra: '2h 38m', dec: '+20°', area: 441, quadrant: 'NQ1', onEcliptic: true, mythology: 'Zodiacal constellation, first point of Aries historically marked vernal equinox',
			mythologyDetails: {
				figure: 'One of the 48 constellations listed by Ptolemy in the 2nd century CE. Currently ranks 39th in size among the 88 modern constellations.',
				story: 'The vernal equinox (March equinox) was located in Aries in antiquity, giving rise to the term "First Point of Aries." Due to precession, the equinox has since moved into Pisces.',
				celestialMeaning: 'Contains no Messier objects but hosts several galaxies including NGC 772 and the dwarf irregular galaxy NGC 1156.',
				culturalSignificance: 'Best visible in December. Contains the Teegarden\'s Star, one of the nearest known stars to the Sun at 12.5 light-years.'
			}, majorStars: [{ name: 'Hamal', designation: 'α Ari', magnitude: 2.0, distance: '66 ly', spectralType: 'K2III' }, { name: 'Sheratan', designation: 'β Ari', magnitude: 2.6, distance: '59 ly', spectralType: 'A5V' }] },
		{ name: 'Taurus', meaning: 'The Bull', abbreviation: 'Tau', stars: 19, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 42m', dec: '+15°', area: 797, quadrant: 'NQ1', onEcliptic: true, mythology: 'Large zodiacal constellation containing two famous open clusters',
			mythologyDetails: {
				figure: 'The 17th largest constellation, notable for containing both the Pleiades (M45) and Hyades open star clusters, as well as the Crab Nebula (M1).',
				story: 'The Crab Nebula is the remnant of a supernova observed by Chinese and Arab astronomers in 1054 CE. At its center lies a pulsar spinning 30 times per second.',
				celestialMeaning: 'Aldebaran, its brightest star, is a red giant 44 times the Sun\'s diameter. It appears to be part of the Hyades but is actually much closer at 65 light-years.',
				culturalSignificance: 'Best visible in January. The Pleiades cluster contains over 1,000 stars, with the seven brightest visible to the naked eye.'
			}, majorStars: [{ name: 'Aldebaran', designation: 'α Tau', magnitude: 0.85, distance: '65 ly', spectralType: 'K5III' }, { name: 'Elnath', designation: 'β Tau', magnitude: 1.65, distance: '134 ly', spectralType: 'B7III' }] },
		{ name: 'Gemini', meaning: 'The Twins', abbreviation: 'Gem', stars: 8, brightest: 'Pollux', brightestMag: 1.14, ra: '7h 4m', dec: '+22°', area: 514, quadrant: 'NQ2', onEcliptic: true, mythology: 'Zodiacal constellation, radiant point of the Geminid meteor shower',
			mythologyDetails: {
				figure: 'The 30th largest constellation. Notable for containing two first-magnitude stars (Pollux and Castor) representing the celestial twins.',
				story: 'Pollux is a confirmed exoplanet host—Pollux b orbits this orange giant star. Castor is actually a sextuple star system (six stars gravitationally bound).',
				celestialMeaning: 'Contains M35, a large open cluster visible to the naked eye, and the Eskimo Nebula (NGC 2392), a planetary nebula.',
				culturalSignificance: 'Best visible in February. The Geminid meteor shower (mid-December) is one of the most reliable annual showers, with rates up to 120 meteors/hour.'
			}, majorStars: [{ name: 'Pollux', designation: 'β Gem', magnitude: 1.14, distance: '34 ly', spectralType: 'K0III' }, { name: 'Castor', designation: 'α Gem', magnitude: 1.58, distance: '52 ly', spectralType: 'A1V' }] },
		{ name: 'Cancer', meaning: 'The Crab', abbreviation: 'Cnc', stars: 5, brightest: 'Tarf', brightestMag: 3.5, ra: '8h 39m', dec: '+20°', area: 506, quadrant: 'NQ2', onEcliptic: true, mythology: 'Faintest zodiacal constellation, famous for the Beehive Cluster',
			mythologyDetails: {
				figure: 'The 31st largest constellation but one of the dimmest. Its brightest star is only magnitude 3.5. Contains the famous Beehive Cluster (M44).',
				story: 'M44 (Praesepe, the Beehive) is one of the nearest open clusters to Earth at 577 light-years. Ancient observers used its visibility to predict weather.',
				celestialMeaning: 'Also contains M67, one of the oldest known open clusters at 3.7 billion years. Several exoplanet-hosting stars have been discovered here.',
				culturalSignificance: 'Best visible in March. The summer solstice was located in Cancer in ancient times, giving the Tropic of Cancer its name.'
			}, majorStars: [{ name: 'Tarf', designation: 'β Cnc', magnitude: 3.5, distance: '290 ly', spectralType: 'K4III' }] },
		{ name: 'Leo', meaning: 'The Lion', abbreviation: 'Leo', stars: 9, brightest: 'Regulus', brightestMag: 1.35, ra: '10h 40m', dec: '+13°', area: 947, quadrant: 'NQ2', onEcliptic: true, mythology: 'Large zodiacal constellation with multiple bright galaxies',
			mythologyDetails: {
				figure: 'The 12th largest constellation, easily identified by the "Sickle" asterism forming the lion\'s head and mane. Contains five Messier galaxies.',
				story: 'The Leo Triplet (M65, M66, NGC 3628) is a group of interacting galaxies 35 million light-years away, a popular target for amateur astronomers.',
				celestialMeaning: 'Regulus is a quadruple star system, with the primary being a blue-white main sequence star spinning so fast it\'s oblate.',
				culturalSignificance: 'Best visible in April. The Leonid meteor shower (mid-November) originates from comet Tempel-Tuttle and can produce meteor storms every 33 years.'
			}, majorStars: [{ name: 'Regulus', designation: 'α Leo', magnitude: 1.35, distance: '79 ly', spectralType: 'B8IVn' }, { name: 'Denebola', designation: 'β Leo', magnitude: 2.14, distance: '36 ly', spectralType: 'A3V' }] },
		{ name: 'Virgo', meaning: 'The Maiden', abbreviation: 'Vir', stars: 9, brightest: 'Spica', brightestMag: 0.97, ra: '13h 25m', dec: '-4°', area: 1294, quadrant: 'SQ3', onEcliptic: true, mythology: 'Second-largest constellation, gateway to the Virgo Cluster of galaxies',
			mythologyDetails: {
				figure: 'The largest zodiacal constellation and second-largest overall (after Hydra). Contains the Virgo Cluster, a massive galaxy cluster at the heart of our Local Supercluster.',
				story: 'The Virgo Cluster contains over 2,000 galaxies, including M87, home to the first black hole ever photographed (2019). It lies 54 million light-years away.',
				celestialMeaning: 'Spica is a close binary system—two stars so close they distort each other into egg shapes. Combined, they\'re 2,300 times more luminous than the Sun.',
				culturalSignificance: 'Best visible in May. Contains the autumnal equinox point where the Sun crosses the celestial equator heading south.'
			}, majorStars: [{ name: 'Spica', designation: 'α Vir', magnitude: 0.97, distance: '250 ly', spectralType: 'B1V' }, { name: 'Vindemiatrix', designation: 'ε Vir', magnitude: 2.83, distance: '102 ly', spectralType: 'G8III' }] },
		{ name: 'Libra', meaning: 'The Scales', abbreviation: 'Lib', stars: 4, brightest: 'Zubeneschamali', brightestMag: 2.6, ra: '15h 17m', dec: '-15°', area: 538, quadrant: 'SQ3', onEcliptic: true, mythology: 'Only zodiacal constellation representing an inanimate object',
			mythologyDetails: {
				figure: 'The 29th largest constellation. Originally part of Scorpius (the scorpion\'s claws), it became a separate constellation in Roman times.',
				story: 'Star names reflect its Scorpius connection: Zubenelgenubi means "southern claw" and Zubeneschamali means "northern claw" in Arabic.',
				celestialMeaning: 'Contains Gliese 581, a red dwarf with multiple exoplanets including some in or near the habitable zone.',
				culturalSignificance: 'Best visible in June. The Sun was in Libra at the autumnal equinox in ancient times, hence its association with balance.'
			}, majorStars: [{ name: 'Zubeneschamali', designation: 'β Lib', magnitude: 2.6, distance: '185 ly', spectralType: 'B8V' }] },
		{ name: 'Scorpius', meaning: 'The Scorpion', abbreviation: 'Sco', stars: 18, brightest: 'Antares', brightestMag: 0.96, ra: '16h 53m', dec: '-30°', area: 497, quadrant: 'SQ3', onEcliptic: true, mythology: 'Bright zodiacal constellation near the Milky Way\'s center',
			mythologyDetails: {
				figure: 'The 33rd largest constellation but one of the most distinctive, with a clear scorpion shape. Located near the galactic center, rich in deep-sky objects.',
				story: 'Contains M4, one of the closest globular clusters (7,200 ly), and the Butterfly Cluster (M6) and Ptolemy Cluster (M7), both naked-eye visible.',
				celestialMeaning: 'Antares is a red supergiant 700 times the Sun\'s diameter. Its name means "rival of Mars" due to its similar red color.',
				culturalSignificance: 'Best visible in July (but low in northern latitudes). The galactic center in Sagittarius is adjacent, making this region spectacular.'
			}, majorStars: [{ name: 'Antares', designation: 'α Sco', magnitude: 0.96, distance: '600 ly', spectralType: 'M1Ib' }, { name: 'Shaula', designation: 'λ Sco', magnitude: 1.62, distance: '570 ly', spectralType: 'B2IV' }] },
		{ name: 'Sagittarius', meaning: 'The Archer', abbreviation: 'Sgr', stars: 8, brightest: 'Kaus Australis', brightestMag: 1.85, ra: '19h 0m', dec: '-25°', area: 867, quadrant: 'SQ4', onEcliptic: true, mythology: 'Contains the galactic center; richest area of the Milky Way',
			mythologyDetails: {
				figure: 'The 15th largest constellation, lying in the direction of the Milky Way\'s center. Contains more Messier objects (15) than any other constellation.',
				story: 'The galactic center lies within Sagittarius, marked by Sagittarius A*, a supermassive black hole of 4 million solar masses, 26,000 light-years away.',
				celestialMeaning: 'The "Teapot" asterism makes it easy to identify. Steam (the Milky Way) appears to rise from the spout toward Scorpius.',
				culturalSignificance: 'Best visible in August. Contains the Lagoon Nebula (M8), Trifid Nebula (M20), and Omega Nebula (M17), all visible in binoculars.'
			}, majorStars: [{ name: 'Kaus Australis', designation: 'ε Sgr', magnitude: 1.85, distance: '143 ly', spectralType: 'B9.5III' }] },
		{ name: 'Capricornus', meaning: 'The Sea-Goat', abbreviation: 'Cap', stars: 5, brightest: 'Deneb Algedi', brightestMag: 2.87, ra: '21h 2m', dec: '-18°', area: 414, quadrant: 'SQ4', onEcliptic: true, mythology: 'One of the faintest zodiacal constellations',
			mythologyDetails: {
				figure: 'The 40th largest constellation. One of the oldest recognized constellations, depicted on Babylonian star catalogs 3,000 years ago.',
				story: 'Contains the globular cluster M30, about 28,000 light-years away. This cluster has undergone core collapse, making its center extremely dense.',
				celestialMeaning: 'The winter solstice was located here in antiquity, giving the Tropic of Capricorn its name (though precession has since moved it to Sagittarius).',
				culturalSignificance: 'Best visible in September. Alpha Capricorni is an optical double—two unrelated stars that appear close together by chance.'
			}, majorStars: [{ name: 'Deneb Algedi', designation: 'δ Cap', magnitude: 2.87, distance: '39 ly', spectralType: 'A7III' }] },
		{ name: 'Aquarius', meaning: 'The Water Bearer', abbreviation: 'Aqr', stars: 10, brightest: 'Sadalsuud', brightestMag: 2.91, ra: '22h 17m', dec: '-10°', area: 980, quadrant: 'SQ4', onEcliptic: true, mythology: 'Large zodiacal constellation with famous planetary nebulae',
			mythologyDetails: {
				figure: 'The 10th largest constellation. Contains the Helix Nebula (NGC 7293), the closest planetary nebula to Earth at 700 light-years.',
				story: 'The Saturn Nebula (NGC 7009) and Helix Nebula are both planetary nebulae—glowing shells of gas expelled by dying Sun-like stars.',
				celestialMeaning: 'Currently hosts the vernal equinox\'s direction of precession—the "Age of Aquarius" will begin around 2600 CE.',
				culturalSignificance: 'Best visible in October. The Delta Aquariid and Eta Aquariid meteor showers both radiate from this constellation.'
			}, majorStars: [{ name: 'Sadalsuud', designation: 'β Aqr', magnitude: 2.91, distance: '540 ly', spectralType: 'G0Ib' }] },
		{ name: 'Pisces', meaning: 'The Fishes', abbreviation: 'Psc', stars: 7, brightest: 'Eta Piscium', brightestMag: 3.62, ra: '0h 28m', dec: '+7°', area: 889, quadrant: 'NQ1', onEcliptic: true, mythology: 'Large but faint zodiacal constellation; current location of vernal equinox',
			mythologyDetails: {
				figure: 'The 14th largest constellation but one of the dimmest. No star brighter than magnitude 3.6. Contains the vernal equinox point.',
				story: 'The vernal equinox (March equinox) has been in Pisces since about 68 BCE and will remain here until around 2600 CE.',
				celestialMeaning: 'Contains M74, a classic face-on spiral galaxy 32 million light-years away, and the "Circlet" asterism representing one of the fish.',
				culturalSignificance: 'Best visible in November. The current "Age of Pisces" (astrological) corresponds to the past 2,000+ years of human history.'
			}, majorStars: [{ name: 'Eta Piscium', designation: 'η Psc', magnitude: 3.62, distance: '294 ly', spectralType: 'G7III' }] },
		// Major non-zodiacal constellations
		{ name: 'Orion', meaning: 'The Hunter', abbreviation: 'Ori', stars: 7, brightest: 'Rigel', brightestMag: 0.12, ra: '5h 30m', dec: '+0°', area: 594, quadrant: 'NQ1', onEcliptic: false, onEquator: true, mythology: 'Most recognizable constellation, straddling the celestial equator',
			mythologyDetails: {
				figure: 'The 26th largest constellation but arguably the most famous, visible from both hemispheres. Contains two of the ten brightest stars (Rigel and Betelgeuse).',
				story: 'The Orion Nebula (M42) is the closest massive star-forming region to Earth (1,344 ly). Visible to the naked eye, it\'s a stellar nursery birthing thousands of new stars.',
				celestialMeaning: 'Betelgeuse is a red supergiant that will explode as a supernova within the next 100,000 years. It has visibly dimmed and brightened in recent years.',
				culturalSignificance: 'Best visible in January. The three Belt stars (Alnitak, Alnilam, Mintaka) are used worldwide for navigation and cultural timekeeping.'
			}, majorStars: [{ name: 'Rigel', designation: 'β Ori', magnitude: 0.12, distance: '860 ly', spectralType: 'B8Ia' }, { name: 'Betelgeuse', designation: 'α Ori', magnitude: 0.42, distance: '700 ly', spectralType: 'M1Ia' }, { name: 'Bellatrix', designation: 'γ Ori', magnitude: 1.64, distance: '250 ly', spectralType: 'B2III' }] },
		{ name: 'Ursa Major', meaning: 'Great Bear', abbreviation: 'UMa', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', area: 1280, quadrant: 'NQ2', onEcliptic: false, mythology: 'Third-largest constellation, contains the Big Dipper asterism',
			mythologyDetails: {
				figure: 'The third-largest constellation (1,280 sq°). The seven brightest stars form the Big Dipper (or Plough in the UK), the most recognized asterism in the Northern Hemisphere.',
				story: 'Five of the Big Dipper stars (except Dubhe and Alkaid) share common motion through space—the Ursa Major Moving Group, about 80 light-years away.',
				celestialMeaning: 'The "pointer stars" (Dubhe and Merak) point toward Polaris. Contains M81/M82, a famous interacting galaxy pair, and the Owl Nebula (M97).',
				culturalSignificance: 'Circumpolar from most northern latitudes (never sets). Contains the Pinwheel Galaxy (M101), a grand-design spiral 21 million light-years away.'
			}, majorStars: [{ name: 'Alioth', designation: 'ε UMa', magnitude: 1.77, distance: '81 ly', spectralType: 'A1III' }, { name: 'Dubhe', designation: 'α UMa', magnitude: 1.79, distance: '124 ly', spectralType: 'K0III' }] },
		{ name: 'Ursa Minor', meaning: 'Little Bear', abbreviation: 'UMi', stars: 7, brightest: 'Polaris', brightestMag: 1.98, ra: '15h 40m', dec: '+77°', area: 256, quadrant: 'NQ3', onEcliptic: false, mythology: 'Contains Polaris, the current North Star',
			mythologyDetails: {
				figure: 'The 56th largest constellation, notable primarily for containing Polaris, which lies within 1° of the north celestial pole.',
				story: 'Polaris is a triple star system. The primary is a Cepheid variable—its brightness variations helped establish the cosmic distance ladder.',
				celestialMeaning: 'Due to Earth\'s axial precession, different stars serve as "pole stars" over a 26,000-year cycle. Polaris will be closest to the pole around 2100 CE.',
				culturalSignificance: 'Essential for navigation in the Northern Hemisphere. Polaris\'s altitude above the horizon equals the observer\'s latitude.'
			}, majorStars: [{ name: 'Polaris', designation: 'α UMi', magnitude: 1.98, distance: '433 ly', spectralType: 'F7Ib' }] },
		{ name: 'Cassiopeia', meaning: 'The Queen', abbreviation: 'Cas', stars: 5, brightest: 'Schedar', brightestMag: 2.24, ra: '1h 0m', dec: '+60°', area: 598, quadrant: 'NQ1', onEcliptic: false, mythology: 'Distinctive W-shape, circumpolar from northern latitudes',
			mythologyDetails: {
				figure: 'The 25th largest constellation, easily recognized by its W (or M) shape. Circumpolar from latitudes north of 35°N.',
				story: 'Contains Tycho\'s Supernova remnant (SN 1572), a Type Ia supernova observed by Tycho Brahe. At peak, it was visible in daylight.',
				celestialMeaning: 'Lies in the Milky Way, rich in open clusters including M52 and M103. The Heart Nebula (IC 1805) and Soul Nebula (IC 1848) lie nearby.',
				culturalSignificance: 'Circumpolar from most northern latitudes. Opposite the Big Dipper across Polaris, it helps locate the pole when the Dipper is low.'
			}, majorStars: [{ name: 'Schedar', designation: 'α Cas', magnitude: 2.24, distance: '228 ly', spectralType: 'K0IIIa' }] },
		{ name: 'Cygnus', meaning: 'The Swan', abbreviation: 'Cyg', stars: 9, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 35m', dec: '+42°', area: 804, quadrant: 'NQ4', onEcliptic: false, mythology: 'Contains the Northern Cross asterism; rich Milky Way field',
			mythologyDetails: {
				figure: 'The 16th largest constellation, containing the Northern Cross asterism. Lies along the Milky Way, extremely rich in deep-sky objects.',
				story: 'Cygnus X-1 was the first widely accepted black hole, confirmed in 1972. It\'s a stellar-mass black hole accreting material from a companion star.',
				celestialMeaning: 'Deneb is one of the most luminous stars known—about 200,000 times the Sun\'s luminosity. Part of the Summer Triangle with Vega and Altair.',
				culturalSignificance: 'Best visible in September. The North America Nebula (NGC 7000) and Pelican Nebula are large emission nebulae visible in dark skies.'
			}, majorStars: [{ name: 'Deneb', designation: 'α Cyg', magnitude: 1.25, distance: '2600 ly', spectralType: 'A2Ia' }, { name: 'Albireo', designation: 'β Cyg', magnitude: 3.08, distance: '430 ly', spectralType: 'K2II' }] },
		{ name: 'Lyra', meaning: 'The Lyre', abbreviation: 'Lyr', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 51m', dec: '+36°', area: 286, quadrant: 'NQ4', onEcliptic: false, mythology: 'Small constellation dominated by Vega, the 5th brightest star',
			mythologyDetails: {
				figure: 'The 52nd largest constellation but contains Vega, the 5th brightest star in the sky and former pole star (around 12,000 BCE).',
				story: 'The Ring Nebula (M57) is one of the most photographed planetary nebulae. Vega was the first star (other than the Sun) to be photographed (1850).',
				celestialMeaning: 'Vega is the standard reference star for stellar photometry (defined as magnitude 0). It has a debris disk that may harbor planets.',
				culturalSignificance: 'Vega is part of the Summer Triangle. Due to precession, it will again be the North Star around 13,700 CE.'
			}, majorStars: [{ name: 'Vega', designation: 'α Lyr', magnitude: 0.03, distance: '25 ly', spectralType: 'A0V' }] },
		{ name: 'Aquila', meaning: 'The Eagle', abbreviation: 'Aql', stars: 10, brightest: 'Altair', brightestMag: 0.76, ra: '19h 40m', dec: '+3°', area: 652, quadrant: 'NQ4', onEcliptic: false, onEquator: true, mythology: 'Straddles celestial equator; Altair completes the Summer Triangle',
			mythologyDetails: {
				figure: 'The 22nd largest constellation, straddling the celestial equator. Altair is one of the closest bright stars at just 17 light-years.',
				story: 'Altair rotates extremely fast—one rotation every 9 hours (vs. 25 days for the Sun). This flattens the star significantly at its equator.',
				celestialMeaning: 'Completes the Summer Triangle with Vega (Lyra) and Deneb (Cygnus). Contains several planetary nebulae and the dark nebula B143.',
				culturalSignificance: 'Best visible in late summer. In East Asian tradition, Altair (the Cowherd) is separated from Vega (the Weaver Girl) by the Milky Way.'
			}, majorStars: [{ name: 'Altair', designation: 'α Aql', magnitude: 0.76, distance: '17 ly', spectralType: 'A7V' }] },
		{ name: 'Pegasus', meaning: 'The Winged Horse', abbreviation: 'Peg', stars: 9, brightest: 'Enif', brightestMag: 2.39, ra: '22h 41m', dec: '+19°', area: 1121, quadrant: 'NQ4', onEcliptic: false, mythology: 'Seventh-largest constellation, contains the Great Square asterism',
			mythologyDetails: {
				figure: 'The 7th largest constellation. The Great Square of Pegasus asterism is a useful autumn signpost (though one corner star, Alpheratz, is in Andromeda).',
				story: '51 Pegasi was the first Sun-like star found to host an exoplanet (1995). This "hot Jupiter" discovery revolutionized planetary science.',
				celestialMeaning: 'Contains M15, one of the oldest and densest known globular clusters at 12 billion years old.',
				culturalSignificance: 'Best visible in October. The Great Square spans about 15°, roughly the size of your fist at arm\'s length.'
			}, majorStars: [{ name: 'Enif', designation: 'ε Peg', magnitude: 2.39, distance: '670 ly', spectralType: 'K2Ib' }] },
		{ name: 'Andromeda', meaning: 'The Chained Princess', abbreviation: 'And', stars: 16, brightest: 'Alpheratz', brightestMag: 2.06, ra: '0h 48m', dec: '+37°', area: 722, quadrant: 'NQ1', onEcliptic: false, mythology: 'Home to M31, the nearest large galaxy to the Milky Way',
			mythologyDetails: {
				figure: 'The 19th largest constellation, famous for containing the Andromeda Galaxy (M31), the most distant object visible to the naked eye.',
				story: 'M31 is 2.5 million light-years away and contains roughly 1 trillion stars. It will collide with the Milky Way in about 4.5 billion years.',
				celestialMeaning: 'Also contains M32 and M110, satellite galaxies of Andromeda, and the Blue Snowball planetary nebula (NGC 7662).',
				culturalSignificance: 'Best visible in November. The Andromeda Galaxy spans 3° of sky (6 full moons), though only the bright core is visible to the naked eye.'
			}, majorStars: [{ name: 'Alpheratz', designation: 'α And', magnitude: 2.06, distance: '97 ly', spectralType: 'B8IVpMnHg' }] },
		{ name: 'Perseus', meaning: 'The Hero', abbreviation: 'Per', stars: 19, brightest: 'Mirfak', brightestMag: 1.79, ra: '3h 10m', dec: '+45°', area: 615, quadrant: 'NQ1', onEcliptic: false, mythology: 'Contains Algol, the prototype eclipsing binary star',
			mythologyDetails: {
				figure: 'The 24th largest constellation, lying in the Milky Way. Radiant point of the Perseid meteor shower.',
				story: 'Algol (the "Demon Star") is the prototype eclipsing binary. Every 2.87 days, a dimmer companion passes in front, causing Algol to fade noticeably.',
				celestialMeaning: 'Contains the Double Cluster (NGC 869 and 884), two open clusters visible to the naked eye, each about 7,000 light-years away.',
				culturalSignificance: 'The Perseid meteor shower (August) is one of the most reliable annual showers, produced by debris from comet Swift-Tuttle.'
			}, majorStars: [{ name: 'Mirfak', designation: 'α Per', magnitude: 1.79, distance: '590 ly', spectralType: 'F5Ib' }, { name: 'Algol', designation: 'β Per', magnitude: 2.12, distance: '93 ly', spectralType: 'B8V' }] },
		{ name: 'Canis Major', meaning: 'Great Dog', abbreviation: 'CMa', stars: 8, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 50m', dec: '-22°', area: 380, quadrant: 'SQ2', onEcliptic: false, mythology: 'Contains Sirius, the brightest star in the night sky',
			mythologyDetails: {
				figure: 'The 43rd largest constellation, distinguished by containing Sirius, the brightest star in Earth\'s night sky at magnitude -1.46.',
				story: 'Sirius is a binary system—Sirius A is accompanied by Sirius B, a white dwarf. Sirius B was the first white dwarf discovered (1862).',
				celestialMeaning: 'At 8.6 light-years, Sirius is one of our closest stellar neighbors. Its brightness is due primarily to proximity rather than intrinsic luminosity.',
				culturalSignificance: 'Ancient Egyptians based their calendar on Sirius\'s heliacal rising. The "Dog Days" of summer derive from Sirius rising with the Sun.'
			}, majorStars: [{ name: 'Sirius', designation: 'α CMa', magnitude: -1.46, distance: '8.6 ly', spectralType: 'A1V' }] },
		{ name: 'Centaurus', meaning: 'The Centaur', abbreviation: 'Cen', stars: 11, brightest: 'Alpha Centauri', brightestMag: -0.27, ra: '13h 4m', dec: '-47°', area: 1060, quadrant: 'SQ3', onEcliptic: false, mythology: 'Contains the closest star system to the Sun',
			mythologyDetails: {
				figure: 'The 9th largest constellation, containing Alpha Centauri, the closest star system to the Sun at 4.37 light-years.',
				story: 'Alpha Centauri is a triple system. Proxima Centauri (4.24 ly), the closest star to the Sun, hosts an Earth-sized planet in its habitable zone.',
				celestialMeaning: 'Also contains Omega Centauri (NGC 5139), the largest and brightest globular cluster visible from Earth, with 10 million stars.',
				culturalSignificance: 'Not visible from latitudes north of about 25°N. For southern observers, it\'s one of the most spectacular regions of the sky.'
			}, majorStars: [{ name: 'Alpha Centauri', designation: 'α Cen', magnitude: -0.27, distance: '4.4 ly', spectralType: 'G2V' }] },
		{ name: 'Crux', meaning: 'Southern Cross', abbreviation: 'Cru', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-60°', area: 68, quadrant: 'SQ3', onEcliptic: false, mythology: 'Smallest constellation; key for southern navigation',
			mythologyDetails: {
				figure: 'The smallest of all 88 constellations at just 68 square degrees, but one of the most distinctive and culturally important.',
				story: 'Despite its small size, it contains the Jewel Box (NGC 4755), a colorful open cluster, and part of the Coal Sack, a prominent dark nebula.',
				celestialMeaning: 'The longer axis of the Cross points toward the south celestial pole, making it invaluable for southern hemisphere navigation.',
				culturalSignificance: 'Appears on the flags of Australia, New Zealand, Brazil, Papua New Guinea, and Samoa. Once visible from Mediterranean latitudes in antiquity.'
			}, majorStars: [{ name: 'Acrux', designation: 'α Cru', magnitude: 0.76, distance: '320 ly', spectralType: 'B0.5IV' }] },
		{ name: 'Hydra', meaning: 'Water Snake', abbreviation: 'Hya', stars: 17, brightest: 'Alphard', brightestMag: 1.98, ra: '11h 36m', dec: '-14°', area: 1303, quadrant: 'SQ2', onEcliptic: false, mythology: 'Largest of all 88 constellations',
			mythologyDetails: {
				figure: 'The largest constellation, spanning 1,303 square degrees and over 100° of celestial longitude. Takes 7 hours to rise completely.',
				story: 'Contains M83, the Southern Pinwheel Galaxy, one of the closest starburst galaxies. Also home to the Ghost of Jupiter planetary nebula.',
				celestialMeaning: 'Alphard ("the solitary one") is the only bright star in this large constellation, an orange giant 177 light-years away.',
				culturalSignificance: 'Its head is best visible in early spring, but the tail doesn\'t rise until summer, illustrating its immense length across the sky.'
			}, majorStars: [{ name: 'Alphard', designation: 'α Hya', magnitude: 1.98, distance: '177 ly', spectralType: 'K3II' }] },
		{ name: 'Draco', meaning: 'The Dragon', abbreviation: 'Dra', stars: 14, brightest: 'Eltanin', brightestMag: 2.23, ra: '15h 25m', dec: '+67°', area: 1083, quadrant: 'NQ3', onEcliptic: false, mythology: 'Eighth-largest constellation, wraps around Ursa Minor',
			mythologyDetails: {
				figure: 'The 8th largest constellation, wrapping around Ursa Minor. Circumpolar from northern latitudes. Contains the north ecliptic pole.',
				story: 'Thuban (α Draconis) was the pole star when the Egyptian pyramids were built (around 2700 BCE). The Great Pyramid\'s descending passage aligned to it.',
				celestialMeaning: 'Contains the Cat\'s Eye Nebula (NGC 6543), one of the most complex planetary nebulae known, with intricate concentric shells.',
				culturalSignificance: 'The Draconid meteor shower (October) has occasionally produced spectacular meteor storms, most notably in 1933 and 1946.'
			}, majorStars: [{ name: 'Eltanin', designation: 'γ Dra', magnitude: 2.23, distance: '148 ly', spectralType: 'K5III' }] }
	];

	// Greco-Roman Classical Mythology - Same constellations with mythological focus
	const GRECO_ROMAN: Constellation[] = [
		// Zodiac constellations (on ecliptic)
		{ name: 'Aries', meaning: 'The Ram', abbreviation: 'Ari', stars: 4, brightest: 'Hamal', brightestMag: 2.0, ra: '2h 38m', dec: '+20°', area: 441, quadrant: 'NQ1', onEcliptic: true, mythology: 'The golden ram that rescued Phrixus and Helle', majorStars: [{ name: 'Hamal', designation: 'α Ari', magnitude: 2.0, distance: '66 ly', spectralType: 'K2III' }, { name: 'Sheratan', designation: 'β Ari', magnitude: 2.6, distance: '59 ly', spectralType: 'A5V' }] },
		{ name: 'Taurus', meaning: 'The Bull', abbreviation: 'Tau', stars: 19, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 42m', dec: '+15°', area: 797, quadrant: 'NQ1', onEcliptic: true, mythology: 'Zeus disguised to abduct Europa', mythologyDetails: { figure: 'Taurus represents Zeus in the form of a magnificent white bull. The Pleiades (Seven Sisters) and Hyades star clusters both lie within Taurus.', story: 'Zeus fell in love with Europa, a Phoenician princess. He transformed into a beautiful white bull and mingled with her father\'s herd. When Europa climbed onto his back, Zeus swam across the sea to Crete. The Pleiades within Taurus are the seven daughters of Atlas, placed in the sky to escape Orion\'s pursuit.', celestialMeaning: 'Orion appears to chase Taurus (and the Pleiades within it) across the sky, reflecting the myth of Orion pursuing the seven sisters. The "V" shape of the Hyades forms the bull\'s face, with Aldebaran as its fiery red eye watching the hunter approach.', culturalSignificance: 'The Pleiades\' heliacal rising in autumn marked planting season across many cultures—from Greece to Japan to the Americas. Many Indigenous peoples used "when you can\'t see the Pleiades" as the signal that frost would come. In Japan, Subaru (Pleiades) symbolizes unity.' }, majorStars: [{ name: 'Aldebaran', designation: 'α Tau', magnitude: 0.85, distance: '65 ly', spectralType: 'K5III' }, { name: 'Elnath', designation: 'β Tau', magnitude: 1.65, distance: '134 ly', spectralType: 'B7III' }] },
		{ name: 'Gemini', meaning: 'The Twins', abbreviation: 'Gem', stars: 8, brightest: 'Pollux', brightestMag: 1.14, ra: '7h 4m', dec: '+22°', area: 514, quadrant: 'NQ2', onEcliptic: true, mythology: 'Castor and Pollux, twin brothers of Helen of Troy', majorStars: [{ name: 'Pollux', designation: 'β Gem', magnitude: 1.14, distance: '34 ly', spectralType: 'K0III' }, { name: 'Castor', designation: 'α Gem', magnitude: 1.58, distance: '52 ly', spectralType: 'A1V' }] },
		{ name: 'Cancer', meaning: 'The Crab', abbreviation: 'Cnc', stars: 5, brightest: 'Tarf', brightestMag: 3.5, ra: '8h 39m', dec: '+20°', area: 506, quadrant: 'NQ2', onEcliptic: true, mythology: 'Sent by Hera to distract Heracles', majorStars: [{ name: 'Tarf', designation: 'β Cnc', magnitude: 3.5, distance: '290 ly', spectralType: 'K4III' }] },
		{ name: 'Leo', meaning: 'The Lion', abbreviation: 'Leo', stars: 9, brightest: 'Regulus', brightestMag: 1.35, ra: '10h 40m', dec: '+13°', area: 947, quadrant: 'NQ2', onEcliptic: true, mythology: 'The Nemean Lion slain by Heracles', majorStars: [{ name: 'Regulus', designation: 'α Leo', magnitude: 1.35, distance: '79 ly', spectralType: 'B8IVn' }, { name: 'Denebola', designation: 'β Leo', magnitude: 2.14, distance: '36 ly', spectralType: 'A3V' }] },
		{ name: 'Virgo', meaning: 'The Maiden', abbreviation: 'Vir', stars: 9, brightest: 'Spica', brightestMag: 0.97, ra: '13h 25m', dec: '-4°', area: 1294, quadrant: 'SQ3', onEcliptic: true, mythology: 'Goddess of harvest and justice', majorStars: [{ name: 'Spica', designation: 'α Vir', magnitude: 0.97, distance: '250 ly', spectralType: 'B1V' }, { name: 'Vindemiatrix', designation: 'ε Vir', magnitude: 2.83, distance: '102 ly', spectralType: 'G8III' }] },
		{ name: 'Libra', meaning: 'The Scales', abbreviation: 'Lib', stars: 4, brightest: 'Zubeneschamali', brightestMag: 2.6, ra: '15h 17m', dec: '-15°', area: 538, quadrant: 'SQ3', onEcliptic: true, mythology: 'Scales of justice held by Astraea', majorStars: [{ name: 'Zubeneschamali', designation: 'β Lib', magnitude: 2.6, distance: '185 ly', spectralType: 'B8V' }] },
		{ name: 'Scorpius', meaning: 'The Scorpion', abbreviation: 'Sco', stars: 18, brightest: 'Antares', brightestMag: 0.96, ra: '16h 53m', dec: '-30°', area: 497, quadrant: 'SQ3', onEcliptic: true, mythology: 'Sent by Gaia to kill Orion', mythologyDetails: { figure: 'The Scorpion was a monstrous creature sent by Gaia (Earth) to punish the boastful hunter Orion. It was no ordinary scorpion but a primordial beast of divine origin.', story: 'When Orion declared he would kill every animal on Earth, Gaia sent the Scorpion to stop him. The two fought an epic battle. Though Orion was mighty, the Scorpion\'s poison was too powerful. Both died in the struggle, and Zeus placed them in opposite ends of the sky as a memorial to their battle.', celestialMeaning: 'Scorpius and Orion are eternal enemies in the sky. The gods placed them at opposite ends of the heavens so they would never meet again—when Scorpius rises, Orion flees below the horizon. Antares, the "heart" of the Scorpion, means "rival of Mars" (Anti-Ares) due to its red color rivaling the red planet.', culturalSignificance: 'Scorpius rising in summer marked the hottest part of the year. The Egyptians saw it as a symbol of Isis. For the Māori of New Zealand, it is Te Matau a Māui (the fishhook of Māui) that pulled up the North Island from the sea.' }, majorStars: [{ name: 'Antares', designation: 'α Sco', magnitude: 0.96, distance: '600 ly', spectralType: 'M1Ib' }, { name: 'Shaula', designation: 'λ Sco', magnitude: 1.62, distance: '570 ly', spectralType: 'B2IV' }] },
		{ name: 'Sagittarius', meaning: 'The Archer', abbreviation: 'Sgr', stars: 8, brightest: 'Kaus Australis', brightestMag: 1.85, ra: '19h 0m', dec: '-25°', area: 867, quadrant: 'SQ4', onEcliptic: true, mythology: 'Centaur archer Chiron', majorStars: [{ name: 'Kaus Australis', designation: 'ε Sgr', magnitude: 1.85, distance: '143 ly', spectralType: 'B9.5III' }] },
		{ name: 'Capricornus', meaning: 'The Sea-Goat', abbreviation: 'Cap', stars: 5, brightest: 'Deneb Algedi', brightestMag: 2.87, ra: '21h 2m', dec: '-18°', area: 414, quadrant: 'SQ4', onEcliptic: true, mythology: 'Pan transformed to escape Typhon', majorStars: [{ name: 'Deneb Algedi', designation: 'δ Cap', magnitude: 2.87, distance: '39 ly', spectralType: 'A7III' }] },
		{ name: 'Aquarius', meaning: 'The Water Bearer', abbreviation: 'Aqr', stars: 10, brightest: 'Sadalsuud', brightestMag: 2.91, ra: '22h 17m', dec: '-10°', area: 980, quadrant: 'SQ4', onEcliptic: true, mythology: 'Ganymede, cupbearer to the gods', majorStars: [{ name: 'Sadalsuud', designation: 'β Aqr', magnitude: 2.91, distance: '540 ly', spectralType: 'G0Ib' }] },
		{ name: 'Pisces', meaning: 'The Fishes', abbreviation: 'Psc', stars: 7, brightest: 'Eta Piscium', brightestMag: 3.62, ra: '0h 28m', dec: '+7°', area: 889, quadrant: 'NQ1', onEcliptic: true, mythology: 'Aphrodite and Eros transformed to escape Typhon', majorStars: [{ name: 'Eta Piscium', designation: 'η Psc', magnitude: 3.62, distance: '294 ly', spectralType: 'G7III' }] },
		// Major non-ecliptic constellations
		{ name: 'Orion', meaning: 'The Hunter', abbreviation: 'Ori', stars: 7, brightest: 'Rigel', brightestMag: 0.12, ra: '5h 30m', dec: '+0°', area: 594, quadrant: 'NQ1', onEcliptic: false, mythology: 'Giant huntsman placed in the sky by Zeus', mythologyDetails: { figure: 'Orion was a giant huntsman of great beauty and skill, son of Poseidon. He was the greatest hunter in the world and could walk on water, a gift from his divine father.', story: 'Orion boasted he could kill any creature on Earth. Gaia (Mother Earth), fearing for her animals, sent a giant scorpion to kill him. In another version, Artemis fell in love with Orion, but her brother Apollo, jealous of their bond, tricked her into shooting Orion with an arrow from a great distance.', celestialMeaning: 'Orion eternally flees from Scorpius across the sky—as Scorpius rises in the east, Orion sets in the west. They are never visible together, representing their eternal conflict. Orion appears to chase the Pleiades (seven sisters) across the heavens, while his faithful dogs (Canis Major and Minor) follow at his heels.', culturalSignificance: 'Orion\'s appearance in late autumn marked hunting season for many cultures. The "Belt" stars were used for navigation. In Egypt, Orion was associated with Osiris, god of the afterlife—the pyramids of Giza are aligned to mirror Orion\'s Belt.' }, majorStars: [{ name: 'Rigel', designation: 'β Ori', magnitude: 0.12, distance: '860 ly', spectralType: 'B8Ia' }, { name: 'Betelgeuse', designation: 'α Ori', magnitude: 0.42, distance: '700 ly', spectralType: 'M1Ia' }, { name: 'Bellatrix', designation: 'γ Ori', magnitude: 1.64, distance: '250 ly', spectralType: 'B2III' }] },
		{ name: 'Ursa Major', meaning: 'Great Bear', abbreviation: 'UMa', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', area: 1280, quadrant: 'NQ2', onEcliptic: false, mythology: 'Callisto transformed by Hera', mythologyDetails: { figure: 'Ursa Major represents Callisto, a beautiful nymph and companion of Artemis. The seven bright stars forming the "Big Dipper" are among the most recognized in the Northern Hemisphere.', story: 'Zeus seduced Callisto, and she bore him a son, Arcas. When Hera discovered this, she transformed Callisto into a bear. Years later, Arcas nearly killed his mother while hunting. Zeus intervened, placing both in the sky—Callisto as Ursa Major and Arcas as Ursa Minor.', celestialMeaning: 'Ursa Major never sets below the horizon in northern latitudes (circumpolar). The Greeks said Hera forbade the bear from bathing in the sea (setting), condemning her to circle eternally. The two "pointer stars" (Dubhe and Merak) point toward Polaris in Ursa Minor.', culturalSignificance: 'The Big Dipper has served as a navigation aid across cultures. For escaping enslaved people in America, it was the "Drinking Gourd" pointing north to freedom. Many Indigenous peoples see a bear being chased by hunters—the handle stars are the hunters pursuing her.' }, majorStars: [{ name: 'Alioth', designation: 'ε UMa', magnitude: 1.77, distance: '81 ly', spectralType: 'A1III' }, { name: 'Dubhe', designation: 'α UMa', magnitude: 1.79, distance: '124 ly', spectralType: 'K0III' }] },
		{ name: 'Ursa Minor', meaning: 'Little Bear', abbreviation: 'UMi', stars: 7, brightest: 'Polaris', brightestMag: 1.98, ra: '15h 40m', dec: '+77°', area: 256, quadrant: 'NQ3', onEcliptic: false, mythology: 'Arcas, son of Callisto', majorStars: [{ name: 'Polaris', designation: 'α UMi', magnitude: 1.98, distance: '433 ly', spectralType: 'F7Ib' }] },
		{ name: 'Cassiopeia', meaning: 'The Queen', abbreviation: 'Cas', stars: 5, brightest: 'Schedar', brightestMag: 2.24, ra: '1h 0m', dec: '+60°', area: 598, quadrant: 'NQ1', onEcliptic: false, mythology: 'Vain queen punished by Poseidon', majorStars: [{ name: 'Schedar', designation: 'α Cas', magnitude: 2.24, distance: '228 ly', spectralType: 'K0IIIa' }] },
		{ name: 'Cygnus', meaning: 'The Swan', abbreviation: 'Cyg', stars: 9, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 35m', dec: '+42°', area: 804, quadrant: 'NQ4', onEcliptic: false, mythology: 'Zeus disguised to seduce Leda', majorStars: [{ name: 'Deneb', designation: 'α Cyg', magnitude: 1.25, distance: '2600 ly', spectralType: 'A2Ia' }, { name: 'Albireo', designation: 'β Cyg', magnitude: 3.08, distance: '430 ly', spectralType: 'K2II' }] },
		{ name: 'Lyra', meaning: 'The Lyre', abbreviation: 'Lyr', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 51m', dec: '+36°', area: 286, quadrant: 'NQ4', onEcliptic: false, mythology: 'Orpheus\'s lyre', majorStars: [{ name: 'Vega', designation: 'α Lyr', magnitude: 0.03, distance: '25 ly', spectralType: 'A0V' }] },
		{ name: 'Aquila', meaning: 'The Eagle', abbreviation: 'Aql', stars: 10, brightest: 'Altair', brightestMag: 0.76, ra: '19h 40m', dec: '+3°', area: 652, quadrant: 'NQ4', onEcliptic: false, mythology: 'Eagle that carried Zeus\'s thunderbolts', majorStars: [{ name: 'Altair', designation: 'α Aql', magnitude: 0.76, distance: '17 ly', spectralType: 'A7V' }] },
		{ name: 'Pegasus', meaning: 'The Winged Horse', abbreviation: 'Peg', stars: 9, brightest: 'Enif', brightestMag: 2.39, ra: '22h 41m', dec: '+19°', area: 1121, quadrant: 'NQ4', onEcliptic: false, mythology: 'Born from Medusa\'s blood', majorStars: [{ name: 'Enif', designation: 'ε Peg', magnitude: 2.39, distance: '670 ly', spectralType: 'K2Ib' }] },
		{ name: 'Andromeda', meaning: 'The Chained Princess', abbreviation: 'And', stars: 16, brightest: 'Alpheratz', brightestMag: 2.06, ra: '0h 48m', dec: '+37°', area: 722, quadrant: 'NQ1', onEcliptic: false, mythology: 'Princess chained as sacrifice to Cetus', majorStars: [{ name: 'Alpheratz', designation: 'α And', magnitude: 2.06, distance: '97 ly', spectralType: 'B8IVpMnHg' }] },
		{ name: 'Perseus', meaning: 'The Hero', abbreviation: 'Per', stars: 19, brightest: 'Mirfak', brightestMag: 1.79, ra: '3h 10m', dec: '+45°', area: 615, quadrant: 'NQ1', onEcliptic: false, mythology: 'Slayer of Medusa, rescuer of Andromeda', majorStars: [{ name: 'Mirfak', designation: 'α Per', magnitude: 1.79, distance: '590 ly', spectralType: 'F5Ib' }, { name: 'Algol', designation: 'β Per', magnitude: 2.12, distance: '93 ly', spectralType: 'B8V' }] },
		{ name: 'Canis Major', meaning: 'Great Dog', abbreviation: 'CMa', stars: 8, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 50m', dec: '-22°', area: 380, quadrant: 'SQ2', onEcliptic: false, mythology: 'Orion\'s hunting dog', majorStars: [{ name: 'Sirius', designation: 'α CMa', magnitude: -1.46, distance: '8.6 ly', spectralType: 'A1V' }] },
		{ name: 'Centaurus', meaning: 'The Centaur', abbreviation: 'Cen', stars: 11, brightest: 'Alpha Centauri', brightestMag: -0.27, ra: '13h 4m', dec: '-47°', area: 1060, quadrant: 'SQ3', onEcliptic: false, mythology: 'The wise centaur Chiron', majorStars: [{ name: 'Alpha Centauri', designation: 'α Cen', magnitude: -0.27, distance: '4.4 ly', spectralType: 'G2V' }] },
		{ name: 'Crux', meaning: 'Southern Cross', abbreviation: 'Cru', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-60°', area: 68, quadrant: 'SQ3', onEcliptic: false, mythology: 'Christian cross; used for navigation', majorStars: [{ name: 'Acrux', designation: 'α Cru', magnitude: 0.76, distance: '320 ly', spectralType: 'B0.5IV' }] },
		{ name: 'Hydra', meaning: 'Water Snake', abbreviation: 'Hya', stars: 17, brightest: 'Alphard', brightestMag: 1.98, ra: '11h 36m', dec: '-14°', area: 1303, quadrant: 'SQ2', onEcliptic: false, mythology: 'Serpent slain by Heracles', majorStars: [{ name: 'Alphard', designation: 'α Hya', magnitude: 1.98, distance: '177 ly', spectralType: 'K3II' }] },
		{ name: 'Draco', meaning: 'The Dragon', abbreviation: 'Dra', stars: 14, brightest: 'Eltanin', brightestMag: 2.23, ra: '15h 25m', dec: '+67°', area: 1083, quadrant: 'NQ3', onEcliptic: false, mythology: 'Dragon guarding the golden apples', majorStars: [{ name: 'Eltanin', designation: 'γ Dra', magnitude: 2.23, distance: '148 ly', spectralType: 'K5III' }] },
		{ name: 'Boötes', meaning: 'The Herdsman', abbreviation: 'Boo', stars: 7, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 42m', dec: '+31°', area: 907, quadrant: 'NQ3', onEcliptic: false, mythology: 'Driver of the oxen in Ursa Major', majorStars: [{ name: 'Arcturus', designation: 'α Boo', magnitude: -0.05, distance: '37 ly', spectralType: 'K1.5III' }] },
		{ name: 'Corona Borealis', meaning: 'Northern Crown', abbreviation: 'CrB', stars: 4, brightest: 'Alphecca', brightestMag: 2.23, ra: '15h 50m', dec: '+33°', area: 179, quadrant: 'NQ3', onEcliptic: false, mythology: 'Crown of Ariadne', majorStars: [{ name: 'Alphecca', designation: 'α CrB', magnitude: 2.23, distance: '75 ly', spectralType: 'A0V' }] }
	];

	// Chinese 28 Lunar Mansions (宿 Xiù) + Four Symbols + Zodiac Context
	// Note: These follow the celestial EQUATOR and Moon's path, not the ecliptic (Sun's path)
	// The 12 Chinese zodiac animals are based on Jupiter's 12-year orbit, each linked to specific mansions
	const CHINESE: Constellation[] = [
		// THE FOUR SYMBOLS (四象) - Meta-constellations spanning multiple mansions
		{ name: 'Qīnglóng (青龍)', meaning: 'Azure Dragon', abbreviation: '东方', stars: 32, brightest: 'Spica', brightestMag: 1.04, ra: '15h 00m', dec: '-15°', onEquator: true, mythology: 'The Azure Dragon of the East, ruling spring',
			mythologyDetails: {
				figure: 'The Azure Dragon (Qīnglóng) is one of the Four Symbols of Chinese astronomy, a celestial dragon spanning seven lunar mansions. It represents the East, spring, the Wood element, and the color blue-green. The Dragon is considered the most auspicious of the Four Symbols.',
				story: 'When the Dragon\'s heart (Antares) rises in the east at dusk in late spring, farmers knew the rainy season had begun. Ancient chronicles tell that the first legendary emperor, Huangdi, rode a dragon into the heavens after his death. The Dragon brings life-giving rain and controls rivers.',
				celestialMeaning: 'The seven mansions from Horn to Winnowing Basket form the Dragon\'s body: Horn (head), Neck, Root (shoulders), Room (chest), Heart, Tail, and Basket (end). When fully visible, the Dragon stretches across 1/4 of the celestial equator.',
				culturalSignificance: 'The dragon became the symbol of the Emperor, who wore dragon robes and sat on the Dragon Throne. The character 龍 (dragon) appears in words for excellence. Dragon dances during festivals invoke its power to bring rain and prosperity.'
			},
			majorStars: [
				{ name: 'Spica', designation: 'α Vir', magnitude: 1.04, distance: '250 ly', spectralType: 'B1V' },
				{ name: 'Antares', designation: 'α Sco', magnitude: 1.06, distance: '600 ly', spectralType: 'M1Ib' }
			]
		},
		{ name: 'Xuánwǔ (玄武)', meaning: 'Black Tortoise', abbreviation: '北方', stars: 35, brightest: 'Fomalhaut', brightestMag: 1.16, ra: '22h 00m', dec: '+5°', onEquator: true, mythology: 'The Black Tortoise of the North, ruling winter',
			mythologyDetails: {
				figure: 'The Black Tortoise (Xuánwǔ) combines a tortoise and snake—the tortoise represents longevity and the earth, while the snake represents wisdom and heaven. Together they symbolize the perfect balance of yin (earth) and yang (sky). It rules the North, winter, and the Water element.',
				story: 'Xuánwǔ was originally a prince who became a Daoist immortal after 42 years of meditation. He shed his human stomach and intestines, which transformed into the tortoise and snake. As the God of the North, he commands the armies of the underworld and protects against evil.',
				celestialMeaning: 'The seven mansions from Dipper to Wall form the Tortoise\'s domain. The Southern Dipper marks its head, while the Encampment and Wall form the protective shell. In winter, these stars dominate the northern sky.',
				culturalSignificance: 'Temples to Xuánwǔ protected cities from invasion. The famous Wudang Mountains are sacred to him, birthplace of tai chi. The tortoise-snake motif appears in architecture, with tortoise-shaped bases supporting memorial steles.'
			}
		},
		{ name: 'Báihǔ (白虎)', meaning: 'White Tiger', abbreviation: '西方', stars: 54, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 00m', dec: '+20°', onEquator: true, mythology: 'The White Tiger of the West, ruling autumn',
			mythologyDetails: {
				figure: 'The White Tiger (Báihǔ) rules the western sky and autumn, associated with the Metal element and the color white. Tigers in China symbolize power, courage, and military prowess. The celestial tiger only appears white after 500 years of life, making it exceptionally rare and powerful.',
				story: 'The White Tiger appears when a sage ruler governs justly. In the Records of the Grand Historian, a white tiger appeared before King Wen of Zhou, portending the founding of the Zhou dynasty. The tiger commands respect—even the dragon\'s rain cannot extinguish its fighting spirit.',
				celestialMeaning: 'Seven mansions from Legs to Three Stars form the Tiger: Legs (feet), Bond (belly), Stomach, Hairy Head (Pleiades on forehead), Net (Hyades as snare), Turtle Beak, and Three Stars (Orion\'s belt as the tiger\'s body). Its rising marks autumn\'s arrival.',
				culturalSignificance: 'Generals wore tiger imagery into battle. The phrase "crouching tiger, hidden dragon" describes concealed power. Autumn executions were carried out under the Tiger\'s watch, as the Metal element represents justice—cutting what must be cut.'
			},
			majorStars: [
				{ name: 'Aldebaran', designation: 'α Tau', magnitude: 0.85, distance: '65 ly', spectralType: 'K5III' },
				{ name: 'Rigel', designation: 'β Ori', magnitude: 0.13, distance: '860 ly', spectralType: 'B8Ia' }
			]
		},
		{ name: 'Zhūquè (朱雀)', meaning: 'Vermilion Bird', abbreviation: '南方', stars: 42, brightest: 'Alphard', brightestMag: 1.98, ra: '9h 00m', dec: '+5°', onEquator: true, mythology: 'The Vermilion Bird of the South, ruling summer',
			mythologyDetails: {
				figure: 'The Vermilion Bird (Zhūquè) is a sacred bird wreathed in flames, ruling the southern sky and summer. Associated with the Fire element and the color red, it is sometimes confused with the phoenix (fènghuáng) but is distinct—where the phoenix represents immortality through rebirth, the Vermilion Bird represents the eternal fire of summer.',
				story: 'The Vermilion Bird carries the sun across the southern sky and kindles the summer heat. When the Han dynasty founder Liu Bang was born, his mother dreamed of mating with a red dragon—the Vermilion Bird\'s influence. Red banners and decorations at weddings invoke its blessing.',
				celestialMeaning: 'Seven mansions from Well to Chariot form the Bird: Well (beak), Ghost (ghost carriage carrying souls), Willow (neck), Star (crop), Extended Net (wings spread for prey), Wings, and Chariot (tail). Summer brings the bird to prominence.',
				culturalSignificance: 'Red is the luckiest color in China because of the Vermilion Bird. Southern-facing gates (toward the bird) are most auspicious. The bird appears on military flags and represents the army\'s vanguard.'
			}
		},
		// AZURE DRAGON MANSIONS (青龍七宿) - East, Spring, Wood, Dragon zodiac years
		{ name: 'Jiǎo (角)', meaning: 'Horn', abbreviation: 'Xiu1', stars: 2, brightest: 'Spica', brightestMag: 1.04, ra: '13h 25m', dec: '-11°', onEquator: true, mythology: 'Dragon\'s horns; first mansion, associated with Dragon zodiac year',
			mythologyDetails: {
				figure: 'The Horn is the Azure Dragon\'s twin horns, marked by the brilliant blue-white star Spica. As the first lunar mansion, it begins the celestial cycle and is associated with the Dragon (龍) in the zodiac—people born in Dragon years share the mansion\'s qualities of leadership and auspiciousness.',
				story: 'When the Horn rose at dusk in ancient times, farmers knew spring planting must begin. The Jiǎo mansion was used to time the vernal equinox sacrifices. One legend tells that a dragon\'s horn, if found on earth, could control the weather.',
				celestialMeaning: 'Spica\'s heliacal rising (first visible before dawn) marked the start of the agricultural calendar. The two stars of the Horn point toward the celestial equator, making this mansion critical for astronomical observations.',
				culturalSignificance: 'The Dragon zodiac sign (those born in Dragon years) draws on this mansion\'s energy—ambition, nobility, and cosmic favor. Emperors performed sacrifices when the Horn was prominent.'
			}
		},
		{ name: 'Kàng (亢)', meaning: 'Neck', abbreviation: 'Xiu2', stars: 4, brightest: 'κ Vir', ra: '14h 13m', dec: '-10°', onEquator: true, mythology: 'Dragon\'s neck; governs planting season' },
		{ name: 'Dǐ (氐)', meaning: 'Root/Foundation', abbreviation: 'Xiu3', stars: 4, brightest: 'α Lib', ra: '14h 50m', dec: '-16°', onEquator: true, mythology: 'Dragon\'s chest; stability and grounding' },
		{ name: 'Fáng (房)', meaning: 'Room/Chamber', abbreviation: 'Xiu4', stars: 4, brightest: 'π Sco', ra: '15h 58m', dec: '-26°', onEquator: true, mythology: 'Emperor\'s chamber; governs the Moon and royal matters',
			mythologyDetails: {
				figure: 'The Room (Fáng) represents the celestial emperor\'s private chambers in the dragon\'s body. Associated with the Rabbit (兔) zodiac, as the Rabbit is gentle and prefers indoor sanctuary. This mansion governs matters of the imperial household.',
				story: 'The Moon was said to rest in this mansion when full. Court astrologers watched Fáng carefully—if the Moon was eclipsed here, it portended trouble in the imperial harem. Conversely, a bright Moon in Fáng meant harmony in the palace.',
				celestialMeaning: 'Positioned at the dragon\'s belly, Fáng connects the chest (Dǐ) to the heart (Xīn). Its four stars form a rectangle representing the four walls of a room.',
				culturalSignificance: 'The Rabbit zodiac sign shares qualities with this mansion—both represent domestic peace, sensitivity to cycles (the Moon), and quiet intelligence over aggression.'
			}
		},
		{ name: 'Xīn (心)', meaning: 'Heart', abbreviation: 'Xiu5', stars: 3, brightest: 'Antares', brightestMag: 1.06, ra: '16h 29m', dec: '-26°', onEquator: true, mythology: 'Dragon\'s heart; the Emperor star, most sacred mansion',
			mythologyDetails: {
				figure: 'The Heart (Xīn) is the Azure Dragon\'s heart, centered on the blood-red star Antares (大火, "Great Fire"). This mansion represented the Emperor himself. The three stars symbolized the Emperor (center, Antares) flanked by the Crown Prince and younger princes.',
				story: 'Antares was called the "Fire Star" and was watched obsessively by court astrologers. When Mars (also red) approached Antares, it was called "Fire approaches Fire" (熒惑守心)—one of the most feared celestial omens, foretelling the Emperor\'s death or dynastic change.',
				celestialMeaning: 'At the exact center of the Azure Dragon, the Heart governed the summer solstice. When it culminated at midnight, the Emperor performed the most important sacrifices. Its redness connected it to the Fire element despite the Dragon\'s Wood nature.',
				culturalSignificance: 'The phrase "dragon\'s heart" (龍心) means the core of imperial power. Officials wore badges showing their proximity to the Emperor\'s heart. This mansion had its own altar in the Temple of Heaven.'
			},
			majorStars: [
				{ name: 'Antares', designation: 'α Sco', magnitude: 1.06, distance: '600 ly', spectralType: 'M1Ib' },
				{ name: 'σ Sco', designation: 'σ Sco', magnitude: 2.88, distance: '696 ly', spectralType: 'B1III' },
				{ name: 'τ Sco', designation: 'τ Sco', magnitude: 2.82, distance: '474 ly', spectralType: 'B0V' }
			]
		},
		{ name: 'Wěi (尾)', meaning: 'Tail', abbreviation: 'Xiu6', stars: 9, brightest: 'μ Sco', ra: '16h 52m', dec: '-38°', onEquator: true, mythology: 'Dragon\'s tail; governs heirs and descendants, Tiger zodiac' },
		{ name: 'Jī (箕)', meaning: 'Winnowing Basket', abbreviation: 'Xiu7', stars: 4, brightest: 'γ Sgr', ra: '18h 06m', dec: '-30°', onEquator: true, mythology: 'End of Dragon; governs wind, speech, and gossip' },
		// BLACK TORTOISE MANSIONS (玄武七宿) - North, Winter, Water, Ox/Rat zodiac years
		{ name: 'Dǒu (斗)', meaning: 'Southern Dipper', abbreviation: 'Xiu8', stars: 6, brightest: 'φ Sgr', ra: '18h 46m', dec: '-27°', onEquator: true, mythology: 'Tortoise head; controls fate and lifespan, Ox zodiac',
			mythologyDetails: {
				figure: 'The Southern Dipper forms the head of the Black Tortoise and is associated with the Ox (牛) zodiac. While the Northern Dipper (Big Dipper) records death, the Southern Dipper records birth—the two dippers together control human destiny.',
				story: 'A famous tale tells of Guan Lu, a fortune teller who helped a young man destined to die at 19. Following Guan Lu\'s advice, the man offered wine to two old men playing chess—the spirits of the North and South Dippers. Moved by his sincerity, the South Dipper changed his "19" to "90."',
				celestialMeaning: 'The six stars resemble a ladle dipping into the Milky Way. Positioned at the celestial river\'s brightest section, it was believed to ladle out souls for rebirth. Its position marked late autumn and early winter.',
				culturalSignificance: 'The Ox zodiac shares this mansion\'s qualities: patient, hardworking, connected to agriculture and prosperity. Birthday rituals included prayers to the Southern Dipper for longevity. Daoist priests still perform Dipper-walking rituals.'
			}
		},
		{ name: 'Niú (牛)', meaning: 'Ox', abbreviation: 'Xiu9', stars: 6, brightest: 'β Cap', ra: '20h 21m', dec: '-15°', onEquator: true, mythology: 'The Cowherd; associated with the Ox zodiac and harvest',
			mythologyDetails: {
				figure: 'The Ox mansion represents the celestial ox of the Cowherd (Niúláng), the mortal who married the Weaving Maiden (Zhīnǚ). The Ox zodiac (牛) draws its nature directly from this mansion—diligence, reliability, and quiet strength.',
				story: 'The Cowherd was a poor orphan whose only companion was his elderly ox. The ox was actually a disgraced immortal who helped Niúláng meet and marry Zhīnǚ. When the ox died, it told him to keep its hide to fly to heaven—which he used when the Jade Emperor separated the lovers.',
				celestialMeaning: 'Opposite the Weaving Maiden across the Milky Way, the Ox appears in late summer. When the Moon passes through during the 7th month, it\'s time for the Qixi Festival when the lovers reunite.',
				culturalSignificance: 'People born in Ox years are said to be as faithful as the celestial ox—loyal even unto death, willing to sacrifice for love. Farmers honor this mansion at harvest\'s end, thanking their oxen for the year\'s labor.'
			}
		},
		{ name: 'Nǚ (女)', meaning: 'Weaving Maiden', abbreviation: 'Xiu10', stars: 4, brightest: 'ε Aqr', ra: '20h 48m', dec: '-9°', onEquator: true, mythology: 'The Weaving Girl; embroidery and textiles, paired with Ox' },
		{ name: 'Xū (虛)', meaning: 'Emptiness/Void', abbreviation: 'Xiu11', stars: 2, brightest: 'β Aqr', ra: '21h 32m', dec: '-6°', onEquator: true, mythology: 'The Void; mourning, funerals, winter solstice, Rat zodiac',
			mythologyDetails: {
				figure: 'The Emptiness (Xū) represents the cosmic void and is associated with the Rat (鼠) zodiac. The Rat was first to reach the Jade Emperor\'s celestial banquet by being clever and resourceful—emerging from emptiness/nothing to achieve first place.',
				story: 'When the Jade Emperor called all animals to determine the zodiac order, the Rat had no way to cross a river. It convinced the Ox to carry it, then jumped off at the last moment to arrive first. From emptiness, the Rat created opportunity.',
				celestialMeaning: 'This mansion marks the winter solstice—the moment of maximum darkness before light returns. It represents the empty space between death and rebirth, the pause between years.',
				culturalSignificance: 'The Rat zodiac shares this mansion\'s paradoxical nature: from nothing, everything can emerge. Rat-year people are clever, resourceful, and able to thrive in scarcity. Funeral rites were timed by this mansion.'
			}
		},
		{ name: 'Wēi (危)', meaning: 'Rooftop/Danger', abbreviation: 'Xiu12', stars: 3, brightest: 'α Aqr', ra: '22h 06m', dec: '-0°', onEquator: true, mythology: 'Steep roof; construction, renovation, calculated risks' },
		{ name: 'Shì (室)', meaning: 'Encampment', abbreviation: 'Xiu13', stars: 2, brightest: 'α Peg', ra: '23h 05m', dec: '+15°', onEquator: true, mythology: 'Military camp; warfare, fortifications, Pig zodiac' },
		{ name: 'Bì (壁)', meaning: 'Wall', abbreviation: 'Xiu14', stars: 2, brightest: 'γ Peg', ra: '0h 13m', dec: '+15°', onEquator: true, mythology: 'Library wall; literature, learning, scholarship' },
		// WHITE TIGER MANSIONS (白虎七宿) - West, Autumn, Metal, Dog/Rooster zodiac years
		{ name: 'Kuí (奎)', meaning: 'Legs', abbreviation: 'Xiu15', stars: 16, brightest: 'η And', ra: '0h 57m', dec: '+23°', onEquator: true, mythology: 'Tiger\'s legs; literature and written works, Dog zodiac' },
		{ name: 'Lóu (婁)', meaning: 'Bond/Pasture', abbreviation: 'Xiu16', stars: 3, brightest: 'β Ari', ra: '1h 54m', dec: '+21°', onEquator: true, mythology: 'Tiger\'s belly; animal husbandry, gathering' },
		{ name: 'Wèi (胃)', meaning: 'Stomach/Granary', abbreviation: 'Xiu17', stars: 3, brightest: '35 Ari', ra: '2h 44m', dec: '+19°', onEquator: true, mythology: 'The Granary; food storage, warehouses, Rooster zodiac',
			mythologyDetails: {
				figure: 'The Stomach (Wèi) represents a celestial granary within the White Tiger. Associated with the Rooster (雞) zodiac, both concern the storage and protection of sustenance. The Rooster pecks grain; the Stomach stores it.',
				story: 'This mansion was watched to predict famine or abundance. If a comet passed through the Stomach, grain prices would rise. If the stars shone bright, harvests would overflow. Wise rulers stockpiled grain when omens appeared in Wèi.',
				celestialMeaning: 'Located where the tiger\'s belly would be, this mansion governs digestion—of food, of knowledge, of experience. It rises in late autumn when the harvest is gathered and stored.',
				culturalSignificance: 'The Rooster zodiac shares the mansion\'s vigilance—roosters guard the grain, crowing at dawn to wake farmers. Rooster-year people are punctual, organized, and practical about resources.'
			}
		},
		{ name: 'Mǎo (昴)', meaning: 'Hairy Head', abbreviation: 'Xiu18', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEquator: true, mythology: 'The Pleiades; execution season, judgment, Monkey zodiac',
			mythologyDetails: {
				figure: 'The Hairy Head (Mǎo) is the Pleiades cluster forming the White Tiger\'s fur crown. Associated with the Monkey (猴) zodiac, both represent sharp judgment—the Monkey is clever and discerning, while the Pleiades marked the execution season when justice was carried out.',
				story: 'The seven visible stars were called the "Seven Sisters of Death." Criminals condemned in summer were executed in autumn when Mǎo rose at dusk. The Pleiades\' cold blue light was thought to carry souls to judgment. One legend calls them seven weaving maidens who ascended to escape an earthly prince.',
				celestialMeaning: 'The Pleiades\' visibility was used to test eyesight—seeing all seven meant keen perception. Their heliacal rising marked the transition from harvest to winter preparation.',
				culturalSignificance: 'The Monkey zodiac shares the mansion\'s discernment—seeing through deception, judging character. Despite death associations, this mansion also represents clarity and truth. Judges invoked it when hearing difficult cases.'
			},
			majorStars: [
				{ name: 'Alcyone', designation: 'η Tau', magnitude: 2.87, distance: '440 ly', spectralType: 'B7III' },
				{ name: 'Atlas', designation: '27 Tau', magnitude: 3.62, distance: '431 ly', spectralType: 'B8III' },
				{ name: 'Electra', designation: '17 Tau', magnitude: 3.70, distance: '440 ly', spectralType: 'B6III' }
			]
		},
		{ name: 'Bì (畢)', meaning: 'Net', abbreviation: 'Xiu19', stars: 8, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 20m', dec: '+16°', onEquator: true, mythology: 'Hunting net; rain, borders, hunting, Goat zodiac',
			mythologyDetails: {
				figure: 'The Net (Bì) is a celestial hunting net centered on orange Aldebaran. Associated with the Goat/Sheep (羊) zodiac, both concern gathering—the net catches prey, the goat gathers with its flock. This mansion governs hunting, rain, and territorial boundaries.',
				story: 'When the Moon passed through the Net, rain was expected—the net was said to catch rain clouds. Hunters launched expeditions when Bì was favorable. One legend tells of a divine hunter who cast this net across the sky to catch a rogue star.',
				celestialMeaning: 'The V-shaped Hyades cluster forms the net\'s body, with Aldebaran (not actually a cluster member) as the anchor point. Its orange color connected it to autumn leaves and the end of growth.',
				culturalSignificance: 'The Goat zodiac shares the mansion\'s communal nature—goats gather in flocks, hunters gather game. Goat-year people are gentle but effective, catching opportunities others miss. Border treaties were signed when Bì was prominent.'
			},
			majorStars: [
				{ name: 'Aldebaran', designation: 'α Tau', magnitude: 0.85, distance: '65 ly', spectralType: 'K5III' }
			]
		},
		{ name: 'Zī (觜)', meaning: 'Turtle Beak', abbreviation: 'Xiu20', stars: 3, brightest: 'λ Ori', ra: '5h 25m', dec: '+9°', onEquator: true, mythology: 'Smallest mansion; ceremonies and proper rituals' },
		{ name: 'Shēn (參)', meaning: 'Three Stars', abbreviation: 'Xiu21', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 32m', dec: '+0°', onEquator: true, mythology: 'Orion\'s Belt; generals and warriors, Horse zodiac',
			mythologyDetails: {
				figure: 'The Three Stars (Shēn) contains Orion\'s Belt and represents a great general leading celestial armies. Associated with the Horse (馬) zodiac, both embody martial spirit, speed, and nobility. This general eternally opposes the Heart (Antares).',
				story: 'Shēn and Shāng (Antares) were brothers who quarreled so violently that the Jade Emperor separated them at opposite ends of the sky. The phrase "Shēn and Shāng never meet" (參商不相見) describes people who can never be reconciled—when one rises, the other sets.',
				celestialMeaning: 'Orion\'s Belt was the general\'s sword-belt, with Rigel as his battle standard and Betelgeuse as his second-in-command. The mansion marks winter solstice and governed military campaigns.',
				culturalSignificance: 'The Horse zodiac shares the mansion\'s warrior nature—swift, brave, born for action. Generals consulted this mansion before battle. Horse-year people are said to have martial energy, unable to stay still.'
			},
			majorStars: [
				{ name: 'Rigel', designation: 'β Ori', magnitude: 0.13, distance: '860 ly', spectralType: 'B8Ia' },
				{ name: 'Alnilam', designation: 'ε Ori', magnitude: 1.69, distance: '2000 ly', spectralType: 'B0Ia' },
				{ name: 'Betelgeuse', designation: 'α Ori', magnitude: 0.42, distance: '700 ly', spectralType: 'M2Ib' }
			]
		},
		// VERMILION BIRD MANSIONS (朱雀七宿) - South, Summer, Fire, Snake zodiac years
		{ name: 'Jǐng (井)', meaning: 'Well', abbreviation: 'Xiu22', stars: 8, brightest: 'μ Gem', ra: '6h 23m', dec: '+22°', onEquator: true, mythology: 'Bird\'s beak/celestial well; largest mansion, water source, Snake zodiac',
			mythologyDetails: {
				figure: 'The Well (Jǐng) is the largest lunar mansion, representing a celestial water well that nourishes the Vermilion Bird. Associated with the Snake (蛇) zodiac, both connect to water despite the Bird\'s fire nature—the snake guards wells in Chinese folklore.',
				story: 'Every village had a well, and every well had a guardian spirit. The celestial well provided water to heaven itself. Snakes were often found near wells, believed to be the well-spirit\'s manifestation. To offend a snake was to risk poisoning the water.',
				celestialMeaning: 'Eight stars form a well-bucket shape. This mansion spans the most celestial real estate of any Xiù. Its prominence in early summer marked the rainy season.',
				culturalSignificance: 'The Snake zodiac shares the mansion\'s depth and hidden power—snakes guard treasures in wells and caves. Snake-year people are said to be deep thinkers, intuitive, and connected to hidden knowledge.'
			}
		},
		{ name: 'Guǐ (鬼)', meaning: 'Ghost', abbreviation: 'Xiu23', stars: 4, brightest: 'θ Cnc', ra: '8h 31m', dec: '+18°', onEquator: true, mythology: 'Ghost carriage; ancestors, death rites, underworld' },
		{ name: 'Liǔ (柳)', meaning: 'Willow', abbreviation: 'Xiu24', stars: 8, brightest: 'δ Hya', ra: '8h 38m', dec: '+6°', onEquator: true, mythology: 'Bird\'s beak; food, drink, weeping willows bringing rain' },
		{ name: 'Xīng (星)', meaning: 'Star', abbreviation: 'Xiu25', stars: 7, brightest: 'α Hya', brightestMag: 1.98, ra: '9h 28m', dec: '-8°', onEquator: true, mythology: 'The star of stars; clothing, textiles, appearance' },
		{ name: 'Zhāng (張)', meaning: 'Extended Net', abbreviation: 'Xiu26', stars: 6, brightest: 'υ Hya', ra: '9h 51m', dec: '-15°', onEquator: true, mythology: 'Bird\'s crop; banquets, hospitality, entertainment' },
		{ name: 'Yì (翼)', meaning: 'Wings', abbreviation: 'Xiu27', stars: 22, brightest: 'α Crt', ra: '10h 59m', dec: '-18°', onEquator: true, mythology: 'Largest wing span; music, theater, performances' },
		{ name: 'Zhěn (軫)', meaning: 'Chariot', abbreviation: 'Xiu28', stars: 4, brightest: 'γ Crv', ra: '12h 16m', dec: '-17°', onEquator: true, mythology: 'Bird\'s tail; travel, vehicles, safe journeys' }
	];

	// Hindu/Indian 27 Nakshatras - Lunar Mansions along the ecliptic
	// Each Nakshatra spans 13°20' of the ecliptic (360° ÷ 27) and has a ruling deity
	// Used for Vedic astrology, marriage compatibility, and timing of rituals
	const HINDU: Constellation[] = [
		{ name: 'Ashvini', meaning: 'Horse Woman', abbreviation: 'Nak1', stars: 2, brightest: 'β Ari', brightestMag: 2.64, ra: '1h 54m', dec: '+21°', onEcliptic: true, mythology: 'The Ashvini Kumaras, divine twin horsemen physicians of the gods',
			mythologyDetails: {
				figure: 'The Ashvini Kumaras are twin horsemen, born from Surya (the sun) and Sanjna (shadow). They are the physicians of the gods, eternally youthful and handsome. Their horses are golden, their chariot is the dawn itself.',
				story: 'When Sanjna, wife of Surya, could not bear his brilliance, she created a shadow-self and fled, transforming into a mare. Surya pursued as a stallion, and the twins were born from this union. They earned the gratitude of the gods by restoring youth to the sage Chyavana.',
				celestialMeaning: 'As the first nakshatra, Ashvini marks the beginning of the lunar zodiac at 0° Aries. The Moon\'s monthly journey begins here, racing like the divine horses. The two stars represent the twin physicians arriving at dawn.',
				culturalSignificance: 'Those born under Ashvini are swift, healer-minded, and beautiful. This nakshatra governs healing, beginnings, and speed. Ayurvedic treatments begun under Ashvini are considered especially potent.'
			}
		},
		{ name: 'Bharani', meaning: 'The Bearer', abbreviation: 'Nak2', stars: 3, brightest: '35 Ari', ra: '2h 44m', dec: '+19°', onEcliptic: true, mythology: 'Yama, god of death; the womb that carries souls between lives',
			mythologyDetails: {
				figure: 'Bharani is ruled by Yama, the god of death and dharma. The symbol is a yoni (womb)—not of birth into life, but of the cosmic womb that holds souls between incarnations. Yama is also Dharmaraja, the righteous judge.',
				story: 'Yama was the first mortal to die, becoming king of the dead by being first to walk the path. He judges souls with perfect justice, weighing their karma. Bharani represents the extreme transformation: death, but also the restraint needed before rebirth.',
				celestialMeaning: 'The three stars form a triangle suggesting the yoni. Located where the ecliptic crosses from Aries into Taurus, this nakshatra marks transitions—between signs, between lives, between states of being.',
				culturalSignificance: 'Considered inauspicious for beginnings but powerful for endings. Funeral rites timed under Bharani ensure safe passage. Those born here have strong transformative powers and face life\'s extremes.'
			}
		},
		{ name: 'Krittika', meaning: 'The Cutter', abbreviation: 'Nak3', stars: 6, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'The Pleiades; six foster mothers of Kartikeya, god of war',
			mythologyDetails: {
				figure: 'The Krittikas are the six stars of the Pleiades, wives of the seven sages (Saptarishi). When Agni (fire god) fell in love with them, only one—Svaha—reciprocated, transforming into each of her sisters to be with him. The child born was Kartikeya.',
				story: 'Kartikeya (also called Skanda or Murugan) was raised by the six Krittikas, giving him the name "Kartika." Born to destroy the demon Taraka, he became the commander of the gods\' armies. The seventh sister hid in shame, which is why we see only six Pleiades clearly.',
				celestialMeaning: 'Krittika spans from late Aries into Taurus, a "cutting" transition point. The Pleiades\' heliacal rising once marked the Hindu New Year. Agni (fire) rules this nakshatra, giving it purifying power.',
				culturalSignificance: 'The sacred fire ceremony (homa) is especially powerful under Krittika. Those born here are sharp-tongued, capable of cutting away illusion. The festival Kartik Purnima celebrates these stars.'
			},
			majorStars: [
				{ name: 'Alcyone', designation: 'η Tau', magnitude: 2.87, distance: '440 ly', spectralType: 'B7III' }
			]
		},
		{ name: 'Rohini', meaning: 'The Red One', abbreviation: 'Nak4', stars: 5, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 36m', dec: '+16°', onEcliptic: true, mythology: 'Brahma\'s daughter, Moon\'s favorite wife; the most beautiful nakshatra',
			mythologyDetails: {
				figure: 'Rohini was the most beautiful of the 27 daughters of Daksha, all married to Chandra (the Moon). Chandra loved Rohini above all others, neglecting his other wives. Her father cursed the Moon to wane—then relented, creating the lunar cycle.',
				story: 'Daksha gave all 27 of his daughters to the Moon in marriage (these became the 27 nakshatras). But Chandra spent all his time with Rohini, ignoring the rest. The other wives complained to their father, who cursed the Moon to waste away—then modified the curse so he would cyclically recover.',
				celestialMeaning: 'The red star Aldebaran (Rohini\'s eye) marks this nakshatra. The Moon exalts here at 3° Taurus—this is where the Moon is strongest and most fertile. The V-shaped Hyades form Rohini\'s face.',
				culturalSignificance: 'The most auspicious nakshatra for beauty, fertility, and material abundance. Marriages performed when the Moon is in Rohini are especially blessed. Those born here are sensuous and creative.'
			},
			majorStars: [
				{ name: 'Aldebaran', designation: 'α Tau', magnitude: 0.85, distance: '65 ly', spectralType: 'K5III' }
			]
		},
		{ name: 'Mrigashira', meaning: 'Deer\'s Head', abbreviation: 'Nak5', stars: 3, brightest: 'λ Ori', ra: '5h 25m', dec: '+9°', onEcliptic: true, mythology: 'Soma (moon god) searching; the eternal quest' },
		{ name: 'Ardra', meaning: 'The Moist One', abbreviation: 'Nak6', stars: 1, brightest: 'Betelgeuse', brightestMag: 0.42, ra: '5h 55m', dec: '+7°', onEcliptic: true, mythology: 'Rudra the storm god; destruction that renews',
			mythologyDetails: {
				figure: 'Ardra is ruled by Rudra, the howling storm god who later evolved into Shiva. Rudra represents the fierce, terrifying aspect of cosmic destruction—the necessary clearing that makes new creation possible. His tears are the monsoon.',
				story: 'When Brahma created the universe, one of his first creations was a howling child—Rudra, who cried so fiercely that Brahma gave him eight names and eight forms, each ruling different aspects of reality. The monsoon rains are Rudra\'s tears of fury.',
				celestialMeaning: 'The red supergiant Betelgeuse marks Ardra, a star of fierce power nearing the end of its life—representing destruction before renewal. The monsoon season in India begins when the Sun transits Ardra.',
				culturalSignificance: 'A challenging nakshatra associated with suffering, but also with the mental clarity that follows storms. Those born here experience intense struggles but emerge transformed. Shiva worship is powerful under Ardra.'
			},
			majorStars: [
				{ name: 'Betelgeuse', designation: 'α Ori', magnitude: 0.42, distance: '700 ly', spectralType: 'M2Ib' }
			]
		},
		{ name: 'Punarvasu', meaning: 'Return of Light', abbreviation: 'Nak7', stars: 5, brightest: 'Pollux', brightestMag: 1.14, ra: '7h 45m', dec: '+28°', onEcliptic: true, mythology: 'Aditi, mother of all gods; renewal and restoration',
			mythologyDetails: {
				figure: 'Aditi is the cosmic mother, boundless and infinite, who gave birth to the Adityas (solar deities). She represents the nurturing matrix from which all gods emerge. Her name means "unbound"—she is freedom itself.',
				story: 'Aditi gave birth to twelve Adityas, the solar deities who rule the twelve months. When her son Indra slew Vritra and released the waters, Aditi welcomed her children back—the returning light after darkness. Rama was born under Punarvasu.',
				celestialMeaning: 'Castor and Pollux, the heavenly twins, mark this nakshatra. "Punarvasu" means "return of the Vasu deities"—representing homecoming, second chances, and the return of what was lost. The Sun strengthens here after the storms of Ardra.',
				culturalSignificance: 'Lord Rama\'s birth nakshatra, making it especially sacred for Vaishnavas. Those born here are generous, forgiving, and capable of bouncing back from adversity. A good nakshatra for starting over.'
			},
			majorStars: [
				{ name: 'Pollux', designation: 'β Gem', magnitude: 1.14, distance: '34 ly', spectralType: 'K0III' },
				{ name: 'Castor', designation: 'α Gem', magnitude: 1.58, distance: '52 ly', spectralType: 'A1V' }
			]
		},
		{ name: 'Pushya', meaning: 'The Nourisher', abbreviation: 'Nak8', stars: 3, brightest: 'δ Cnc', ra: '8h 45m', dec: '+18°', onEcliptic: true, mythology: 'Brihaspati, guru of gods; the most auspicious nakshatra',
			mythologyDetails: {
				figure: 'Brihaspati is the teacher of the gods, master of sacred wisdom and proper ritual. He embodies the planet Jupiter\'s benefic nature—expansion, wisdom, and spiritual growth. His symbol is the udder of the cosmic cow.',
				story: 'Brihaspati guides the devas against the asuras, using his wisdom rather than weapons. Once, when he temporarily left heaven, the gods suffered defeat after defeat—only his return restored their fortunes. His counsel is worth more than armies.',
				celestialMeaning: 'Located in the heart of Cancer (the crab\'s shell), Pushya represents safety and nurturing. The Beehive Cluster (M44) lies here, representing the many souls nourished by cosmic wisdom. Jupiter exalts in this region.',
				culturalSignificance: 'Considered the most auspicious of all 27 nakshatras. Major purchases, marriages, and initiations are ideally timed when the Moon is in Pushya. Those born here are wise, helpful, and spiritually inclined.'
			}
		},
		{ name: 'Ashlesha', meaning: 'The Embracer', abbreviation: 'Nak9', stars: 6, brightest: 'ε Hya', ra: '9h 28m', dec: '+6°', onEcliptic: true, mythology: 'The Nagas, serpent deities; kundalini energy and hidden wisdom' },
		{ name: 'Magha', meaning: 'The Mighty', abbreviation: 'Nak10', stars: 5, brightest: 'Regulus', brightestMag: 1.35, ra: '10h 08m', dec: '+12°', onEcliptic: true, mythology: 'The Pitris (ancestors); royal power and ancestral blessings',
			mythologyDetails: {
				figure: 'Magha is ruled by the Pitris—the ancestral spirits who watch over their descendants. The symbol is a royal throne, representing inherited power and legitimacy. Regulus, the "heart of the lion," marks this nakshatra.',
				story: 'The Pitris were the first ancestors who discovered the path of the dead and established the rites that maintain the bond between living and deceased. They are honored every new moon (amavasya) with offerings. Their blessings carry through generations.',
				celestialMeaning: 'At 0° Leo, Magha begins the sign of royalty. Regulus, one of the four Royal Stars, represents the king\'s heart. The Sun is strong here, and those born under Magha often achieve positions of authority.',
				culturalSignificance: 'Ancestor worship ceremonies (shraddha) are especially powerful under Magha. Those born here feel a strong connection to their lineage and often carry forward family traditions. A nakshatra of kings and leaders.'
			},
			majorStars: [
				{ name: 'Regulus', designation: 'α Leo', magnitude: 1.35, distance: '77 ly', spectralType: 'B7V' }
			]
		},
		{ name: 'Purva Phalguni', meaning: 'Former Red One', abbreviation: 'Nak11', stars: 2, brightest: 'δ Leo', ra: '11h 14m', dec: '+20°', onEcliptic: true, mythology: 'Bhaga, god of fortune; pleasure and creative union' },
		{ name: 'Uttara Phalguni', meaning: 'Latter Red One', abbreviation: 'Nak12', stars: 2, brightest: 'Denebola', brightestMag: 2.14, ra: '11h 49m', dec: '+15°', onEcliptic: true, mythology: 'Aryaman, god of contracts; partnerships and commitments' },
		{ name: 'Hasta', meaning: 'The Hand', abbreviation: 'Nak13', stars: 5, brightest: 'δ Crv', ra: '12h 30m', dec: '-16°', onEcliptic: true, mythology: 'Savitar the sun god; skill, dexterity, and manifestation' },
		{ name: 'Chitra', meaning: 'The Bright One', abbreviation: 'Nak14', stars: 1, brightest: 'Spica', brightestMag: 1.04, ra: '13h 25m', dec: '-11°', onEcliptic: true, mythology: 'Vishvakarma, divine architect; creativity and craftsmanship',
			mythologyDetails: {
				figure: 'Vishvakarma is the divine architect who designed the gods\' palaces, weapons, and chariots. He created Indra\'s thunderbolt, Shiva\'s trident, and Vishnu\'s discus. His symbol is a single jewel—the perfect gem of creation.',
				story: 'When the gods needed weapons to defeat the demons, Vishvakarma forged them from pure light. He built Lanka for Kubera (which Ravana later stole), the city of Dwarka for Krishna, and the flying chariot Pushpaka. Every beautiful thing traces to his design.',
				celestialMeaning: 'The brilliant blue star Spica marks Chitra—a beacon of creative power. This nakshatra spans from late Virgo into Libra, the signs of craft and balance. The name "Chitra" means "picture" or "wonderful."',
				culturalSignificance: 'Vishvakarma Puja celebrates artisans and craftspeople under this nakshatra. Those born here are creative, beautiful, and skilled at making things. Architects, artists, and engineers often have Chitra prominent.'
			},
			majorStars: [
				{ name: 'Spica', designation: 'α Vir', magnitude: 1.04, distance: '250 ly', spectralType: 'B1V' }
			]
		},
		{ name: 'Swati', meaning: 'The Sword', abbreviation: 'Nak15', stars: 1, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 16m', dec: '+19°', onEcliptic: true, mythology: 'Vayu, god of wind; independence and movement' },
		{ name: 'Vishakha', meaning: 'Forked Branch', abbreviation: 'Nak16', stars: 4, brightest: 'α Lib', ra: '14h 51m', dec: '-16°', onEcliptic: true, mythology: 'Indra and Agni; purpose, determination, and triumph' },
		{ name: 'Anuradha', meaning: 'Following Radha', abbreviation: 'Nak17', stars: 4, brightest: 'δ Sco', ra: '16h 00m', dec: '-23°', onEcliptic: true, mythology: 'Mitra, god of friendship; devotion and cooperation' },
		{ name: 'Jyeshtha', meaning: 'The Eldest', abbreviation: 'Nak18', stars: 3, brightest: 'Antares', brightestMag: 1.06, ra: '16h 29m', dec: '-26°', onEcliptic: true, mythology: 'Indra, king of gods; seniority and protective power',
			mythologyDetails: {
				figure: 'Indra is the king of gods, wielder of the thunderbolt, slayer of Vritra. As the "eldest" of the atmospheric gods, he represents supreme authority and the responsibility that comes with power. His symbol is the earring of kingship.',
				story: 'Indra slew the serpent Vritra who had captured all the world\'s waters, releasing them to bring life. Though he sometimes fails morally, he always rises to protect the cosmic order. He sits upon his thousand-eyed throne in Amaravati.',
				celestialMeaning: 'The red heart of Scorpius, Antares, marks Jyeshtha. Its name means "rival of Mars"—two red warriors facing off. This is a gandanta point (karmic knot) between water signs, representing difficult transitions.',
				culturalSignificance: 'A challenging nakshatra for those born under it—they face the burdens of leadership and elder responsibility. However, they also receive Indra\'s protection. Best for activities requiring authority and protection.'
			},
			majorStars: [
				{ name: 'Antares', designation: 'α Sco', magnitude: 1.06, distance: '600 ly', spectralType: 'M1Ib' }
			]
		},
		{ name: 'Mula', meaning: 'The Root', abbreviation: 'Nak19', stars: 11, brightest: 'λ Sco', ra: '17h 33m', dec: '-37°', onEcliptic: true, mythology: 'Nirriti, goddess of dissolution; the root of existence' },
		{ name: 'Purva Ashadha', meaning: 'Former Victory', abbreviation: 'Nak20', stars: 2, brightest: 'δ Sgr', ra: '18h 21m', dec: '-30°', onEcliptic: true, mythology: 'Apas, water deity; invincibility and purification' },
		{ name: 'Uttara Ashadha', meaning: 'Latter Victory', abbreviation: 'Nak21', stars: 2, brightest: 'σ Sgr', ra: '18h 55m', dec: '-26°', onEcliptic: true, mythology: 'The Vishvadevas, ten universal gods; final victory' },
		{ name: 'Shravana', meaning: 'The Ear/Hearing', abbreviation: 'Nak22', stars: 3, brightest: 'Altair', brightestMag: 0.76, ra: '19h 51m', dec: '+9°', onEcliptic: true, mythology: 'Vishnu the preserver; learning through listening',
			mythologyDetails: {
				figure: 'Vishnu is the preserver of the universe, maintaining cosmic order between creation and destruction. He manifests as avatars (Rama, Krishna) when dharma declines. Shravana represents his quality of all-hearing—he listens to every prayer.',
				story: 'Vishnu reclines on the serpent Shesha in the cosmic ocean, dreaming the universe into being. Every sound in creation reaches his ears. The sage Vamana (Vishnu\'s dwarf avatar) took three steps to claim the universe—"Shravana" recalls these footsteps.',
				celestialMeaning: 'Three stars forming an eagle\'s wings mark Shravana—the stars of Altair. The nakshatra spans the middle of Capricorn, a sign of achievement. The Moon is strong here, receiving divine wisdom.',
				culturalSignificance: 'The sacred month of Shravana is when Vishnu is especially worshipped. Those born here are excellent listeners, learners, and teachers. The Vamana Jayanti festival celebrates this nakshatra. Good for all forms of education.'
			},
			majorStars: [
				{ name: 'Altair', designation: 'α Aql', magnitude: 0.76, distance: '17 ly', spectralType: 'A7V' }
			]
		},
		{ name: 'Dhanishtha', meaning: 'The Wealthiest', abbreviation: 'Nak23', stars: 4, brightest: 'β Del', ra: '20h 37m', dec: '+15°', onEcliptic: true, mythology: 'The Eight Vasus; fame, abundance, and musical talent' },
		{ name: 'Shatabhisha', meaning: 'Hundred Physicians', abbreviation: 'Nak24', stars: 1, brightest: 'γ Aqr', ra: '22h 22m', dec: '-1°', onEcliptic: true, mythology: 'Varuna, god of cosmic waters; healing and mystery',
			mythologyDetails: {
				figure: 'Varuna is the ancient god of the cosmic waters and moral order (rita). Unlike Indra\'s flashy storms, Varuna\'s power is mysterious and all-seeing—his thousand eyes are the stars watching for sin. He binds the guilty with his noose.',
				story: 'Varuna once caught the sage Bhrigu lying and bound him underwater. Only true confession released Bhrigu. Varuna\'s 100 physicians (the shatabhisha) heal not just the body but purify sins. He guards the cosmic order that underlies even the gods.',
				celestialMeaning: 'A single star (γ Aquarii) surrounded by a circle represents this nakshatra—like a doctor surrounded by medicines. Located in Aquarius, the water-bearer, it connects to Varuna\'s oceanic domain.',
				culturalSignificance: 'A mysterious, secretive nakshatra. Those born here are drawn to healing, occult knowledge, and hidden truths. Good for beginning treatments, especially for chronic or mysterious ailments.'
			}
		},
		{ name: 'Purva Bhadrapada', meaning: 'Former Lucky Feet', abbreviation: 'Nak25', stars: 2, brightest: 'α Peg', brightestMag: 2.49, ra: '23h 05m', dec: '+15°', onEcliptic: true, mythology: 'Aja Ekapada, one-footed serpent; intense transformation' },
		{ name: 'Uttara Bhadrapada', meaning: 'Latter Lucky Feet', abbreviation: 'Nak26', stars: 2, brightest: 'γ Peg', ra: '0h 13m', dec: '+15°', onEcliptic: true, mythology: 'Ahir Budhnya, serpent of the depths; wisdom and restraint' },
		{ name: 'Revati', meaning: 'The Wealthy', abbreviation: 'Nak27', stars: 32, brightest: 'ζ Psc', ra: '1h 14m', dec: '+7°', onEcliptic: true, mythology: 'Pushan, the nourisher; safe journeys and final liberation',
			mythologyDetails: {
				figure: 'Pushan is the god of paths and journeys, protector of travelers and livestock. He carries a golden goad and leads souls safely to the afterlife. As the final nakshatra, Revati represents the completion of the soul\'s journey.',
				story: 'Pushan once guided a dying man\'s soul safely past the dogs of Yama to the realm of the ancestors. He nourishes all beings on their paths, whether through the forest, through life, or through the afterlife. His toothless smile is gentle, not fierce.',
				celestialMeaning: 'The 27th and final nakshatra, Revati marks the end of the zodiac at 30° Pisces. Its 32 stars include the faint fish of Pisces. The next day, the cycle begins again with Ashvini.',
				culturalSignificance: 'The nakshatra of completion and moksha (liberation). Those born here often feel they are completing karmic cycles. Good for endings, final journeys, and spiritual practices aimed at liberation.'
			}
		}
	];

	// Japanese Traditional Star Patterns (和名の星座)
	// Japanese astronomy blends indigenous traditions, Chinese influence, and unique cultural interpretations
	const JAPANESE: Constellation[] = [
		{ name: 'Subaru (昴)', meaning: 'The Pleiades/Unity', abbreviation: 'JP1', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Unity and togetherness; gave name to the car company',
			mythologyDetails: {
				figure: 'Subaru means "to gather together" or "unite." The cluster represents togetherness, harmony, and the strength found in unity. The name predates the famous car company, which adopted it (with a six-star logo) to represent the merger of five companies.',
				story: 'In the Kojiki (Japan\'s oldest chronicle), the Pleiades were called Mutsuraboshi ("Six Stars"). Farmers watched for their pre-dawn rising in late autumn to time the rice harvest. The Sei Shōnagon, in her Pillow Book, listed them among the most elegant things.',
				celestialMeaning: 'Subaru\'s heliacal rising (early November) marked the harvest festival season and the start of preparations for winter. In Japanese culture, being able to see all seven stars clearly was a sign of good eyesight and fortune.',
				culturalSignificance: 'The Subaru car logo shows six stars (representing the merger of five companies with Fuji Heavy Industries). In poetry, Subaru represents the beauty of unity—small things becoming magnificent together.'
			}
		},
		{ name: 'Mitsu Boshi (三つ星)', meaning: 'Three Stars', abbreviation: 'JP2', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Orion\'s Belt; marks the turning of seasons' },
		{ name: 'Tsuzumi Boshi (鼓星)', meaning: 'Drum Stars', abbreviation: 'JP3', stars: 4, brightest: 'Betelgeuse', brightestMag: 0.42, ra: '5h 30m', dec: '+0°', onEcliptic: false, mythology: 'Orion as a tsuzumi hand drum; connected to Noh theater',
			mythologyDetails: {
				figure: 'Japanese observers saw Orion\'s distinctive shape not as a hunter but as a tsuzumi—the hourglass-shaped hand drum used in Noh and Kabuki theater. Betelgeuse and Rigel form the drumheads, with the Belt as the grip.',
				story: 'The tsuzumi drum produces the distinctive "pon" sound in traditional theater. Seeing the constellation rising in winter reminded audiences of upcoming Kabuki performances. The drum shape also appears in traditional New Year decorations.',
				celestialMeaning: 'Unlike the Western hunter myth, the Japanese drum interpretation celebrates the arts and the approach of the New Year theater season. The constellation\'s winter prominence aligned with indoor entertainment.',
				culturalSignificance: 'This renaming shows how Japanese astronomy adapted imported Chinese knowledge with indigenous perspectives. The drum shape is now used in logos for traditional arts organizations.'
			}
		},
		{ name: 'Hokuto Shichisei (北斗七星)', meaning: 'Northern Dipper Seven Stars', abbreviation: 'JP4', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Big Dipper; governs death in Buddhist cosmology',
			mythologyDetails: {
				figure: 'The Northern Dipper governs death and the end of life, while its southern counterpart governs birth. In Japanese Buddhist tradition, Myōken Bosatsu (the Pole Star deity) rides the Dipper across the sky, judging the dead.',
				story: 'In the anime "Fist of the North Star" (Hokuto no Ken), the deadly martial art is named after this constellation—those who see the Dipper fall die. The seven stars were also associated with the seven days of the week in Japan after Western contact.',
				celestialMeaning: 'The Dipper\'s eternal circling around Polaris represented the cycle of death and rebirth. Its position indicated the four seasons and was used to tell time at night. Temples dedicated to Myōken face north toward the Dipper.',
				culturalSignificance: 'Samurai families used Dipper imagery in their crests (kamon). The "Hokuto" brand name appears in products from beer to video games. Buddhist temples still perform Myōken rituals for the dying.'
			}
		},
		{ name: 'Nankin Boshi (南斤星)', meaning: 'Southern Dipper Six Stars', abbreviation: 'JP5', stars: 6, brightest: 'φ Sgr', ra: '18h 46m', dec: '-27°', onEcliptic: false, mythology: 'Counterpart to Northern Dipper; governs life and birth' },
		{ name: 'Amanogawa (天の川)', meaning: 'River of Heaven', abbreviation: 'JP6', stars: '∞', brightest: 'Milky Way', ra: 'Various', dec: 'Various', onEcliptic: false, mythology: 'The Milky Way; separates the celestial lovers',
			mythologyDetails: {
				figure: 'Amanogawa (Heavenly River) is the Milky Way, a celestial stream that separates the Weaving Princess (Vega) from her lover the Cowherd (Altair). The river was created by the gods to keep the distracted lovers apart.',
				story: 'Orihime, daughter of the Sky King, wove beautiful clouds by the river. She fell in love with Hikoboshi, a cowherd across the river. They married but became so lost in love they neglected their work. The angry King separated them with the river, allowing them to meet only on the 7th night of the 7th month.',
				celestialMeaning: 'The Milky Way\'s misty band was imagined as a river flowing through heaven. In summer, when it arches overhead, Vega and Altair are visible on opposite banks—the lovers gazing at each other across the water.',
				culturalSignificance: 'Tanabata (July 7) celebrates the annual reunion. People write wishes on colorful paper strips (tanzaku) and hang them on bamboo branches. If it rains on Tanabata, the lovers cannot meet—their tears become the raindrops.'
			}
		},
		{ name: 'Orihime (織姫)', meaning: 'Weaving Princess', abbreviation: 'JP7', stars: 1, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Vega; the celestial princess who weaves clouds and silk',
			mythologyDetails: {
				figure: 'Orihime is the daughter of Tentei (the Sky Emperor), a skilled weaver who created the gods\' robes and the colorful clouds of dawn and dusk. She represents dedication to craft, beauty, and the arts.',
				story: 'Orihime wove so diligently she had no time for love. Her father, pitying her loneliness, arranged her marriage to Hikoboshi. But their love was so consuming they stopped working—no clouds in the sky, no cattle tended. In fury, Tentei cast the lovers apart.',
				celestialMeaning: 'Vega is one of the three brightest stars in the Northern Hemisphere and the brightest of the Summer Triangle. Its blue-white brilliance represents the shimmering silk woven by the princess.',
				culturalSignificance: 'Young women pray to Orihime for skill in arts like weaving, sewing, and calligraphy. Tanabata celebrations feature displays of crafts made by women. The star\'s name also appears in traditional kimono patterns.'
			},
			majorStars: [
				{ name: 'Vega', designation: 'α Lyr', magnitude: 0.03, distance: '25 ly', spectralType: 'A0V' }
			]
		},
		{ name: 'Hikoboshi (彦星)', meaning: 'Cowherd Star', abbreviation: 'JP8', stars: 1, brightest: 'Altair', brightestMag: 0.76, ra: '19h 51m', dec: '+9°', onEcliptic: false, mythology: 'Altair; the mortal cowherd who won a goddess\'s love',
			mythologyDetails: {
				figure: 'Hikoboshi was a humble cowherd who worked on the far side of the Heavenly River. His diligence caught the attention of the Sky Emperor, who offered him Orihime\'s hand. He represents devoted love and honest labor.',
				story: 'Unlike the Chinese version where the cowherd is mortal, in some Japanese tellings Hikoboshi is also divine—a god of cattle and agriculture. His two flanking stars (β and γ Aquilae) are his children, carried on his shoulders as he crosses the river.',
				celestialMeaning: 'Altair, with its two companion stars, forms a distinctive line across the Milky Way from Vega. The three stars together look like a man carrying children—Hikoboshi rushing to meet his wife.',
				culturalSignificance: 'Men pray to Hikoboshi for success in work and dedicated love. The constellation appears in countless Tanabata poems, songs, and artworks. The star\'s name means "prince star" or "boy star."'
			},
			majorStars: [
				{ name: 'Altair', designation: 'α Aql', magnitude: 0.76, distance: '17 ly', spectralType: 'A7V' }
			]
		},
		{ name: 'Kasasagi (鵲)', meaning: 'Magpie Bridge', abbreviation: 'JP9', stars: 6, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'Cygnus; magpies form a bridge for the Tanabata lovers',
			mythologyDetails: {
				figure: 'The Magpie Bridge (Kasasagi no Hashi) is formed by countless magpies spreading their wings across the Heavenly River on Tanabata night, creating a bridge for Orihime and Hikoboshi to meet.',
				story: 'Moved by the lovers\' tears, a flock of magpies volunteered to help them meet. Each year on the 7th night of the 7th month, all the magpies in the world fly up to form a living bridge across the Milky Way. This is why magpies are rarely seen on Tanabata—they are all in heaven.',
				celestialMeaning: 'The Northern Cross (Cygnus), with its shape of spread wings and Deneb at its tail, represents the magpie bridge stretching across the Milky Way between Vega and Altair.',
				culturalSignificance: 'The phrase "magpie bridge" (kasasagi no hashi) is used in poetry to describe things that connect separated lovers. Magpies in Japan are considered good omens because of their role in the Tanabata legend.'
			},
			majorStars: [
				{ name: 'Deneb', designation: 'α Cyg', magnitude: 1.25, distance: '2600 ly', spectralType: 'A2Ia' }
			]
		},
		{ name: 'Kengyū (牽牛)', meaning: 'Ox-Puller', abbreviation: 'JP10', stars: 3, brightest: 'Altair', ra: '19h 51m', dec: '+9°', onEcliptic: false, mythology: 'Alternative name for Hikoboshi; emphasizes his work with cattle' },
		{ name: 'Nanto Rokusē (南斗六星)', meaning: 'Six Southern Stars', abbreviation: 'JP11', stars: 6, brightest: 'ε Sgr', ra: '18h 24m', dec: '-34°', onEcliptic: false, mythology: 'The Southern Dipper; governs birth and life span',
			mythologyDetails: {
				figure: 'The Southern Dipper (in Sagittarius) is the counterpart to the Northern Dipper. While the Northern Dipper controls death, the Southern Dipper records birth and determines lifespan. Together they govern human destiny.',
				story: 'In Chinese-influenced Japanese belief, one\'s fate is written in both Dippers. Prayers to the Southern Dipper on one\'s birthday can extend life. An old tale tells of a man who bribed the spirits of both Dippers to add decades to his destined lifespan.',
				celestialMeaning: 'The six stars form a smaller, inverted dipper-shape compared to the Big Dipper. Located near the center of the Milky Way, it appears to be dipping into the celestial river—the source of life.',
				culturalSignificance: 'Japanese esoteric Buddhism incorporated Dipper worship from China. Birthday celebrations traditionally included prayers to the Southern Dipper. The constellation appears in manga and anime as a symbol of fate.'
			}
		},
		{ name: 'Akeboshi (明けの明星)', meaning: 'Morning Star', abbreviation: 'JP12', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Venus at dawn; the herald of new beginnings' }
	];

	// Polynesian Wayfinding Stars - One of humanity's most sophisticated navigation systems
	// Hawaiian names shown; other Polynesian cultures (Tahitian, Māori, Samoan, etc.) have their own names
	// The star compass divides the horizon into "houses" where stars rise and set
	const POLYNESIAN: Constellation[] = [
		// THE STAR COMPASS (Kaulana Mahina) - Conceptual framework
		{ name: 'Kaulana Mahina', meaning: 'Star Compass', abbreviation: 'PN0', stars: 220, brightest: 'Multiple', ra: 'All sky', dec: 'All sky', onEcliptic: false, mythology: 'The complete wayfinding system using star rising/setting positions',
			mythologyDetails: {
				figure: 'The Hawaiian Star Compass divides the horizon into 32 "houses" where stars rise and set. Each house corresponds to a specific direction, and master navigators (pwo) memorize which stars rise in each house throughout the year.',
				story: 'For over 3,000 years, Polynesian wayfinders crossed the largest ocean on Earth without instruments—only stars, waves, birds, and clouds. When Western contact nearly destroyed this knowledge, master navigator Mau Piailug of Satawal shared it with Hawaiians, sparking a revival that continues today aboard the voyaging canoe Hōkūleʻa.',
				celestialMeaning: 'Stars are grouped into four "star lines" that cross the sky: Ke Kā o Makaliʻi (the canoe bailer), Kaiwikuamoʻo (the backbone), and two others. By knowing which stars are rising, setting, and overhead, a navigator can maintain course across thousands of miles of open ocean.',
				culturalSignificance: 'The Polynesian Voyaging Society has sailed Hōkūleʻa over 150,000 nautical miles using traditional navigation. This knowledge proves that "primitive" peoples had sophisticated science—the stars were their GPS, their clock, and their calendar.'
			}
		},
		// FIXED REFERENCE POINTS
		{ name: 'Hōkūpaʻa', meaning: 'Fixed Star', abbreviation: 'PN1', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'The immovable star around which the entire sky rotates',
			mythologyDetails: {
				figure: 'Hōkūpaʻa (Polaris) is the fixed star that never moves, around which the entire northern sky rotates. For navigators sailing north of the equator, it provides a constant reference point. Its height above the horizon tells the navigator their latitude.',
				story: 'When Hōkūleʻa sailed from Hawaiʻi to Tahiti in 1976, navigator Mau Piailug used Hōkūpaʻa to check his northerly position. As the canoe sailed south, Hōkūpaʻa sank lower toward the horizon—when it disappeared, they were near the equator. The star\'s reappearance on the return voyage meant they were approaching home.',
				celestialMeaning: 'Hōkūpaʻa sits almost exactly at the North Celestial Pole. Its altitude above the horizon equals the observer\'s latitude—at Hawaiʻi (20°N), it sits 20° above the northern horizon. At the equator, it sits on the horizon itself.',
				culturalSignificance: 'The name "Hōkūpaʻa" means "star that does not move" or "fixed star." It represents constancy, leadership, and the guiding principle that keeps voyagers on course. In Hawaiian culture, it symbolizes steadfast purpose.'
			},
			majorStars: [
				{ name: 'Polaris', designation: 'α UMi', magnitude: 1.98, distance: '433 ly', spectralType: 'F7Ib' }
			]
		},
		{ name: 'Hānaiakamalama', meaning: 'Cared for by the Moon', abbreviation: 'PN2', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-63°', onEcliptic: false, mythology: 'The Southern Cross—gateway to the southern sky',
			mythologyDetails: {
				figure: 'Hānaiakamalama (the Southern Cross, or Crux) is one of the most important navigation markers in the southern hemisphere. Its long axis points almost directly to the South Celestial Pole, which has no bright star to mark it.',
				story: 'The name means "cared for by the Moon"—the Moon passes near this constellation, seeming to nurture it. Polynesian navigators sailing south of the equator used the Cross to find south, extending its long axis 4.5 times to locate the invisible south pole.',
				celestialMeaning: 'From Hawaiʻi, the Southern Cross just barely rises above the southern horizon in autumn. As voyagers sail south toward Tahiti (17°S), it rises higher. When it crosses the meridian at maximum height, the navigator can calculate their latitude.',
				culturalSignificance: 'The Southern Cross appears on the flags of Australia, New Zealand, Samoa, and Papua New Guinea—testament to its navigational importance across the Pacific. For Māori, it is Te Punga (the Anchor), holding the Milky Way canoe in place.'
			},
			majorStars: [
				{ name: 'Acrux', designation: 'α Cru', magnitude: 0.76, distance: '320 ly', spectralType: 'B0.5IV' },
				{ name: 'Mimosa', designation: 'β Cru', magnitude: 1.25, distance: '280 ly', spectralType: 'B0.5III' }
			]
		},
		// ZENITH STARS - Used to determine latitude by when they pass directly overhead
		{ name: 'Hōkūleʻa', meaning: 'Star of Gladness', abbreviation: 'PN3', stars: 1, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 16m', dec: '+19°', onEcliptic: false, mythology: 'The zenith star of Hawaiʻi—passes directly overhead at Hawaiian latitude',
			mythologyDetails: {
				figure: 'Hōkūleʻa (Arcturus) is the "Star of Gladness"—when ancient voyagers saw it pass directly overhead, they knew they had reached the latitude of Hawaiʻi. The famous voyaging canoe was named after this star.',
				story: 'After weeks at sea sailing north from Tahiti, Polynesian voyagers would watch for the moment Hōkūleʻa passed through the zenith (directly overhead). When it did, they knew to turn east or west to find the Hawaiian Islands. This "latitude hook" technique allowed precise navigation without instruments.',
				celestialMeaning: 'A star passes through your zenith when your latitude equals its declination. Arcturus has a declination of +19°—almost exactly the latitude of Hawaiʻi. When Arcturus passes overhead, you are at Hawaiian latitude.',
				culturalSignificance: 'The voyaging canoe Hōkūleʻa was built in 1975 and has since sailed over 150,000 nautical miles, visiting every Polynesian island group and circumnavigating the globe. It represents the revival of traditional Hawaiian culture and navigation.'
			},
			majorStars: [
				{ name: 'Arcturus', designation: 'α Boo', magnitude: -0.05, distance: '37 ly', spectralType: 'K1.5III' }
			]
		},
		{ name: 'ʻAʻa', meaning: 'Sirius/Burning Brightly', abbreviation: 'PN4', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'The brightest star in the sky; zenith star for Tahiti',
			mythologyDetails: {
				figure: 'ʻAʻa (Sirius), the brightest star in the night sky, passes through the zenith at the latitude of Tahiti (17°S). For navigators sailing between Hawaiʻi and Tahiti, this star marked the destination\'s latitude.',
				story: 'The name ʻAʻa means "burning" or "glowing" in Hawaiian, referring to Sirius\'s brilliant blue-white light. In Tahitian tradition, it is called Taurua-nui-o-mere ("Great festivity of parental yearning"). Its rising with the sun marked the beginning of the new year.',
				celestialMeaning: 'Sirius rises in the southeast (from Hawaiʻi) and is so bright it can be seen even in twilight. Its position near the celestial equator means it rises almost due east and sets almost due west—excellent for maintaining an east-west course.',
				culturalSignificance: 'Sirius\'s heliacal rising (first appearance before dawn after being hidden in the sun\'s glare) was observed throughout Polynesia. In Hawaiʻi, it marked seasonal transitions. The star\'s brilliance made it visible even on partially cloudy nights.'
			},
			majorStars: [
				{ name: 'Sirius', designation: 'α CMa', magnitude: -1.46, distance: '8.6 ly', spectralType: 'A1V' }
			]
		},
		// STAR LINES - Groups of stars that rise/set together marking directions
		{ name: 'Ke Kā o Makaliʻi', meaning: 'Canoe-Bailer of the Pleiades', abbreviation: 'PN5', stars: 8, brightest: 'Sirius', ra: 'Various', dec: 'Various', onEcliptic: false, mythology: 'A star line arcing from Sirius through Orion to the Pleiades',
			mythologyDetails: {
				figure: 'Ke Kā o Makaliʻi is a "star line"—a group of bright stars that rise in sequence, creating an arc across the sky. It includes Sirius, Procyon, Castor, Pollux, Capella, and the Pleiades. The arc forms the shape of a canoe bailer (bilge scoop).',
				story: 'In Hawaiian mythology, Makaliʻi was a navigator who captained one of the canoes that brought the first settlers to Hawaiʻi. His canoe bailer—the arc of stars—spilled food into the ocean, which is why the sea has so many fish. The Pleiades cluster sits at the handle.',
				celestialMeaning: 'This star line is visible in winter months. The stars rise in sequence from the southeast: first Sirius, then Procyon, the Twins, and finally Capella and the Pleiades to the northeast. Following this arc gives bearings across half the horizon.',
				culturalSignificance: 'Star lines were essential teaching tools. A master navigator would point out the complete line to students, who would memorize not just individual stars but their relationships—which stars rise together, which follow which.'
			}
		},
		{ name: 'Kaiwikuamoʻo', meaning: 'The Backbone of the Sky', abbreviation: 'PN6', stars: 15, brightest: 'Polaris', ra: 'Various', dec: 'Various', onEcliptic: false, mythology: 'The meridian line from Polaris through the zenith to the Southern Cross',
			mythologyDetails: {
				figure: 'Kaiwikuamoʻo (the Backbone) is not a constellation but a conceptual line running from Polaris in the north, through the zenith (overhead point), down to the Southern Cross in the south. It marks the celestial meridian—true north-south.',
				story: 'The backbone represents the spine of the sky, the axis around which all stars appear to rotate. When a star crosses this invisible line, it reaches its highest point in the sky (for northern stars) or is exactly north or south of the navigator.',
				celestialMeaning: 'The meridian is crucial for navigation. When a known star crosses the meridian, its altitude tells the navigator their latitude with precision. The backbone also divides the sky into rising stars (east) and setting stars (west).',
				culturalSignificance: 'The concept of the sky having a "backbone" connects celestial and human anatomy—the navigator\'s body mirrors the sky\'s body. This embodied knowledge was easier to remember than abstract coordinates.'
			}
		},
		// HORIZON STARS - Stars that rise/set at specific compass points
		{ name: 'Keoe', meaning: 'Vega', abbreviation: 'PN7', stars: 1, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Rises in the house of Lā Koʻolau—the northeast direction',
			mythologyDetails: {
				figure: 'Keoe (Vega) is a brilliant blue-white star that rises in the northeast "house" called Lā Koʻolau on the Hawaiian star compass. It is the brightest star in the northern summer sky and part of the Summer Triangle.',
				story: 'The star compass assigns each rising and setting position to a "house." Keoe rises in the house Lā Koʻolau (about 20° north of east from Hawaiʻi). A navigator steering toward where Keoe rises would sail northeast.',
				celestialMeaning: 'Vega\'s declination of +39° means it rises quite far north of east from Hawaiian latitudes. Combined with Altair and Deneb, it forms the Summer Triangle—three bright stars that dominate summer nights.',
				culturalSignificance: 'Stars rising in the "Koʻolau" (windward) houses on the compass indicate sailing toward the trade winds—the northeast direction. This linguistic connection between wind and stars shows how Polynesian navigation integrated multiple environmental cues.'
			}
		},
		{ name: 'Humu', meaning: 'Triggerfish', abbreviation: 'PN8', stars: 1, brightest: 'Altair', brightestMag: 0.76, ra: '19h 51m', dec: '+9°', onEcliptic: false, mythology: 'Rises almost due east—near the equatorial house',
			mythologyDetails: {
				figure: 'Humu (Altair) is named after the humuhumunukunukuāpuaʻa (reef triggerfish), Hawaiʻi\'s state fish. The star rises almost due east and sets almost due west, making it excellent for holding an east-west course.',
				story: 'Stars near the celestial equator (declination 0°) rise due east and set due west, regardless of the observer\'s latitude. Altair, at +9° declination, rises only slightly north of east—close enough for practical east-west steering.',
				celestialMeaning: 'Altair forms the Summer Triangle with Vega and Deneb. Its near-equatorial position means it spends equal time above and below the horizon. From anywhere in the Pacific, Humu provides an east-west reference.',
				culturalSignificance: 'The triggerfish name connects the star to the sea—navigators lived between sky and ocean, and their star names often referenced marine life, waves, and currents.'
			}
		},
		{ name: 'Makaliʻi', meaning: 'Little Eyes', abbreviation: 'PN9', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'The Pleiades—signal of the Hawaiian New Year and navigation cluster',
			mythologyDetails: {
				figure: 'Makaliʻi (the Pleiades) means "Little Eyes" in Hawaiian. This compact cluster of stars was one of the most important celestial markers across all of Polynesia. It signaled the start of the Makahiki festival season.',
				story: 'When Makaliʻi rose in the eastern sky at sunset (November), it marked the beginning of Makahiki—a four-month period of peace, harvest festivals, and games dedicated to the god Lono. Warfare was forbidden, and chiefs traveled to collect tribute.',
				celestialMeaning: 'The Pleiades\' heliacal rising (first visible before dawn after being hidden) occurs in different months depending on latitude, providing a calendar marker. From Hawaiʻi, the cluster is visible most of the night in winter.',
				culturalSignificance: 'Makaliʻi appears on the Hawaiian star compass and was used for navigation, calendar-keeping, and religious ceremonies across Polynesia. The navigator Makaliʻi, for whom the cluster may be named, is said to have captained the first voyaging canoe to Hawaiʻi.'
			}
		},
		{ name: 'Nā Hiku', meaning: 'The Seven', abbreviation: 'PN10', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'The Big Dipper—circumpolar navigation reference from northern Pacific',
			mythologyDetails: {
				figure: 'Nā Hiku (the Seven) is the Big Dipper, visible year-round from Hawaiian latitudes because it never sets below the horizon. Its rotation around Polaris creates a celestial clock that tells the time of night.',
				story: 'While the Big Dipper carries different stories in different cultures, its practical use in Hawaiʻi was primarily navigational. The "pointer stars" (Dubhe and Merak) aim toward Polaris. The handle\'s curve points to Arcturus (Hōkūleʻa).',
				celestialMeaning: 'The Big Dipper rotates around Polaris every 24 hours. By noting its position, a navigator could estimate the time of night. This was crucial for knowing when to expect certain stars to rise or set.',
				culturalSignificance: 'The number seven has significance across Polynesian cultures—seven main island groups, seven major stars in this pattern. The regularity of the Dipper\'s motion represented cosmic order.'
			}
		},
		{ name: 'Holokaʻimoku', meaning: 'Star of Ocean Voyaging', abbreviation: 'PN11', stars: 1, brightest: 'Canopus', brightestMag: -0.74, ra: '6h 24m', dec: '-53°', onEcliptic: false, mythology: 'Second brightest star—essential for southern voyaging',
			mythologyDetails: {
				figure: 'Holokaʻimoku (Canopus), the second brightest star in the sky, is crucial for navigation in the southern hemisphere. Its name literally means "star for voyaging on the ocean"—a testament to its practical importance.',
				story: 'From Hawaiʻi, Canopus barely rises above the southern horizon in winter. But for voyagers sailing to Tahiti or beyond, it rises higher and higher as they travel south. Its altitude tells them how far south they have come.',
				celestialMeaning: 'Canopus has a declination of -53°, meaning it passes directly overhead at 53° south latitude (far south of Polynesia). But its brightness makes it visible even when low on the horizon, and its changing altitude is a latitude indicator.',
				culturalSignificance: 'The emphasis on ocean voyaging in the name reflects how stars were named for their practical function. This star means "go to sea"—seeing it rise higher meant the voyage south was succeeding.'
			},
			majorStars: [
				{ name: 'Canopus', designation: 'α Car', magnitude: -0.74, distance: '310 ly', spectralType: 'A9II' }
			]
		},
		{ name: 'Newe', meaning: 'The Pointers', abbreviation: 'PN12', stars: 2, brightest: 'α Cen', brightestMag: -0.27, ra: '14h 40m', dec: '-61°', onEcliptic: false, mythology: 'Alpha and Beta Centauri—point to the Southern Cross',
			mythologyDetails: {
				figure: 'Newe (the Pointers) are Alpha and Beta Centauri, two bright stars that point directly toward the Southern Cross. Alpha Centauri is the closest star system to our Sun, only 4.37 light-years away.',
				story: 'When the Southern Cross is low or obscured, the Pointers help locate it. Following a line from Alpha through Beta Centauri leads directly to the Cross. This redundancy was essential—clouds could hide one marker but not usually all.',
				celestialMeaning: 'The Pointers circle the south celestial pole like the Big Dipper circles the north pole. From the latitude of Tahiti, they are circumpolar (never set). From Hawaiʻi, they barely rise above the southern horizon.',
				culturalSignificance: 'Alpha Centauri contains the closest star to our solar system (Proxima Centauri). Polynesians did not know this, but they recognized the practical relationship between these stars and the Cross for navigation.'
			},
			majorStars: [
				{ name: 'Rigil Kentaurus', designation: 'α Cen', magnitude: -0.27, distance: '4.4 ly', spectralType: 'G2V' },
				{ name: 'Hadar', designation: 'β Cen', magnitude: 0.61, distance: '390 ly', spectralType: 'B1III' }
			]
		},
		// NAVIGATION CONCEPTS
		{ name: 'Kona Rising House', meaning: 'Leeward Direction', abbreviation: 'PN13', stars: 3, brightest: 'Antares', brightestMag: 1.06, ra: '16h 29m', dec: '-26°', onEcliptic: false, mythology: 'Stars that rise in the Kona (leeward/southwest) houses',
			mythologyDetails: {
				figure: 'The "Kona" houses on the star compass mark the leeward (sheltered) direction—southwest from Hawaiʻi. Stars rising in this direction include Antares, Spica, and other stars of the southern sky.',
				story: 'Kona means "leeward" in Hawaiian—the side of an island sheltered from the trade winds. Sailing toward where Kona stars rise meant sailing toward the leeward direction. The red star Antares (called Lehua in Hawaiian, after the red ʻōhiʻa flower) rises in a Kona house.',
				celestialMeaning: 'Stars with southern declinations rise in the southeastern sky and set in the southwestern sky from Hawaiʻi. The exact rising position tells the navigator which "house" on the compass the star occupies.',
				culturalSignificance: 'The integration of wind directions (Kona/Koʻolau, or leeward/windward) with star positions shows the holistic nature of Polynesian navigation—a single system combining astronomy, meteorology, and oceanography.'
			}
		},
		{ name: 'Puana', meaning: 'Blossom', abbreviation: 'PN14', stars: 1, brightest: 'Procyon', brightestMag: 0.34, ra: '7h 39m', dec: '+5°', onEcliptic: false, mythology: 'An equatorial star that rises almost due east',
			mythologyDetails: {
				figure: 'Puana (Procyon) is one of the bright stars near the celestial equator. Its declination of +5° means it rises only slightly north of due east. The name "Puana" means blossom or flower.',
				story: 'Procyon forms part of the "Winter Triangle" with Sirius and Betelgeuse. Its near-equatorial position made it valuable for maintaining an east-west course. Polynesian navigators needed multiple equatorial stars because clouds might obscure any single one.',
				celestialMeaning: 'Procyon rises about 5° north of east, close enough to true east for practical navigation. Stars near the celestial equator spend half their time above the horizon—rising for 12 hours and setting for 12 hours.',
				culturalSignificance: 'The floral name suggests the star\'s beauty as it rises. Polynesian star names often mix practical navigation function with poetic imagery—the stars were both tools and sacred beings.'
			}
		},
		{ name: 'Kalupeakawelo', meaning: 'Kite of Kawelo', abbreviation: 'PN15', stars: 6, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'The Northern Cross (Cygnus) resembles a kite flown by the chief Kawelo',
			mythologyDetails: {
				figure: 'Kalupeakawelo (the Northern Cross or Cygnus) is seen as a kite flown by the legendary chief Kawelo. The long axis of the Cross represents the kite, with Deneb at the tail end.',
				story: 'Kawelo was a chief from Kauaʻi known for his strength and kite-flying skill. In competitions, his kite would soar highest of all. When he died, his kite remained in the sky as the constellation we see today. The kite flies highest in summer and autumn.',
				celestialMeaning: 'The Northern Cross is visible in the northern sky during Hawaiian summer and fall. Deneb, at the "tail" of the kite (or the top of the cross), is the brightest star and part of the Summer Triangle.',
				culturalSignificance: 'Kite-flying (lupe) was a respected sport in ancient Hawaiʻi, associated with chiefs and sacred rituals. By naming a constellation after a kite, the stars were connected to earthly activities and legendary heroes.'
			}
		},
		{ name: 'Māui\'s Fishhook', meaning: 'Scorpius Constellation', abbreviation: 'PN16', stars: 15, brightest: 'Antares', brightestMag: 1.06, ra: '16h 30m', dec: '-26°', onEcliptic: true, mythology: 'The fishhook demigod Māui used to pull islands from the sea',
			mythologyDetails: {
				figure: 'The constellation Scorpius is known across Polynesia as the Fishhook of Māui (Manaiakalani in Hawaiian). The curved tail of the scorpion forms the hook, with Antares as the barb or the rope attachment.',
				story: 'The demigod Māui, trickster and hero, once went fishing with his brothers. Using a magical fishhook made from his grandmother\'s jawbone, he hooked something enormous—the sea floor. Pulling with all his strength, he raised the Hawaiian Islands from the ocean depths. When he placed the hook in the sky, it became this constellation.',
				celestialMeaning: 'Scorpius is a zodiacal constellation that rises in the southeast and crosses the southern sky. Its distinctive J-shape is visible from all Polynesian islands. The hook appears to "fish" along the horizon.',
				culturalSignificance: 'The Māui myth appears throughout Polynesia—in New Zealand, Māui fished up the North Island (Te Ika-a-Māui, "The Fish of Māui"). The fishhook symbol is one of the most important in Polynesian culture, representing strength, prosperity, and good luck.'
			}
		},
		{ name: 'Hokulei', meaning: 'Star Wreath/Lei', abbreviation: 'PN17', stars: 1, brightest: 'Capella', brightestMag: 0.08, ra: '5h 17m', dec: '+46°', onEcliptic: false, mythology: 'A northern star that rises in the ʻĀkau (north) houses',
			mythologyDetails: {
				figure: 'Hokulei (Capella) means "Star Lei" or "Star Wreath." A lei (flower garland) is a symbol of welcome, love, and honor in Hawaiian culture. This bright yellow star adorns the northern sky.',
				story: 'Capella is one of the brightest northern stars visible from Hawaiʻi. It rises in the north-northeast, helping navigators identify the northern horizon houses on the star compass. Its warm yellow color resembles the yellow flowers used in leis.',
				celestialMeaning: 'Capella\'s declination of +46° places it fairly far north. From Hawaiian latitude (20°N), it rises about 46° north of east—in the far northeastern "houses" of the star compass.',
				culturalSignificance: 'The lei imagery connects the star to Hawaiian hospitality and ceremony. When Polynesians arrived at new islands, they would be greeted with leis—the lei star welcomes navigators from the northern sky.'
			}
		},
		{ name: 'Nāmāhoe', meaning: 'The Twins', abbreviation: 'PN18', stars: 2, brightest: 'Pollux', brightestMag: 1.14, ra: '7h 45m', dec: '+28°', onEcliptic: true, mythology: 'Castor and Pollux—twin stars marking the northeastern horizon',
			mythologyDetails: {
				figure: 'Nāmāhoe (the Twins) are Castor and Pollux, the two brightest stars of Gemini. They rise in the northeast and are easy to identify because they are equally bright and close together.',
				story: 'Twins have significance in Polynesian mythology—they often appear as complementary opposites (like land and sea, or night and day). These celestial twins travel together across the sky, always the same distance apart.',
				celestialMeaning: 'Pollux (+28° declination) and Castor (+32° declination) rise northeast of east, about 25-30° from the true east point. They set northwest of west. Their pair makes them easy to identify even in hazy conditions.',
				culturalSignificance: 'Having two stars together provided redundancy—if one was obscured by a cloud, the other might still be visible. The twins also demonstrated how stars maintain fixed relationships to each other as they cross the sky.'
			}
		},
		{ name: 'Ka Hei-Hei o nā Keiki', meaning: 'Cat\'s Cradle/Children\'s Game', abbreviation: 'PN19', stars: 4, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 25m', dec: '-1°', onEcliptic: false, mythology: 'Orion—the string figure pattern or the bird snare',
			mythologyDetails: {
				figure: 'Orion is known in Hawaiʻi as Ka Hei-Hei o nā Keiki (the Cat\'s Cradle, a children\'s string game) or as a bird snare. The distinctive belt and the surrounding stars resemble string figure patterns that children create with loops of cord.',
				story: 'String figures (hei) were common games across Polynesia, teaching children dexterity and storytelling. Each figure had a story—by seeing Orion as a string game, the constellation became interactive and memorable. Other interpretations saw it as a bird snare used for catching forest birds.',
				celestialMeaning: 'Orion straddles the celestial equator, meaning its stars rise almost due east and set almost due west. The belt stars are especially useful for east-west navigation. The constellation dominates the winter sky.',
				culturalSignificance: 'Polynesian cultures have over 100 recorded string figures, some depicting constellations. Teaching astronomy through games made the knowledge accessible to children, who would grow up to become navigators.'
			}
		},
		{ name: 'Te Waka o Tama-rereti', meaning: 'Canoe of Tama-rereti', abbreviation: 'PN20', stars: 9, brightest: 'Canopus', brightestMag: -0.74, ra: '8h 00m', dec: '-50°', onEcliptic: false, mythology: 'Māori: The great voyaging canoe in the Milky Way',
			mythologyDetails: {
				figure: 'In Māori (New Zealand Polynesian) tradition, the Milky Way is seen as a great voyaging canoe—Te Waka o Tama-rereti. The bright stars of the southern sky (including Canopus, the Southern Cross, and Centauri) form the canoe and its parts.',
				story: 'Tama-rereti was a navigator who saw that the night sky was empty and dark—dangerous for people. He filled his canoe with shining pebbles and sailed across the sky, scattering them to create the stars. The Milky Way is his wake. When the sky god saw this gift to humanity, he placed Tama-rereti and his canoe permanently in the heavens.',
				celestialMeaning: 'The "canoe" of bright southern stars—Canopus (the stern), the Southern Cross (the anchor), and the Pointers (the rope)—travel together across the sky. The Milky Way\'s band represents the canoe\'s path.',
				culturalSignificance: 'This myth explains why the Milky Way exists and celebrates navigation as a sacred gift. Tama-rereti represents all voyaging ancestors who crossed the Pacific. The story was told as crews prepared for ocean voyages.'
			}
		},
		// ADDITIONAL ZENITH STARS - Every major island group has its zenith star(s)
		{ name: 'Ke Ali\'i o Kona', meaning: 'Chief of the South', abbreviation: 'PN21', stars: 1, brightest: 'Spica', brightestMag: 0.98, ra: '13h 25m', dec: '-11°', onEcliptic: true, mythology: 'Zenith star for Fiji and Samoa; guides voyages to the western Pacific',
			mythologyDetails: {
				figure: 'Spica, the brightest star in Virgo, passes through the zenith at Fiji\'s latitude (about 18°S). For navigators approaching from the east or west, when Spica passed directly overhead, they knew they had reached Fiji\'s latitude.',
				story: 'The name "Chief of the South" reflects the star\'s importance for southern voyages. Samoan navigators called it Taulua, using it alongside Canopus to navigate the western Pacific routes. Its bright blue-white light made it visible even through haze.',
				celestialMeaning: 'With a declination of -11°, Spica passes through the zenith at 11°S—close to both Fiji and Samoa. Combined with its position on the ecliptic (marking seasonal changes), it served as both latitude finder and calendar star.',
				culturalSignificance: 'The islands of Fiji, Samoa, and Tonga formed the "Polynesian homeland" from which eastern Polynesian migrations departed. Stars for these latitudes were among the oldest in navigational memory.'
			}
		},
		{ name: 'Kaulia', meaning: 'Hanging Star', abbreviation: 'PN22', stars: 1, brightest: 'Betelgeuse', brightestMag: 0.42, ra: '5h 55m', dec: '+7°', onEcliptic: false, mythology: 'Rising in the northeast; marks the house Manu Ko\'olau (northeast bird)',
			mythologyDetails: {
				figure: 'Kaulia (Betelgeuse), the red supergiant in Orion, rises in the northeast from Hawaiian latitudes. Its distinctive red-orange color made it easy to identify even when low on the horizon.',
				story: 'The star\'s name suggests something suspended or hanging—perhaps referring to its position in Orion\'s shoulder. Betelgeuse is one of the largest stars visible to the naked eye, and its red color was associated with chieftainship and sacred status.',
				celestialMeaning: 'Betelgeuse rises about 7° north of due east from Hawaiʻi. In the star compass, it occupies a house in the Koʻolau (windward/northeast) direction. As winter progresses, it rises earlier each night.',
				culturalSignificance: 'Red stars often held special significance in Polynesian astronomy. Betelgeuse and Antares (also red) were noted for their distinctive colors among the otherwise blue-white and yellow stars.'
			}
		},
		{ name: 'Fetu\'u-ao', meaning: 'Daybreak Star', abbreviation: 'PN23', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Samoan: Venus as morning star; the herald of dawn and new voyages',
			mythologyDetails: {
				figure: 'Fetu\'u-ao (the Daybreak Star) is Venus when it appears in the eastern sky before sunrise. In Samoan tradition, this brilliant "star" heralded the new day and was a signal to prepare for departure.',
				story: 'Voyaging canoes often departed at first light to maximize travel time. When Fetu\'u-ao appeared on the eastern horizon, crews knew dawn was approaching. The star\'s brightness (it can cast shadows) made it visible even in twilight when other stars had faded.',
				celestialMeaning: 'Venus never strays far from the sun, so it appears either before sunrise (morning star) or after sunset (evening star). Its cycle of appearances was tracked to predict optimal sailing conditions.',
				culturalSignificance: 'Venus has different names depending on whether it\'s a morning or evening star. The Samoan Fetu\'u-ao (morning) and Fetu\'u-afiafi (evening) were understood to be the same object, an insight not all ancient cultures achieved.'
			}
		},
		{ name: 'Matariki', meaning: 'Eyes of God/Tiny Eyes', abbreviation: 'PN24', stars: 9, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Māori: Pleiades; the New Year star cluster and harbinger of winter',
			mythologyDetails: {
				figure: 'Matariki is the Māori name for the Pleiades. While Hawaiians call it Makaliʻi, the Māori tradition has particularly detailed stories about each of the nine visible stars, each associated with different aspects of life.',
				story: 'Matariki\'s heliacal rising (late June/early July in New Zealand) marks the Māori New Year. Each of the nine stars represents a different domain: Matariki herself watches over health, Pōhutukawa connects to the dead, Waitī protects fresh water, Waitā guards the sea, Waipuna-ā-rangi brings rain, Tupuānuku governs food grown in the ground, Tupuārangi oversees food from above (birds, fruit), Ururangi controls winds, and Hiwa-i-te-rangi grants wishes.',
				celestialMeaning: 'From New Zealand (35-47°S), Matariki rises in the northeast in winter (June/July). Its visibility varies each year—a bright Matariki promised a warm, productive year; a hazy one foretold difficulty.',
				culturalSignificance: 'Matariki celebrations were revived in the 2000s and became a New Zealand public holiday in 2022. The festival involves remembering the dead, celebrating the present, and planning for the future—a complete temporal reflection.'
			}
		},
		{ name: 'Rehua', meaning: 'Star of Joy', abbreviation: 'PN25', stars: 1, brightest: 'Antares', brightestMag: 1.06, ra: '16h 29m', dec: '-26°', onEcliptic: true, mythology: 'Māori: Antares as the healing star; associated with summer and recovery',
			mythologyDetails: {
				figure: 'Rehua (Antares) is one of the most important stars in Māori astronomy. Unlike its Greek association with war (Ares), in Māori tradition Rehua represents joy, healing, and summer abundance.',
				story: 'Rehua is sometimes called the "star of the tenth month" because it rises prominently in summer (December in New Zealand). When Rehua is high in the sky, food is plentiful and the weather is warm. In some traditions, Rehua is a celestial chief who dispenses healing and abundance.',
				celestialMeaning: 'Antares is a red supergiant whose color is visible to the naked eye. Its position in Scorpius means it rises in the southeast and stays relatively low in the sky from New Zealand\'s southern latitude.',
				culturalSignificance: 'Healing ceremonies were often timed by Rehua\'s prominence. The star\'s red color, rather than suggesting blood or war, was associated with warmth, the sun, and life-giving energy.'
			}
		},
		{ name: 'Atutahi', meaning: 'Stand Alone', abbreviation: 'PN26', stars: 1, brightest: 'Canopus', brightestMag: -0.74, ra: '6h 24m', dec: '-53°', onEcliptic: false, mythology: 'Māori: Canopus as the solitary chief; second brightest star visible from New Zealand',
			mythologyDetails: {
				figure: 'Atutahi (Canopus) means "standing alone"—this brilliant star appears separate from the Milky Way and other star groups. It is the second brightest star in the sky and dominates the southern summer nights.',
				story: 'In Māori tradition, Atutahi was too haughty to join the other stars in Te Ikamui (the Milky Way) when Tāne placed them in the sky. Instead, it stands apart, watching over the other stars. Some traditions say Atutahi is a chief so high-ranked that none may touch him.',
				celestialMeaning: 'From New Zealand, Canopus is circumpolar—it never sets below the horizon. Its altitude above the southern horizon indicates the time of night and season, making it a celestial clock.',
				culturalSignificance: 'Atutahi\'s solitary nature made it a symbol of independence and high status. Chiefs were sometimes compared to Atutahi—bright and prominent, standing apart from ordinary people.'
			}
		},
		{ name: 'Te Punga', meaning: 'The Anchor', abbreviation: 'PN27', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-63°', onEcliptic: false, mythology: 'Māori: Southern Cross as the anchor holding the Milky Way canoe in place',
			mythologyDetails: {
				figure: 'Te Punga (the Southern Cross) is the anchor of Te Waka o Tama-rereti, the great canoe of the Milky Way. While Hawaiians call it Hānaiakamalama (cared for by Moon), Māori see it as the device that keeps the celestial canoe from drifting.',
				story: 'When Tama-rereti scattered the stars from his canoe, he needed to anchor it in place. Te Punga was dropped into the sky to hold the canoe steady. The two Pointer stars (Alpha and Beta Centauri) form the rope (taura) connecting the anchor to the canoe.',
				celestialMeaning: 'From New Zealand, the Southern Cross is circumpolar and can be used to find south at any time of night, any night of the year. It rotates around the South Celestial Pole, appearing to "anchor" the sky.',
				culturalSignificance: 'Te Punga appears on the New Zealand flag and is one of the most recognized symbols of the Southern Hemisphere. Its four bright stars represent the four winds, the four corners of the earth, or the four main islands.'
			}
		},
		{ name: 'Tainui', meaning: 'Great Tide', abbreviation: 'PN28', stars: 1, brightest: 'Fomalhaut', brightestMag: 1.16, ra: '22h 58m', dec: '-29°', onEcliptic: false, mythology: 'A southern star used to time fishing and tidal rhythms',
			mythologyDetails: {
				figure: 'Fomalhaut is an isolated bright star in the southern sky, easy to identify because it has no bright neighbors. The name Tainui (great tide) connects it to ocean rhythms and the timing of fishing expeditions.',
				story: 'Certain stars were associated with productive fishing times. When Tainui rose at particular times, navigators and fishermen knew the currents and tides would be favorable. This knowledge combined astronomical observation with practical marine skills.',
				celestialMeaning: 'Fomalhaut\'s declination of -29° places it in the southern sky from Polynesian latitudes. It rises in the southeast and sets in the southwest, spending most of its time above the horizon in the Pacific.',
				culturalSignificance: 'The connection between stars and fishing reflects how completely integrated Polynesian astronomy was with daily survival. Stars told you not just where you were, but when to fish, plant, and harvest.'
			}
		},
		// STAR COMPASS HOUSES - Individual directions on the compass
		{ name: 'Lā Ko\'olau', meaning: 'Windward Sun House', abbreviation: 'PN29', stars: 8, brightest: 'Various', ra: 'Variable', dec: '+20° to +30°', onEcliptic: false, mythology: 'Northeast horizon house; where stars rise on the windward side',
			mythologyDetails: {
				figure: 'The star compass divides the horizon into "houses" (hale). Lā Ko\'olau is the northeastern house, about 20-30° north of east—the direction of the trade winds (ko\'olau means windward).',
				story: 'Stars that rise in Lā Ko\'olau include Capella, Pollux, and Castor. When a navigator wanted to sail northeast, they would steer toward where these stars rose. Each house has corresponding stars for both rising (east) and setting (west).',
				celestialMeaning: 'Stars with declinations between +20° and +30° rise in the Lā Ko\'olau house from Hawaiian latitudes. The house extends roughly from east-northeast to northeast on a Western compass.',
				culturalSignificance: 'Ko\'olau (windward) is one of the most important directions in Hawaiian geography—the windward sides of islands receive more rain and have different ecosystems than leeward sides. Stars rising here point toward trade wind origins.'
			}
		},
		{ name: 'ʻĀina Ko\'olau', meaning: 'Land of the Windward', abbreviation: 'PN30', stars: 5, brightest: 'Deneb', brightestMag: 1.25, ra: 'Variable', dec: '+35° to +50°', onEcliptic: false, mythology: 'Far northeast house; stars rising near the summer solstice point',
			mythologyDetails: {
				figure: 'ʻĀina Ko\'olau is the far northeastern house on the star compass, where stars with high northern declinations rise. Deneb, Vega, and stars of the far north appear here.',
				story: 'Navigating toward ʻĀina Ko\'olau meant sailing toward the lands of the far north—beyond the normal Polynesian sailing range. Stars in this house were known but rarely followed for actual voyages.',
				celestialMeaning: 'Stars rising this far north (declination +35° to +50°) clear the horizon only briefly from Hawaiian latitude before swinging toward the zenith. They mark the northernmost extreme of the compass.',
				culturalSignificance: 'The completeness of the star compass—covering directions that weren\'t practical destinations—shows it was a full mental model of the sky, not just a navigation tool for known routes.'
			}
		},
		{ name: 'Hikina', meaning: 'Rising/East', abbreviation: 'PN31', stars: 10, brightest: 'Orion Belt', ra: 'Variable', dec: '-5° to +5°', onEcliptic: false, mythology: 'Due east house; equatorial stars that rise exactly east',
			mythologyDetails: {
				figure: 'Hikina is the house of due east—the direction where equatorial stars rise. Orion\'s belt, with its three stars straddling the celestial equator, is the perfect Hikina marker.',
				story: 'Stars rising in Hikina are the most valuable for east-west voyages because they rise exactly east regardless of your latitude. A navigator could follow Orion\'s belt rising to sail due east anywhere in the Pacific.',
				celestialMeaning: 'Stars with declinations between -5° and +5° rise almost due east and set almost due west. They spend roughly 12 hours above the horizon—half the day—making them visible for long periods.',
				culturalSignificance: 'The east (hikina) and west (komohana) were the fundamental reference directions. Once you knew east, all other directions followed. Hikina also means "rising" or "arriving"—the direction of new beginnings.'
			}
		},
		{ name: 'Komohana', meaning: 'Setting/West', abbreviation: 'PN32', stars: 10, brightest: 'Orion Belt', ra: 'Variable', dec: '-5° to +5°', onEcliptic: false, mythology: 'Due west house; where equatorial stars set exactly west',
			mythologyDetails: {
				figure: 'Komohana is the western counterpart to Hikina—the house of due west. The same equatorial stars that rise in Hikina set in Komohana, completing their arc across the sky.',
				story: 'To sail west, a navigator would steer toward where equatorial stars set. On the return voyage from Tahiti to Hawaiʻi, the setting stars of Komohana provided the westward bearing when sailing with the wind.',
				celestialMeaning: 'A star\'s rising point and setting point are symmetrical about the north-south axis. If Orion\'s belt rises at 85° (just north of east), it sets at 275° (just south of west).',
				culturalSignificance: 'Komohana also means "entering" or "departing"—the direction of endings and returns. Voyages that began facing hikina (east) ended facing komohana (west) when returning home.'
			}
		},
		{ name: 'Lā Kona', meaning: 'Leeward Sun House', abbreviation: 'PN33', stars: 8, brightest: 'Various', ra: 'Variable', dec: '-20° to -30°', onEcliptic: false, mythology: 'Southeast horizon house; the leeward direction',
			mythologyDetails: {
				figure: 'Lā Kona is the southeastern house on the star compass, roughly 20-30° south of east. "Kona" means leeward—the sheltered side of islands, away from the trade winds.',
				story: 'Stars rising in Lā Kona include those with moderately southern declinations—Antares, Spica, and stars of the southern constellations. To sail toward Tahiti from Hawaiʻi, navigators steered toward Lā Kona rising points.',
				celestialMeaning: 'From Hawaiian latitude, stars rising southeast spend less time above the horizon than northern stars. Antares (declination -26°) rises in the Kona houses and crosses low across the southern sky.',
				culturalSignificance: 'The Kona (leeward) direction was associated with calm, dry conditions—good for certain crops but also for certain sailing conditions. Kona winds (southerly) were unusual and significant weather events.'
			}
		},
		{ name: 'Hema', meaning: 'South', abbreviation: 'PN34', stars: 6, brightest: 'Southern Cross', brightestMag: 0.76, ra: 'Variable', dec: '-50° to -70°', onEcliptic: false, mythology: 'Due south house; the direction of the South Celestial Pole',
			mythologyDetails: {
				figure: 'Hema marks the southern extreme of the star compass. From Hawaiian latitude, these stars barely rise above the horizon. From Tahiti and further south, they are circumpolar.',
				story: 'Navigating toward Hema meant sailing south—toward Tahiti, Marquesas, and eventually New Zealand. The Southern Cross (just barely visible from Hawaiʻi) and the Pointers marked this direction.',
				celestialMeaning: 'The south celestial pole has no bright marker star (unlike Polaris in the north). Navigators used the Southern Cross and Pointers to estimate the pole\'s location, which sits in a dark region.',
				culturalSignificance: 'The south was the direction of ancestors—the homelands from which Hawaiians came. Voyages south retraced the paths of legendary navigators and connected living Hawaiians to their origins.'
			}
		},
		// ADDITIONAL IMPORTANT STARS
		{ name: 'Kōpū', meaning: 'Belly/Pregnant', abbreviation: 'PN35', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Māori: Venus as evening star; the star of pregnancy and potential',
			mythologyDetails: {
				figure: 'Kōpū is the Māori name for Venus as the evening star. While Fetu\'u-ao (Samoan) names the morning appearance, Kōpū names the evening—when Venus appears in the west after sunset.',
				story: 'The name Kōpū (belly/pregnant) suggests fullness and potential—the evening star growing bright in the western sky like a child growing within. Its slow swelling to maximum brightness, then fading, was like a cycle of gestation.',
				celestialMeaning: 'Venus\'s evening apparition lasts several months, during which it rises higher after sunset, reaches maximum brightness, then sinks toward the sun. This cycle repeats roughly every 19 months.',
				culturalSignificance: 'The duality of Venus (morning/evening) was recognized across Polynesia. Kōpū and Tāwera (morning Venus) were understood as the same object appearing at different times—astronomical knowledge that predated Western contact.'
			}
		},
		{ name: 'Puanga', meaning: 'Celebration', abbreviation: 'PN36', stars: 1, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 25m', dec: '-8°', onEcliptic: false, mythology: 'Māori: Rigel as an alternative New Year star for some iwi (tribes)',
			mythologyDetails: {
				figure: 'Puanga (Rigel) is used by some Māori iwi (particularly in the north of New Zealand) as their New Year star instead of Matariki. Its rising signals the same seasonal transition.',
				story: 'The choice of Puanga or Matariki as the New Year star depends on the iwi\'s traditions and which star is more easily observed from their location. Both rise around the same time (late June), marking the start of the cold season.',
				celestialMeaning: 'Rigel rises slightly before the Pleiades (Matariki) from New Zealand latitudes. Its blue-white brilliance makes it easy to spot, even in twilight. As a near-equatorial star, it rises almost due east.',
				culturalSignificance: 'The existence of two New Year stars shows the diversity within Māori astronomical traditions. Different iwi developed their own detailed knowledge based on their specific locations and histories.'
			}
		},
		{ name: 'Tākurua', meaning: 'Winter', abbreviation: 'PN37', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Māori: Sirius as the star of winter and cold',
			mythologyDetails: {
				figure: 'Tākurua is the Māori name for Sirius. While Hawaiians call it ʻAʻa (burning brightly), the Māori name connects it to winter (takurua), as it rises in the evening during New Zealand\'s coldest months.',
				story: 'Sirius\' rising in the evening marked the deepest part of winter. The star\'s brightness in the cold, clear winter sky made it a prominent seasonal marker. Some traditions personify Tākurua as a chief who brings frost.',
				celestialMeaning: 'From New Zealand\'s latitude (35-47°S), Sirius rises in the northeast and crosses high overhead—nearly through the zenith at Auckland\'s latitude. Its transit time indicates the progression of winter.',
				culturalSignificance: 'The association with cold is the opposite of the star\'s Mediterranean associations (the "dog days of summer"). This reflects how the same stars have inverted seasonal meanings in opposite hemispheres.'
			}
		},
		{ name: 'Whakaahu', meaning: 'Raised Up', abbreviation: 'PN38', stars: 3, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 36m', dec: '+17°', onEcliptic: true, mythology: 'The red eye of the bull; a star raised high in the winter sky',
			mythologyDetails: {
				figure: 'Whakaahu (Aldebaran) is the bright red star in Taurus. Its name suggests being raised or lifted up, perhaps referring to its position high in the winter evening sky.',
				story: 'Aldebaran rises after the Pleiades, appearing to chase them across the sky. This pursuit is noted in many cultures. The star\'s red color, like Antares, gave it special significance.',
				celestialMeaning: 'Aldebaran\'s declination of +17° means it passes very close to the zenith at Hawaiian latitude. From New Zealand, it crosses the northern sky but doesn\'t reach overhead.',
				culturalSignificance: 'Red stars were often associated with chiefs, ancestors, or gods. Aldebaran\'s pursuit of the Pleiades created narrative tension in the sky—a story that repeated every night.'
			}
		},
		{ name: 'Pipiri', meaning: 'To Be Close Together', abbreviation: 'PN39', stars: 2, brightest: 'Castor', brightestMag: 1.58, ra: '7h 35m', dec: '+32°', onEcliptic: false, mythology: 'Māori: Gemini twins; two who are inseparable',
			mythologyDetails: {
				figure: 'Pipiri names the twin stars Castor and Pollux (Gemini). The name means "to be close together"—describing how these two bright stars are always seen side by side.',
				story: 'The twins were inseparable in life and death, traveling together across the sky forever. This parallels the Greek myth but emerged independently. Twins have special significance in Polynesian cultures, sometimes seen as sharing one soul.',
				celestialMeaning: 'Castor and Pollux are close in the sky but quite different physically—Castor is a complex system of six stars, while Pollux is a single orange giant. To the eye, they appear similar.',
				culturalSignificance: 'The June month in the Māori calendar is called Pipiri, when these stars are prominent. The concept of closeness and unity reflected in the name extended to human relationships.'
			}
		},
		{ name: 'Autahi', meaning: 'First Light', abbreviation: 'PN40', stars: 1, brightest: 'Canopus', brightestMag: -0.74, ra: '6h 24m', dec: '-53°', onEcliptic: false, mythology: 'Tahitian: Canopus as the star of first navigation',
			mythologyDetails: {
				figure: 'Autahi is the Tahitian name for Canopus. While Māori call it Atutahi and Hawaiians know it as Holokaʻimoku, the Tahitian tradition emphasizes its role as a primary navigation star.',
				story: 'From Tahiti\'s latitude (17°S), Canopus rises high in the southern sky and is visible most of the year. It was one of the first stars taught to apprentice navigators, hence "first light" or "first star" of navigation.',
				celestialMeaning: 'Canopus\'s brightness (second only to Sirius) and its position away from the Milky Way make it easy to identify. Its height above the southern horizon indicates latitude.',
				culturalSignificance: 'Tahiti was a major center of navigation knowledge. The Society Islands produced many of the master navigators who later taught Hawaiian voyagers during the navigation revival.'
			}
		},
		// WAVE AND OCEAN READING - Stars used in conjunction with swells
		{ name: 'Te Lapa', meaning: 'The Flashing', abbreviation: 'PN41', stars: 0, brightest: 'N/A', ra: 'N/A', dec: 'N/A', onEcliptic: false, mythology: 'Underwater lightning—bioluminescent flashes pointing toward land',
			mythologyDetails: {
				figure: 'Te Lapa is not a star but a navigation phenomenon: streaks of underwater light (possibly bioluminescence) that Polynesian navigators observed pointing toward land. It represents the integration of ocean and sky reading.',
				story: 'Master navigators speak of learning to see "the deep light"—flashes beneath the ocean surface that stream toward land, especially on dark nights. This phenomenon, dismissed by Western scientists for decades, has been partially confirmed through research with traditional navigators.',
				celestialMeaning: 'While not celestial, te lapa shows how navigation was a holistic practice. When stars were obscured by clouds, navigators used the ocean itself—swells, currents, bioluminescence, and the behavior of birds.',
				culturalSignificance: 'Te lapa represents indigenous knowledge that Western science is only beginning to understand. The navigation system was far more complex than just star-steering—it was a complete model of the ocean world.'
			}
		},
		{ name: 'Ka\'ehu Kai', meaning: 'Sea Foam/Spray', abbreviation: 'PN42', stars: 0, brightest: 'N/A', ra: 'N/A', dec: 'N/A', onEcliptic: false, mythology: 'Reading swell patterns reflected from distant islands',
			mythologyDetails: {
				figure: 'Ka\'ehu kai refers to wave and swell reading—the ability to detect land by observing how ocean swells bend, reflect, and interfere around islands beyond the horizon.',
				story: 'Long swells from distant storms travel thousands of miles across the Pacific. When they encounter an island, they reflect, refract, and diffract. A master navigator can feel these subtle changes in the canoe\'s motion and know land is near, even at night or in fog.',
				celestialMeaning: 'This knowledge complemented celestial navigation. Stars told you your latitude and direction; swells told you when land was approaching. The two systems together provided redundancy against weather and errors.',
				culturalSignificance: 'Wave-reading was considered as sophisticated as star-reading. Marshall Islanders created "stick charts"—maps of swell patterns around their islands. Similar knowledge existed throughout Polynesia, though less often recorded.'
			}
		},
		// TONGAN TRADITIONS
		{ name: 'Toloa', meaning: 'Wild Duck', abbreviation: 'PN43', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Tongan: Orion\'s Belt as three flying ducks',
			mythologyDetails: {
				figure: 'In Tongan tradition, the three stars of Orion\'s Belt are called Toloa—three wild ducks flying across the sky. The name reflects the Tongan environment, where ducks were familiar birds.',
				story: 'The ducks fly in formation across the celestial ocean, maintaining their spacing just as real ducks do. Their near-equatorial position made them valuable for east-west navigation from Tonga\'s latitude (about 20°S).',
				celestialMeaning: 'Orion\'s Belt crosses almost exactly on the celestial equator. From Tonga, the belt rises due east and sets due west—the most reliable directional marker after Polaris (which is barely visible from 20°S).',
				culturalSignificance: 'Tonga was one of the last Polynesian kingdoms to be colonized and retained more continuous cultural traditions. Tongan star names preserve navigation knowledge that was lost elsewhere.'
			}
		},
		{ name: 'Maʻafu', meaning: 'Cluster of Fires', abbreviation: 'PN44', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Tongan: Pleiades as campfires of the ancestors',
			mythologyDetails: {
				figure: 'Maʻafu is the Tongan name for the Pleiades. While most Polynesian names emphasize "little eyes" or "small group," the Tongan tradition sees them as fires—the campfires of ancestors who traveled to the sky.',
				story: 'The ancestors who discovered and settled the islands now camp in the sky, their fires visible on clear nights. When voyagers saw Maʻafu rising, they knew they were following paths the ancestors had traveled before.',
				celestialMeaning: 'The Pleiades\' heliacal rising marked seasonal transitions across Polynesia. In Tonga, it signaled the planting season and the time for certain ceremonial activities.',
				culturalSignificance: 'The fire imagery connects the stars to human community—ancestors keeping watch, providing light and warmth even from the sky. Navigation was not just science but a spiritual practice of following ancestral paths.'
			}
		},
		// SAMOAN TRADITIONS
		{ name: 'Tolu', meaning: 'Three', abbreviation: 'PN45', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Samoan: Orion\'s Belt as simply "the three"—a fundamental navigation marker',
			mythologyDetails: {
				figure: 'Tolu (three) is the Samoan name for Orion\'s Belt. The simple name emphasizes function over mythology—these are THE three stars that every navigator learns first.',
				story: 'The three stars rise and set due east and west from Samoa\'s latitude. Young navigators learned that when in doubt about direction at night, find the three stars and you know east and west. Their regular spacing made them unmistakable.',
				celestialMeaning: 'Alnilam, Alnitak, and Mintaka sit within 2° of the celestial equator. They rise within minutes of each other, nearly vertically from the horizon, and set the same way—the most reliable east-west reference.',
				culturalSignificance: 'Navigation knowledge was essential for Samoan independence—the ability to travel between islands for trade, ceremony, and alliance-making. Tolu was the starting point for all navigation teaching.'
			}
		},
		{ name: 'Lupe-o-le-tafatu', meaning: 'Pigeon of the Coast', abbreviation: 'PN46', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Samoan: Lyra as a pigeon; birds were navigation aids near land',
			mythologyDetails: {
				figure: 'In Samoan tradition, Lyra with its bright star Vega represents a pigeon. The lupe (pigeon) was an important bird in Samoa, and birds in general were used as land-finding aids by navigators.',
				story: 'Pigeons and other land birds don\'t fly far from shore. When Polynesian voyagers saw certain birds, they knew land was within the birds\' flight range—usually less than 30 miles. The celestial pigeon reminded navigators to watch for earthly ones.',
				celestialMeaning: 'Vega is one of the brightest stars in the sky and dominates summer nights in the Northern Hemisphere. From Samoa (14°S), it rises in the northeast and passes through the northern sky.',
				culturalSignificance: 'The integration of bird knowledge with star knowledge shows how navigation was a complete environmental awareness. Stars, birds, waves, winds, and clouds all worked together.'
			}
		},
		// NAVIGATIONAL CONCEPTS
		{ name: 'Etak', meaning: 'Moving Island', abbreviation: 'PN47', stars: 0, brightest: 'N/A', ra: 'N/A', dec: 'N/A', onEcliptic: false, mythology: 'A navigation concept where the reference island moves while the canoe stays still',
			mythologyDetails: {
				figure: 'Etak is not a star but a revolutionary navigation concept from Micronesia (Satawal, Caroline Islands) that was adopted across the Pacific. Instead of imagining the canoe moving across the ocean, the navigator imagines the canoe staying still while islands move past.',
				story: 'In the etak system, a "reference island" (often not visible, off to one side) appears to move from one star position to another as the voyage progresses. This mental model made dead reckoning more intuitive and accurate.',
				celestialMeaning: 'The reference island "moves" under different stars as the actual voyage progresses. If it starts under star A and ends under star B, the navigator tracks progress by which star the reference island is "under."',
				culturalSignificance: 'Etak was taught to Hawaiian navigators by Mau Piailug during the Hōkūleʻa revival. It demonstrates the sophistication of Pacific navigation—a conceptual framework as elegant as Western longitude and latitude.'
			}
		},
		{ name: 'Kaveinga', meaning: 'Star Path', abbreviation: 'PN48', stars: 20, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'A sequence of stars that rise or set at the same compass point, forming a navigation "path"',
			mythologyDetails: {
				figure: 'A kaveinga is a star path—a sequence of stars that rise (or set) at approximately the same compass point. As one star rises too high to steer by, the next in the sequence takes over.',
				story: 'To sail northeast, for example, a navigator might start by steering toward Aldebaran rising, then switch to Pollux as Aldebaran rises too high, then to Deneb. Each star path was memorized as a sequence that could be followed for an entire night.',
				celestialMeaning: 'Stars with similar declinations rise at similar compass points. A kaveinga for NNE might include stars with declinations of +25° to +35°, all rising about 20-25° north of east.',
				culturalSignificance: 'Memorizing star paths was the primary navigation skill. A fully trained navigator knew hundreds of star sequences for every direction. This knowledge took decades to master and was passed from master to apprentice.'
			}
		},
		{ name: 'Hōkū Hoʻokele', meaning: 'Steering Stars', abbreviation: 'PN49', stars: 50, brightest: 'Multiple', ra: 'All sky', dec: 'All sky', onEcliptic: false, mythology: 'The complete set of stars used for steering during a voyage',
			mythologyDetails: {
				figure: 'Hōkū hoʻokele (steering stars) is a collective term for all stars bright enough and well-positioned enough to steer by. A master navigator might know 200+ steering stars across all directions and seasons.',
				story: 'Different stars were used depending on the voyage direction, time of year, and time of night. A navigator sailing from Hawaiʻi to Tahiti would use different steering stars than one sailing to the Marquesas, and different stars at different stages of the voyage.',
				celestialMeaning: 'Steering stars are typically 1st or 2nd magnitude (bright enough to see near the horizon) and have declinations that place them at useful compass points for the intended voyage.',
				culturalSignificance: 'The term distinguishes practical navigation stars from those known only mythologically. Not all stars were steering stars—some were too faint, some rose and set at useless angles, some were only visible briefly.'
			}
		},
		{ name: 'Hōkū Hele', meaning: 'Traveling Stars', abbreviation: 'PN50', stars: 5, brightest: 'Jupiter', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'The planets—wandering stars that move against the fixed background',
			mythologyDetails: {
				figure: 'Hōkū hele (traveling stars) are the visible planets—Mercury, Venus, Mars, Jupiter, and Saturn. Unlike fixed stars, they move through the zodiac constellations over weeks and months.',
				story: 'The planets were recognized as different from stars because of their wandering motion. Their movement made them less useful for navigation (their positions changed) but more interesting for calendar-keeping and prophecy.',
				celestialMeaning: 'All five naked-eye planets stay within the zodiac band (±5° of the ecliptic). Their movements were tracked for ceremonial timing rather than navigation. Venus and Jupiter, being brightest, were most commonly noted.',
				culturalSignificance: 'Understanding that planets were fundamentally different from stars required careful observation over years. This astronomical insight developed independently across Polynesia, demonstrating sophisticated sky-watching.'
			}
		}
	];

	// First Nations / Indigenous North American - Multiple distinct nations with unique astronomical traditions
	// These are living cultures; these stories are simplified introductions and should be learned from Indigenous sources
	const FIRST_NATIONS: Constellation[] = [
		{ name: 'Ojiig', meaning: 'Fisher', abbreviation: 'FN1', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Ojibwe: Big Dipper as a fisher (marten); the hero who brought summer',
			mythologyDetails: {
				figure: 'Ojiig is the Fisher, a marten-like animal who is one of the great culture heroes of Anishinaabe/Ojibwe tradition. The Big Dipper\'s seven stars trace his body—the bowl is his back, and the handle extends to his tail.',
				story: 'Long ago, the world was trapped in eternal winter. Ojiig led a party of animals—Otter, Lynx, and Wolverine—on a dangerous journey to the sky world where the Sky People kept summer birds imprisoned. Though the Sky People shot him with arrows (creating the holes in his body that let the summer escape), Ojiig succeeded in freeing the birds, bringing warmth back to the world.',
				celestialMeaning: 'As the Big Dipper rotates around Polaris through the year, Ojiig appears to be struck by arrows and fall (when low in winter), then rise triumphant (when high in summer). His eternal cycle mirrors the cycle of seasons he created.',
				culturalSignificance: 'The Fisher\'s height above the horizon indicates seasonal timing. When he is highest, summer is strongest; when he falls low, winter approaches. Ojibwe star knowledge was essential for timing planting, hunting, and gathering.'
			}
		},
		{ name: 'Maang', meaning: 'Loon', abbreviation: 'FN2', stars: 4, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Ojibwe: Lyra as the sacred loon, caller between worlds',
			mythologyDetails: {
				figure: 'The Loon is a sacred bird in Anishinaabe tradition, known for its haunting call that bridges the realms of sky and water. The constellation Lyra, with brilliant Vega at its heart, represents Maang.',
				story: 'The loon is said to carry messages between the spirit world and the living. Its call at twilight announces the transition between day and night, between summer and winter. Some Ojibwe origin stories tell of the loon diving to the bottom of the primal waters to bring up mud to create the Earth.',
				celestialMeaning: 'Maang (Lyra) is most visible in summer when loons are most active on northern lakes. As autumn approaches and loons migrate south, the constellation begins to set earlier each night.',
				culturalSignificance: 'The loon clan is one of the major Anishinaabe clans, responsible for inner reflection and spiritual matters. When you hear a loon\'s call, ancestors may be near.'
			}
		},
		{ name: 'Mooz', meaning: 'Moose', abbreviation: 'FN3', stars: 5, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'Ojibwe: Pegasus region as the moose; guide for autumn hunting',
			mythologyDetails: {
				figure: 'The Great Moose appears in the autumn sky, using stars from Pegasus and surrounding regions. Mooz was one of the beings that existed before humans, a powerful spirit associated with the lakes and forests.',
				story: 'When Mooz appears prominently in the night sky, it signals the time for the autumn moose hunt. The moose was a primary food source for Anishinaabe peoples, and its appearance in the stars reminded hunters that the animals were fattened and ready.',
				celestialMeaning: 'The Moose constellation\'s rise in autumn corresponds with the breeding season (rut) when moose are more active and easier to hunt. As winter deepens and hunting becomes harder, Mooz sets below the horizon.',
				culturalSignificance: 'Moose provided meat, hide for clothing, bones for tools, and sinew for sewing. Every part was used. The celestial Mooz reminded communities of the relationship between humans and the animals that sustained them.'
			}
		},
		{ name: 'Mishi-bizhiw', meaning: 'Great Lynx/Underwater Panther', abbreviation: 'FN4', stars: 6, brightest: 'Regulus', brightestMag: 1.35, ra: '10h 8m', dec: '+12°', onEcliptic: false, mythology: 'Ojibwe: Leo as the powerful underwater spirit',
			mythologyDetails: {
				figure: 'Mishi-bizhiw (the Great Lynx or Underwater Panther) is a powerful and dangerous spirit that lives beneath the waters of the Great Lakes. It has the body of a great cat, antlers of a deer, and sometimes serpentine features.',
				story: 'Mishi-bizhiw controls the waters and can create deadly storms. When crossing large bodies of water, Anishinaabe peoples would leave offerings of tobacco to appease this spirit. Those who showed proper respect could receive great power; those who didn\'t might never reach the far shore.',
				celestialMeaning: 'The Leo constellation, representing Mishi-bizhiw, is most visible in spring when the ice breaks on the Great Lakes—the time when the underwater panther awakens and waters become dangerous.',
				culturalSignificance: 'Mishi-bizhiw appears in pictographs throughout the Great Lakes region. Copper items found near the lakes were said to be its scales. Shamans who successfully negotiated with this spirit gained great healing powers.'
			}
		},
		{ name: 'Wiçinyanna Sakowin', meaning: 'Seven Little Girls', abbreviation: 'FN5', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Lakota: Pleiades; seven sisters who escaped to the sky',
			mythologyDetails: {
				figure: 'The Seven Little Girls are the Lakota name for the Pleiades. The story explains both the star cluster and the origin of Mato Tipila (Bear Lodge/Devils Tower)—one of the most sacred sites in Lakota tradition.',
				story: 'Seven sisters were gathering wild turnips when a great bear attacked. They fled to a rock and prayed to the Creator for help. The rock heard their prayer and grew high into the sky, lifting them out of the bear\'s reach. The bear\'s claws left deep scratches on the tower\'s sides as it tried to climb. When the rock could grow no higher, the sisters stepped into the sky and became the star cluster.',
				celestialMeaning: 'The Pleiades\' annual cycle—visible in winter, hidden in spring and early summer—governs the Lakota calendar. Their heliacal rising in late autumn signals the coming of winter.',
				culturalSignificance: 'Mato Tipila (Bear Lodge) is still a sacred prayer site. The story teaches that prayer and respect for the land bring protection. The seven sisters\' escape to the stars shows how the sacred and earthly realms are connected.'
			}
		},
		{ name: 'Tayamni', meaning: 'Buffalo', abbreviation: 'FN6', stars: 15, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 36m', dec: '+16°', onEcliptic: false, mythology: 'Lakota: The great Buffalo constellation spanning Orion and Taurus',
			mythologyDetails: {
				figure: 'Tayamni, the celestial Buffalo, is a massive constellation spanning what Western astronomy calls Orion and Taurus. The red star Aldebaran marks the buffalo\'s heart or eye. The buffalo was the center of Plains nations\' way of life.',
				story: 'The Buffalo Nation gave themselves to the Lakota people so that the people could live. In return, the people honored the buffalo with ceremonies, used every part, and never took more than needed. Tayamni in the sky reminds the people of this sacred compact.',
				celestialMeaning: 'Tayamni rises fully in late autumn and dominates the winter sky—the same season when buffalo hunts traditionally occurred. Its stars guided winter camps and hunting parties across the plains.',
				culturalSignificance: 'The buffalo provided everything: food, shelter (lodges from hides), tools (from bone), clothing, and spiritual connection. The celestial Buffalo eternally reminds the people of this gift and the responsibility to honor all relations.'
			}
		},
		{ name: 'Keya', meaning: 'Turtle', abbreviation: 'FN7', stars: 5, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 14m', dec: '-8°', onEcliptic: false, mythology: 'Lakota: Orion\'s belt and sword as the sacred Turtle',
			mythologyDetails: {
				figure: 'Keya, the Turtle, uses Orion\'s Belt as its shell and the Sword as its tail. The turtle is sacred to many Plains nations—it carries the world on its back in some creation stories, and turtle shells were used for ceremonies.',
				story: 'In one Lakota story, the world rests on a great turtle\'s back swimming through cosmic waters. Keya in the sky reminds people that the Earth itself is alive and deserving of respect. Turtle shells were also used as ceremonial drums and rattles.',
				celestialMeaning: 'The Turtle constellation is prominent in winter, the season of stories and ceremonies when people gathered in lodges. Its visibility coincided with important winter gatherings.',
				culturalSignificance: 'Turtle represents patience, longevity, and the Earth itself. Many tribes used 13 sections on turtle shells to count lunar months. "Turtle Island" is a common name for North America in Indigenous traditions.'
			}
		},
		{ name: 'Wicakiyuhapi', meaning: 'Stretcher/Bier', abbreviation: 'FN8', stars: 7, brightest: 'Alioth', ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Lakota: Big Dipper as a funeral stretcher',
			mythologyDetails: {
				figure: 'Where Ojibwe peoples see the Fisher (Ojiig), the Lakota see Wicakiyuhapi—a stretcher (bier) carrying a person. The bowl of the Big Dipper forms the stretcher, carried by three mourners (the handle stars).',
				story: 'A great chief was so beloved that when he died, his people could not bear to bury him in the earth. They carried him forever through the sky on a stretcher, circling the Chief Star (Polaris) eternally. The three handle stars are the mourners who never stop their vigil.',
				celestialMeaning: 'The eternal circling of the stretcher around Polaris represents the unending love of the people for their leader, and the unbroken cycle of death and remembrance. The constellation never sets—like the memory of great ones.',
				culturalSignificance: 'This alternative interpretation shows how the same stars can carry different meanings across cultures. Both stories (Fisher and Stretcher) use the Big Dipper to teach important values—sacrifice for others (Fisher) and honoring the departed (Stretcher).'
			}
		},
		{ name: 'Council of Chiefs', meaning: 'Circle of Stars', abbreviation: 'FN9', stars: 7, brightest: 'Alphecca', brightestMag: 2.23, ra: '15h 35m', dec: '+27°', onEcliptic: false, mythology: 'Pawnee: Corona Borealis as a council of chiefs',
			mythologyDetails: {
				figure: 'The Skidi Pawnee saw Corona Borealis as a semicircle of chiefs sitting in council. The brightest star, Alphecca, represents the head chief who leads discussions and holds the speaking staff.',
				story: 'The Council of Chiefs in the sky mirrors the way Pawnee villages were governed—through consultation and consensus among leaders. Major decisions affecting the nation were made in council, not by any single chief\'s decree.',
				celestialMeaning: 'Corona Borealis is most visible in summer, the season when Pawnee held major councils before hunting expeditions. Its presence reminded leaders that their celestial counterparts watched their decisions.',
				culturalSignificance: 'The Pawnee were known for their sophisticated star knowledge, using constellations to time ceremonies, plan hunts, and govern society. The Council of Chiefs taught that leadership meant listening and deliberating, not commanding.'
			}
		},
		{ name: 'Chief Star', meaning: 'North Star', abbreviation: 'FN10', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Pawnee: Polaris as the Chief Star, highest authority',
			mythologyDetails: {
				figure: 'For the Skidi Pawnee, Polaris was the Chief Star, placed at the center of the sky to oversee all other stars. It represented Tirawahat (sometimes called Tirawa), the supreme power of the universe.',
				story: 'Tirawahat organized the stars into their positions, giving each a purpose. All other stars revolve around the Chief Star, just as the nation revolved around proper cosmic order. The Chief Star never moves, representing constancy and truth.',
				celestialMeaning: 'Polaris was used for navigation and as a timing reference for ceremonies. Its fixed position made it the anchor for understanding all other celestial movements.',
				culturalSignificance: 'The Pawnee earth lodge was designed to mirror the sky—its entrance faced east toward the Morning Star, and its roof opening aligned with the Chief Star. Sacred bundles associated with stars were kept by specific families.'
			}
		},
		{ name: 'Swimming Ducks', meaning: 'Waterfowl', abbreviation: 'FN11', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Multiple nations: Orion\'s Belt as three swimming birds',
			mythologyDetails: {
				figure: 'Many Indigenous peoples saw Orion\'s Belt as three waterfowl swimming in a line across the sky river (Milky Way). The Pawnee specifically called them Swimming Ducks, while other nations saw geese or other birds.',
				story: 'The Pawnee watched for the Swimming Ducks to rise in autumn—signaling both the waterfowl migration and the approach of winter. Some Mi\'kmaq peoples saw these stars as fleas on a great celestial dog\'s back, which explained seasonal flea patterns.',
				celestialMeaning: 'These bright, evenly-spaced stars were easy to identify and appeared in winter when duck hunting ended (lakes frozen) but deer hunting peaked. Their setting in late spring marked the return of fleas and waterfowl.',
				culturalSignificance: 'The practical wisdom encoded in star knowledge impressed early European observers. The "flea star" interpretation directly linked celestial and practical knowledge—when these stars were up, you could sleep on animal skins without flea worry.'
			}
		},
		{ name: 'Aasgaya Galunlati', meaning: 'Seven Boys', abbreviation: 'FN12', stars: 7, brightest: 'Alcyone', ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Cherokee: Pleiades; seven boys who danced into the sky',
			mythologyDetails: {
				figure: 'The Cherokee tell of the Pleiades as Aasgaya Galunlati—seven boys who became stars. Their story differs from the Lakota "Seven Girls" but shares themes of children ascending to the sky.',
				story: 'Seven boys were always playing and neglecting their duties. Their mothers scolded them, saying they could go hungry for all she cared. The boys began dancing in a circle, praying and rising higher with each step. One mother ran to pull her son back, but only managed to pull him down, creating a pine tree. The other six continued rising until they became the Pleiades.',
				celestialMeaning: 'The Pleiades were central to Cherokee timekeeping. When they appeared at certain positions, it was time for the Green Corn ceremony, the most important annual celebration marking the new year.',
				culturalSignificance: 'The story teaches consequences—the mothers\' harsh words sent their children away forever. The seventh boy, pulled back, became the first pine tree—explaining both the star cluster and why pine trees appear to reach toward the sky.'
			}
		}
	];

	// Mesoamerican & South American - Maya, Aztec, and Inca astronomical traditions
	// These civilizations built sophisticated observatories and calendrical systems based on celestial observations
	const MESOAMERICAN: Constellation[] = [
		// MAYA ASTRONOMY - The Maya developed one of the most accurate calendar systems in history
		{ name: 'Ak\'ek\' (Tortoise)', meaning: 'Orion\'s Belt', abbreviation: 'MA1', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Maya: The three hearthstones of creation; where the cosmic fire was kindled',
			mythologyDetails: {
				figure: 'The three stars of Orion\'s Belt represent the three stones of the cosmic hearth (koben). In Maya creation mythology, these stones were set in place at the beginning of the current world age on August 13, 3114 BCE.',
				story: 'The Popol Vuh tells how the gods prepared the Earth for humanity by setting three hearthstones in the sky. The fire kindled at this hearth is the Orion Nebula (M42), visible as a hazy glow below the belt. Every Maya home hearth mirrored this celestial pattern.',
				celestialMeaning: 'The three stars form the "First Three Stone Place" (Oxib\' Xk\'ub\'). When they rise at dusk, it marks important agricultural and ceremonial cycles. The Orion Nebula below them is the smoke of the cosmic fire.',
				culturalSignificance: 'Every Maya house contained three hearthstones arranged like Orion\'s Belt. When you cooked on your hearth, you participated in the ongoing creation of the world. The cosmic fire never goes out.'
			}
		},
		{ name: 'Xux Ek\' (Wasp Star)', meaning: 'Venus', abbreviation: 'MA2', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Maya: Venus as the Wasp Star; most important celestial object after the Sun and Moon',
			mythologyDetails: {
				figure: 'Venus was the single most important celestial body in Maya astronomy after the Sun and Moon. Its 584-day synodic cycle was tracked with remarkable precision—the Dresden Codex contains Venus tables accurate to within 2 hours over 481 years.',
				story: 'The Hero Twins of the Popol Vuh—Hunahpu and Xbalanque—descended to Xibalba (the underworld) and defeated the Lords of Death through cunning. They rose as the Sun and Venus, their eternal journey across the sky reenacting their mythic victory.',
				celestialMeaning: 'Venus\'s disappearance (conjunction with the Sun) and reappearance was tracked meticulously. The 8-day period when Venus is invisible as morning star ends, then reappears as evening star, was particularly dangerous and powerful.',
				culturalSignificance: 'Maya warfare was often timed to Venus\'s heliacal rising. The first appearance of Venus as morning star was considered especially potent for attacking enemies. The Dresden Codex Venus tables guided both war and peace.'
			}
		},
		{ name: 'Ek Balam (Jaguar Star)', meaning: 'Mars', abbreviation: 'MA3', stars: 1, brightest: 'Mars', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Maya: Mars as the Jaguar, lord of the night and the underworld',
			mythologyDetails: {
				figure: 'Mars, with its red color and wandering motion, was associated with the jaguar—the night sun that travels through the underworld. The jaguar was the most powerful animal in the Maya world.',
				story: 'When the sun sets, it becomes a jaguar and travels through Xibalba (the underworld) to be reborn at dawn. Mars\'s red color was blood—the sustenance that kept the cosmos running. Its retrograde motion (apparent backward movement) was the jaguar stalking.',
				celestialMeaning: 'Mars\'s 780-day synodic cycle and 687-day orbital period were tracked but less precisely than Venus. Its color made it easy to identify, and its retrogrades were noted as significant omens.',
				culturalSignificance: 'Jaguar imagery pervades Maya art and religion. Kings wore jaguar skins and took jaguar names. The celestial jaguar (Mars) represented royal power, warfare, and the ability to traverse between worlds.'
			}
		},
		{ name: 'Tzab (Rattlesnake Tail)', meaning: 'Pleiades', abbreviation: 'MA4', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Maya: The Pleiades as the rattle of the celestial serpent',
			mythologyDetails: {
				figure: 'The Maya saw the Pleiades as Tzab—the rattle at the end of a rattlesnake\'s tail. The rattlesnake was a powerful symbol throughout Mesoamerica, connected to rain, fertility, and cosmic cycles.',
				story: 'In some Maya traditions, a great celestial serpent stretches across the sky, its rattle (the Pleiades) shaking to announce the rains. When Tzab passes through the zenith, it marks the beginning of the agricultural cycle.',
				celestialMeaning: 'The zenith passage of the Pleiades (when they pass directly overhead at Maya latitudes around 15-20°N) was a key calendar marker. This happens in late April/early May, signaling time to prepare fields for planting.',
				culturalSignificance: 'Maya cities were often oriented to the Pleiades. The pyramid at Chichen Itza casts a serpent shadow at equinox, and the Pleiades\' relationship to this pyramid was carefully designed.'
			}
		},
		{ name: 'Ek\' Way (Black Dreamer)', meaning: 'Dark Rift', abbreviation: 'MA5', stars: 0, brightest: 'N/A', ra: '17h 30m', dec: '-29°', onEcliptic: false, mythology: 'Maya: The dark lane in the Milky Way; entrance to Xibalba (the underworld)',
			mythologyDetails: {
				figure: 'The Great Rift—a dark lane of dust in the Milky Way visible from Sagittarius to Cygnus—was not merely an absence of stars to the Maya but a positive feature: the Black Road (Xibalba Be) leading to the underworld.',
				story: 'The Hero Twins traveled the Black Road to reach Xibalba and defeat the Lords of Death. The dark rift is the road itself, visible as a gap in the star-river of the Milky Way. At certain times, the sun appears to enter this road.',
				celestialMeaning: 'When the sun passes through the Dark Rift at winter solstice (December), it appears to enter the underworld. The Maya 2012 phenomenon partly related to the sun\'s alignment with the Galactic center near this rift.',
				culturalSignificance: 'The Milky Way was called Wakah Chan (Raised-up Sky)—it was the cosmic tree and the path of souls. Its bright band was the tree trunk; the Dark Rift was the road to the roots in the underworld.'
			}
		},
		{ name: 'Hun Hunahpu (One Maize)', meaning: 'Maize God', abbreviation: 'MA6', stars: 8, brightest: 'Betelgeuse', brightestMag: 0.42, ra: '5h 55m', dec: '+7°', onEcliptic: false, mythology: 'Maya: Orion as the Maize God; father of the Hero Twins',
			mythologyDetails: {
				figure: 'The full Orion constellation (beyond just the belt hearthstones) was seen as Hun Hunahpu, the Maize God and father of the Hero Twins. His story mirrors the maize agricultural cycle.',
				story: 'Hun Hunahpu was killed by the Lords of Xibalba and his head hung in a calabash tree. A maiden became pregnant by his saliva, bearing the Hero Twins who would avenge him. Orion\'s seasonal disappearance and return mirrors the maize cycle of planting, death, and rebirth.',
				celestialMeaning: 'Orion disappears (conjunct with the sun) in late May/early June—exactly when maize seeds are planted and "buried." It reappears in late July/August as maize plants mature—the god reborn.',
				culturalSignificance: 'Maize was literally the flesh of humanity in Maya mythology—people were made from maize dough. The Maize God\'s celestial journey taught that death and planting are the same: both lead to new life.'
			}
		},
		{ name: 'Wakah Chan (World Tree)', meaning: 'Milky Way', abbreviation: 'MA7', stars: 400, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Maya: The Milky Way as the World Tree connecting all realms',
			mythologyDetails: {
				figure: 'When the Milky Way stands vertically in the sky (as viewed from Maya lands), it becomes Wakah Chan—the World Tree connecting underworld, earth, and sky. Its roots are in Xibalba, its trunk passes through our world, its branches reach the heavens.',
				story: 'The World Tree was raised at creation to hold up the sky. It appears on countless Maya monuments with the Celestial Bird (the constellation Cygnus or the Big Dipper) perched at its top and the jaws of the Earth Monster (Scorpius) at its base.',
				celestialMeaning: 'The Milky Way\'s orientation changes through the night and year. When vertical at midnight, it\'s the World Tree. When horizontal, it\'s the Cosmic Crocodile (the canoe of the gods). Both aspects were tracked.',
				culturalSignificance: 'The central axis (axis mundi) of the universe, the World Tree, was replicated in every ceiba tree, every temple pyramid, every royal scepter. Kings climbed the tree in vision quests to speak with ancestors.'
			}
		},
		// AZTEC ASTRONOMY - The Mexica (Aztec) integrated astronomy with their imperial religion
		{ name: 'Tianquiztli (Marketplace)', meaning: 'Pleiades', abbreviation: 'MA8', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Aztec: The Pleiades as a celestial marketplace; key to the New Fire Ceremony',
			mythologyDetails: {
				figure: 'The Aztecs called the Pleiades Tianquiztli (the Marketplace), seeing the cluster as a celestial gathering place. Its culmination (highest point) at midnight was the most important astronomical observation of Aztec civilization.',
				story: 'Every 52 years, the Aztecs feared the world might end. On the night when the Pleiades reached zenith at midnight, all fires throughout the empire were extinguished. Priests watched the Pleiades—if they continued moving past midnight, the world would continue. A new fire was drilled on a sacrificed captive\'s chest, and from this fire, all fires in the empire were rekindled.',
				celestialMeaning: 'The Pleiades\' midnight culmination happens around mid-November in central Mexico. The 52-year cycle aligned the 260-day sacred calendar with the 365-day solar calendar—matching the Pleiades\' cycle.',
				culturalSignificance: 'The New Fire Ceremony (Toxiuhmolpilia) was the most important Aztec ritual. Without it, the Fifth Sun (our current age) would end. The stakes—cosmic destruction—were taken literally.'
			}
		},
		{ name: 'Citlalpol (Great Star)', meaning: 'Venus Morning Star', abbreviation: 'MA9', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Aztec: Venus as the Great Star; the weapon of Quetzalcoatl',
			mythologyDetails: {
				figure: 'Venus as morning star was Citlalpol (Great Star) or Tlahuizcalpantecuhtli (Lord of the Dawn). This aspect of Quetzalcoatl was a warrior who shot darts of light at his enemies—the first rays of dawn that "killed" the stars and Moon.',
				story: 'When Quetzalcoatl departed the Toltec city of Tollan, he burned himself and rose as the morning star. His myth explained Venus\'s appearance: the god descends to the underworld (invisible period), burns (inferior conjunction with sun), and rises transformed.',
				celestialMeaning: 'The heliacal rising of Venus (first appearance as morning star after being invisible) was tracked obsessively. The Aztecs recorded that this happened every 584 days, matching Venus\'s synodic period almost exactly.',
				culturalSignificance: 'The Codex Borgia and other manuscripts contain extensive Venus tables. Different Venus phases affected different groups—farmers, warriors, women, children. Knowing Venus\'s cycle was power.'
			}
		},
		{ name: 'Citlalin Popoca (Smoking Stars)', meaning: 'Comets', abbreviation: 'MA10', stars: 0, brightest: 'Variable', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Aztec: Comets as celestial omens and warnings',
			mythologyDetails: {
				figure: 'Comets (citlalin popoca, "smoking stars") and meteors (citlalin tlamina, "star-arrows") were powerful omens. The Aztecs recorded numerous comets as harbingers of change—famously including one before the Spanish arrival.',
				story: 'When a great comet appeared in 1517, just before Cortés\'s arrival, Emperor Moctezuma II consulted his astrologers anxiously. Smoking stars were messages from the gods—warnings of war, famine, the death of rulers, or the end of ages.',
				celestialMeaning: 'Unlike predictable planets and stars, comets appeared unexpectedly and violated celestial order. Their tails of "smoke" made them seem like celestial fires—creation or destruction made visible.',
				culturalSignificance: 'The famous "Eight Omens of Moctezuma" include celestial phenomena (a column of fire, the sun rising with a comet\'s tail). Whether historical or later invention, they show how seriously the Aztecs took sky signs.'
			}
		},
		{ name: 'Colotl (Scorpion)', meaning: 'Scorpius', abbreviation: 'MA11', stars: 15, brightest: 'Antares', brightestMag: 1.06, ra: '16h 30m', dec: '-26°', onEcliptic: true, mythology: 'Aztec: Scorpius as the celestial scorpion; associated with Malinalxochitl',
			mythologyDetails: {
				figure: 'The Aztecs recognized Scorpius as Colotl, the Scorpion. Its red star Antares was associated with fire and sacrifice. Scorpions themselves were connected to the goddess Malinalxochitl, sorceress and sister of Huitzilopochtli.',
				story: 'Malinalxochitl led the Mexica people during part of their migration to Tenochtitlan but was abandoned by her brother Huitzilopochtli for her sorcery. She controlled scorpions, snakes, and centipedes. The celestial scorpion remembers her power.',
				celestialMeaning: 'Scorpius is visible in the southern sky during summer nights from Mexico. Its prominent hook and red heart (Antares) made it easy to identify. It rises as the Pleiades set—they never share the sky.',
				culturalSignificance: 'The opposition between Scorpius and the Pleiades (never visible together) encoded seasonal knowledge. When the Pleiades set at dusk and Scorpius rose, summer had arrived.'
			}
		},
		{ name: 'Mamalhuaztli (Fire Drill)', meaning: 'Orion\'s Belt', abbreviation: 'MA12', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Aztec: Orion\'s Belt as the fire drill used to kindle the New Fire',
			mythologyDetails: {
				figure: 'The Aztecs saw Orion\'s Belt as Mamalhuaztli—the fire drill used to create fire by friction. This connected the stars to the most important Aztec ritual: the New Fire Ceremony.',
				story: 'At the New Fire Ceremony, priests used a fire drill to kindle flame on a sacrifice victim\'s chest. The celestial fire drill (Orion\'s Belt) turned overhead as earthly priests replicated its motion. Heaven and earth united in the creation of new fire.',
				celestialMeaning: 'Orion\'s Belt spins around the celestial pole through the night, mimicking the rotation of a fire drill. Its position at key hours helped time ritual activities.',
				culturalSignificance: 'Fire was alive—it had to be fed with hearts and blood to keep burning. The cosmic fire drill explained why: fire came from the sky and required sky-gifts (sacrifice) to continue.'
			}
		},
		{ name: 'Tonatiuh (Sun)', meaning: 'The Fifth Sun', abbreviation: 'MA13', stars: 1, brightest: 'Sun', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Aztec: The current Sun, sustained by blood sacrifice',
			mythologyDetails: {
				figure: 'The Aztecs believed we live in the age of the Fifth Sun (Nahui Ollin, "4 Movement"). Four previous suns had been created and destroyed—by jaguars, hurricanes, fire rain, and flood. This sun too would end, by earthquakes.',
				story: 'At the beginning of this age, the gods gathered at Teotihuacan. For the sun to rise, a god had to sacrifice himself. The humble god Nanahuatzin leapt into the cosmic fire and became the Sun. But he wouldn\'t move until the other gods sacrificed themselves too. Their deaths set the sun in motion.',
				celestialMeaning: 'The sun requires blood to move—this was literal Aztec theology. Without sacrifice, the sun would stop, the world would end. Human sacrifice kept the sun rising.',
				culturalSignificance: 'The famous Aztec Sun Stone depicts the face of Tonatiuh surrounded by the glyphs for previous sun ages and the day signs. It was both calendar and cosmological statement—a reminder of what was owed to keep time moving.'
			}
		},
		// INCA ASTRONOMY - The Inca tracked both bright constellations and "dark cloud" constellations
		{ name: 'Yacana (Llama)', meaning: 'Dark Cloud Llama', abbreviation: 'MA14', stars: 0, brightest: 'N/A', ra: '17h 30m', dec: '-30°', onEcliptic: false, mythology: 'Inca: A dark cloud constellation; the celestial llama drinking from the cosmic river',
			mythologyDetails: {
				figure: 'The Inca saw constellations not just in star patterns but in the dark patches of the Milky Way. Yacana (the Llama) is formed by dark nebulae near the Coal Sack, stretching from the Southern Cross toward Scorpius.',
				story: 'Yacana descends to Earth at midnight to drink from rivers and springs—if you see this happen, you will have great fortune. The llama\'s eyes are Alpha and Beta Centauri. A baby llama (Uña Llama) nurses beneath her.',
				celestialMeaning: 'Dark cloud constellations are visible only in the Southern Hemisphere where the Milky Way is brightest. They were used for agricultural timing—when the Llama\'s eyes rose at certain times, it was time for specific activities.',
				culturalSignificance: 'The Inca empire ran on llamas—they carried trade goods, provided wool, and were sacrificed in rituals. The celestial llama blessed earthly herds. Her drinking from cosmic waters ensured springs wouldn\'t run dry.'
			}
		},
		{ name: 'Mach\'acuay (Serpent)', meaning: 'Dark Cloud Serpent', abbreviation: 'MA15', stars: 0, brightest: 'N/A', ra: '18h 00m', dec: '-25°', onEcliptic: false, mythology: 'Inca: A great serpent in the dark clouds of the Milky Way',
			mythologyDetails: {
				figure: 'Mach\'acuay is a giant serpent visible as a dark lane in the Milky Way between Scorpius and the Southern Cross. Like the Maya Dark Rift, the Inca saw this "absence" as a powerful presence.',
				story: 'The celestial serpent was associated with water and rain. When Mach\'acuay rose, the rainy season approached. The serpent\'s movement through the sky brought moisture to the Andes.',
				celestialMeaning: 'The serpent rises in the evening sky as the Southern Hemisphere\'s rainy season begins. Inca astronomers at Cusco\'s Coricancha temple tracked these rising times precisely.',
				culturalSignificance: 'Serpent imagery pervades Andean art—often depicted with two heads, one at each end. The celestial serpent connected sky-water (rain) with earth-water (rivers), showing the unity of the cosmos.'
			}
		},
		{ name: 'Atoq (Fox)', meaning: 'Dark Cloud Fox', abbreviation: 'MA16', stars: 0, brightest: 'N/A', ra: '19h 00m', dec: '-30°', onEcliptic: false, mythology: 'Inca: The fox constellation; trickster and survivor',
			mythologyDetails: {
				figure: 'Atoq, the Fox, is a dark cloud constellation near the Llama in the Milky Way. The fox was a trickster figure in Andean mythology, cunning and adaptable.',
				story: 'When the Fox rises, it\'s said to steal stars from the Llama\'s bag. In some stories, the Fox tried to climb to the sky and was caught, losing his tail. His embarrassed yelp is the howl foxes make at night.',
				celestialMeaning: 'Atoq rises shortly after Yacana (the Llama), appearing to follow her through the sky. This pursuit was watched for agricultural and hunting timing.',
				culturalSignificance: 'The fox in Andean culture was neither purely good nor evil—he survived through cleverness. Stories about him taught that wit could overcome strength, useful wisdom in the competitive Inca world.'
			}
		},
		{ name: 'Yakumama (Water Mother)', meaning: 'Milky Way', abbreviation: 'MA17', stars: 500, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Inca: The Milky Way as the celestial river; mother of all waters',
			mythologyDetails: {
				figure: 'The Inca called the Milky Way Mayu (River) or associated it with Yakumama, the great water serpent. It was the cosmic counterpart to the rivers that sustained Andean agriculture.',
				story: 'The celestial river mirrors earthly rivers. Water flows from the cosmic Mayu to feed springs and streams. In the dry season, the Llama drinks from the river; in the wet season, the river overflows as rain.',
				celestialMeaning: 'The Milky Way\'s position was tracked throughout the year. When it appeared at certain angles, it predicted the coming of rains. Inca astronomers saw it as the visible structure of the universe.',
				culturalSignificance: 'Cusco itself was designed as a microcosm of the celestial river, with the Huatanay River running through it. The temple of Coricancha contained a model of the entire cosmos including the star-river.'
			}
		},
		{ name: 'Chakana (Cross/Stairs)', meaning: 'Southern Cross', abbreviation: 'MA18', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-63°', onEcliptic: false, mythology: 'Inca: The Southern Cross as a cosmic stairway connecting worlds',
			mythologyDetails: {
				figure: 'The Southern Cross was Chakana to the Inca—a stepped cross representing the three levels of existence: Hanan Pacha (upper world), Kay Pacha (this world), and Ukhu Pacha (lower world).',
				story: 'The Chakana shape appears throughout Andean art—in textiles, architecture, and ceramics. It was the bridge between worlds, the symbol of mediation between human and divine. Four stars mark the four directions.',
				celestialMeaning: 'From Cusco (13°S latitude), the Southern Cross is circumpolar and visible year-round. Its rotation around the south celestial pole provided a constant reference for navigation and time-telling.',
				culturalSignificance: 'The stepped cross became the most important symbol of Andean cosmology. Its proportions were used in architecture (windows at Machu Picchu are Chakana-shaped) and textiles. It still appears on Peruvian and Bolivian national symbols.'
			}
		},
		{ name: 'Catachillay (Bright Stars)', meaning: 'Lyra/Vega region', abbreviation: 'MA19', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Inca: The storehouse of multicolored corn; associated with fertility',
			mythologyDetails: {
				figure: 'Catachillay is associated with Lyra and possibly other northern stars visible from Inca territories. It represented a storehouse of multicolored maize seeds—the genetic wealth of Andean agriculture.',
				story: 'The Inca bred dozens of maize varieties—red, blue, purple, yellow, white. This diversity was their insurance against crop failure. The celestial storehouse held the templates for all these varieties.',
				celestialMeaning: 'Stars low on the northern horizon from Cusco were associated with abundance and variety. Vega, one of the brightest stars in the sky, anchors this region.',
				culturalSignificance: 'Agricultural biodiversity was sacred to the Inca. The terraces of Moray were used to breed new crop varieties at different altitudes. Catachillay blessed this work of agricultural science.'
			}
		},
		{ name: 'Chuquichinchay (Shining Jaguar)', meaning: 'Felines in the Sky', abbreviation: 'MA20', stars: 3, brightest: 'Castor', brightestMag: 1.58, ra: '7h 35m', dec: '+32°', onEcliptic: false, mythology: 'Inca: A celestial feline associated with hail and storms',
			mythologyDetails: {
				figure: 'Chuquichinchay was a great celestial cat—puma or jaguar—whose spots were the stars. In some accounts, this constellation is associated with Gemini; in others, with different star groups visible seasonally.',
				story: 'The shining jaguar guarded the celestial realm and could send hail to punish those who violated sacred laws. Its roar was thunder; its spots, the stars that fell as rain.',
				celestialMeaning: 'The position of this constellation was watched during planting season. Hail could destroy entire crops, so propitiation of the celestial jaguar was important agricultural insurance.',
				culturalSignificance: 'Feline imagery is everywhere in Andean culture—from Chavín jaguar heads to Inca puma-shaped Cusco. Cats represented power that could nurture or destroy.'
			}
		},
		{ name: 'Inti (Sun God)', meaning: 'The Sun', abbreviation: 'MA21', stars: 1, brightest: 'Sun', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Inca: The Sun as the supreme deity; ancestor of the Inca royal line',
			mythologyDetails: {
				figure: 'Inti, the Sun, was the patron deity of the Inca Empire and the mythic ancestor of the royal family. The Sapa Inca (emperor) was Intip Churin (Son of the Sun), ruling by divine right.',
				story: 'Inti and his sister-wife Mama Quilla (the Moon) were the parents of Manco Cápac and Mama Ocllo, the founders of the Inca dynasty. Inti gave his children a golden staff and commanded them to settle where it sank into the ground—this was Cusco.',
				celestialMeaning: 'The Inca tracked solstices and equinoxes with precision. Inti Raymi (Festival of the Sun) at winter solstice (June in the Southern Hemisphere) was the most important annual festival.',
				culturalSignificance: 'The Coricancha ("Golden Courtyard") in Cusco was the most sacred temple, dedicated to Inti. Its walls were covered with gold—the "sweat of the sun." Priests tracked solar alignments from this and other observation points.'
			}
		},
		{ name: 'Mama Quilla (Mother Moon)', meaning: 'The Moon', abbreviation: 'MA22', stars: 1, brightest: 'Moon', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Inca: The Moon as divine sister-wife of the Sun; goddess of time and calendars',
			mythologyDetails: {
				figure: 'Mama Quilla, the Moon, was Inti\'s sister and wife. She governed the calendar—months were lunar, and her silver light balanced Inti\'s gold. Women and silver mining were under her protection.',
				story: 'Lunar eclipses terrified the Inca—a great serpent or puma was attacking Mama Quilla. People would make noise, wave weapons, and beat dogs to scare off the attacker. The Moon\'s monthly "death" and "rebirth" was her journey through the underworld.',
				celestialMeaning: 'The Inca used a lunar-solar calendar with months of 30 days and additional days to sync with the solar year. Mama Quilla\'s phases timed festivals, agriculture, and ritual activities.',
				culturalSignificance: 'The queen (coya) was Mama Quilla\'s representative on earth, just as the Sapa Inca represented Inti. The partnership of sun and moon mirrored the political partnership of king and queen.'
			}
		},
		{ name: 'Quyllur (Stars)', meaning: 'Stars in General', abbreviation: 'MA23', stars: 1000, brightest: 'Multiple', ra: 'Various', dec: 'Various', onEcliptic: false, mythology: 'Inca: The stars as offspring of the Sun and Moon; each had a role',
			mythologyDetails: {
				figure: 'The Inca categorized stars into groups based on brightness and behavior. Quyllur (or Coyllur) meant "star" generally, but specific stars and groups had specific names and roles in the cosmic order.',
				story: 'Stars were the children of the Sun and Moon, each appointed to watch over something on Earth. Bright stars protected important things; dim stars watched smaller creatures. Shooting stars were messages between cosmic and earthly realms.',
				celestialMeaning: 'The Inca built sight-line observatories (sukanka) throughout the empire, using natural and artificial horizon features to track star risings. Stars told not just time but also latitude, helping manage the vast empire.',
				culturalSignificance: 'The Coricancha contained not just sun and moon temples but shrines to specific stars and constellations. Venus, the Pleiades, and the Southern Cross each had their own sacred spaces.'
			}
		},
		{ name: 'Qolqa (Storehouse)', meaning: 'Pleiades', abbreviation: 'MA24', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Inca: The Pleiades as cosmic granaries; predictors of harvest',
			mythologyDetails: {
				figure: 'The Inca called the Pleiades Qolqa (storehouse) or Qollqa. Their brightness when they rose heliacally (just before dawn after being invisible) predicted the coming harvest.',
				story: 'Farmers watched the Pleiades intensely. If the stars appeared large and bright at their heliacal rising (around early June), the year would bring abundant rains and good harvests. If they appeared small and dim, drought would follow.',
				celestialMeaning: 'This prediction method actually works. If the Pleiades appear faint and small at heliacal rising, it\'s often due to atmospheric moisture—indicating an El Niño year with different (often poorer) growing conditions.',
				culturalSignificance: 'Modern researchers have confirmed this Inca prediction method is climatologically sound. It represents sophisticated empirical science encoded in mythology—practical knowledge preserved through stories.'
			}
		},
		{ name: 'Orcorara (Rainbow Conjunction)', meaning: 'Meteor Showers', abbreviation: 'MA25', stars: 0, brightest: 'Variable', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Inca: Meteor showers as bridges between heaven and earth',
			mythologyDetails: {
				figure: 'Major meteor showers were watched and recorded by Inca astronomers. Shooting stars were variously interpreted as divine messages, souls of the dead, or seeds of rain falling to earth.',
				story: 'Some traditions held that meteors were pieces of the sun\'s fire falling to ignite volcanoes or cause lightning. Others saw them as the tears of Mama Quilla when she grieved for her children (the stars that fell).',
				celestialMeaning: 'The Inca tracked periodic meteor showers, though we don\'t have detailed records of which showers they observed. The Eta Aquariids (visible in May) and Orionids would have been notable from Cusco.',
				culturalSignificance: 'Transient phenomena like meteors and comets were taken seriously as divine communication. Unlike predictable stars, they broke the pattern—and breaking patterns meant the gods were speaking.'
			}
		}
	];

	// Australian Aboriginal Astronomy - One of the oldest continuous astronomical traditions on Earth
	// These stories belong to living cultures; they are shared here with respect and as simplified introductions
	const ABORIGINAL: Constellation[] = [
		// Note: Aboriginal astronomy is incredibly diverse, with hundreds of language groups each having their own traditions
		// The following represents shared elements and well-documented examples, not a complete system
		{ name: 'Emu in the Sky', meaning: 'Dark Cloud Constellation', abbreviation: 'AB1', stars: 0, brightest: 'N/A', ra: '12h 30m', dec: '-63°', onEcliptic: false, mythology: 'Various nations: The great celestial emu formed by dark clouds in the Milky Way',
			mythologyDetails: {
				figure: 'Like the Inca, Aboriginal Australians saw constellations in the dark spaces of the Milky Way. The Emu\'s head is the dark nebula next to the Southern Cross (the Coal Sack). Its neck stretches along the dark rift toward Scorpius. Its body and legs extend further still.',
				story: 'The Emu appears in rock art dated over 15,000 years old—making Aboriginal astronomy possibly the oldest continuous astronomical tradition on Earth. Different nations tell different stories: the Emu laid the sun as an egg; the Emu\'s pursuit by hunters; the Emu\'s seasonal cycle matching earthly emu breeding.',
				celestialMeaning: 'When the Emu is upright in the evening sky (April-May from southeastern Australia), earthly emus are laying eggs—time to collect them. When it appears to run along the horizon later in the year, emus are running and shouldn\'t be hunted.',
				culturalSignificance: 'This is practical knowledge: emu eggs are nutritious and collecting them during laying season doesn\'t deplete the population. The sky told when to hunt, when to gather, when to let animals breed. It was a living calendar.'
			}
		},
		{ name: 'Coal Sack', meaning: 'Emu\'s Head', abbreviation: 'AB2', stars: 0, brightest: 'N/A', ra: '12h 50m', dec: '-62°', onEcliptic: false, mythology: 'The head of the celestial Emu; a dark nebula near the Southern Cross',
			mythologyDetails: {
				figure: 'The Coal Sack nebula, appearing as a dark patch next to the Southern Cross, forms the Emu\'s head. Its darkness is actually caused by interstellar dust blocking the light of more distant stars.',
				story: 'In some traditions, the Coal Sack is where the Emu sleeps. In others, it\'s a law-man waiting to punish wrongdoers. The darkness is not empty—it is full of meaning, a presence rather than an absence.',
				celestialMeaning: 'The Coal Sack\'s position relative to the Southern Cross changes through the night as the sky rotates. Watching this movement told time during long ceremonial nights.',
				culturalSignificance: 'Aboriginal astronomy recognized that dark spaces had significance—a philosophical insight that Western astronomy only embraced recently with the study of dark nebulae, dark matter, and dark energy.'
			}
		},
		{ name: 'Baiame\'s Emu Tracks', meaning: 'Alpha and Beta Centauri', abbreviation: 'AB3', stars: 2, brightest: 'α Cen', brightestMag: -0.27, ra: '14h 40m', dec: '-61°', onEcliptic: false, mythology: 'Kamilaroi/Gamilaraay: The pointer stars as the footprints of the creator spirit',
			mythologyDetails: {
				figure: 'Alpha and Beta Centauri (the Pointers that guide you to the Southern Cross) are seen by some nations as the footprints of Baiame, the creator spirit, or the footprints of the Emu as it runs across the sky.',
				story: 'Baiame walked across the sky in the Dreamtime, leaving his footprints as stars. Where he stepped, the way was marked for his children to follow. These stars point the way—both to the Southern Cross and, metaphorically, to proper behavior.',
				celestialMeaning: 'The Pointers are bright, close together, and easy to identify. They serve as a reliable navigation reference and time indicator, visible year-round from most of Australia.',
				culturalSignificance: 'The Pointers guide you to the Cross, and the Cross helps find south. This practical navigation knowledge was essential for travel across the vast Australian landscape. Stars were maps.'
			}
		},
		{ name: 'Crux (Southern Cross)', meaning: 'Sacred Law/Singing Place', abbreviation: 'AB4', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 26m', dec: '-63°', onEcliptic: false, mythology: 'Various nations: The Cross holds different meanings—a sky camp, a sacred tree, a stingray',
			mythologyDetails: {
				figure: 'The Southern Cross carries different meanings across Aboriginal Australia. To some, it\'s a sky camp where the spirits of the dead rest. To others, it\'s a sacred tree connecting worlds. The Boorong people of Victoria saw it as a possum in a tree.',
				story: 'One widespread story tells of a brave man who climbed a tree to escape a pursuer. The tree grew into the sky, and the man became the Cross, forever safe. The stars of Centaurus are the men who chased him, still waiting below.',
				celestialMeaning: 'The Southern Cross is circumpolar from most of Australia—it never sets. This permanence made it a reliable reference for navigation, ceremony, and the passage of seasons.',
				culturalSignificance: 'The Southern Cross appears on the Australian flag, but for Aboriginal people it held meaning for tens of thousands of years before European arrival. Its stories encode law, navigation, and seasonal knowledge.'
			}
		},
		{ name: 'Orion (The Canoe)', meaning: 'Various Interpretations', abbreviation: 'AB5', stars: 8, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 25m', dec: '-1°', onEcliptic: false, mythology: 'Yolngu: Orion as three brothers in a canoe; the Orion Nebula is their campfire',
			mythologyDetails: {
				figure: 'The Yolngu people of Arnhem Land see Orion\'s Belt as three brothers (Djulpan) sitting in a canoe. The Orion Nebula (M42) is their campfire. The surrounding stars form the canoe and its fishing equipment.',
				story: 'The three brothers paddled their canoe into the sky after eating a forbidden fish. Their canoe is forever sailing the celestial sea, campfire burning. When they reach certain positions, it\'s time for specific ceremonies or fishing seasons.',
				celestialMeaning: 'Orion\'s position indicates seasonal changes. When the brothers are in certain positions at dusk, it signals time for particular activities—fishing, ceremony, burning the landscape to encourage new growth.',
				culturalSignificance: 'The connection between celestial and practical knowledge is seamless. The story is engaging and memorable; the timing information is life-saving. You don\'t forget when to fish if you know the story.'
			}
		},
		{ name: 'Pleiades (Seven Sisters)', meaning: 'Pursued Women', abbreviation: 'AB6', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Multiple nations: Seven sisters pursued by Orion the hunter',
			mythologyDetails: {
				figure: 'The Seven Sisters story appears across Australia (and around the world). Seven women are pursued by a man (often Orion). They flee into the sky to escape, becoming the Pleiades. The man follows eternally, never catching them.',
				story: 'In many versions, the pursuer (Nyeeruna in some languages) is the constellation Orion. The women\'s campfires are the Pleiades\' stars. One sister hides (the faint seventh star), and the pursuer\'s magic boomerang (the Hyades) returns to him continuously.',
				celestialMeaning: 'Orion rises after the Pleiades—appearing to "chase" them across the sky. This astronomical fact is encoded in stories told across cultures that never had contact with each other.',
				culturalSignificance: 'The story teaches about consent and pursuit—that unwanted attention should be fled, that protectors will help, that escape is possible. It\'s law encoded in stars.'
			}
		},
		{ name: 'Scorpius (The Crocodile)', meaning: 'Water Being', abbreviation: 'AB7', stars: 15, brightest: 'Antares', brightestMag: 1.06, ra: '16h 30m', dec: '-26°', onEcliptic: true, mythology: 'Various nations: Scorpius as a water creature—crocodile, rainbow serpent, or stingray',
			mythologyDetails: {
				figure: 'In tropical northern Australia, Scorpius is often seen as a crocodile. In other regions, it\'s part of the Rainbow Serpent or a giant stingray. Its curved tail and red "heart" (Antares) make it distinctive.',
				story: 'One story tells of a crocodile who became greedy and was placed in the sky as a warning. Another tells of the Rainbow Serpent, whose body arches through the Milky Way, whose scales are stars, whose movement brings the monsoon.',
				celestialMeaning: 'Scorpius is visible in the southern sky during Australian winter (June-August). Its position relative to the Milky Way and its rising/setting times tied to seasonal activities.',
				culturalSignificance: 'The Rainbow Serpent is one of the most important ancestral beings in Aboriginal culture. Seeing Scorpius as part of the Serpent connects the night sky to sacred geography—the Serpent created rivers and waterholes.'
			}
		},
		{ name: 'Magellanic Clouds', meaning: 'Celestial Camps', abbreviation: 'AB8', stars: 0, brightest: 'N/A', ra: '5h 23m', dec: '-69°', onEcliptic: false, mythology: 'Various nations: The Large and Small Magellanic Clouds as sky camps or ancestors',
			mythologyDetails: {
				figure: 'The Magellanic Clouds are two dwarf galaxies visible from the Southern Hemisphere as hazy patches of light. They appear to travel with the Milky Way across the sky.',
				story: 'In some traditions, the Clouds are the camps of an old couple—the larger camp (LMC) is the husband, the smaller (SMC) is the wife. In others, they are the camps of ancestors watching over their descendants.',
				celestialMeaning: 'The Magellanic Clouds are circumpolar from much of Australia—visible every clear night. Their steady presence made them symbols of eternal watchfulness.',
				culturalSignificance: 'The Clouds remind people that they are never alone—ancestors are always present. This connection to the dead, visible nightly in the sky, is a source of comfort and obligation.'
			}
		},
		{ name: 'Canopus (The Fat One)', meaning: 'Seasonal Marker', abbreviation: 'AB9', stars: 1, brightest: 'Canopus', brightestMag: -0.74, ra: '6h 24m', dec: '-53°', onEcliptic: false, mythology: 'Boorong: Canopus as War; a seasonal marker for cold and frost',
			mythologyDetails: {
				figure: 'The Boorong people of Victoria called Canopus "War"—the cold season. Its prominent position in the winter sky made it a marker for the onset of cold weather.',
				story: 'When War rises at sunset, winter has arrived. Frosts come, food becomes scarce, and people must rely on stored provisions and different hunting strategies. War\'s brightness in the clear winter sky was itself a reminder of cold nights.',
				celestialMeaning: 'Canopus rises earlier each evening as winter approaches. By mid-winter, it\'s high in the evening sky. This progression tracked the seasonal shift with daily precision.',
				culturalSignificance: 'Seasonal markers like War were essential for survival. Knowing when to prepare for winter, where to move, what foods to store—all depended on reading the sky correctly.'
			}
		},
		{ name: 'Sirius (The Eagle)', meaning: 'Water Being', abbreviation: 'AB10', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Various nations: Sirius as eagle, dingo, or ancestral being',
			mythologyDetails: {
				figure: 'Sirius, the brightest star in the sky, held special significance across Aboriginal Australia. Different nations saw it as an eagle, a wedge-tailed eagle\'s nest, a dingo, or various ancestral beings.',
				story: 'In one story, Sirius and its companion (the faint white dwarf Sirius B, invisible to the naked eye) are two wives who ascended to the sky. Remarkably, some Aboriginal accounts describe Sirius as having a companion—an observation typically credited to Western astronomers in the 1860s.',
				celestialMeaning: 'Sirius\'s brilliance and its rising/setting positions made it a primary seasonal marker. Its heliacal rising (first appearance before dawn) marked important calendar transitions.',
				culturalSignificance: 'The possible observation of Sirius\'s companion has intrigued researchers. Whether coincidence or actual observation, it demonstrates the sophistication of Aboriginal sky-watching.'
			}
		},
		{ name: 'Arcturus (The Ancestor)', meaning: 'Star of Important Being', abbreviation: 'AB11', stars: 1, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 16m', dec: '+19°', onEcliptic: false, mythology: 'Boorong: Marpeankurrk, the discoverer of ant larvae',
			mythologyDetails: {
				figure: 'The Boorong called Arcturus "Marpeankurrk"—a woman who discovered that ant larvae (bittur) could be eaten. This is the fourth brightest star in the sky, prominent in autumn evenings.',
				story: 'Marpeankurrk was gathering food when she discovered that ant pupae and larvae were nutritious and delicious. She shared this knowledge with her people. When she died, she ascended to become a bright star, appearing each year when ant larvae are ready to harvest.',
				celestialMeaning: 'Arcturus\'s evening rise (March-April in Australia) coincides with the time when ant larvae are fat and ready for collection—a valuable food source.',
				culturalSignificance: 'This story encodes practical ecological knowledge: when this star rises in the evening, go check the ant nests. Astronomy serves survival. The discoverer is honored forever in the sky.'
			}
		},
		{ name: 'Vega (The Mallee Hen)', meaning: 'Egg Star', abbreviation: 'AB12', stars: 1, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Boorong: Neilloan, the Mallee Fowl; associated with egg collection',
			mythologyDetails: {
				figure: 'The Boorong called Vega "Neilloan"—the Mallee Fowl (Lowan). This bird buries its eggs in mounds of warm, composting vegetation. The star\'s position indicated when to search for eggs.',
				story: 'Mallee fowl were important food sources. The birds bury eggs in mounds that incubate them through composting heat. When Neilloan (Vega) appears at a certain position, the eggs are ready to collect—not too early (undeveloped) or too late (hatched).',
				celestialMeaning: 'Vega is low in the northern sky from southeastern Australia but still visible. Its position in the sky during September-October signals egg-finding season.',
				culturalSignificance: 'Again, the sky serves as a calendar for food collection. Stories about star beings encode timing knowledge that ensures sustainable harvesting—take eggs at the right time, not during breeding.'
			}
		},
		{ name: 'Jupiter (The Father)', meaning: 'Wandering Ancestor', abbreviation: 'AB13', stars: 1, brightest: 'Jupiter', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Various nations: Jupiter as a powerful ancestral being',
			mythologyDetails: {
				figure: 'Jupiter\'s brightness and slow movement across the sky made it stand out among the stars. Many nations recognized it as special—a wanderer, an ancestor, a spirit of power.',
				story: 'Unlike stars, planets move. This wandering was explained differently by different groups: spirits visiting; ancestors checking on their children; powerful beings walking the sky road.',
				celestialMeaning: 'Aboriginal astronomers tracked planetary motion. Some traditions describe Venus and Jupiter as having different characters based on their behavior—Venus quick and bright, Jupiter slow and steady.',
				culturalSignificance: 'Recognizing planets as different from stars requires careful observation over time. This knowledge demonstrates the depth of Aboriginal astronomical practice—the sky was watched attentively for countless generations.'
			}
		},
		{ name: 'Venus (The Morning Star)', meaning: 'Barnumbirr', abbreviation: 'AB14', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Yolngu: Venus as Barnumbirr, who guides the souls of the dead',
			mythologyDetails: {
				figure: 'Venus as morning star is called Barnumbirr by the Yolngu people. She carries a light (actually a string of stringybark) as she guides the spirits of the newly dead to the island of the dead.',
				story: 'Each morning before dawn, Barnumbirr rises in the east, carrying the souls of those who died during the night. She guides them across the sky and sea to Baralku, the island of the dead. The Morning Star Ceremony honors this journey.',
				celestialMeaning: 'Venus\'s appearance as morning star (rising before the sun) lasts several months before it becomes invisible then reappears as evening star. This cycle was carefully tracked.',
				culturalSignificance: 'The Morning Star Ceremony is one of the most important Yolngu ceremonies, performed during funerals. The ceremonial pole represents Barnumbirr\'s light. The star connects the living and dead.'
			}
		},
		{ name: 'Moon Phases', meaning: 'Lunar Cycle', abbreviation: 'AB15', stars: 1, brightest: 'Moon', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Pan-Australian: The Moon\'s cycle as a story of death and rebirth',
			mythologyDetails: {
				figure: 'The Moon\'s monthly cycle—waxing from new to full, waning from full to dark, then returning—was universally interpreted across Aboriginal Australia as a story of death, decay, and rebirth.',
				story: 'One widespread story tells of the Moon-man who angers the Sun-woman. She strikes him with an axe (causing him to "wane"), he "dies" (new moon), then slowly heals (waxing). Different nations tell different reasons for their conflict.',
				celestialMeaning: 'Lunar phases governed many activities: ceremonies held at full moon, fishing timed to tides (which follow the moon), women\'s ceremonies connected to monthly cycles.',
				culturalSignificance: 'The Moon\'s reliable death and rebirth provided a model for human death—we too would return, in some form. This connection between sky and mortality runs through all Aboriginal astronomy.'
			}
		},
		{ name: 'Milky Way', meaning: 'Sky River/Emu', abbreviation: 'AB16', stars: 500, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Pan-Australian: The Milky Way as a sky river, emu, or path of spirits',
			mythologyDetails: {
				figure: 'The Milky Way carries many names and stories across Aboriginal Australia. It\'s a sky-river (with fish and waterlilies), the body of the Emu, the campfires of ancestors, or the path souls travel to the spirit world.',
				story: 'In riverine cultures, the Milky Way is a river where fish and water creatures live. The dark patches are waterholes. In other regions, it\'s the smoke of ancestors\' campfires, or the road they traveled during the Dreamtime.',
				celestialMeaning: 'The Milky Way\'s orientation changes through the night and year. These changes were tracked—when it\'s vertical vs. horizontal told time; its seasonal position indicated calendar events.',
				culturalSignificance: 'The Milky Way connected every local story to the universal—the same sky-river flows over everyone\'s country. Different nations could share astronomy even when other things differed.'
			}
		},
		{ name: 'Eclipses', meaning: 'Cosmic Events', abbreviation: 'AB17', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Pan-Australian: Eclipses as dangerous or significant cosmic events',
			mythologyDetails: {
				figure: 'Solar and lunar eclipses were significant events requiring specific responses—often silence, looking away, and ceremony. The temporary "death" of the sun or moon was understood as a cosmic conflict.',
				story: 'Eclipse stories vary: the sun-woman and moon-man fighting; the sun being swallowed; darkness spirits attacking. Importantly, people knew what to do—the eclipse would pass if proper actions were taken.',
				celestialMeaning: 'Some researchers suggest Aboriginal people predicted eclipses, though evidence is debated. Certainly, eclipses were known to recur and were not met with panic but with ritual response.',
				culturalSignificance: 'The predictable response to eclipses—specific actions known to restore the sun or moon—demonstrates that these events were understood within a framework, not feared as unprecedented. Cosmos has order.'
			}
		},
		{ name: 'Aurora Australis', meaning: 'Spirit Fire', abbreviation: 'AB18', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Various nations: The Southern Lights as dancing spirits or cosmic fire',
			mythologyDetails: {
				figure: 'The Aurora Australis (Southern Lights) is visible from Tasmania and sometimes southern Australia during solar maximum. These dancing lights were interpreted as spirits, fires, or communications from the sky-world.',
				story: 'In Tasmania, the Aurora was associated with spirits dancing. In some mainland traditions, it was the campfires of Baiame or other sky beings. Its appearance might signal events in the spirit world.',
				celestialMeaning: 'Auroras correlate with solar activity—though Aboriginal people couldn\'t know this mechanism, they would have noticed that auroras were more common some years than others (roughly 11-year solar cycle).',
				culturalSignificance: 'The aurora connected people to the sky in a dynamic way—not just fixed stars but living, moving light. The sky was not static; it responded and communicated.'
			}
		},
		{ name: 'Meteor Showers', meaning: 'Falling Spirits', abbreviation: 'AB19', stars: 0, brightest: 'Variable', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Various nations: Shooting stars as messages or falling spirits',
			mythologyDetails: {
				figure: 'Meteors—individual shooting stars and major showers—were interpreted as sky beings moving, messages being sent, or spirits descending to or ascending from Earth.',
				story: 'Some traditions held that each person had a star, and when they died, their star fell from the sky. Others saw meteors as weapons thrown by sky-beings during conflicts. The direction a meteor fell could indicate where a death had occurred.',
				celestialMeaning: 'Regular meteor showers (like the Eta Aquariids in May or Geminids in December) would have been noticed as recurring events. Their predictability may have been incorporated into calendar systems.',
				culturalSignificance: 'Transient sky events—comets, meteors, eclipses, aurora—reminded people that the sky was alive. Stars might seem permanent, but the cosmos was always changing, always communicating.'
			}
		},
		{ name: 'Wurrpan (Lyra)', meaning: 'Spirit Messenger', abbreviation: 'AB20', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Boorong: Lyra as a spirit being',
			mythologyDetails: {
				figure: 'The Boorong saw Lyra as Wurrpan, associated with spirit communication. Vega, the brightest star in Lyra, anchored this small constellation in the northern sky.',
				story: 'Wurrpan was connected to spirit communication and possibly to ceremonies involving trance or vision. The specific stories are not fully recorded, but the star\'s association with spirituality was noted by early ethnographers.',
				celestialMeaning: 'Lyra is low on the northern horizon from southeastern Australia, visible during warmer months. Its appearance would mark certain ceremonial seasons.',
				culturalSignificance: 'Many Aboriginal star names and stories were lost during colonization. Wurrpan represents the fragments that remain—meaningful enough to record, but with much context lost.'
			}
		}
	];

	// Inuit & Arctic Peoples - Astronomy adapted to the extreme conditions of polar regions
	// The Arctic sky behaves differently: months of darkness, months of light, the sun circling the horizon
	const INUIT: Constellation[] = [
		{ name: 'Tukturjuit', meaning: 'Caribou', abbreviation: 'IN1', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Inuit: The Big Dipper as caribou; the most important food animal',
			mythologyDetails: {
				figure: 'The Big Dipper is seen as Tukturjuit—caribou. In the Arctic, caribou were essential for survival, providing food, clothing, shelter materials, and tools. The celestial caribou reminds people of their dependence on these animals.',
				story: 'In one story, a hunter pursued caribou so long that both hunter and prey ended up in the sky. The caribou run eternally around the North Star, and the hunter follows eternally. This explains why the Big Dipper circles Polaris without rest.',
				celestialMeaning: 'From Arctic latitudes (60-80°N), the Big Dipper is circumpolar—it never sets. It circles low around the horizon in summer (when it\'s light anyway) and high overhead in the dark winter months when stars matter most.',
				culturalSignificance: 'Caribou migrations determined when and where Inuit groups moved. The celestial caribou reminded hunters to think about migration timing, to prepare for hunts, and to respect the animals that sustained them.'
			}
		},
		{ name: 'Nanurjuk', meaning: 'Polar Bear', abbreviation: 'IN2', stars: 5, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Inuit: Polaris and surrounding stars as a polar bear being hunted',
			mythologyDetails: {
				figure: 'Some Inuit groups see Polaris and nearby stars as Nanurjuk, a polar bear. Polaris itself is the bear, while surrounding stars are hunters or dogs pursuing it. The bear stands still while hunters circle.',
				story: 'A great polar bear was so powerful that no hunter could approach it directly. Hunters had to circle around it endlessly. The bear became the fixed star at the center of the sky, with hunters (other stars) forever circling but never catching it.',
				celestialMeaning: 'Polaris\'s position at the celestial north pole means it appears motionless while all other stars rotate around it. From the High Arctic, Polaris is very high in the sky—sometimes nearly overhead.',
				culturalSignificance: 'Polar bears were both feared and revered—the most dangerous animal in the Arctic, but also a source of food, fur, and spiritual power. The bear\'s stillness at the sky\'s center reflected its commanding presence.'
			}
		},
		{ name: 'Quturjuuk', meaning: 'Collarbones', abbreviation: 'IN3', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Inuit: Orion\'s Belt as collarbones; markers of winter',
			mythologyDetails: {
				figure: 'Orion\'s Belt is known as Quturjuuk—collarbones. The three evenly-spaced stars resemble the bones at the base of the neck. This simple, practical identification made the stars easy to teach and remember.',
				story: 'The collarbones belong to a giant who was placed in the sky. When the collarbones are visible in the evening, winter has truly arrived. They were a calendar marker for the darkest season.',
				celestialMeaning: 'From Arctic latitudes, Orion is a winter constellation that rises only partway above the southern horizon. It\'s visible during the long polar night but disappears during summer\'s midnight sun.',
				culturalSignificance: 'Body-part names for constellations (collarbones, backbone, etc.) made astronomy accessible. Everyone knows their own anatomy; mapping it onto the sky made star patterns intuitive and memorable.'
			}
		},
		{ name: 'Ullaktut', meaning: 'Runners', abbreviation: 'IN4', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Alternate interpretation: Orion\'s Belt as three runners in a race',
			mythologyDetails: {
				figure: 'Another interpretation of Orion\'s Belt sees the three stars as Ullaktut—runners racing across the sky. The stars appear to move in lockstep, never gaining or losing on each other.',
				story: 'Three runners once raced across the tundra. They were so evenly matched that they ran forever without any winning. The creator placed them in the sky to continue their race eternally, inspiring human runners.',
				celestialMeaning: 'The three belt stars are almost perfectly aligned and evenly spaced—natural imagery for runners in formation. Their apparent motion across the winter sky mimics runners crossing terrain.',
				culturalSignificance: 'Running was essential for survival—chasing game, fleeing danger, carrying messages between camps. The celestial runners honored this skill and encouraged endurance.'
			}
		},
		{ name: 'Aagjuuk', meaning: 'Two Placed Far Apart', abbreviation: 'IN5', stars: 2, brightest: 'Altair', brightestMag: 0.76, ra: '19h 51m', dec: '+9°', onEcliptic: false, mythology: 'Inuit: Altair and Tarazed as two stars used for navigation and time-telling',
			mythologyDetails: {
				figure: 'Aagjuuk refers to Altair and its nearby companion Tarazed in Aquila. These two stars "placed far apart" were used for telling time during the long winter nights.',
				story: 'When Aagjuuk reaches a certain position in the sky, people know how much of the night has passed. In the continuous darkness of polar winter, such markers were essential for maintaining daily rhythms.',
				celestialMeaning: 'Altair is bright and easily identified. Its position relative to the horizon at different hours helped Inuit maintain schedules during the months-long polar night when the sun never rose.',
				culturalSignificance: 'Without clocks, and without sunrise/sunset during polar winter, stars were the only way to structure time. Aagjuuk\'s position told people when to sleep, when to wake, when to hunt.'
			}
		},
		{ name: 'Kingulliq', meaning: 'The One Behind', abbreviation: 'IN6', stars: 1, brightest: 'Betelgeuse', brightestMag: 0.42, ra: '5h 55m', dec: '+7°', onEcliptic: false, mythology: 'Inuit: Betelgeuse as a star that follows or trails behind',
			mythologyDetails: {
				figure: 'Betelgeuse, the red star in Orion, is called Kingulliq—"the one behind" or "the one that follows." It follows behind the collarbones (Orion\'s Belt) as they cross the sky.',
				story: 'Kingulliq is a hunter who always arrives late, always behind the others. His red color shows his embarrassment at being last. Yet he persists, following the others night after night.',
				celestialMeaning: 'Betelgeuse rises after Orion\'s Belt and follows it across the sky. Its distinctive red color made it easy to identify even when low on the horizon.',
				culturalSignificance: 'The story of the latecomer teaches persistence—even those who start behind can keep going. Red color in the sky was noted specially, as red stars are uncommon.'
			}
		},
		{ name: 'Sakiattiak', meaning: 'Breastbone', abbreviation: 'IN7', stars: 6, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Inuit: The Pleiades as a breastbone; seasonal marker',
			mythologyDetails: {
				figure: 'The Pleiades cluster is called Sakiattiak—the breastbone. The cluster\'s shape was seen as resembling the central bone of the chest. Like other body-part names, this made identification intuitive.',
				story: 'The breastbone protects the heart. When Sakiattiak is visible high in the evening sky, the coldest part of winter is upon the land. People must protect their hearts (stay warm) as the breastbone star protects.',
				celestialMeaning: 'The Pleiades are visible in winter from Arctic latitudes, rising in the east during early evening. Their height in the sky indicated how deep into winter the season had progressed.',
				culturalSignificance: 'Winter was the most dangerous time in the Arctic—cold, dark, and food-scarce. Sakiattiak\'s prominence reminded people to take care, to conserve resources, to protect one another.'
			}
		},
		{ name: 'Sivulliit', meaning: 'The First Ones', abbreviation: 'IN8', stars: 2, brightest: 'Castor', brightestMag: 1.58, ra: '7h 35m', dec: '+32°', onEcliptic: false, mythology: 'Inuit: Castor and Pollux as the first people or ancestors',
			mythologyDetails: {
				figure: 'The twin stars Castor and Pollux are known as Sivulliit—"the first ones" or ancestors. These two bright stars, close together and similar in brightness, represent the original people.',
				story: 'In the beginning, there were two people—perhaps siblings, perhaps spouses. From them, all other people descended. They were placed in the sky so their children would never forget them.',
				celestialMeaning: 'Gemini is a winter constellation visible during the long polar night. The twin stars\' similarity in brightness made them natural symbols for paired ancestors or original beings.',
				culturalSignificance: 'Ancestor veneration was central to Inuit spirituality. The first ones established the ways of living that descendants followed. Seeing them in the sky connected present to past.'
			}
		},
		{ name: 'Qimmiit', meaning: 'Dogs', abbreviation: 'IN9', stars: 5, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Inuit: Sirius and surrounding stars as sled dogs',
			mythologyDetails: {
				figure: 'Sirius and nearby stars in Canis Major are seen as Qimmiit—sled dogs. The brightest star (Sirius) is the lead dog, with others following in the team formation.',
				story: 'A hunter\'s dog team was so magnificent that the spirits placed them in the sky. They pull their invisible sled across the heavens each night. Their leader, the brightest star, guides the team true.',
				celestialMeaning: 'Sirius is the brightest star in the sky, dominant even from Arctic latitudes where it skims the southern horizon in winter. Its brilliance naturally suggested leadership.',
				culturalSignificance: 'Sled dogs were essential for Arctic survival—transportation, hunting assistance, and companionship. Honoring dogs in the sky recognized their partnership with humans.'
			}
		},
		{ name: 'Pituaq', meaning: 'Lamp', abbreviation: 'IN10', stars: 1, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Inuit: Vega as a lamp or light source in the sky',
			mythologyDetails: {
				figure: 'Vega, one of the brightest stars visible from the Arctic, was called Pituaq—the lamp. In the dark winter, stars provided the only light, and Vega\'s brightness made it a natural lamp.',
				story: 'The lamp in the sky was lit by a spirit to help people see during the long darkness. Unlike earthly lamps that need oil and tending, the sky lamp burns forever, never running dry.',
				celestialMeaning: 'Vega is circumpolar from High Arctic latitudes—visible year-round, circling the pole. During winter darkness, its steady presence provided reliable light.',
				culturalSignificance: 'The qulliq (seal oil lamp) was the center of Inuit home life—providing light, heat, and the ability to cook. A celestial lamp honored this essential technology.'
			}
		},
		{ name: 'Nuuttuittuq', meaning: 'Never Moves', abbreviation: 'IN11', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Inuit: Polaris as the star that never moves; navigation anchor',
			mythologyDetails: {
				figure: 'Polaris is called Nuuttuittuq—"the one that never moves." While all other stars rotate around the sky, Polaris remains fixed. This made it the ultimate reference point.',
				story: 'The creator placed one star that would never move, so that travelers would always know which way was north. As long as that star is in the sky, no one need be truly lost.',
				celestialMeaning: 'From Arctic latitudes, Polaris is very high in the sky—sometimes nearly overhead. Its fixed position made it essential for navigation across the featureless tundra and sea ice.',
				culturalSignificance: 'In an environment with few landmarks, navigation by stars was critical. Polaris\'s constancy was lifesaving. The name encodes this practical knowledge: find the star that doesn\'t move, and you know north.'
			}
		},
		{ name: 'Akuttujuuk', meaning: 'Those Placed Apart', abbreviation: 'IN12', stars: 2, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 14m', dec: '-8°', onEcliptic: false, mythology: 'Inuit: Rigel and Betelgeuse as two placed apart in Orion',
			mythologyDetails: {
				figure: 'Rigel and Betelgeuse, the two brightest stars in Orion (one blue-white, one red), are called Akuttujuuk—"those placed apart." They bracket the hunter\'s body.',
				story: 'Two siblings quarreled and were separated, placed at opposite ends of the same constellation. They can see each other but never reconcile. Their different colors show their different temperaments—one cool, one hot-tempered.',
				celestialMeaning: 'The color contrast between blue Rigel and red Betelgeuse is visible to the naked eye. This made them easy to identify and discuss, even without knowing stellar physics.',
				culturalSignificance: 'Stories of quarreling siblings served as moral lessons about the importance of harmony. The stars eternally remind people what happens when family bonds break.'
			}
		},
		{ name: 'Tiriganniaq', meaning: 'Arctic Fox', abbreviation: 'IN13', stars: 4, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'Inuit: Cygnus region as an arctic fox hunting or playing',
			mythologyDetails: {
				figure: 'The stars of Cygnus are sometimes seen as Tiriganniaq—the arctic fox. The cross-shape of Cygnus was interpreted as the fox\'s body and legs as it runs or plays.',
				story: 'The arctic fox is known for its playfulness and cunning. One fox was so clever it outwitted all hunters and escaped into the sky. Now it plays among the stars, always just out of reach.',
				celestialMeaning: 'Cygnus is visible in the northern sky during autumn, when arctic foxes are growing their thick winter coats. The constellation\'s appearance coincided with prime fox-hunting season.',
				culturalSignificance: 'Arctic fox fur was valuable for clothing. The animal\'s color change (brown in summer, white in winter) was seen as magical. A celestial fox honored this clever survivor.'
			}
		},
		{ name: 'Siqiniq', meaning: 'Sun', abbreviation: 'IN14', stars: 1, brightest: 'Sun', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Inuit: The Sun as a woman carrying a torch; sister of the Moon',
			mythologyDetails: {
				figure: 'In many Inuit traditions, the Sun (Siqiniq) is female—a woman carrying a torch across the sky. She is the sister (or sometimes wife) of the Moon, and they chase each other eternally.',
				story: 'Sun and Moon were once human siblings. After a quarrel (stories vary on the cause), they fled into the sky. The sister became the Sun, bright and warming; the brother became the Moon, pale and cold. They chase each other but never meet.',
				celestialMeaning: 'The Sun\'s extreme behavior in the Arctic—absent for months, then present for months—made it a powerful presence. During the return of the sun after polar winter, celebrations were held.',
				culturalSignificance: 'The Sun\'s return after months of darkness was the most important event of the Arctic year. Ceremonies welcomed her back, giving thanks for light and the promise of warmth.'
			}
		},
		{ name: 'Taqqiq', meaning: 'Moon', abbreviation: 'IN15', stars: 1, brightest: 'Moon', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Inuit: The Moon as a man; brother of the Sun, hunter in the sky',
			mythologyDetails: {
				figure: 'The Moon (Taqqiq) is male in most Inuit traditions—a man with a sled and dogs who hunts across the sky. His light allows night hunting when the Sun is away.',
				story: 'Moon-man hunts seals and caribou in the sky, providing spirit-food for the dead. His waxing and waning shows his success—when full, he has fed well; when thin, he is hungry. He sometimes visits earth, and shamans could journey to visit him.',
				celestialMeaning: 'During the months-long polar night, the Moon was the primary light source. Its phases structured time and influenced tides (important for seal hunting on ice).',
				culturalSignificance: 'The Moon\'s cycles governed practical activities. Full moons provided light for night hunting during winter darkness. The Moon-man was a helper of humans, not fearsome like some spirits.'
			}
		},
		{ name: 'Uvluriaq', meaning: 'Star (generic)', abbreviation: 'IN16', stars: 500, brightest: 'Multiple', ra: 'Various', dec: 'Various', onEcliptic: false, mythology: 'Inuit: Stars in general as holes in the sky, campfires of the dead, or sparks',
			mythologyDetails: {
				figure: 'Individual stars without specific identities were called uvluriaq (or regional variants). They were variously explained as holes in the sky-dome letting light through, campfires of the dead, or sparks from celestial fires.',
				story: 'One widespread story tells of a girl who poked holes in the sky with a stick, letting light from the bright world beyond shine through. Each hole became a star. Another tells of ancestors camping in the sky, their fires visible to descendants.',
				celestialMeaning: 'The sheer number of stars visible in the clear Arctic air, especially during winter, demanded explanation. These general stories explained why there were so many points of light.',
				culturalSignificance: 'The idea of stars as connections to ancestors—their campfires, their eyes watching—provided comfort. People were never alone; the dead watched over them from above.'
			}
		},
		{ name: 'Kingullirusiq', meaning: 'The Very Last One', abbreviation: 'IN17', stars: 1, brightest: 'Alkaid', brightestMag: 1.86, ra: '13h 47m', dec: '+49°', onEcliptic: false, mythology: 'Inuit: The last star in the Big Dipper\'s handle',
			mythologyDetails: {
				figure: 'Alkaid, the star at the end of the Big Dipper\'s handle, is called Kingullirusiq—"the very last one." It trails behind the other caribou (the rest of the Dipper) as they circle the pole.',
				story: 'This is the slowest caribou, always bringing up the rear of the herd. It never catches up, never rests, always following. Some say it\'s an old caribou; others say a young one still learning to keep pace.',
				celestialMeaning: 'As the Big Dipper rotates, Alkaid appears to trail behind, the last to rise over any given horizon point. This positional relationship was noted and named.',
				culturalSignificance: 'Naming individual stars in the Dipper showed detailed attention to the constellation. Each star had character, not just the pattern as a whole.'
			}
		},
		{ name: 'Singuuriq', meaning: 'The Flickering One', abbreviation: 'IN18', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Inuit: Sirius noted for its twinkling when low on horizon',
			mythologyDetails: {
				figure: 'Sirius, when seen low on the southern horizon from Arctic latitudes, twinkles dramatically due to atmospheric effects. This flickering earned it the name Singuuriq—"the flickering one."',
				story: 'The flickering star is said to be laughing, or dancing, or sending signals. Its unsteady light distinguished it from other stars that burn steadily. Some thought it was trying to communicate.',
				celestialMeaning: 'Sirius\'s extreme twinkling near the horizon is an atmospheric effect, but it\'s observationally real. This naming shows careful attention to stellar behavior, not just position.',
				culturalSignificance: 'Noting that different stars behave differently (some twinkle more than others) represents sophisticated observation. The flickering star had personality and mood.'
			}
		},
		{ name: 'Amaqqut', meaning: 'The Wolves', abbreviation: 'IN19', stars: 3, brightest: 'Spica', brightestMag: 0.98, ra: '13h 25m', dec: '-11°', onEcliptic: true, mythology: 'Inuit: Various wolf interpretations in different star groups',
			mythologyDetails: {
				figure: 'Wolves appear in Inuit star lore associated with various star groups. The wolf was respected as a skilled hunter and feared as competition for caribou.',
				story: 'A pack of wolves chased caribou so far that both predators and prey ended up in the sky. Now they hunt eternally. When wolves howl on earth, they\'re calling to their brothers in the stars.',
				celestialMeaning: 'Wolf-associated stars were typically near caribou-associated stars (like the Big Dipper), maintaining the predator-prey relationship in the celestial realm.',
				culturalSignificance: 'Wolves and humans competed for the same prey. Yet wolves were also admired for their hunting skills and pack cooperation. The celestial wolves were powerful spirits.'
			}
		},
		{ name: 'Aurora Borealis (Aqsarniit)', meaning: 'Northern Lights', abbreviation: 'IN20', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Inuit: The Northern Lights as spirits playing, ancestors dancing, or omens',
			mythologyDetails: {
				figure: 'The Aurora Borealis (called Aqsarniit, "those who play ball" or other names) is visible more frequently and intensely in the Arctic than anywhere else. It dominated Inuit astronomical experience.',
				story: 'One widespread belief holds that the aurora is spirits of the dead playing ball with a walrus skull (or sometimes the reverse—walruses playing with a human skull). The lights\' movement resembles a game in progress. Whistling could call the aurora closer; it might be curious or it might be dangerous.',
				celestialMeaning: 'The aurora\'s colors, movement, and sound (some report hearing crackling) were all noted. Its appearance could predict weather changes. Active auroras often preceded storms.',
				culturalSignificance: 'The aurora was one of the most powerful phenomena in Inuit experience. It connected the living to the dead, the earth to the sky. Some groups feared it; others welcomed it as visitation from ancestors.'
			}
		}
	];

	// Celtic Astronomy - Pre-Roman astronomical traditions of Ireland, Britain, and Gaul
	// Much knowledge was oral and lost; what survives comes from archaeological alignments and later medieval texts
	const CELTIC: Constellation[] = [
		{ name: 'Arth Fawr (Great Bear)', meaning: 'Big Dipper/Ursa Major', abbreviation: 'CE1', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Welsh: The Great Bear; associated with King Arthur',
			mythologyDetails: {
				figure: 'The Big Dipper was known as Arth Fawr (the Great Bear) in Welsh tradition. The name "Arthur" itself may derive from the Celtic word for bear (*artos), linking the legendary king to this constellation.',
				story: 'King Arthur, the once and future king, was said to sleep in a cave beneath the stars, waiting to return in Britain\'s hour of greatest need. His constellation circles the pole, never setting, because he never truly dies.',
				celestialMeaning: 'From British latitudes (50-60°N), the Big Dipper is circumpolar—always visible, always circling. This eternal presence suited stories of an undying king.',
				culturalSignificance: 'The Arthurian connection transformed a simple star pattern into a symbol of British identity and hope. Medieval texts elaborated the connection, but it may trace to pre-Roman beliefs about bear-warriors.'
			}
		},
		{ name: 'Cerbyd Arthur', meaning: 'Arthur\'s Chariot/Wagon', abbreviation: 'CE2', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Welsh: The Big Dipper as King Arthur\'s war chariot',
			mythologyDetails: {
				figure: 'An alternative Welsh name for the Big Dipper was Cerbyd Arthur (Arthur\'s Chariot) or Y Cerbyd Mawr (The Great Chariot). The bowl forms the chariot body; the handle is its pole.',
				story: 'Arthur\'s chariot carries him across the sky as he patrols his kingdom. The chariot never stops because threats never stop. Some tales say the chariot will descend when Arthur returns.',
				celestialMeaning: 'The chariot interpretation emphasizes motion—the constellation\'s rotation around the pole suggests a vehicle in motion, patrolling the heavens.',
				culturalSignificance: 'Chariots were symbols of high status in Celtic culture. Iron Age chariot burials show their importance. A celestial chariot befitted a legendary king.'
			}
		},
		{ name: 'Llys Dôn', meaning: 'Court of Dôn', abbreviation: 'CE3', stars: 10, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'Welsh: Cassiopeia as the court of the goddess Dôn',
			mythologyDetails: {
				figure: 'Cassiopeia was called Llys Dôn (the Court of Dôn) in Welsh mythology. Dôn was a mother goddess figure, ancestor of many important deities in the Mabinogi tales.',
				story: 'Dôn holds court in the sky, ruling over her divine children: Gwydion the magician, Arianrhod of the silver wheel, and others. Her W-shaped throne is the constellation itself.',
				celestialMeaning: 'Cassiopeia is opposite the Big Dipper across Polaris, circumpolar from British latitudes. When Arthur\'s chariot is low, Dôn\'s court is high, and vice versa.',
				culturalSignificance: 'Female deities holding celestial courts balanced the male Arthur. Dôn\'s children appear in some of Wales\'s most important mythological tales, linking sky and story.'
			}
		},
		{ name: 'Caer Arianrhod', meaning: 'Castle of Arianrhod', abbreviation: 'CE4', stars: 6, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Welsh: The Corona Borealis as the castle of the silver-wheel goddess',
			mythologyDetails: {
				figure: 'Corona Borealis was called Caer Arianrhod—the castle of Arianrhod, goddess of the silver wheel. The circular crown of stars formed her fortress walls.',
				story: 'Arianrhod, daughter of Dôn, refused to name or arm her son Lleu. From her castle in the sky, she watches over the land. Her name means "silver wheel"—perhaps originally referring to the Moon or to this circlet of stars.',
				celestialMeaning: 'Corona Borealis forms a distinctive semicircular shape, easily seen as a crown or castle wall. Its position near the circumpolar zone kept it visible much of the year from Britain.',
				culturalSignificance: 'Arianrhod represents female power and the consequences of curses. Her story in the Mabinogi is one of the most complex, dealing with legitimacy, naming, and maternal rejection.'
			}
		},
		{ name: 'Caer Gwydion', meaning: 'Castle of Gwydion', abbreviation: 'CE5', stars: 500, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Welsh: The Milky Way as the fortress/path of the magician Gwydion',
			mythologyDetails: {
				figure: 'The Milky Way was called Caer Gwydion—the Castle (or Path) of Gwydion. Gwydion was the great magician of Welsh mythology, son of Dôn and brother of Arianrhod.',
				story: 'Gwydion\'s magic was so powerful that he built a castle stretching across the entire sky. Others say the Milky Way is the path he walks as he performs his magic, or the scattered remains of a magical battle.',
				celestialMeaning: 'The Milky Way\'s band across the sky was substantial enough to merit naming. Its seeming solidity (like a path or wall) suggested structure to ancient observers.',
				culturalSignificance: 'Gwydion\'s tales include creating a woman from flowers (Blodeuwedd) and tricking Arianrhod. His sky-spanning castle matched his grand magical ambitions.'
			}
		},
		{ name: 'Tŵr Tewdws', meaning: 'Pleiades', abbreviation: 'CE6', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: false, mythology: 'Welsh: The Pleiades as the Tower of Tewdws (Theodorus)',
			mythologyDetails: {
				figure: 'The Pleiades were sometimes called Tŵr Tewdws in Welsh—possibly a late Latinization but indicating the cluster was named and tracked.',
				story: 'The cluster\'s visibility in winter made it a calendar marker across Celtic lands. Festivals were timed by its appearance or disappearance.',
				celestialMeaning: 'The Pleiades rise at sunset in November (Samhain season) and set at sunset in May (Beltane season)—the two great fire festivals of the Celtic year.',
				culturalSignificance: 'The Pleiades\' timing with Samhain and Beltane was certainly noticed by Celtic peoples. Stone alignments in Ireland and Britain sometimes point to Pleiades rising/setting positions.'
			}
		},
		{ name: 'Yr Haul (The Sun)', meaning: 'Sun', abbreviation: 'CE7', stars: 1, brightest: 'Sun', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Welsh: The Sun; tracked at solstices through stone monuments',
			mythologyDetails: {
				figure: 'The Sun (Yr Haul in Welsh, Grian in Irish) was central to Celtic religion. The precise tracking of solstices and equinoxes is evident in monuments like Newgrange, Stonehenge, and countless others.',
				story: 'The Sun was often personified as a god or goddess (Lugh, Belenos, Grian). The winter solstice—when the sun "dies" and is "reborn"—was a major festival throughout the Celtic world.',
				celestialMeaning: 'Monuments like Newgrange (Ireland) have passages aligned to the winter solstice sunrise. Stonehenge tracks both solstices. This engineering required sophisticated solar observation.',
				culturalSignificance: 'The Sun\'s journey determined the Celtic year. Fire festivals (Beltane, Samhain) and solar festivals (solstices, equinoxes) structured agricultural and ritual life.'
			}
		},
		{ name: 'Y Lleuad (The Moon)', meaning: 'Moon', abbreviation: 'CE8', stars: 1, brightest: 'Moon', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Welsh: The Moon; goddess associations and calendar keeper',
			mythologyDetails: {
				figure: 'The Moon (Y Lleuad in Welsh, Gealach in Irish) governed Celtic time-keeping. The Celtic calendar was lunar-based, with months beginning at the new moon.',
				story: 'The Moon was associated with goddesses of night, magic, and transformation. Its phases governed planting, harvesting, rituals, and prophecy. The full moon was particularly powerful.',
				celestialMeaning: 'The Coligny Calendar (a Gaulish bronze artifact) shows sophisticated lunar-solar reconciliation. Months were grouped into "bright" and "dark" halves following the moon.',
				culturalSignificance: 'Lunar time-keeping connected Celtic peoples to cycles of growth, death, and renewal. The Moon\'s predictable phases allowed long-term planning and ritual scheduling.'
			}
		},
		{ name: 'Samhain Sky', meaning: 'November Stars', abbreviation: 'CE9', stars: 20, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 36m', dec: '+16°', onEcliptic: false, mythology: 'Celtic: The winter constellations prominent at Samhain (Halloween)',
			mythologyDetails: {
				figure: 'Samhain (October 31-November 1) marked the Celtic new year and the beginning of the dark half. The evening sky at Samhain features the rising Pleiades, Taurus (with red Aldebaran), and the first appearance of Orion.',
				story: 'Samhain was when the boundary between worlds thinned. The dead could visit; the living could glimpse the otherworld. The stars rising at this time were associated with death, ancestors, and transition.',
				celestialMeaning: 'The Pleiades crossing the meridian at midnight on Samhain was a calendar marker in some Celtic regions. The appearance of the "winter stars" announced the season of stories and indoor work.',
				culturalSignificance: 'Modern Halloween descends from Samhain. The timing—when summer\'s stars set and winter\'s rise—marked a fundamental transition, observed through both ritual and astronomical awareness.'
			}
		},
		{ name: 'Beltane Sky', meaning: 'May Stars', abbreviation: 'CE10', stars: 15, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 16m', dec: '+19°', onEcliptic: false, mythology: 'Celtic: The spring/summer constellations prominent at Beltane (May Day)',
			mythologyDetails: {
				figure: 'Beltane (May 1) marked the beginning of summer and the light half of the year. The evening sky features Arcturus high in the east, the Big Dipper overhead, and the last of the winter stars setting.',
				story: 'Beltane was a fire festival celebrating fertility, growth, and the triumph of summer over winter. Cattle were driven between bonfires for purification before being sent to summer pastures.',
				celestialMeaning: 'When the Pleiades set as the sun sets at Beltane, it was a calendar marker. The "summer stars" (including Vega and the Summer Triangle) begin to appear.',
				culturalSignificance: 'Beltane and Samhain were the great hinges of the Celtic year. Both were timed by solar position but also tracked through stellar appearances—integrated astronomical and ritual calendars.'
			}
		},
		{ name: 'Seren y Gogledd', meaning: 'North Star', abbreviation: 'CE11', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Welsh: Polaris as the navigation anchor; associated with sovereignty',
			mythologyDetails: {
				figure: 'Polaris (Seren y Gogledd, "Star of the North") was the fixed point around which the sky turned. In Celtic symbolism, the center—the axis—held special power.',
				story: 'The North Star was the nail upon which the sky hangs, or the hub of the wheel of stars. Kings were metaphorically positioned at the center of their realms as the North Star is at the center of the sky.',
				celestialMeaning: 'From British latitudes, Polaris is about 50-60° above the horizon—high but not overhead. Its position enabled navigation across the Celtic world by land and sea.',
				culturalSignificance: 'Celtic concepts of sacred kingship involved the king as the stable center of society. The North Star provided a celestial metaphor for this terrestrial role.'
			}
		},
		{ name: 'Yr Aradr', meaning: 'The Plough', abbreviation: 'CE12', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'English/Welsh: The Big Dipper as an agricultural plough',
			mythologyDetails: {
				figure: 'In agricultural communities, the Big Dipper was often seen as a plough (Yr Aradr in Welsh, the Plough in English). The bowl is the blade; the handle is the beam.',
				story: 'A celestial plough turns the soil of the sky, preparing it for the seeds of stars. Some said the Milky Way was the furrow left by this plough.',
				celestialMeaning: 'The plough interpretation emphasizes agriculture over hunting (bears, chariots). It reflects the concerns of settled farming communities.',
				culturalSignificance: 'The shift from "bear" or "chariot" to "plough" may reflect changing societies—from warrior aristocracies to agricultural communities. The same stars carried different meanings for different people.'
			}
		},
		{ name: 'Brân\'s Head', meaning: 'Constellation of the Raven King', abbreviation: 'CE13', stars: 5, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'Welsh: Cygnus associated with Brân the Blessed, whose head protected Britain',
			mythologyDetails: {
				figure: 'Cygnus (the Swan) may have been associated with Brân the Blessed in Welsh tradition. Brân means "raven" or "crow"—birds connected to death and prophecy.',
				story: 'In the Mabinogi, Brân\'s severed head was buried under the White Hill in London to protect Britain from invasion. Cygnus, flying along the Milky Way, could represent Brân\'s spirit protecting the land from the sky.',
				celestialMeaning: 'Cygnus lies in the Milky Way and is prominent in summer and autumn. Its cross shape could suggest a head on a pole—Brân\'s talking head that entertained his companions for years.',
				culturalSignificance: 'Brân\'s story is one of sacrifice for protection. A celestial association would extend his protective function to the entire sky, watching over Britain forever.'
			}
		},
		{ name: 'Olwen\'s Track', meaning: 'Path of White Trefoils', abbreviation: 'CE14', stars: 200, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Welsh: The Milky Way as flowers springing from Olwen\'s footsteps',
			mythologyDetails: {
				figure: 'In the tale of Culhwch and Olwen, Olwen is so beautiful that white trefoils (clover) spring up wherever she walks. The Milky Way may be interpreted as her path across the sky.',
				story: 'Olwen, daughter of the giant Ysbaddaden, was sought by Culhwch. Wherever her foot touched the ground, white flowers bloomed. Her walk across the sky left the Milky Way—an eternal trail of blossoms.',
				celestialMeaning: 'The Milky Way\'s misty white appearance could suggest scattered flowers. This interpretation gives the galaxy a feminine, fertile association.',
				culturalSignificance: 'The story of Culhwch and Olwen is one of the oldest Arthurian-adjacent tales. Olwen\'s celestial path connects beauty, fertility, and the heavens.'
			}
		},
		{ name: 'Cŵn Annwn', meaning: 'Hounds of Annwn', abbreviation: 'CE15', stars: 8, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Welsh: Canis Major and Minor as the supernatural hounds of the otherworld',
			mythologyDetails: {
				figure: 'The Cŵn Annwn were the hounds of Annwn (the Welsh otherworld), led by Arawn or Gwyn ap Nudd. The brightest "dog star" Sirius could lead them.',
				story: 'The spectral hounds hunted through the sky and land, especially during winter nights. Their barking was an omen of death. Seeing them meant someone nearby would die.',
				celestialMeaning: 'Canis Major (containing Sirius) appears in winter, when stories of the Wild Hunt were told. The stars were visible during the darkest, most dangerous months.',
				culturalSignificance: 'The Wild Hunt (a spectral hunt across the sky) appears in Celtic, Germanic, and other mythologies. Winter constellations were naturally associated with this fearsome phenomenon.'
			}
		}
	];

	// Norse Astronomy - Old Norse astronomical traditions from Scandinavia and Iceland
	// Much comes from the Eddas, sagas, and archaeological evidence
	const NORSE: Constellation[] = [
		{ name: 'Karlsvagn', meaning: 'Man\'s Wagon/Charles\'s Wagon', abbreviation: 'NO1', stars: 7, brightest: 'Alioth', brightestMag: 1.77, ra: '11h 3m', dec: '+56°', onEcliptic: false, mythology: 'Norse: The Big Dipper as a wagon; later associated with Charlemagne',
			mythologyDetails: {
				figure: 'The Big Dipper was called Karlsvagn (Man\'s Wagon) in Old Norse. After Christianization, "Karl" was sometimes interpreted as Charlemagne, but the name likely predates this.',
				story: 'The wagon carries supplies across the sky, never stopping, never resting. In some versions, it\'s the wagon of Thor or another god, perpetually on a journey through the heavens.',
				celestialMeaning: 'From Scandinavian latitudes (55-70°N), the Big Dipper is high in the sky and circumpolar. It was the most prominent constellation for Norse observers.',
				culturalSignificance: 'Wagons were essential for Norse life—moving goods, people, and the dead. A celestial wagon honored this practical technology while suggesting divine purpose.'
			}
		},
		{ name: 'Þjazi\'s Eyes', meaning: 'Thiazi\'s Eyes', abbreviation: 'NO2', stars: 2, brightest: 'Castor', brightestMag: 1.58, ra: '7h 35m', dec: '+32°', onEcliptic: false, mythology: 'Norse: Castor and Pollux as the eyes of the giant Þjazi',
			mythologyDetails: {
				figure: 'The twin stars Castor and Pollux were known as Þjazi\'s Eyes (Augun Þjaza). Þjazi was a giant who kidnapped the goddess Iðunn and her apples of immortality.',
				story: 'When the gods rescued Iðunn, Þjazi pursued in the form of an eagle. The gods lit fires that burned his wings; he fell and was killed. Odin took his eyes and threw them into the sky, where they shine as twin stars.',
				celestialMeaning: 'Castor and Pollux are close together and similar in brightness—natural eyes. They\'re visible in the winter sky when Norse nights were longest.',
				culturalSignificance: 'This myth explains both the stars and why gods might be wary of giants. Þjazi\'s eyes watch from the sky, reminding the gods of their old enemy.'
			}
		},
		{ name: 'Frigg\'s Distaff (Friggerock)', meaning: 'Orion\'s Belt', abbreviation: 'NO3', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Norse: Orion\'s Belt as the goddess Frigg\'s spinning tool',
			mythologyDetails: {
				figure: 'Orion\'s Belt was called Friggerock (Frigg\'s Distaff) in Scandinavian tradition. Frigg, Odin\'s wife, was associated with spinning, weaving, and household crafts.',
				story: 'Frigg spins the clouds and fates in her hall Fensalir. Her distaff in the sky reminds women of their work and honors the craft of spinning. The three stars are the rod around which wool is wound.',
				celestialMeaning: 'Orion\'s Belt\'s three aligned stars naturally suggest a rod or staff. Its winter visibility coincided with the indoor season when spinning and weaving were done.',
				culturalSignificance: 'Textile production was essential and respected in Norse society. Associating a constellation with Frigg\'s distaff honored both the goddess and women\'s labor.'
			}
		},
		{ name: 'Loki\'s Brand', meaning: 'Sirius', abbreviation: 'NO4', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Norse: Sirius as the torch or brand carried by the trickster Loki',
			mythologyDetails: {
				figure: 'Sirius may have been called Lokabrenna (Loki\'s Brand or Loki\'s Torch) in Old Norse. The trickster god carries fire through the sky, causing mischief.',
				story: 'Loki, bound for his crimes against Baldr, struggles in his chains. His torch is visible in the sky—a reminder of his existence and the chaos he represents. Some say when Sirius twinkles strongly, Loki is struggling.',
				celestialMeaning: 'Sirius\'s flickering when low on the horizon could suggest a wavering torch. Its brilliant blue-white light is the brightest of any star.',
				culturalSignificance: 'Associating the brightest star with the most famous trickster gave it a dangerous, unpredictable character. Loki\'s torch illuminates but also threatens.'
			}
		},
		{ name: 'Veðrfölnir', meaning: 'Weather-Pale', abbreviation: 'NO5', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Norse: The hawk sitting between the eagle\'s eyes on Yggdrasil',
			mythologyDetails: {
				figure: 'In Norse cosmology, an eagle sits at the top of Yggdrasil (the World Tree), and a hawk named Veðrfölnir sits between its eyes. Polaris, at the center of the sky, may represent this hawk.',
				story: 'Veðrfölnir watches everything from his position at the top of the World Tree. The sky rotates around him as the tree branches spread. He sees all but says nothing.',
				celestialMeaning: 'Polaris\'s position at the celestial pole—the point around which the sky turns—matches the hawk\'s position at the top of the cosmic axis.',
				culturalSignificance: 'The World Tree connected all nine worlds. Its apex, where the hawk sits, is the center of everything—appropriately marked by the pole star.'
			}
		},
		{ name: 'Bifröst', meaning: 'Rainbow Bridge', abbreviation: 'NO6', stars: 500, brightest: 'Multiple', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Norse: The Milky Way as the burning rainbow bridge to Asgard',
			mythologyDetails: {
				figure: 'The Milky Way was one interpretation of Bifröst—the burning rainbow bridge connecting Midgard (Earth) to Asgard (realm of the gods). The bridge burns constantly but never collapses.',
				story: 'Heimdallr guards Bifröst, watching for giants who might attempt to cross. The bridge will finally break at Ragnarök when the fire giants march across it to battle the gods.',
				celestialMeaning: 'The Milky Way stretches across the sky like a bridge. Its faint glow could suggest burning or shimmering, fitting the "burning rainbow" description.',
				culturalSignificance: 'The connection between Earth and the realm of gods was a bridge—suggesting travel, not simply separation. The gods could visit; heroes could ascend.'
			}
		},
		{ name: 'Sól', meaning: 'Sun Goddess', abbreviation: 'NO7', stars: 1, brightest: 'Sun', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Norse: The Sun as a goddess chased by wolves',
			mythologyDetails: {
				figure: 'Sól (or Sunna) was the Norse Sun goddess, driving her chariot across the sky. She was pursued by the wolf Sköll, who will finally catch her at Ragnarök.',
				story: 'Sól races across the sky each day, her horses sweating from the heat. The wolf Sköll runs behind her, snapping at her heels. During solar eclipses, the wolf catches up and takes a bite.',
				celestialMeaning: 'The Sun\'s journey from east to west was a chase. Solar eclipses were terrifying—the wolf was succeeding. People would make noise to drive the wolf away.',
				culturalSignificance: 'The Sun\'s importance in Scandinavia—with extreme seasonal variation—was immense. Midsummer was a major celebration; midwinter marked the Sun\'s return.'
			}
		},
		{ name: 'Máni', meaning: 'Moon God', abbreviation: 'NO8', stars: 1, brightest: 'Moon', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Norse: The Moon as a god chased by a wolf',
			mythologyDetails: {
				figure: 'Máni was the Norse Moon god, brother of Sól. He drove the moon\'s chariot across the night sky, pursued by the wolf Hati, who will catch him at Ragnarök.',
				story: 'Máni stole two children, Bil and Hjúki, from Earth—they can sometimes be seen on the Moon\'s face. The wolf Hati runs behind him. Lunar eclipses showed Hati gaining ground.',
				celestialMeaning: 'The Moon\'s phases were Máni\'s varying distance from the wolf. Full moon meant he had pulled ahead; new moon meant the wolf was close.',
				culturalSignificance: 'Moon and Sun as siblings (often with opposite genders from Mediterranean traditions) reflected Norse concepts of balance and paired forces.'
			}
		},
		{ name: 'Aurvandil\'s Toe', meaning: 'Morning Star', abbreviation: 'NO9', stars: 1, brightest: 'Venus', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Norse: Venus as the frozen toe of the hero Aurvandil',
			mythologyDetails: {
				figure: 'The morning star (Venus) was called Aurvandil\'s Toe in Norse mythology. Aurvandil was a hero carried across icy rivers by Thor.',
				story: 'Thor carried Aurvandil across the river Élivágar in a basket. One toe stuck out and froze. Thor broke it off and threw it into the sky, where it became a bright star. Aurvandil\'s wife Gróa saw it and knew her husband would return.',
				celestialMeaning: 'Venus as morning star appears in the east before dawn—a signal that day is coming. For a wife watching for her husband\'s return, this bright star would be a hopeful sign.',
				culturalSignificance: 'This unusual myth explains a star through bodily sacrifice—losing a toe for a journey. It connects the mundane (frostbite) with the cosmic (bright stars).'
			}
		},
		{ name: 'Dáin and Dvalinn', meaning: 'Stags on Yggdrasil', abbreviation: 'NO10', stars: 2, brightest: 'Castor', brightestMag: 1.58, ra: '7h 35m', dec: '+32°', onEcliptic: false, mythology: 'Norse: Four stags that eat Yggdrasil\'s leaves; two may be star-associated',
			mythologyDetails: {
				figure: 'Four stags—Dáin, Dvalinn, Duneyrr, and Duraþrór—eat the leaves of Yggdrasil. Some scholars suggest pairs of stars represented these beings.',
				story: 'The stags constantly devour the World Tree\'s leaves, but the tree continually regenerates. This cycle of consumption and renewal keeps the cosmos in balance.',
				celestialMeaning: 'The stags may represent star pairs or meteor activity ("eating" the sky). Their names appear in kennings for warriors and may connect to battle-fallen.',
				culturalSignificance: 'The ecology of Yggdrasil—with creatures consuming and maintaining it—presented a cosmos of cycles rather than stasis. Stars participated in this cosmic metabolism.'
			}
		},
		{ name: 'Hvergelmir Stars', meaning: 'Stars above the Cold Spring', abbreviation: 'NO11', stars: 10, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Norse: Stars near the northern horizon associated with Hvergelmir, the cold spring',
			mythologyDetails: {
				figure: 'Hvergelmir was the spring beneath the root of Yggdrasil that extended into Niflheim (world of ice). Stars low on the northern horizon—perhaps circumpolar stars when at their lowest—could be associated with this realm.',
				story: 'Rivers flow from Hvergelmir, and the dragon Níðhöggr gnaws the root above it. The cold stars of the north reminded observers of this frozen realm.',
				celestialMeaning: 'In Scandinavian latitudes, northern horizon stars could seem to "dip into" the earth before rising again—as if drawing from a spring below.',
				culturalSignificance: 'Norse cosmology placed cold in the north. Northern stars, always low and cold-seeming, matched this geography of the imagination.'
			}
		},
		{ name: 'Irminsul', meaning: 'Great Pillar', abbreviation: 'NO12', stars: 15, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Germanic: The axis of the world represented by the pole star region',
			mythologyDetails: {
				figure: 'The Irminsul was a sacred pillar worshipped by continental Germanic peoples (especially the Saxons). It represented the axis mundi—the world pillar. The pole star region, around which the sky turns, was the celestial equivalent.',
				story: 'The Irminsul held up the sky. When Charlemagne destroyed the physical Irminsul (a sacred tree or pillar) in 772, the Germans lost their central sacred object—but the celestial axis remained.',
				celestialMeaning: 'The sky appears to rotate around the celestial pole. A world-pillar at that position would "hold up" the turning sky, preventing it from falling.',
				culturalSignificance: 'The destruction of the Irminsul was a key moment in the Christianization of the Saxons. But the concept of a world-axis connecting Earth and sky persisted in stories of Yggdrasil.'
			}
		},
		{ name: 'Ragnarök Omens', meaning: 'End-Time Stars', abbreviation: 'NO13', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Norse: Celestial signs of the coming end—the sun and moon devoured',
			mythologyDetails: {
				figure: 'Ragnarök prophecies describe celestial events: the Sun and Moon swallowed by wolves, stars falling from the sky, the heavens splitting open. These were the ultimate bad omens.',
				story: 'Before Ragnarök, Fimbulwinter brings three years of cold without summer. The Sun and Moon go dark as Sköll and Hati catch them. Stars fall. The World Tree shakes. Then the final battle begins.',
				celestialMeaning: 'Solar and lunar eclipses, meteor showers, and comets could all be interpreted as Ragnarök warnings. Such events caused fear but also confirmed the mythology.',
				culturalSignificance: 'Norse mythology uniquely included a prophecy of its own gods\' death. Ragnarök was not to be prevented but endured. The cosmos would end and be reborn.'
			}
		},
		{ name: 'Ginnungagap', meaning: 'The Yawning Void', abbreviation: 'NO14', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Norse: The primordial void between fire and ice; dark regions of the sky',
			mythologyDetails: {
				figure: 'Before creation, there was Ginnungagap—the yawning void between fiery Muspelheim and icy Niflheim. Dark patches in the sky, away from the Milky Way, could represent this primordial emptiness.',
				story: 'In Ginnungagap, fire and ice met. Their meeting created mist, which formed into the primordial giant Ymir. From Ymir\'s body, the gods created the worlds. The void is the background of creation.',
				celestialMeaning: 'The darker regions of the night sky—empty of Milky Way glow—could represent Ginnungagap. The void is not nothing; it\'s the potential for everything.',
				culturalSignificance: 'Norse creation mythology begins with contrast (fire/ice) meeting in emptiness. This suggests creation requires difference and space—a surprisingly sophisticated cosmogony.'
			}
		},
		{ name: 'Naglfar Star Signs', meaning: 'Ship of the Dead', abbreviation: 'NO15', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Norse: Stars associated with Naglfar, the ship made of dead men\'s nails',
			mythologyDetails: {
				figure: 'Naglfar is the ship that will carry the forces of chaos to battle at Ragnarök. It\'s made from the fingernails and toenails of the dead. Certain star patterns may have been associated with this ominous vessel.',
				story: 'The dead must have their nails trimmed before burial, or their nails add to Naglfar\'s construction. When the ship is complete, Ragnarök begins. Every death contributes to the end.',
				celestialMeaning: 'Ship-shaped asterisms (Lyra\'s lyre could be a boat) might have been associated with Naglfar. The ship sails through the sky toward the final battle.',
				culturalSignificance: 'The grim practicality—trim the dead\'s nails to delay doomsday—shows how mythology penetrated daily life. Every funeral was a small delay of the end.'
			}
		}
	];

	// EGYPTIAN CONSTELLATIONS - Ancient Egypt's sophisticated astronomical tradition
	const EGYPTIAN: Constellation[] = [
		{ name: 'Sah (Orion)', meaning: 'The Soul of Osiris', abbreviation: 'EG01', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 35m', dec: '-1°', onEcliptic: false, mythology: 'Egyptian: Osiris in the heavens, ruler of the afterlife',
			mythologyDetails: {
				figure: 'Sah was the celestial form of Osiris, god of the dead and resurrection. The constellation represented him striding across the sky, leading souls to the afterlife. His appearance heralded the Nile flood.',
				story: 'Osiris was murdered by his brother Set, dismembered, and scattered. Isis reassembled him, and he became lord of the underworld. His constellation rises, dies (sets), and is reborn each night—mimicking his myth.',
				celestialMeaning: 'The heliacal rising of Sah coincided with the Nile inundation, the source of Egypt\'s agricultural prosperity. Osiris rising from the underworld brought the life-giving flood.',
				culturalSignificance: 'The Pyramid Texts describe the pharaoh\'s soul ascending to join Sah. The Giza pyramids\' shaft alignments may point to this constellation, creating a pathway for the royal soul.'
			}
		},
		{ name: 'Sopdet (Sirius)', meaning: 'The Sharp One', abbreviation: 'EG02', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Egyptian: Isis as the brightest star, herald of the flood',
			mythologyDetails: {
				figure: 'Sopdet was the deification of Sirius and the celestial form of Isis, wife of Osiris. She was shown as a woman with a star on her head or as a cow. Her appearance was the most important astronomical event in Egypt.',
				story: 'For 70 days, Sopdet was invisible below the horizon (like Osiris in the underworld). Her heliacal rising marked the New Year and the imminent Nile flood—Isis\'s tears of grief for Osiris.',
				celestialMeaning: 'The heliacal rising of Sirius (mid-July) predicted the Nile flood with remarkable accuracy. This practical utility made Sopdet the foundation of the Egyptian calendar.',
				culturalSignificance: 'The Sothic cycle—1,460 years for the civil calendar and Sirius rising to realign—allowed modern Egyptologists to establish absolute chronologies of Egyptian history.'
			}
		},
		{ name: 'Meskhetiu', meaning: 'The Bull\'s Thigh', abbreviation: 'EG03', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'Egyptian: The Big Dipper as the severed leg of Set',
			mythologyDetails: {
				figure: 'The Bull\'s Thigh (our Big Dipper/Ursa Major) represented the foreleg of Set, god of chaos, severed by Horus in their battle for Egypt\'s throne. It was also seen as an adze used in the Opening of the Mouth ceremony.',
				story: 'After Set murdered Osiris, Horus fought him for 80 years. In one battle, Horus cut off Set\'s leg and cast it into the sky, where it circles endlessly, never setting (in Egyptian latitudes).',
				celestialMeaning: 'As a circumpolar constellation, it never "died" by setting. This made it a symbol of eternal life—the defeated chaos god forever trapped in the sky.',
				culturalSignificance: 'Depictions show Isis as a hippo goddess holding the Thigh on a chain, preventing it from attacking Osiris/Sah. The deceased was promised to never be "given to the Bull\'s Thigh."'
			}
		},
		{ name: 'Nut\'s Body', meaning: 'The Sky Goddess', abbreviation: 'EG04', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: The Milky Way as Nut\'s star-covered body',
			mythologyDetails: {
				figure: 'Nut was the sky itself—her body arched over the earth, hands and feet touching the horizons, covered in stars. She swallowed the sun each evening and gave birth to it each morning.',
				story: 'Nut married her brother Geb (Earth) against Ra\'s wishes. Ra forbade her from giving birth on any day of the year. Thoth gambled with the Moon and won five extra days, during which Nut bore Osiris, Isis, Set, Nephthys, and Horus.',
				celestialMeaning: 'The Milky Way traced the length of Nut\'s body. Stars were either painted on her skin or were other celestial souls passing through her. The sun\'s daily cycle was her eternal pregnancy.',
				culturalSignificance: 'Nut appears on countless coffin lids, promising to embrace and protect the deceased. The dead were said to enter her mouth with the sun and be reborn from her at dawn.'
			}
		},
		{ name: 'Wepet Renpet', meaning: 'Opening of the Year', abbreviation: 'EG05', stars: 3, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: Decan stars that marked the new year',
			mythologyDetails: {
				figure: 'Wepet Renpet was a festival goddess representing the New Year, linked to specific stars that rose heliacally at the year\'s start. She was shown as a woman with the hieroglyph for "year" on her head.',
				story: 'The Egyptian year began with Sopdet\'s heliacal rising. Wepet Renpet personified this moment of renewal—when time reset, chaos was pushed back, and ma\'at (cosmic order) was restored.',
				celestialMeaning: 'The decans—36 star groups that rose heliacally through the year—tracked the calendar. Wepet Renpet was the decan of renewal, specifically tied to the first appearance of Sirius.',
				culturalSignificance: 'New Year was celebrated with festivals and the lifting of taboos. The "Opening of the Year" was when the king\'s power was renewed and the cosmic cycle began again.'
			}
		},
		{ name: 'The Decan Stars', meaning: 'Time-Keeping Stars', abbreviation: 'EG06', stars: 36, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Egyptian: 36 star groups that divided the year and night',
			mythologyDetails: {
				figure: 'The decans were 36 star groups, each ruling 10 days of the year and one hour of the night. They were depicted as gods, often with star-topped heads, marching in procession across coffin lids.',
				story: 'Each decan rose heliacally, ruled the year for 10 days, then "died" for 70 days while below the horizon (like Osiris in the underworld). They were guides for the dead through the night sky.',
				celestialMeaning: 'This system created the 360-day year (plus 5 extra days), the 12-hour night, and influenced Babylonian zodiac development. It\'s the ancestor of the 12 zodiac signs.',
				culturalSignificance: 'Decan ceilings in tombs (like Senenmut\'s) showed the cosmos. The dead needed to know the decans to navigate the afterlife. Each decan was also a protective deity.'
			}
		},
		{ name: 'The Imperishable Stars', meaning: 'Ikhemu-Sek', abbreviation: 'EG07', stars: 0, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Egyptian: Circumpolar stars that never set',
			mythologyDetails: {
				figure: 'The Imperishable Stars (ikhemu-sek) were the circumpolar stars that never "died" by setting below the horizon. They represented the eternal blessed dead who had achieved immortality.',
				story: 'The pharaoh\'s soul was promised a place among the Imperishable Stars. Unlike the decans that rose and set (dying and being reborn), these stars endured forever—the ultimate afterlife.',
				celestialMeaning: 'From Egyptian latitudes, stars within ~25° of the pole never set. This observable phenomenon was given theological significance: some souls achieve eternal, unchanging existence.',
				culturalSignificance: 'The Great Pyramid\'s northern shaft may align to these stars, providing a path for the pharaoh\'s ba (soul) to join them. Being "imperishable" was the highest afterlife goal.'
			}
		},
		{ name: 'The Indestructible Stars', meaning: 'Ikhemu-Wredj', abbreviation: 'EG08', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: Stars that rise and set but always return',
			mythologyDetails: {
				figure: 'The Indestructible Stars (ikhemu-wredj) were stars that set (died) but always rose again (were reborn). This included the decans, Sah, Sopdet, and all non-circumpolar stars.',
				story: 'These stars followed Osiris\'s pattern: death and resurrection. The deceased could join them, experiencing cyclical rebirth rather than static eternity. Different afterlife, different glory.',
				celestialMeaning: 'The distinction between circumpolar and rising/setting stars was fundamental to Egyptian theology. It created two categories of blessed existence: eternal stasis or eternal rebirth.',
				culturalSignificance: 'Coffin texts offer the deceased both options. The choice between unchanging eternity and cyclical renewal reflects deep philosophical questions about the nature of immortality.'
			}
		},
		{ name: 'The Aten', meaning: 'The Sun Disk', abbreviation: 'EG09', stars: 1, brightest: 'Sun', brightestMag: -26.74, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Egyptian: The solar disk itself, later the monotheistic god',
			mythologyDetails: {
				figure: 'The Aten was the visible sun disk, rays ending in hands offering ankhs (life). Under Akhenaten, it became the sole god. After Akhenaten\'s death, traditional gods were restored.',
				story: 'Akhenaten (Amenhotep IV) elevated the Aten above all gods, closing temples, defacing names of Amun, and building a new capital at Akhetaten. His religious revolution lasted only one generation.',
				celestialMeaning: 'The Aten represented the visible, physical sun rather than the sun-god Ra. Akhenaten\'s focus on the observable disk may reflect early scientific or naturalistic thinking.',
				culturalSignificance: 'Sometimes called the first monotheism, Atenism preceded Israelite monotheism. Its quick suppression shows the power of traditional Egyptian priesthoods and the state\'s religious conservatism.'
			}
		},
		{ name: 'Khepri', meaning: 'The Morning Sun', abbreviation: 'EG10', stars: 1, brightest: 'Sun', brightestMag: -26.74, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Egyptian: The rising sun as a scarab beetle',
			mythologyDetails: {
				figure: 'Khepri was the morning sun, depicted as a scarab beetle or a man with a scarab head. The beetle rolling a dung ball mirrored the sun rolling across the sky.',
				story: 'Khepri was self-created, emerging from the primordial chaos. Each morning, he was "reborn" from Nut. By noon he became Ra, by evening Atum. Three gods, one sun, one day.',
				celestialMeaning: 'The scarab emerged from dung (seemingly from nothing) as the sun emerged from the horizon. This natural phenomenon was proof of the sun\'s self-generating, eternal nature.',
				culturalSignificance: 'Scarab amulets were the most common Egyptian charm, placed over the heart of mummies. The heart scarab ensured the heart wouldn\'t testify against the deceased in judgment.'
			}
		},
		{ name: 'Seshat\'s Stars', meaning: 'Goddess of Writing', abbreviation: 'EG11', stars: 7, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: Stars used for temple foundation alignments',
			mythologyDetails: {
				figure: 'Seshat was goddess of writing, measurement, and temple foundation rituals. She wore a seven-pointed star or flower on her head. With the pharaoh, she "stretched the cord" to align temples to the stars.',
				story: 'The "stretching of the cord" ceremony used stellar observations to align temples precisely. Seshat and the king would sight stars (often in Meskhetiu) to establish the sacred north axis.',
				celestialMeaning: 'Egyptian temples were astronomically aligned—to cardinal directions, to solstice sunrises, or to specific stars. Seshat\'s ritual ensured cosmic harmony in architecture.',
				culturalSignificance: 'This ceremony shows that Egyptian astronomy wasn\'t just mythology but practical science. Temple alignments can be verified today, confirming ancient astronomical knowledge.'
			}
		},
		{ name: 'Hathor as Evening Star', meaning: 'Lady of Stars', abbreviation: 'EG12', stars: 1, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Egyptian: Venus as the beautiful goddess Hathor',
			mythologyDetails: {
				figure: 'Hathor, goddess of love, beauty, and joy, was associated with Venus. She was shown as a cow or a woman with cow ears. As the evening star, she welcomed the dead to the afterlife.',
				story: 'Hathor once nearly destroyed humanity at Ra\'s command, but was tricked into drinking beer dyed red like blood. She fell asleep and humanity survived. Her dual nature—gentle and destructive—matched Venus.',
				celestialMeaning: 'Venus\'s dual appearance as morning and evening star may have connected to Hathor\'s dual nature. Her beauty dominated the twilight sky as she dominated among the gods.',
				culturalSignificance: 'The Temple of Hathor at Dendera contains a famous zodiac ceiling. Hathor was goddess of the western mountains where the sun set—she welcomed Ra and the dead each evening.'
			}
		},
		{ name: 'Anubis Stars', meaning: 'The Jackal Guide', abbreviation: 'EG13', stars: 3, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: Stars associated with Anubis, embalmer of the dead',
			mythologyDetails: {
				figure: 'Anubis, the jackal-headed god, presided over embalming and guided souls to judgment. Certain stars near the horizon, where jackals roamed at night, may have been his celestial domain.',
				story: 'Anubis embalmed Osiris after his murder and invented mummification. He guides the dead through the underworld and weighs their hearts against Ma\'at\'s feather.',
				celestialMeaning: 'Jackals prowled the desert edges where the dead were buried. Stars low on the horizon, in the "desert" of the sky, belonged to this liminal god between life and death.',
				culturalSignificance: 'Anubis\'s role evolved from chief death god to Osiris\'s assistant, showing how Egyptian religion changed over millennia. His astronomical associations are less documented than other gods.'
			}
		},
		{ name: 'Thoth\'s Ibis', meaning: 'Moon God & Wisdom', abbreviation: 'EG14', stars: 5, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Egyptian: Stars associated with Thoth, god of the moon and knowledge',
			mythologyDetails: {
				figure: 'Thoth, the ibis-headed god, was lord of the moon, wisdom, writing, and magic. He recorded the judgment of the dead and maintained the cosmic balance. His curved ibis beak resembled the crescent moon.',
				story: 'Thoth gambled with the Moon and won 1/72nd of its light, creating five extra days for Nut to bear her children. He invented writing and gave hieroglyphs to humanity.',
				celestialMeaning: 'The Moon was Thoth\'s primary celestial association. His monthly cycle of waxing and waning represented the eternal return of knowledge and the measurement of time.',
				culturalSignificance: 'Thoth was the divine scribe who recorded the weighing of hearts. He gave humanity the gifts of science and writing—the means to preserve knowledge beyond individual lives.'
			}
		},
		{ name: 'The Duat', meaning: 'The Underworld Sky', abbreviation: 'EG15', stars: 0, brightest: 'N/A', ra: 'N/A', dec: 'N/A', onEcliptic: false, mythology: 'Egyptian: The realm below the horizon where stars and sun traveled',
			mythologyDetails: {
				figure: 'The Duat was the underworld through which Ra traveled at night and the dead journeyed to judgment. It was depicted as a star-filled realm beneath the earth, mirroring the sky above.',
				story: 'Each night, Ra entered the Duat through the western horizon, traveled through 12 hours/regions, battled the chaos serpent Apophis, and emerged reborn in the east. The dead followed this path.',
				celestialMeaning: 'The Duat was literally "where the stars go" when they set. It was both underworld and a continuation of the sky—the cosmos wrapped completely around the earth.',
				culturalSignificance: 'The Books of the Dead (actually "Books of Coming Forth by Day") were guides to the Duat. Knowing the names of its gates and guardians was essential for the soul\'s successful journey.'
			}
		}
	];

	// AFRICAN CONSTELLATIONS - Sub-Saharan African astronomical traditions
	const AFRICAN: Constellation[] = [
		{ name: 'Dogon\'s Sirius', meaning: 'Po Tolo & Sigi Tolo', abbreviation: 'AF01', stars: 2, brightest: 'Sirius A', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Dogon: Complex knowledge of Sirius and its companion',
			mythologyDetails: {
				figure: 'The Dogon of Mali have detailed knowledge of Sirius (Sigi Tolo) and its white dwarf companion (Po Tolo), calling it the "smallest and heaviest" star. This knowledge, recorded before Western confirmation, remains debated.',
				story: 'Dogon mythology describes beings called Nommo who came from the Sirius system. The 50-year Sigi ceremony celebrates Sirius B\'s orbital period. Whether this represents ancient knowledge or recent adoption is contested.',
				celestialMeaning: 'Sirius B is invisible to the naked eye and was only confirmed in 1862. Dogon claims about its properties have sparked debates about ancient astronomical knowledge versus modern influence.',
				culturalSignificance: 'Regardless of origin, the Dogon Sirius tradition shows how central stars can be to African cosmologies. Sirius\'s importance spans Africa from Egypt to Mali to the Khoisan peoples.'
			}
		},
		{ name: 'The Zulu Sky', meaning: 'Amazulu Cosmology', abbreviation: 'AF02', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Zulu: Stars as the eyes of the ancestors watching over the living',
			mythologyDetails: {
				figure: 'In Zulu tradition, stars (izinkanyezi) are the eyes of the ancestors. The sky at night reveals that the dead continue to watch over and guide the living. Each star is a departed soul.',
				story: 'The creator Unkulunkulu placed the first humans on Earth. When people die, they join the sky as stars, becoming part of the great assembly of ancestors who influence earthly affairs.',
				celestialMeaning: 'The more stars visible, the more ancestors are watching. Bright stars are the most honored ancestors. The Milky Way is the path they travel.',
				culturalSignificance: 'Ancestor veneration is central to Zulu spirituality. The star-ancestors provide guidance, demand respect through proper ritual, and must be consulted for major decisions.'
			}
		},
		{ name: 'isiLimela', meaning: 'The Pleiades', abbreviation: 'AF03', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'Zulu/Xhosa: The Digging Stars that signal planting season',
			mythologyDetails: {
				figure: 'IsiLimela (the Digging Stars) is the Pleiades cluster, which rises in June in the Southern Hemisphere. Its appearance signals time to begin preparing fields for planting.',
				story: 'When isiLimela appears, the earth warms enough to dig. The stars are sometimes seen as a group of boys who climbed to heaven to escape hunger, or as the wives of great chiefs.',
				celestialMeaning: 'The heliacal rising of the Pleiades (their reappearance after being lost in the sun\'s glare) was a practical calendar marker across Africa, from the Nguni peoples to the Dogon.',
				culturalSignificance: 'Agricultural societies needed reliable seasonal markers. The Pleiades\' visibility was consistent enough to base planting schedules on, integrating astronomy into food security.'
			}
		},
		{ name: 'Sotho Milky Way', meaning: 'Molalatladi - Lightning Path', abbreviation: 'AF04', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Sotho: The Milky Way as the path of lightning',
			mythologyDetails: {
				figure: 'The Sotho and Tswana peoples call the Milky Way "Molalatladi" (lightning\'s sleeping place) or the path where lightning walks. It stretches across the sky like a celestial river of light.',
				story: 'Lightning, a powerful force associated with the supreme being, travels along this path. The Milky Way connects sky and earth, the divine and mundane realms.',
				celestialMeaning: 'The Milky Way\'s band of light suggested a pathway or road. Different African cultures saw it as routes for ancestors, animals, or supernatural forces.',
				culturalSignificance: 'Lightning was both feared and revered in southern African cultures. Linking it to the Milky Way elevated the galaxy to a conduit for divine power.'
			}
		},
		{ name: 'The San Eland', meaning: 'Hunters\' Sky', abbreviation: 'AF05', stars: 4, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'San (Bushmen): Orion\'s belt as the zebras, chased by the lion',
			mythologyDetails: {
				figure: 'The San people of southern Africa see Orion\'s Belt as three zebras. The nearby stars form a lion stalking them. The sky is an eternal hunt, frozen in starlight.',
				story: 'The lion pursues but never catches the zebras. This eternal chase reflects the balance of hunter and hunted that dominated San life. The hunt sustains but never ends.',
				celestialMeaning: 'Hunter-gatherer peoples often projected their way of life onto the sky. The successful hunt—surviving without killing all the prey—was cosmic principle as well as survival strategy.',
				culturalSignificance: 'San rock art shows deep spiritual connection to animals. Their astronomy mirrors their art: animals and hunters in relationship, frozen in eternal, meaningful motion.'
			}
		},
		{ name: 'Khoi Stars', meaning: 'Star Lore of the Khoi', abbreviation: 'AF06', stars: 3, brightest: 'Canopus', brightestMag: -0.74, ra: '6h 24m', dec: '-53°', onEcliptic: false, mythology: 'Khoikhoi: Canopus as the star of the ants',
			mythologyDetails: {
				figure: 'The Khoikhoi (Hottentots) called Canopus the "ant egg star" or star that brings the season of ant larvae. Its heliacal rising marked when ant larvae (a food source) became available.',
				story: 'Canopus\'s appearance signaled time to gather ant larvae, a protein-rich food. The star was practical: it told people when to look for specific foods.',
				celestialMeaning: 'Canopus, the second-brightest star, was visible in the Southern Hemisphere as a major seasonal marker. Different cultures keyed different events to its rising.',
				culturalSignificance: 'Indigenous astronomical knowledge was often practical and ecological, tied to food availability, animal migrations, and seasonal resources. Stars were a survival calendar.'
			}
		},
		{ name: 'The Tswana Lion', meaning: 'Naka - The Horn', abbreviation: 'AF07', stars: 5, brightest: 'Aldebaran', brightestMag: 0.85, ra: '4h 36m', dec: '+17°', onEcliptic: true, mythology: 'Tswana: The Hyades as the face of a lion',
			mythologyDetails: {
				figure: 'The Tswana see the V-shaped Hyades cluster (with bright Aldebaran) as Naka, the Lion. The V-shape suggests a lion\'s face or horns. The nearby Pleiades are the wives of the lion.',
				story: 'Naka the Lion watches over the sky. His wives (Pleiades) walk behind him. When they rise together, it signals seasonal change and time for certain activities.',
				celestialMeaning: 'The visual pattern of the Hyades—a V with a bright star—suggested a face to many cultures. The Tswana lion interpretation connects to the importance of lions in southern African life.',
				culturalSignificance: 'Lions were both threat and symbol of power. A lion in the sky was a guardian, a king watching over the land. Chiefs were often associated with lion imagery.'
			}
		},
		{ name: 'The Cattle Stars', meaning: 'Pastoral Astronomy', abbreviation: 'AF08', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Pan-African: Stars as celestial herds among pastoral peoples',
			mythologyDetails: {
				figure: 'Across pastoral Africa (Maasai, Dinka, Fulani), stars are often seen as cattle. The sky is a great pasture where celestial herds graze. Comets are stray cattle; the Milky Way is the herd\'s path.',
				story: 'Cattle are central to pastoral African identity. The sky\'s cattle reflect the earthly herds: the wealth, identity, and spiritual connection that real cattle represent.',
				celestialMeaning: 'For cattle-keeping peoples, projecting herds onto the sky was natural. The night sky moving in orderly patterns mirrored well-managed livestock.',
				culturalSignificance: 'Among the Dinka, the first cattle came from the sky. The celestial cattle are the originals; earthly herds are their reflections. This inverts the usual metaphor direction.'
			}
		},
		{ name: 'Borana Calendar', meaning: 'Ethiopian Time-Keeping', abbreviation: 'AF09', stars: 7, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Borana: Sophisticated lunar-stellar calendar system',
			mythologyDetails: {
				figure: 'The Borana people of Ethiopia and Kenya developed a sophisticated calendar combining lunar months with observations of seven stars/asterisms. Their ayantu (astronomer-priests) maintained this system.',
				story: 'Borana tradition says the calendar was discovered in the distant past. The ayantu pass knowledge orally through generations. The system coordinates ceremonies, pastoral movements, and agriculture.',
				celestialMeaning: 'The Borana observe seven stars (including the Pleiades, Orion\'s Belt, and specific bright stars) in combination with moon phases to track a 12-month, 354-day year.',
				culturalSignificance: 'This system, documented by researchers like Bassi and Doyle, shows independent African development of complex astronomical calendrics, comparable to any ancient civilization.'
			}
		},
		{ name: 'Nyambe\'s Fire', meaning: 'The Lozi Sun God', abbreviation: 'AF10', stars: 1, brightest: 'Sun', brightestMag: -26.74, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Lozi: The sun as the eye of the creator god',
			mythologyDetails: {
				figure: 'Among the Lozi (Barotse) of Zambia, Nyambe is the creator god who once lived on earth but fled to the sky to escape humans. The sun is his eye or his fire, watching the world below.',
				story: 'Nyambe created humans, but they copied everything he did, including killing. He fled to the sky, crossing a spider\'s web. Humans tried to build a tower to follow him (echoing Babel) but failed.',
				celestialMeaning: 'The sun\'s daily passage shows Nyambe watching over creation. At night, he rests; at dawn, his eye reopens. The sun\'s heat is evidence of his power.',
				culturalSignificance: 'The motif of a withdrawn sky god is common across Africa. The sun becomes the sign of divine presence without direct intervention—god watches but no longer walks among us.'
			}
		},
		{ name: 'Ashanti Stars', meaning: 'Akan Celestial Knowledge', abbreviation: 'AF11', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Ashanti: Stars in Gold Coast astronomy and symbolism',
			mythologyDetails: {
				figure: 'The Ashanti (Asante) of Ghana incorporate celestial imagery into their famous gold weights and adinkra symbols. Osram ne Nsoromma (the moon and star) represents faithfulness and love.',
				story: 'The star follows the moon across the sky, never catching it but never losing it—like a faithful partner. This motif appears in royal regalia and expresses the ideal of devoted relationship.',
				celestialMeaning: 'Venus, as the Evening Star, seems to follow the setting moon. This astronomical relationship was given romantic meaning, enshrined in symbol and proverb.',
				culturalSignificance: 'Adinkra symbols carry philosophical meanings. The celestial symbols show how West African thought integrated astronomical observation with ethics and aesthetics.'
			}
		},
		{ name: 'The Mursi Calendar', meaning: 'Astronomical Agriculture', abbreviation: 'AF12', stars: 6, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Mursi: Ethiopian cattle culture\'s stellar calendar',
			mythologyDetails: {
				figure: 'The Mursi people of Ethiopia\'s Omo Valley use stellar observations to structure their agricultural year. Specific star groups guide planting, harvesting, and cattle management.',
				story: 'Elders observe stars from traditional viewing points. Knowledge passed through generations allows prediction of rains and optimal farming times. The stars are teachers.',
				celestialMeaning: 'The Mursi system shows practical astronomy: specific stars tied to specific agricultural activities. It\'s not mythology but science, proven effective over centuries.',
				culturalSignificance: 'Documentation of Mursi astronomical knowledge by researchers shows that sub-Saharan Africa developed sophisticated, practical astronomical systems comparable to any ancient civilization.'
			}
		},
		{ name: 'Swahili Navigation', meaning: 'Coastal Star Wisdom', abbreviation: 'AF13', stars: 5, brightest: 'Canopus', brightestMag: -0.74, ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Swahili: East African maritime astronomy',
			mythologyDetails: {
				figure: 'Swahili sailors of the East African coast navigated using stars, monsoon winds, and ocean swells. Their dhows crossed the Indian Ocean to Arabia, India, and Southeast Asia.',
				story: 'Swahili navigation combined Arabic astronomical knowledge with African coastal expertise. Captains (nahodha) learned star patterns for oceanic voyages. The pole star, Southern Cross, and bright stars marked directions.',
				celestialMeaning: 'For maritime peoples, stars were survival tools. The Indian Ocean trade that made Swahili cities wealthy depended on astronomical navigation across open water.',
				culturalSignificance: 'The Swahili coast\'s prosperity came from navigation skills. Their astronomy was practical, professional, and international—part of the wider Indian Ocean world\'s shared maritime science.'
			}
		},
		{ name: 'The Congo Sky', meaning: 'Central African Cosmology', abbreviation: 'AF14', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Kongo: Stars as spirits and the land of the dead',
			mythologyDetails: {
				figure: 'In Kongo cosmology, the universe has four quadrants: the living, the dead, and their reflections. Stars may be spirits of the dead or fires in the village of the ancestors. The Milky Way is the spirit path.',
				story: 'The Kongo cosmos is often represented by a cross (yowa) showing the cycle of life, death, and rebirth. The sun\'s position marks where the soul is in its journey—rising (birth), noon (peak), setting (death), midnight (rebirth).',
				celestialMeaning: 'The sun\'s daily cycle mirrors the soul\'s eternal journey. Midnight (when the sun is "below") represents the land of the dead—which is also awaiting rebirth at dawn.',
				culturalSignificance: 'Kongo cosmology influenced diaspora religions (Vodou, Candomblé, Palo). The cosmic diagram survived the Middle Passage, showing how fundamental it was to Kongo identity.'
			}
		},
		{ name: 'Nigerian Sky Tales', meaning: 'Yoruba and Igbo Astronomy', abbreviation: 'AF15', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Nigerian: Diverse celestial traditions of West Africa\'s largest nation',
			mythologyDetails: {
				figure: 'Nigeria\'s hundreds of ethnic groups have diverse astronomical traditions. The Yoruba associate planets with orishas (deities). The Igbo used lunar calendars. The Hausa had Arabic-influenced astronomy.',
				story: 'Each Nigerian people has star stories. The Yoruba see the sun as Orun (heaven) manifest; the moon as Oshu, monthly marker. Northern Nigerians adopted Islamic astronomical traditions through trans-Saharan contact.',
				celestialMeaning: 'Nigerian astronomical diversity shows that "African astronomy" isn\'t monolithic. Forest peoples, savanna peoples, and coastal peoples developed different systems suited to their environments.',
				culturalSignificance: 'Modern Nigeria\'s space program connects to ancient star-watching traditions. From observation to satellite, Nigerian peoples have always looked up and wondered.'
			}
		}
	];

	// SLAVIC CONSTELLATIONS - Eastern European astronomical traditions
	const SLAVIC: Constellation[] = [
		{ name: 'Veles\'s Road', meaning: 'The Milky Way', abbreviation: 'SL01', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: The Milky Way as the path of souls and cattle god',
			mythologyDetails: {
				figure: 'Veles was the Slavic god of earth, water, cattle, and the underworld—Perun\'s eternal opponent. The Milky Way was his road, connecting worlds, a path for souls and the god\'s cattle.',
				story: 'The conflict between sky-god Perun and earth-god Veles structured Slavic mythology. Veles, in serpent form, stole from Perun; Perun hurled thunderbolts in return. The Milky Way marks their boundary.',
				celestialMeaning: 'The Milky Way as road/path is common globally. The Slavic association with cattle-god Veles reflects the pastoral importance of livestock in Eastern European life.',
				culturalSignificance: 'Veles survived in folk tradition as "Volos" and in place names. The Perun-Veles duality (sky/earth, order/chaos) remains a key to understanding Slavic paganism.'
			}
		},
		{ name: 'Perun\'s Axe', meaning: 'The Big Dipper', abbreviation: 'SL02', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'Slavic: The Great Bear as the thunder god\'s weapon or chariot',
			mythologyDetails: {
				figure: 'Perun, the Slavic thunder god, was analogous to Thor and Zeus. The Big Dipper was variously seen as his axe, his chariot, or a bear associated with his cult. It circles the pole like a wheel.',
				story: 'Perun rode across the sky in a chariot, hurling thunderbolts at Veles. When lightning struck, Perun had found his enemy. The circumpolar Big Dipper represented his eternal vigilance.',
				celestialMeaning: 'Circumpolar constellations that never set were naturally associated with the highest gods—always watching, always present. Perun\'s weapon never rested.',
				culturalSignificance: 'Perun was the head of the Slavic pantheon, his worship suppressed by Christianity. His day (Thursday) survives in Russian "chetverg" and the association of thunder with divine anger.'
			}
		},
		{ name: 'Mokosh\'s Spindle', meaning: 'Orion', abbreviation: 'SL03', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 35m', dec: '-1°', onEcliptic: false, mythology: 'Slavic: The goddess of fate spinning destiny',
			mythologyDetails: {
				figure: 'Mokosh was the goddess of women, weaving, and fate—similar to the Greek Moirai. Orion\'s distinctive shape was seen as her spindle or distaff, spinning the threads of destiny.',
				story: 'Mokosh spun the fates of all beings. Women honored her through spinning and weaving rituals. The constellation\'s winter prominence coincided with indoor textile work season.',
				celestialMeaning: 'The connection of weaving goddesses to constellations appears worldwide. The stars themselves might be knots in cosmic thread, fates woven into the sky.',
				culturalSignificance: 'Mokosh survived as "Paraskeva-Pyatnitsa" in Orthodox Christian tradition. Her association with Friday (like Venus/Freya) and with women\'s work persisted through centuries.'
			}
		},
		{ name: 'The Rozhanitsy', meaning: 'Birth Fate Stars', abbreviation: 'SL04', stars: 3, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: Stars associated with the goddesses of fate and birth',
			mythologyDetails: {
				figure: 'The Rozhanitsy were birth goddesses who determined each person\'s fate at birth. They came in the night (perhaps as stars) to pronounce destiny. Offerings were made to them for good fortune.',
				story: 'When a child was born, the Rozhanitsy visited to assign its fate. Bread, cheese, and honey were left out to appease them. Their verdict was final—fate was fixed at birth.',
				celestialMeaning: 'Stars that were prominent at birth might have been considered the Rozhanitsy\'s markers. The stars visible at your birth moment could indicate your destiny.',
				culturalSignificance: 'The Rozhanitsy cult persisted into Christian times despite Church condemnation. Christmas Eve tables set for "deceased ancestors" may continue Rozhanitsy offerings.'
			}
		},
		{ name: 'Zorya', meaning: 'The Morning/Evening Stars', abbreviation: 'SL05', stars: 2, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Slavic: Venus as the aurora goddess(es)',
			mythologyDetails: {
				figure: 'The Zorya were goddess(es) associated with Venus—Zorya Utrennyaya (Morning Star) and Zorya Vechernyaya (Evening Star). They guarded the doomsday hound chained to Polaris.',
				story: 'A monstrous hound (Simargl) was chained to Polaris; if it broke free, the world would end. Each dawn and dusk, a Zorya checked that the chain held. Venus\'s appearance marked their patrol.',
				celestialMeaning: 'Venus\'s role as "guardian" of dawn and dusk transitions fits its prominent appearance at those times. The Slavs dramatized the astronomical fact.',
				culturalSignificance: 'The Zorya survived in folk prayers and spells. Invoking the Morning Star for protection was common. Their role as cosmic guardians made them personally accessible goddesses.'
			}
		},
		{ name: 'Svarog\'s Forge', meaning: 'Celestial Fire', abbreviation: 'SL06', stars: 5, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: The sky god\'s heavenly smithy',
			mythologyDetails: {
				figure: 'Svarog was the god of celestial fire and smithing—father of the sun-god Dazhbog. The sparks from his forge became stars. The sky itself was his workshop.',
				story: 'Svarog forged the sun, gave humanity fire and metalworking, and established marriage and civilization. The stars were the eternal sparks of his cosmic anvil.',
				celestialMeaning: 'Fire gods and smiths appear in many cultures (Hephaestus, Vulcan). The stars as forge-sparks explains both their scattered pattern and their fiery nature.',
				culturalSignificance: 'Svarog\'s gift of fire and metalworking made civilization possible. The divine smith is a culture hero, and his starry sparks show his work continues eternally.'
			}
		},
		{ name: 'Dazhbog\'s Path', meaning: 'The Sun\'s Road', abbreviation: 'SL07', stars: 0, brightest: 'Sun', brightestMag: -26.74, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Slavic: The ecliptic as the sun god\'s daily journey',
			mythologyDetails: {
				figure: 'Dazhbog was the sun god, son of Svarog, who gave warmth and prosperity. His daily journey across the sky blessed the earth. The ecliptic was his golden road.',
				story: 'Each day, Dazhbog drove his golden chariot from east to west, battled darkness, and emerged renewed. Slavic princes claimed descent from him, calling their people "Dazhbog\'s grandchildren."',
				celestialMeaning: 'The sun\'s path (ecliptic) was the most important celestial road. Dazhbog\'s journey brought day, warmth, and the seasons—all life depended on his faithfulness.',
				culturalSignificance: 'The "Igor Tale" calls the Rus\' people Dazhbog\'s grandchildren, showing solar identity persisted into Christian times. Sun worship was stubborn across Eastern Europe.'
			}
		},
		{ name: 'Stribog\'s Winds', meaning: 'Weather Stars', abbreviation: 'SL08', stars: 4, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: Stars associated with the wind god',
			mythologyDetails: {
				figure: 'Stribog was the god of winds, storms, and air. His "grandchildren" were the individual winds from different directions. Certain stars may have been associated with wind directions or storm predictions.',
				story: 'Stribog\'s winds could help or hinder. Sailors and farmers prayed to him. The "Igor Tale" calls the winds "Stribog\'s grandchildren," showing his importance in medieval Slavic thought.',
				celestialMeaning: 'Stars rising or setting in particular directions might have been associated with winds from those quarters. Practical weather prediction met theological explanation.',
				culturalSignificance: 'Wind gods were practical deities—their favor meant good sailing, harvest drying, windmill power. Stribog received ongoing folk veneration long after official Christianization.'
			}
		},
		{ name: 'The Pleiades Wedding', meaning: 'Baba\'s Daughters', abbreviation: 'SL09', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'Slavic: The Pleiades as seven sisters or a celestial wedding party',
			mythologyDetails: {
				figure: 'The Pleiades were seen as seven sisters, "Baba\'s daughters," or a celestial wedding party across Slavic cultures. Their appearance marked seasonal transitions important for agriculture.',
				story: 'Various Slavic peoples told stories of sisters who fled to the sky to escape an unwanted marriage, or of a wedding party transformed into stars. The cluster\'s seven visible stars matched typical family sizes.',
				celestialMeaning: 'The Pleiades\' heliacal rising (in autumn in Slavic latitudes) marked the end of agricultural work and beginning of the indoor season—time for weddings.',
				culturalSignificance: 'The Pleiades\' wedding association connects to their autumn appearance. Traditional Slavic weddings clustered in autumn after harvest, when the "wedding stars" were prominent.'
			}
		},
		{ name: 'Kupala Night', meaning: 'Midsummer Stars', abbreviation: 'SL10', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: The summer solstice celebration and its celestial signs',
			mythologyDetails: {
				figure: 'Kupala Night (around summer solstice) was the major Slavic festival—bonfires, river bathing, fern-flower seeking. The short night and bright stars were integral to the celebration.',
				story: 'On Kupala Night, young people leaped over fires, set wreaths floating on rivers, and searched for the magical fern flower that bloomed only at midnight. The brief darkness glittered with midsummer stars.',
				celestialMeaning: 'The solstice marks the sun\'s peak power. Kupala celebrated light\'s triumph even as days would begin shortening. The stars visible that short night had special significance.',
				culturalSignificance: 'Kupala persists today as "Ivan Kupala Day." The holiday\'s survival through a millennium of Christianity shows its deep roots in Slavic seasonal consciousness.'
			}
		},
		{ name: 'Rod\'s Creation', meaning: 'The Cosmic Egg', abbreviation: 'SL11', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: The creator god and cosmic origins',
			mythologyDetails: {
				figure: 'Rod was the supreme creator god who emerged from a cosmic egg and created the universe. He was later eclipsed by Perun and other gods, but remained fundamental to Slavic cosmogony.',
				story: 'Before existence, there was only Rod in darkness. He created light, separated earth from sky, sea from land. Stars were perhaps fragments of his original creative light, scattered across the dome.',
				celestialMeaning: 'Creation from an egg (world-egg myths) appears globally. The sky dome was the egg\'s upper shell; stars were embedded in it or were holes letting through primordial light.',
				culturalSignificance: 'Rod worship was explicitly condemned by medieval Church texts, indicating its persistence. Easter eggs may continue ancient Rod symbolism through Christian reinterpretation.'
			}
		},
		{ name: 'Marzanna\'s Death', meaning: 'Winter\'s End Stars', abbreviation: 'SL12', stars: 3, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: Stars associated with winter\'s death and spring\'s birth',
			mythologyDetails: {
				figure: 'Marzanna was the goddess of winter, death, and dreams. At spring equinox, her effigy was burned and drowned to kill winter. The stars present at this ritual had seasonal significance.',
				story: 'Each spring, villagers made a Marzanna effigy, paraded it through town, set it on fire, and threw it in water. Winter was symbolically killed; spring could begin.',
				celestialMeaning: 'The stars visible at spring equinox marked Marzanna\'s death and the seasonal shift. Specific constellations setting (winter stars) and rising (spring stars) dramatized the change.',
				culturalSignificance: 'Marzanna drowning continues today in Poland and Czech lands. The ancient ritual\'s survival shows how deeply seasonal transitions were embedded in Slavic consciousness.'
			}
		},
		{ name: 'The World Tree', meaning: 'Cosmic Axis', abbreviation: 'SL13', stars: 15, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Slavic: The celestial pole region as the world axis',
			mythologyDetails: {
				figure: 'Like Norse Yggdrasil, Slavic mythology featured a world tree connecting underworld, earth, and sky. The celestial pole, around which the sky turns, was its top. Polaris marked the pivot.',
				story: 'The world tree\'s roots reached to Veles in the underworld; its trunk was the earthly world; its crown touched Perun\'s sky realm. Birds in the top, serpent at the bottom—the eternal conflict visualized.',
				celestialMeaning: 'The circumpolar stars rotating around the pole created the visual impression of a fixed axis. The world tree myth explained why the sky appeared to spin around one point.',
				culturalSignificance: 'World tree imagery persists in Slavic folk art—embroidered towels, carved decorations. The vertical axis connecting worlds remains culturally meaningful.'
			}
		},
		{ name: 'Jarilo\'s Spring', meaning: 'Fertility God\'s Stars', abbreviation: 'SL14', stars: 5, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: The spring god and vegetation spirits in the sky',
			mythologyDetails: {
				figure: 'Jarilo was the god of spring, fertility, and vegetation. He returned each year from the underworld, bringing warmth and growth. Stars prominent in spring may have been associated with his return.',
				story: 'Jarilo was Perun\'s son, stolen at birth by Veles. Each spring he returns from the underworld to marry Morana (spring\'s bride). By summer\'s end, she kills him, and winter begins.',
				celestialMeaning: 'The seasonal appearance and disappearance of certain star patterns matched Jarilo\'s mythic cycle—gone in winter (with Veles), returning in spring, dying in autumn.',
				culturalSignificance: 'Jarilo festivals marked spring\'s arrival. The god embodied the cycle of growth and death, the eternal return of fertility. His astronomical associations tracked that cycle.'
			}
		},
		{ name: 'Domovoi\'s Watch', meaning: 'Household Spirit Stars', abbreviation: 'SL15', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Slavic: Stars associated with protective household spirits',
			mythologyDetails: {
				figure: 'The Domovoi was the household spirit—ancestor-protector of the home. Stars visible from the house (through windows, doors) might be connected to these protective beings watching over the family.',
				story: 'Each home had its Domovoi, living behind the stove. Families left food offerings and spoke respectfully of him. Moving houses required rituals to bring the Domovoi along.',
				celestialMeaning: 'The stars one could see from home—one\'s familiar night sky—were the cosmic backdrop to domestic protection. The Domovoi watched from within; the stars watched from without.',
				culturalSignificance: 'Domovoi belief persisted through Soviet times and continues today. The household spirit represents the Slavic emphasis on family continuity and ancestral protection.'
			}
		}
	];

	// GERMANIC CONSTELLATIONS - Central European folk astronomy
	const GERMANIC: Constellation[] = [
		{ name: 'Der Große Wagen', meaning: 'The Great Wagon', abbreviation: 'GE01', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'Germanic: The Big Dipper as a wagon or cart',
			mythologyDetails: {
				figure: 'In German folk tradition, the Big Dipper is "Der Große Wagen" (the Great Wagon) or "Karlswagen" (Charles\'s Wagon, after Charlemagne). It\'s one of the most recognized patterns in Germanic sky lore.',
				story: 'The wagon carries grain across the sky, or is Charlemagne\'s chariot perpetually circling. Some tales say it carries souls to heaven. The four "bowl" stars are the wagon; three "handle" stars are horses or the pole.',
				celestialMeaning: 'Wagons were essential to agricultural society. The circumpolar wagon eternally circling was reassuringly constant—like the agricultural cycle it represented.',
				culturalSignificance: 'The wagon name is used across Germanic languages. It reflects the practical, agricultural nature of Central European folk astronomy—celestial bodies named for useful things.'
			}
		},
		{ name: 'Die Gluckhenne', meaning: 'The Brooding Hen', abbreviation: 'GE02', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'Germanic: The Pleiades as a hen with chicks',
			mythologyDetails: {
				figure: 'The Pleiades were called "die Gluckhenne" (the Brooding Hen) or "das Siebengestirn" (the Seven Stars) in German tradition. The cluster resembled a hen sheltering chicks under her wings.',
				story: 'The celestial hen protects her chicks (the fainter stars) from the sky\'s cold. Her appearance in autumn meant time to prepare for winter—like hens gathering their broods before cold weather.',
				celestialMeaning: 'The Pleiades\' compact cluster naturally suggested family groupings. The hen-and-chicks interpretation reflects rural life where poultry were common and valuable.',
				culturalSignificance: 'This domestic, agricultural interpretation differs from Greek mythology\'s fleeing nymphs. Germanic folk astronomy was practical, drawing from daily life rather than heroic legend.'
			}
		},
		{ name: 'Der Jäger', meaning: 'The Hunter', abbreviation: 'GE03', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 35m', dec: '-1°', onEcliptic: false, mythology: 'Germanic: Orion as a hunter (shared with classical tradition)',
			mythologyDetails: {
				figure: 'German tradition preserved the hunter identification for Orion, shared with classical sources. The figure\'s distinctive shape—belt, sword, raised arm—naturally suggested a hunter.',
				story: 'Various German traditions named specific legendary hunters: sometimes the Wild Huntsman (der Wilde Jäger) who rides across the winter sky with his spectral pack.',
				celestialMeaning: 'Orion\'s prominence in winter, when hunting was important, reinforced the association. The constellation rose as hunting season began.',
				culturalSignificance: 'The Wild Hunt (Wilde Jagd) was a powerful Germanic motif—a spectral procession across the winter sky, led by Odin/Wotan or a local legendary figure. Orion fit this role.'
			}
		},
		{ name: 'Die Wilde Jagd', meaning: 'The Wild Hunt', abbreviation: 'GE04', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Germanic: The ghostly procession across the sky',
			mythologyDetails: {
				figure: 'The Wild Hunt was a spectral procession of dead hunters, led by Odin (Wotan), Frau Holle, or other figures, riding across the winter sky. The Milky Way was sometimes their road.',
				story: 'On winter nights, the Hunt rode out. Those caught outside might be carried off; those who joined (even accidentally) were doomed. Leaving offerings could appease the Hunt.',
				celestialMeaning: 'Meteor showers, unusual clouds, or the aurora might be interpreted as the Hunt passing. Winter\'s dark skies and howling winds made the Wild Hunt feel present.',
				culturalSignificance: 'The Wild Hunt survived in folk tradition for centuries after Christianization. It merged with legends of historical figures and influenced modern fantasy (including Tolkien).'
			}
		},
		{ name: 'Frau Holle\'s Stars', meaning: 'The Snow Queen', abbreviation: 'GE05', stars: 5, brightest: 'Capella', brightestMag: 0.08, ra: '5h 17m', dec: '+46°', onEcliptic: false, mythology: 'Germanic: Stars associated with the winter goddess',
			mythologyDetails: {
				figure: 'Frau Holle (Frau Hulda) was a winter goddess who shook out her feather beds, making snow fall. Stars visible in winter—especially bright Capella in Auriga—might be associated with her domain.',
				story: 'Frau Holle rewarded the industrious and punished the lazy in the fairy tale collected by the Grimms. She rules the winter sky, covering the world in her white feathers.',
				celestialMeaning: 'Frau Holle may be a survival of the goddess Holda/Perchta. Her association with winter connects her to the winter stars—the sky\'s appearance when she\'s active.',
				culturalSignificance: 'Frau Holle represents the "good" aspect of the winter goddess, contrasting with fearsome Perchta. Her fairy tale transmits ancient goddess beliefs in domesticated form.'
			}
		},
		{ name: 'Der Morgenstern', meaning: 'The Morning Star', abbreviation: 'GE06', stars: 1, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Germanic: Venus as herald of dawn',
			mythologyDetails: {
				figure: 'Venus as the Morning Star (Morgenstern) was deeply embedded in German tradition—a herald of hope, used in names, poetry, and symbolism. The Evening Star (Abendstern) was recognized as the same object.',
				story: 'The Morgenstern guided travelers and farmers to begin their day. Its brightness before dawn was a promise that light would return. Medieval knights took it as a symbol.',
				celestialMeaning: 'Venus\'s extreme brightness and regular appearance made it the most noted planet. Its role as dawn-herald was practical: seeing the Morgenstern meant it was time to rise.',
				culturalSignificance: 'The morning star appears in German poetry, hymns, and names (including the weapon). Luther called Christ "the bright Morning Star," blending astronomical and theological imagery.'
			}
		},
		{ name: 'Jakobsstab', meaning: 'Jacob\'s Staff', abbreviation: 'GE07', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Germanic: Orion\'s Belt as a pilgrim\'s staff',
			mythologyDetails: {
				figure: 'Orion\'s Belt was called "Jakobsstab" (Jacob\'s Staff) in German tradition, after the pilgrim\'s walking stick used on the road to Santiago de Compostela.',
				story: 'The three aligned stars resembled a pilgrim\'s staff. Medieval pilgrims to Santiago (Saint James/Jakob) would have noted the celestial staff accompanying their journey through dark nights.',
				celestialMeaning: 'The "Jacob\'s Staff" was also a navigation instrument using these stars. The practical and spiritual merged: the celestial staff guided pilgrims literally and symbolically.',
				culturalSignificance: 'The Camino de Santiago was called the "Milky Way" pilgrimage. The celestial imagery of the journey—Jacob\'s Staff, the Milky Way\'s path—made heaven and earth mirror each other.'
			}
		},
		{ name: 'Die Drei Könige', meaning: 'The Three Kings', abbreviation: 'GE08', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Germanic: Orion\'s Belt as the Magi',
			mythologyDetails: {
				figure: 'Another German name for Orion\'s Belt was "Die Drei Könige" (the Three Kings) or "Drei Maria" (Three Marys)—the biblical Magi who followed a star to Bethlehem.',
				story: 'The three aligned stars represented Caspar, Melchior, and Balthasar journeying to find the newborn Jesus. Their prominence in winter (Christmas season) reinforced the association.',
				celestialMeaning: 'Orion\'s Belt\'s visibility around Christmas made the Magi identification natural. The stars seemed to process across the sky, just as the Magi journeyed.',
				culturalSignificance: 'The "Three Kings" visit (January 6, Epiphany) was celebrated with star-singing—children carrying stars door to door. The celestial and liturgical calendars aligned.'
			}
		},
		{ name: 'Der Polarstern', meaning: 'The Pole Star', abbreviation: 'GE09', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Germanic: The fixed star for navigation',
			mythologyDetails: {
				figure: 'Polaris (der Polarstern) was the essential navigation star, the fixed point around which the heavens turned. German sailors, travelers, and farmers all knew its practical value.',
				story: 'The Pole Star was seen as the nail or spike holding the sky in place, around which everything else rotated. Find the Pole Star, find north; find north, find your way home.',
				celestialMeaning: 'Polaris\'s near-perfect alignment with Earth\'s axis made it the only fixed point in the sky. Everything else moved; Polaris remained. This had obvious practical and symbolic value.',
				culturalSignificance: 'The Pole Star appears in German navigation manuals, folk songs, and proverbs. It represents constancy, guidance, and the possibility of finding one\'s way when lost.'
			}
		},
		{ name: 'Der Abendstern', meaning: 'The Evening Star', abbreviation: 'GE10', stars: 1, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Germanic: Venus as the first star of evening',
			mythologyDetails: {
				figure: 'Venus as the Evening Star (Abendstern) marked the transition from day to night. Its early appearance signaled time to end work and return home.',
				story: 'The Abendstern was romantic—appearing as lovers met at day\'s end. German poetry and folk song celebrated it as a symbol of longing, homecoming, and the peace of evening.',
				celestialMeaning: 'Venus\'s brightness makes it visible before any star. When "stars" appear at dusk, Venus is first. Its appearance marked the real beginning of night.',
				culturalSignificance: 'Romantic associations with the Evening Star persist in German literature (Heine, Goethe). The star of lovers\' meetings and homeward journeys remains emotionally resonant.'
			}
		},
		{ name: 'Die Himmelsburg', meaning: 'Heaven\'s Castle', abbreviation: 'GE11', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'Germanic: Bright stars as a celestial fortress',
			mythologyDetails: {
				figure: 'Certain bright star patterns were seen as "Himmelsburg" (Heaven\'s Castle) or the divine fortress. Vega and surrounding stars in Lyra might form such a celestial stronghold.',
				story: 'Heaven was imagined as a castle or hall (like Valhalla). The brightest stars were its towers and walls, the Milky Way its moat or road. The dead who earned entry joined the eternal feast.',
				celestialMeaning: 'The Germanic imagination placed gods in halls—Valhalla, Gimli. The starry sky was naturally the roof of the greatest hall, with bright stars as architectural features.',
				culturalSignificance: 'The "heavenly castle" image persists in hymns and folk belief. Heaven as a place (not just a state) with walls and gates reflects the medieval Germanic worldview.'
			}
		},
		{ name: 'Der Erntewagen', meaning: 'The Harvest Wagon', abbreviation: 'GE12', stars: 4, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Germanic: Autumn stars associated with harvest',
			mythologyDetails: {
				figure: 'Stars prominent during harvest season might be called the "Erntewagen" (Harvest Wagon), celestial parallel to the wagons bringing crops from field to barn.',
				story: 'The harvest wagon rolled across the sky as the earthly wagons rolled across the fields. When the celestial wagon was high, the earthly harvest was underway.',
				celestialMeaning: 'Agricultural peoples naturally associated seasonal stars with seasonal work. The autumn sky was the harvest sky; its patterns reflected harvest activities.',
				culturalSignificance: 'German folk customs around harvest (Erntedankfest, harvest crowns, last-sheaf rituals) connected earth and sky. The celestial wagon blessed the earthly harvest.'
			}
		},
		{ name: 'Alberich\'s Gold', meaning: 'Dwarf\'s Treasure', abbreviation: 'GE13', stars: 0, brightest: 'Various', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Germanic: Stars as the golden hoard of the dwarves',
			mythologyDetails: {
				figure: 'In German legend (especially the Nibelungen cycle), dwarves guarded vast golden hoards. Stars might be seen as this treasure, scattered across the sky-vault by the dwarf-king Alberich.',
				story: 'Alberich, king of the dwarves, possessed the Nibelung treasure. When it was taken from him, perhaps the gold flew to the sky to become stars—forever visible but forever out of reach.',
				celestialMeaning: 'The comparison of stars to gold (or jewels, or silver coins) is widespread. The Germanic twist connects it to specific mythological narratives about lost treasure.',
				culturalSignificance: 'The Nibelungen legend influenced Wagner and German national mythology. The treasure\'s curse—bringing ruin to all who possess it—gives the "star gold" a tragic dimension.'
			}
		},
		{ name: 'Der Schäferstern', meaning: 'The Shepherd\'s Star', abbreviation: 'GE14', stars: 1, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Germanic: Sirius as the shepherd\'s guide',
			mythologyDetails: {
				figure: 'Sirius (der Schäferstern or Shepherd\'s Star) was important for shepherds keeping watch through the night. Its rising and setting helped mark the hours.',
				story: 'Shepherds watching flocks by night needed to know the time. Sirius, the brightest star, was their clock. Its position told them when to expect dawn, when their watch would end.',
				celestialMeaning: 'Sirius\'s brightness made it impossible to miss. Shepherds, awake all night, became star-wise. The "shepherd\'s star" name honored their expertise.',
				culturalSignificance: 'The Christmas narrative\'s "shepherds watching their flocks by night" gave the shepherd\'s star religious resonance. The humble shepherds were first to see Heaven\'s news.'
			}
		},
		{ name: 'Die Milchstraße', meaning: 'The Milk Road', abbreviation: 'GE15', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Germanic: The Milky Way as spilled milk or a celestial road',
			mythologyDetails: {
				figure: 'The German "Milchstraße" (Milk Road/Milky Way) shares the classical etymology—milk spilled across the sky. But German folk tradition also saw it as a road: the path of souls, pilgrims, or wanderers.',
				story: 'The Milky Way was the road to heaven, walked by the dead. It was also called "Jakobsstraße" (Jacob\'s Road)—the celestial Camino de Santiago. Pilgrims on earth walked beneath their heavenly path.',
				celestialMeaning: 'The Milky Way\'s band across the sky naturally suggested a road or river. Whether souls traveled it or milk was spilled depended on which story you heard.',
				culturalSignificance: 'The pilgrimage association linked earthly and heavenly journeys. Walking to Santiago under the Milky Way, you walked two roads at once—toward the saint and toward heaven.'
			}
		}
	];

	// IBERIAN CONSTELLATIONS - Spanish and Portuguese astronomical traditions
	const IBERIAN: Constellation[] = [
		{ name: 'El Carro', meaning: 'The Cart', abbreviation: 'IB01', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'Iberian: The Big Dipper as a farmer\'s cart',
			mythologyDetails: {
				figure: 'In Spain and Portugal, the Big Dipper is called "El Carro" (the Cart) or "El Carro Mayor" (the Great Cart), continuing the ancient European wagon tradition.',
				story: 'The celestial cart rolls eternally around the pole, carrying the grain of heaven. Some say it\'s the cart of Santiago (Saint James), patron of Spain, perpetually journeying.',
				celestialMeaning: 'The cart identification reflects Iberian agricultural life. The constellation\'s visibility throughout the year, circling but never setting, made it a reliable reference.',
				culturalSignificance: 'The cart/wagon name extends across Romance languages, showing continuity from Latin "plaustrum." Spanish navigators used El Carro to find Polaris.'
			}
		},
		{ name: 'Las Siete Cabrillas', meaning: 'The Seven Kids', abbreviation: 'IB02', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'Iberian: The Pleiades as seven little goats',
			mythologyDetails: {
				figure: 'The Pleiades are called "Las Siete Cabrillas" (the Seven Little Goats) in Spain or "As Sete Estrelas" in Portugal. Goats, essential to Iberian pastoral life, climbed the sky.',
				story: 'Seven little goats escaped to the heavens, or were placed there by a shepherd-god. They cluster together for warmth in the cold night sky.',
				celestialMeaning: 'The goat identification reflects Iberian pastoralism. Goats are agile climbers—naturally they\'d reach even the sky. Their tight cluster looks like kids huddling.',
				culturalSignificance: 'Goats were crucial to mountain regions of Spain and Portugal. The celestial kids connect the humble pastoral economy to cosmic significance.'
			}
		},
		{ name: 'El Camino de Santiago', meaning: 'St. James\'s Road', abbreviation: 'IB03', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Iberian: The Milky Way as the pilgrim road',
			mythologyDetails: {
				figure: 'The Milky Way is "El Camino de Santiago" (St. James\'s Road), the celestial mirror of the pilgrimage route across northern Spain. Pilgrims walked beneath their destination\'s reflection.',
				story: 'The Milky Way was said to mark the route to Santiago de Compostela, pointing the way. Saint James himself may have walked it, or it lights the path for pilgrims\' souls.',
				celestialMeaning: 'The Milky Way\'s southwest-to-northeast orientation in Iberian skies does roughly align with the pilgrimage route. The correspondence was noted and celebrated.',
				culturalSignificance: 'The Camino de Santiago was medieval Europe\'s great pilgrimage. Its celestial association made the journey sacred not just in destination but in every starlit step.'
			}
		},
		{ name: 'Estrella Polar', meaning: 'The Pole Star', abbreviation: 'IB04', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'Iberian: The navigator\'s guide',
			mythologyDetails: {
				figure: 'The "Estrella Polar" or "Estrela do Norte" was crucial to Iberian navigation. Portuguese and Spanish explorers opened ocean routes using this fixed reference point.',
				story: 'Prince Henry the Navigator\'s school at Sagres trained sailors in stellar navigation. The Pole Star was fundamental—find it, find north, plot your course.',
				celestialMeaning: 'Polaris\'s position near the celestial pole made it invaluable for latitude determination. As Portuguese and Spanish ships sailed further, this knowledge became global currency.',
				culturalSignificance: 'The Age of Exploration was launched from Iberia using star navigation. The fixed star that guided caravels to India, Brazil, and the Philippines changed world history.'
			}
		},
		{ name: 'Las Tres Marías', meaning: 'The Three Marys', abbreviation: 'IB05', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'Iberian: Orion\'s Belt as the biblical women',
			mythologyDetails: {
				figure: 'Orion\'s Belt is called "Las Tres Marías" (the Three Marys) in Spain and Latin America—Mary Magdalene, Mary of Clopas, and Mary the mother of James, who witnessed the crucifixion.',
				story: 'The three faithful women who stayed at the cross and visited the empty tomb were honored in the sky. Their linear arrangement suggests a procession.',
				celestialMeaning: 'Three bright stars in a row naturally suggested a trio. The biblical Marys, grouped in art and narrative, fit perfectly.',
				culturalSignificance: 'The name spread throughout the Spanish-speaking world. In South America, "Las Tres Marías" is the most common name for these stars, a legacy of colonial evangelization.'
			}
		},
		{ name: 'Lucero del Alba', meaning: 'Light of Dawn', abbreviation: 'IB06', stars: 1, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'Iberian: Venus as the dawn herald',
			mythologyDetails: {
				figure: 'Venus as the Morning Star is "Lucero del Alba" (Light of Dawn) or "Estrela d\'Alva" in Portuguese. The most brilliant object after sun and moon, it announced the coming day.',
				story: 'The dawn-bringer was variously seen as a herald of Christ (the Light of the World), a guardian angel, or simply the promise that night would end.',
				celestialMeaning: 'Venus\'s extreme brightness before dawn made it impossible to ignore. Its regular appearances, predictable to those who watched, made it a trusted morning companion.',
				culturalSignificance: 'The morning star appears in Iberian poetry from the Cantigas de Santa Maria to García Lorca. Its image combines pagan and Christian meanings.'
			}
		},
		{ name: 'El Cazador', meaning: 'The Hunter', abbreviation: 'IB07', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 35m', dec: '-1°', onEcliptic: false, mythology: 'Iberian: Orion as hunter (classical tradition preserved)',
			mythologyDetails: {
				figure: 'Orion is "El Cazador" (the Hunter) in Spanish tradition, preserving the classical identification through Arabic-influenced medieval astronomy and Renaissance recovery of Greek texts.',
				story: 'The Hunter pursues game across the winter sky. In Iberia, winter was hunting season—the constellation\'s prominence matched the activity.',
				celestialMeaning: 'Orion\'s distinctive shape naturally suggests a human figure. The sword/dagger asterism reinforces the hunter interpretation.',
				culturalSignificance: 'Iberian astronomical knowledge blended Greek, Arabic, and indigenous traditions. El Cazador shows how classical names persisted through complex cultural transmission.'
			}
		},
		{ name: 'La Cruz del Sur', meaning: 'The Southern Cross', abbreviation: 'IB08', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 27m', dec: '-63°', onEcliptic: false, mythology: 'Iberian: The cross discovered in southern seas',
			mythologyDetails: {
				figure: 'The Southern Cross (La Cruz del Sur / Cruzeiro do Sul) was discovered by Iberian navigators sailing south. It became the symbol of southern voyages and colonial territories.',
				story: 'Portuguese navigators first recorded the Southern Cross in the 15th century. A Christian cross appearing in pagan southern skies seemed providential—a sign to continue.',
				celestialMeaning: 'The Southern Cross replaces Polaris for southern navigation, indicating south. Its discovery solved a practical problem: how to navigate below the equator.',
				culturalSignificance: 'Brazil\'s flag features the Southern Cross. The constellation symbolizes Iberian expansion southward and the cultural transformation that followed.'
			}
		},
		{ name: 'Canículas', meaning: 'Dog Days Stars', abbreviation: 'IB09', stars: 2, brightest: 'Sirius', brightestMag: -1.46, ra: '6h 45m', dec: '-17°', onEcliptic: false, mythology: 'Iberian: Sirius and the hot days of summer',
			mythologyDetails: {
				figure: 'The "Dog Days" (Canículas) of summer were named for Sirius (the Dog Star) rising with the sun. This period from July to August was the hottest time in Iberia.',
				story: 'When the Dog Star rose with the sun, its heat added to solar heat, creating summer\'s hottest days. Dogs went mad; people fell ill. The star\'s influence was blamed.',
				celestialMeaning: 'Sirius\'s heliacal rising (emerging from the sun\'s glare) coincides with late summer in Mediterranean latitudes. The timing seemed causal: dog star = dog days.',
				culturalSignificance: 'Canículas remain in Spanish vocabulary for the hottest summer period. The ancient star-weather connection persists in language if not belief.'
			}
		},
		{ name: 'El Centinela', meaning: 'The Sentinel', abbreviation: 'IB10', stars: 5, brightest: 'Arcturus', brightestMag: -0.05, ra: '14h 16m', dec: '+19°', onEcliptic: false, mythology: 'Iberian: Arcturus as the watching star',
			mythologyDetails: {
				figure: 'Arcturus (El Centinela) was the "sentinel" star—watching over the northern sky from its position in Boötes. Its brightness made it seem to stand guard.',
				story: 'The sentinel watches over the night, never sleeping. Farmers and shepherds looked to it for seasonal guidance. Its spring prominence marked planting time.',
				celestialMeaning: 'Arcturus is the fourth-brightest star and easily found by "following the arc" of the Big Dipper\'s handle. Its prominence justified the guardian interpretation.',
				culturalSignificance: 'Night watchmen and sentries identified with their celestial counterpart. El Centinela was a companion to all who kept watch while others slept.'
			}
		},
		{ name: 'La Osa', meaning: 'The She-Bear', abbreviation: 'IB11', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'Iberian: Ursa Major preserving the classical bear',
			mythologyDetails: {
				figure: 'Spanish astronomy preserved the classical "Bear" interpretation—"La Osa Mayor" (the Great She-Bear). This coexisted with the "cart" interpretation without contradiction.',
				story: 'The learned tradition said it was Callisto, transformed by jealous Hera; the folk tradition said it was a cart. Both names were used, depending on context.',
				celestialMeaning: 'The bear identification shows the influence of classical education in Iberia. Renaissance recovery of Greek texts reinforced ancient star names.',
				culturalSignificance: 'The coexistence of "cart" and "bear" names shows how folk and learned traditions interacted. Different social contexts used different vocabularies.'
			}
		},
		{ name: 'Las Guardas', meaning: 'The Guards', abbreviation: 'IB12', stars: 2, brightest: 'Kochab', brightestMag: 2.08, ra: '14h 51m', dec: '+74°', onEcliptic: false, mythology: 'Iberian: The pointer stars as guards of the pole',
			mythologyDetails: {
				figure: 'The two front stars of the Big Dipper\'s bowl (pointing to Polaris) were called "Las Guardas" (the Guards). They circle the Pole Star, protecting it.',
				story: 'The Guards march around the Pole Star like sentries around a king. Their position relative to Polaris tells the time at night—the nocturnal clock.',
				celestialMeaning: 'Before reliable timepieces, the Guards\' position was used to calculate night hours. Portuguese navigators developed instruments (the nocturnal) using this principle.',
				culturalSignificance: 'The Guards were essential to navigation. Portuguese pilots used them not just for direction but for time—crucial for calculating longitude before chronometers.'
			}
		},
		{ name: 'El Escorpión', meaning: 'The Scorpion', abbreviation: 'IB13', stars: 18, brightest: 'Antares', brightestMag: 0.96, ra: '16h 30m', dec: '-26°', onEcliptic: true, mythology: 'Iberian: Scorpius in the summer sky',
			mythologyDetails: {
				figure: 'Scorpius (El Escorpión) is one of the most recognizable constellations from Iberia, its long curving tail unmistakable in summer nights. Antares, its heart, glows red.',
				story: 'The classical story of the Scorpion that killed Orion was preserved. The two never appear together—when Scorpius rises, Orion sets (flees).',
				celestialMeaning: 'The scorpion shape is remarkably apt—head, claws, curved tail with stinger. Red Antares (rival of Mars/Ares) pulses like a living heart.',
				culturalSignificance: 'Scorpions were real dangers in Iberia. The celestial Scorpion connected cosmic and everyday hazards. Summer nights under El Escorpión required care walking in darkness.'
			}
		},
		{ name: 'O Cruzeiro', meaning: 'The Cross', abbreviation: 'IB14', stars: 4, brightest: 'Acrux', brightestMag: 0.76, ra: '12h 27m', dec: '-63°', onEcliptic: false, mythology: 'Portuguese: The Southern Cross as national symbol',
			mythologyDetails: {
				figure: 'The Southern Cross (O Cruzeiro) became central to Portuguese identity in their southern colonies. It symbolized the Christian mission and southern exploration.',
				story: 'When Portuguese ships could no longer see Polaris, the Southern Cross appeared—God\'s sign that they should continue. It guided them to Brazil, Africa, India.',
				celestialMeaning: 'The cross-shape in the southern sky seemed providential to Catholic navigators. It replaces Polaris functionally, pointing (roughly) south.',
				culturalSignificance: 'Camões\'s Lusíads celebrates the cross\'s appearance. Brazil\'s flag places it centrally. The constellation embodies Lusophone (Portuguese-speaking) global identity.'
			}
		},
		{ name: 'Estrela dos Magos', meaning: 'Star of the Magi', abbreviation: 'IB15', stars: 1, brightest: 'Variable', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'Iberian: The Christmas star traditions',
			mythologyDetails: {
				figure: 'The Star of Bethlehem (Estrela dos Magos / Estrella de Belén) that guided the Magi was central to Iberian Christmas tradition. Various celestial objects were proposed as the actual star.',
				story: 'The Magi followed a star from the east to find the Christ child. Whether conjunction, nova, or miraculous sign, the star validated the cosmic significance of the Nativity.',
				celestialMeaning: 'Conjunctions of Jupiter and Saturn (7 BCE), a nova, or other astronomical events have been proposed. The star\'s nature matters less than its meaning.',
				culturalSignificance: 'Spanish and Portuguese Christmas traditions feature the star prominently. The Reyes Magos (Three Kings) and their star-guided journey are celebrated on January 6, more important than December 25 in traditional Iberian culture.'
			}
		}
	];

	// FRENCH CONSTELLATIONS - Gallic and French astronomical traditions
	const FRENCH: Constellation[] = [
		{ name: 'La Grande Ourse', meaning: 'The Great Bear', abbreviation: 'FR01', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'French: Ursa Major in Gallic tradition',
			mythologyDetails: {
				figure: 'In French, the Big Dipper is "La Grande Ourse" (the Great Bear), preserving the classical Greek name that passed through Latin. The bear walks eternally around the pole.',
				story: 'French tradition inherited the Callisto myth through classical education. The nymph, transformed by jealous Juno, was placed in the sky by Jupiter. Her son Arcas became the Little Bear.',
				celestialMeaning: 'The circumpolar bear never "bathes" in the sea (never sets in French latitudes)—Juno\'s final curse, denying her rest in Ocean\'s waters.',
				culturalSignificance: 'French poetry from the medieval period through the Enlightenment referenced La Grande Ourse. The classical name marks France\'s Latin heritage and literary culture.'
			}
		},
		{ name: 'Le Chariot', meaning: 'The Chariot', abbreviation: 'FR02', stars: 7, brightest: 'Dubhe', brightestMag: 1.79, ra: '11h 4m', dec: '+62°', onEcliptic: false, mythology: 'French: The Big Dipper as a vehicle',
			mythologyDetails: {
				figure: 'Alongside "Grande Ourse," French folk tradition called the asterism "Le Chariot" (the Chariot) or "Le Grand Chariot." The four bowl stars are wheels; three handle stars are horses or shaft.',
				story: 'The celestial chariot rolls around the pole star, carrying grain, souls, or divine passengers. Different regions had different stories about whose chariot it was.',
				celestialMeaning: 'The chariot interpretation dates to ancient times and persisted in rural France. Practical farmers saw wagons; educated city-dwellers saw bears.',
				culturalSignificance: 'The coexistence of bear and chariot names in French shows the layering of folk and classical traditions that characterizes French culture.'
			}
		},
		{ name: 'Les Pléiades', meaning: 'The Pleiades', abbreviation: 'FR03', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'French: The Seven Sisters in Gallic tradition',
			mythologyDetails: {
				figure: 'The Pleiades (Les Pléiades) in French tradition retained their Greek identity as the seven daughters of Atlas, placed in the sky to escape Orion\'s pursuit.',
				story: 'The sisters are pursued eternally by Orion—when he rises, they flee. The "lost Pleiad" (a star said to have faded from view) was sometimes Electra, ashamed of Troy\'s fall.',
				celestialMeaning: 'The cluster\'s compact grouping naturally suggested family. The number seven (visible stars) matched many mythological groupings.',
				culturalSignificance: 'The Pleiades appear in French literature from medieval romances to modern poetry. Their name became synonymous with any group of seven illustrious individuals.'
			}
		},
		{ name: 'La Poussinière', meaning: 'The Hen and Chicks', abbreviation: 'FR04', stars: 7, brightest: 'Alcyone', brightestMag: 2.87, ra: '3h 47m', dec: '+24°', onEcliptic: true, mythology: 'French folk: The Pleiades as a mother hen',
			mythologyDetails: {
				figure: 'In rural France, the Pleiades were called "La Poussinière" (the brooding hen) or "La Poule et ses Poussins" (the hen and her chicks)—the same domestic image found across Europe.',
				story: 'The mother hen gathers her chicks under her wings against the cold night sky. Their tight clustering shows familial warmth against cosmic cold.',
				celestialMeaning: 'The hen-and-chicks interpretation transformed Greek nymphs into farmyard fowl. It reflects how folk astronomy domesticated the sky.',
				culturalSignificance: 'Different social classes used different names for the same stars. Peasants saw chickens; the educated saw mythological sisters. Both were valid French tradition.'
			}
		},
		{ name: 'L\'Étoile Polaire', meaning: 'The Pole Star', abbreviation: 'FR05', stars: 1, brightest: 'Polaris', brightestMag: 1.98, ra: '2h 32m', dec: '+89°', onEcliptic: false, mythology: 'French: The fixed star of navigation',
			mythologyDetails: {
				figure: 'L\'Étoile Polaire (the Pole Star) was essential to French navigation and served as a metaphor for constancy in French literature and thought.',
				story: 'The Pole Star is the axis around which the heavens turn—the nail that holds the sky in place. French explorers from Canada to the Pacific used it as their guide.',
				celestialMeaning: 'Polaris\'s near-perfect alignment with Earth\'s axis makes it appear stationary. Everything else moves; Polaris remains—the symbol of fixity.',
				culturalSignificance: 'The Pole Star appears throughout French literature as a symbol of constancy, guidance, and truth. Descartes sought a pole star of knowledge in his philosophical method.'
			}
		},
		{ name: 'L\'Étoile du Berger', meaning: 'The Shepherd\'s Star', abbreviation: 'FR06', stars: 1, brightest: 'Venus', brightestMag: -4.6, ra: 'Variable', dec: 'Variable', onEcliptic: true, mythology: 'French: Venus as the pastoral guide',
			mythologyDetails: {
				figure: 'Venus as Morning or Evening Star is "L\'Étoile du Berger" (the Shepherd\'s Star) in French—the star that guides shepherds, telling them when to drive out the flock or bring them home.',
				story: 'The shepherd\'s star appears at dawn to wake the flock and at evening to signal return. Shepherds, awake at odd hours, knew the stars better than town-dwellers.',
				celestialMeaning: 'Venus\'s extreme brightness makes it visible through twilight. For shepherds working dawn and dusk, it was their most reliable celestial companion.',
				culturalSignificance: 'The pastoral image of l\'Étoile du Berger pervades French poetry. It represents the simple wisdom of rural life against urban sophistication.'
			}
		},
		{ name: 'Orion le Chasseur', meaning: 'Orion the Hunter', abbreviation: 'FR07', stars: 7, brightest: 'Rigel', brightestMag: 0.13, ra: '5h 35m', dec: '-1°', onEcliptic: false, mythology: 'French: The classical hunter preserved',
			mythologyDetails: {
				figure: 'Orion (Orion le Chasseur) retained his Greek identity in French tradition—the giant hunter placed in the sky, eternally pursuing the Pleiades or being chased by the Scorpion.',
				story: 'The myths of Orion\'s death vary: killed by Artemis accidentally or intentionally, by the Scorpion, or by Gaia. His belt of three stars is the most recognizable asterism.',
				celestialMeaning: 'Orion\'s prominent position in winter skies and distinctive shape made him impossible to ignore. The French inherited Greek names through Latin and Arabic routes.',
				culturalSignificance: 'Orion appears in French poetry from Ronsard to Apollinaire. The Hunter striding across winter nights was a romantic image of nobility against the cold.'
			}
		},
		{ name: 'Les Trois Rois', meaning: 'The Three Kings', abbreviation: 'FR08', stars: 3, brightest: 'Alnilam', brightestMag: 1.69, ra: '5h 36m', dec: '-1°', onEcliptic: false, mythology: 'French: Orion\'s Belt as the Magi',
			mythologyDetails: {
				figure: 'Orion\'s Belt was called "Les Trois Rois" (the Three Kings)—Gaspard, Melchior, and Balthazar, the Magi who followed the star to Bethlehem.',
				story: 'The three stars march in a line like pilgrims journeying. Their visibility in the Christmas season reinforced the connection to the Epiphany story.',
				celestialMeaning: 'Three aligned stars naturally suggested a procession. The Christmas context gave them specific identity as the gift-bearing kings.',
				culturalSignificance: 'The Feast of the Three Kings (Epiphany) was a major French holiday. The celestial kings in the winter sky connected heaven\'s architecture to the church calendar.'
			}
		},
		{ name: 'La Voie Lactée', meaning: 'The Milky Way', abbreviation: 'FR09', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'French: The galaxy as the milk road',
			mythologyDetails: {
				figure: 'La Voie Lactée preserves the classical etymology—milk (lait) spilled across the sky, from Hera\'s breast when she rejected the infant Hercules.',
				story: 'French tradition inherited the Greek myth through Latin education. The band of light spanning the sky was divine milk—the origins of our galaxy\'s name.',
				celestialMeaning: 'The Milky Way\'s appearance as a diffuse band of light naturally suggested spilled liquid. Modern astronomy revealed it as billions of stars in a disk.',
				culturalSignificance: 'French philosophers and astronomers from Pascal to Flammarion contemplated the Milky Way\'s nature. Its scale prompted reflections on human insignificance and wonder.'
			}
		},
		{ name: 'Le Chemin de Saint-Jacques', meaning: 'Saint James\'s Way', abbreviation: 'FR10', stars: 0, brightest: 'N/A', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'French: The Milky Way as the pilgrim road',
			mythologyDetails: {
				figure: 'The Milky Way was also called "Le Chemin de Saint-Jacques" (Saint James\'s Way), the celestial mirror of the pilgrimage route to Santiago de Compostela.',
				story: 'French pilgrims walking to Santiago crossed through southern France, following the Milky Way overhead. The celestial road marked the earthly path.',
				celestialMeaning: 'The Milky Way\'s general east-west orientation in European skies corresponded to the pilgrimage direction. Pilgrims walking by night followed both roads.',
				culturalSignificance: 'France was crossed by multiple Camino routes converging at the Pyrenees. The celestial road blessed the journey, making each step a walk toward heaven.'
			}
		},
		{ name: 'Les Gardes', meaning: 'The Guards', abbreviation: 'FR11', stars: 2, brightest: 'Kochab', brightestMag: 2.08, ra: '14h 51m', dec: '+74°', onEcliptic: false, mythology: 'French: Pointer stars as pole star guards',
			mythologyDetails: {
				figure: 'The two stars at the front of the Big Dipper\'s bowl (pointing to Polaris) were called "Les Gardes" (the Guards), circling the Pole Star protectively.',
				story: 'The Guards march around their sovereign, the Pole Star, like royal sentinels. Their position relative to Polaris indicates the hour of night.',
				celestialMeaning: 'The Guards\' rotation around Polaris was used for timekeeping before clocks. French sailors used them with the nocturnal instrument.',
				culturalSignificance: 'Navigation was crucial to France\'s colonial and commercial enterprises. Les Gardes were part of every sailor\'s essential knowledge.'
			}
		},
		{ name: 'Le Lion', meaning: 'The Lion', abbreviation: 'FR12', stars: 9, brightest: 'Regulus', brightestMag: 1.35, ra: '10h 8m', dec: '+12°', onEcliptic: true, mythology: 'French: Leo the celestial lion',
			mythologyDetails: {
				figure: 'Leo (Le Lion) was the Nemean Lion of Hercules\'s first labor, placed in the sky after the hero strangled it. Regulus, its heart, was the "Little King."',
				story: 'The Nemean Lion had an impervious hide. Hercules strangled it and wore its skin as armor. The lion\'s outline in the sky preserves his first conquest.',
				celestialMeaning: 'Leo\'s prominence in spring skies made it a major zodiacal constellation. The "sickle" asterism (the lion\'s head) is distinctive.',
				culturalSignificance: 'The lion was a royal symbol in France. Le Lion céleste (the celestial Lion) appeared in royal imagery, connecting monarchy to cosmic order.'
			}
		},
		{ name: 'La Lyre', meaning: 'The Lyre', abbreviation: 'FR13', stars: 5, brightest: 'Vega', brightestMag: 0.03, ra: '18h 37m', dec: '+39°', onEcliptic: false, mythology: 'French: Orpheus\'s instrument in the sky',
			mythologyDetails: {
				figure: 'Lyra (La Lyre) is Orpheus\'s lyre, placed in the sky after the legendary poet was torn apart by Maenads. Its brightest star, Vega, was one of the most important in French astronomy.',
				story: 'Orpheus\'s music could charm stones and trees, tame wild beasts, and even move the gods of the underworld. His lyre, a gift from Apollo, retained its power even in the sky.',
				celestialMeaning: 'Vega (Alpha Lyrae) is the fifth-brightest star and was the northern pole star ~12,000 years ago. It will be again in ~13,000 years.',
				culturalSignificance: 'La Lyre appears in French poetry as a symbol of artistic transcendence. The poet\'s instrument survives in heaven when the poet himself is destroyed.'
			}
		},
		{ name: 'Le Cygne', meaning: 'The Swan', abbreviation: 'FR14', stars: 9, brightest: 'Deneb', brightestMag: 1.25, ra: '20h 41m', dec: '+45°', onEcliptic: false, mythology: 'French: The swan of Zeus',
			mythologyDetails: {
				figure: 'Cygnus (Le Cygne) is the swan form taken by Zeus to seduce Leda. The Northern Cross asterism within it made it important to French Christian interpretation as well.',
				story: 'Zeus transformed into a swan to approach Leda. From their union came Helen (who caused the Trojan War) and the twins Castor and Pollux.',
				celestialMeaning: 'The swan appears to fly along the Milky Way—its wings spread, neck extended. The Northern Cross within it was separately recognized.',
				culturalSignificance: 'French literature uses the swan as a symbol of beauty, grace, and transformation. Le Cygne céleste represented metamorphosis and divine disguise.'
			}
		},
		{ name: 'L\'Étoile de Bethléem', meaning: 'The Star of Bethlehem', abbreviation: 'FR15', stars: 1, brightest: 'Variable', ra: 'Variable', dec: 'Variable', onEcliptic: false, mythology: 'French: The Christmas star traditions',
			mythologyDetails: {
				figure: 'The Star of Bethlehem (L\'Étoile de Bethléem) guided the Magi and remained central to French Christmas tradition. Its exact identity—conjunction, nova, comet—was much debated.',
				story: 'The star appeared in the east, led the Magi to Jerusalem, then to Bethlehem, and "stood over" where the child lay. Its miraculous behavior defied natural explanation.',
				celestialMeaning: 'Modern astronomy has proposed various candidates: Jupiter-Saturn conjunction (7 BCE), a nova, or comet. None fully matches the biblical description.',
				culturalSignificance: 'French crèches (nativity scenes) always include the star. The astronomical quest to identify it continues, blending science with faith.'
			}
		}
	];

	// Get constellations for current culture
	const currentConstellations = $derived(() => {
		switch (selectedCulture) {
			case 'iau': return IAU_OFFICIAL;
			case 'greco-roman': return GRECO_ROMAN;
			case 'chinese': return CHINESE;
			case 'hindu': return HINDU;
			case 'japanese': return JAPANESE;
			case 'polynesian': return POLYNESIAN;
			case 'first-nations': return FIRST_NATIONS;
			case 'mesoamerican': return MESOAMERICAN;
			case 'aboriginal': return ABORIGINAL;
			case 'inuit': return INUIT;
			case 'celtic': return CELTIC;
			case 'norse': return NORSE;
			case 'egyptian': return EGYPTIAN;
			case 'african': return AFRICAN;
			case 'slavic': return SLAVIC;
			case 'germanic': return GERMANIC;
			case 'iberian': return IBERIAN;
			case 'french': return FRENCH;
			default: return IAU_OFFICIAL;
		}
	});

	// Sorted constellations
	const sortedConstellations = $derived(() => {
		const consts = [...currentConstellations()];
		if (constellationSort === 'alpha') {
			return consts.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			// Sort by area/size (larger first), fallback to star count
			return consts.sort((a, b) => {
				const aSize = a.area || (typeof a.stars === 'number' ? a.stars * 10 : 50);
				const bSize = b.area || (typeof b.stars === 'number' ? b.stars * 10 : 50);
				return bSize - aSize;
			});
		}
	});

	function openConstellationDetail(constellation: Constellation) {
		selectedConstellation = constellation;
	}

	function closeConstellationDetail() {
		selectedConstellation = null;
	}

	// HR Diagram star types
	const STAR_TYPES = [
		{ class: 'O', temp: '> 30,000 K', color: 'bg-blue-400', mass: '16-150 M☉', luminosity: '30,000-1,000,000 L☉', examples: 'Naos, Zeta Puppis', lifespan: '~1 million years' },
		{ class: 'B', temp: '10,000-30,000 K', color: 'bg-blue-300', mass: '2.1-16 M☉', luminosity: '25-30,000 L☉', examples: 'Rigel, Spica', lifespan: '~10 million years' },
		{ class: 'A', temp: '7,500-10,000 K', color: 'bg-white', mass: '1.4-2.1 M☉', luminosity: '5-25 L☉', examples: 'Sirius, Vega', lifespan: '~1 billion years' },
		{ class: 'F', temp: '6,000-7,500 K', color: 'bg-yellow-100', mass: '1.04-1.4 M☉', luminosity: '1.5-5 L☉', examples: 'Procyon, Canopus', lifespan: '~2 billion years' },
		{ class: 'G', temp: '5,200-6,000 K', color: 'bg-yellow-300', mass: '0.8-1.04 M☉', luminosity: '0.6-1.5 L☉', examples: 'Sun, Alpha Centauri A', lifespan: '~10 billion years' },
		{ class: 'K', temp: '3,700-5,200 K', color: 'bg-orange-400', mass: '0.45-0.8 M☉', luminosity: '0.08-0.6 L☉', examples: 'Arcturus, Aldebaran', lifespan: '~15-30 billion years' },
		{ class: 'M', temp: '2,400-3,700 K', color: 'bg-red-500', mass: '0.08-0.45 M☉', luminosity: '< 0.08 L☉', examples: 'Proxima Centauri, Betelgeuse', lifespan: '> 100 billion years' }
	];
</script>

<svelte:head>
	<title>Education - Cosmic Mirror</title>
	<meta name="description" content="Learn about space through interactive guides: Galactic Tick tracker, constellations from world cultures, solar system guide, and more." />
</svelte:head>

<div class="min-h-screen bg-black relative">
	<!-- Background grid -->
	<div class="fixed inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors group">
					<svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
					</svg>
					<span class="text-xs tracking-wider uppercase">Back</span>
				</a>
				<div class="flex items-center gap-4">
					<span class="text-xs tracking-[0.2em] {currentColors.accent} uppercase">Education</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/50 uppercase">Learn & Explore</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Section Selector -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] {currentColors.accent} uppercase">Select Topic</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<div class="flex flex-wrap gap-2">
				{#each SECTIONS as section}
					{@const colors = sectionColors[section.name]}
					<button
						type="button"
						class="px-4 py-2.5 text-left transition-all duration-200 border
							{activeSection === section.name
								? colors.active
								: `bg-white/[0.02] border-white/10 text-white/50 hover:text-white/70 ${colors.inactive}`}"
						onclick={() => activeSection = section.name}
					>
						<div class="flex items-center gap-2">
							<span class="text-sm tracking-wider uppercase">{section.displayName}</span>
						</div>
						<div class="text-[10px] tracking-wider {activeSection === section.name ? colors.text : 'text-white/30'}">
							{section.subtitle}
						</div>
					</button>
				{/each}
			</div>
		</section>

		<!-- Content Area -->
		<section class="space-y-6">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] {currentColors.accent} uppercase">{selectedSection.displayName}</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<!-- Galactic Tick Section -->
			{#if activeSection === 'galactic-tick'}
				<div class="space-y-8">
					<!-- Current Tick Display -->
					<div class="bg-white/[0.02] border {currentColors.border} p-8">
						<div class="text-center space-y-4">
							<p class="text-[10px] tracking-[0.3em] text-white/30 uppercase">Current Galactic Tick</p>
							<p class="text-8xl md:text-9xl font-extralight tracking-wider {currentColors.accent}">{galacticData.tick}</p>
							<p class="text-xs tracking-wider text-white/40">Since October 2, 1608</p>
						</div>
					</div>

					<!-- Countdown Clock -->
					<div class="bg-white/[0.02] border {currentColors.border} p-8">
						<div class="text-center space-y-6">
							<div>
								<p class="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-2">Countdown to Tick {galacticData.nextTickNumber}</p>
								<p class="text-xs tracking-wider text-white/50">{galacticData.nextTickDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
							</div>

							<!-- Big Countdown Display -->
							<div class="flex flex-wrap justify-center gap-4 md:gap-6">
								<!-- Months -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider {currentColors.accent}">{String(galacticData.countdown.months).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">months</span>
								</div>
								<span class="text-4xl md:text-6xl font-extralight text-white/20 self-start mt-2">:</span>

								<!-- Weeks -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider {currentColors.accent}">{String(galacticData.countdown.weeks).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">weeks</span>
								</div>
								<span class="text-4xl md:text-6xl font-extralight text-white/20 self-start mt-2">:</span>

								<!-- Days -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider {currentColors.accent}">{String(galacticData.countdown.days).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">days</span>
								</div>
								<span class="text-4xl md:text-6xl font-extralight text-white/20 self-start mt-2">:</span>

								<!-- Hours -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider text-white/70">{String(galacticData.countdown.hours).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">hours</span>
								</div>
								<span class="text-4xl md:text-6xl font-extralight text-white/20 self-start mt-2">:</span>

								<!-- Minutes -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider text-white/70">{String(galacticData.countdown.minutes).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">min</span>
								</div>
								<span class="text-4xl md:text-6xl font-extralight text-white/20 self-start mt-2">:</span>

								<!-- Seconds -->
								<div class="flex flex-col items-center">
									<span class="text-5xl md:text-7xl font-extralight tracking-wider text-white/50 tabular-nums">{String(galacticData.countdown.seconds).padStart(2, '0')}</span>
									<span class="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">sec</span>
								</div>
							</div>

							<!-- Progress bar -->
							<div class="max-w-2xl mx-auto space-y-2 pt-4">
								<div class="h-1 bg-white/5 rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-amber-500/30 via-amber-400 to-yellow-400 transition-all duration-1000"
										style="width: {galacticData.progress}%"
									></div>
								</div>
								<p class="text-xs tracking-wider text-white/40">
									{galacticData.progress.toFixed(6)}% of current tick elapsed
								</p>
							</div>
						</div>
					</div>

					<!-- Stats Grid -->
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div class="bg-white/[0.02] border {currentColors.border} p-4 text-center">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-1">Days Per Tick</p>
							<p class="text-2xl font-light tracking-wider {currentColors.accent}">{DAYS_PER_TICK}</p>
						</div>
						<div class="bg-white/[0.02] border {currentColors.border} p-4 text-center">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-1">Years Per Tick</p>
							<p class="text-2xl font-light tracking-wider {currentColors.accent}">{YEARS_PER_TICK}</p>
						</div>
						<div class="bg-white/[0.02] border {currentColors.border} p-4 text-center">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-1">Galactic Year</p>
							<p class="text-2xl font-light tracking-wider {currentColors.accent}">225<span class="text-sm text-white/40">M yrs</span></p>
						</div>
						<div class="bg-white/[0.02] border {currentColors.border} p-4 text-center">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-1">Ticks Per Orbit</p>
							<p class="text-2xl font-light tracking-wider {currentColors.accent}">129.6<span class="text-sm text-white/40">M</span></p>
						</div>
					</div>

					<!-- Upcoming Ticks Table -->
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase mb-4">Upcoming Galactic Tick Days</h3>
						<div class="overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b border-white/10">
										<th class="text-left py-2 px-3 text-[10px] tracking-wider text-white/40 uppercase">Tick</th>
										<th class="text-left py-2 px-3 text-[10px] tracking-wider text-white/40 uppercase">Date</th>
										<th class="text-left py-2 px-3 text-[10px] tracking-wider text-white/40 uppercase">Status</th>
									</tr>
								</thead>
								<tbody>
									<tr class="border-b border-white/5">
										<td class="py-2 px-3 {currentColors.accent}">239th</td>
										<td class="py-2 px-3 text-white/70">September 10, 2023</td>
										<td class="py-2 px-3"><span class="text-[10px] tracking-wider text-white/30 uppercase">Passed</span></td>
									</tr>
									<tr class="border-b border-white/5">
										<td class="py-2 px-3 {currentColors.accent}">240th</td>
										<td class="py-2 px-3 text-white/70">June 5, 2025</td>
										<td class="py-2 px-3"><span class="text-[10px] tracking-wider text-white/30 uppercase">Passed</span></td>
									</tr>
									<tr class="border-b border-white/5 bg-amber-500/5">
										<td class="py-2 px-3 {currentColors.accent} font-medium">241st</td>
										<td class="py-2 px-3 text-white/90">March 1, 2027</td>
										<td class="py-2 px-3"><span class="text-[10px] tracking-wider {currentColors.accent} uppercase">Next</span></td>
									</tr>
									<tr class="border-b border-white/5">
										<td class="py-2 px-3 {currentColors.accent}">242nd</td>
										<td class="py-2 px-3 text-white/70">November 24, 2028</td>
										<td class="py-2 px-3"><span class="text-[10px] tracking-wider text-white/30 uppercase">Future</span></td>
									</tr>
									<tr class="border-b border-white/5">
										<td class="py-2 px-3 {currentColors.accent}">243rd</td>
										<td class="py-2 px-3 text-white/70">August 20, 2030</td>
										<td class="py-2 px-3"><span class="text-[10px] tracking-wider text-white/30 uppercase">Future</span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Info Panel -->
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase mb-4">What is the Galactic Tick?</h3>
						<div class="space-y-4 text-sm text-white/60 leading-relaxed">
							<p>
								A <span class="{currentColors.accent}">Galactic Tick</span> is one centi-arcsecond of our Solar System's orbit around the Milky Way's center.
								The Sun travels at about <span class="{currentColors.accent}">828,000 km/h</span> around the galactic center, taking roughly
								<span class="{currentColors.accent}">225 million years</span> to complete one full orbit - a galactic year.
							</p>
							<p>
								Each tick represents <span class="{currentColors.accent}">1.7361 Earth years</span> (about 633.7 days). The first tick was retroactively
								set to <span class="{currentColors.accent}">October 2, 1608</span> - the day Hans Lippershey filed the patent for the telescope,
								marking humanity's first step toward understanding our place in the cosmos.
							</p>
							<p>
								Since the Sun formed about 4.6 billion years ago, we've completed roughly <span class="{currentColors.accent}">20 galactic orbits</span>.
								When the dinosaurs roamed Earth 65 million years ago, we were on the opposite side of our current position in the galaxy!
							</p>
							<p class="text-xs text-white/40 pt-2 border-t border-white/5">
								The Galactic Tick concept was created to give humans a cosmic perspective on time, similar to how we track Earth's orbit
								around the Sun with years.
							</p>
						</div>
					</div>
				</div>

			<!-- Constellations Section -->
			{:else if activeSection === 'constellations'}
				<div class="flex flex-col lg:flex-row gap-6">
					<!-- Culture Selector (Left Column) - Sticky on desktop -->
					<div class="lg:w-56 flex-shrink-0 space-y-2 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						<p class="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-3">Select Culture</p>
						{#each CONSTELLATION_CULTURES as culture}
							<button
								type="button"
								onclick={() => { selectedCulture = culture.id; selectedConstellation = null; }}
								class="w-full text-left p-3 border transition-all duration-200
									{selectedCulture === culture.id
										? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
										: 'bg-white/[0.02] border-white/10 text-white/50 hover:border-yellow-500/30 hover:text-white/70'}"
							>
								<div class="text-sm tracking-wider uppercase">{culture.name}</div>
								<div class="text-[10px] tracking-wider {selectedCulture === culture.id ? 'text-yellow-400/70' : 'text-white/30'}">{culture.subtitle}</div>
							</button>
						{/each}
					</div>

					<!-- Constellation Grid (Main Area) -->
					<div class="flex-1 space-y-4">
						<!-- Header with sort options -->
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase">
									{CONSTELLATION_CULTURES.find(c => c.id === selectedCulture)?.name}
								</h3>
								<p class="text-[10px] tracking-wider text-white/40">
									{CONSTELLATION_CULTURES.find(c => c.id === selectedCulture)?.description}
								</p>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-[10px] tracking-wider text-white/30 uppercase">Sort:</span>
								<button
									type="button"
									onclick={() => constellationSort = 'alpha'}
									class="px-2 py-1 text-[10px] tracking-wider uppercase transition-all
										{constellationSort === 'alpha' ? 'text-yellow-400 bg-yellow-500/20' : 'text-white/40 hover:text-white/60'}"
								>A-Z</button>
								<button
									type="button"
									onclick={() => constellationSort = 'size'}
									class="px-2 py-1 text-[10px] tracking-wider uppercase transition-all
										{constellationSort === 'size' ? 'text-yellow-400 bg-yellow-500/20' : 'text-white/40 hover:text-white/60'}"
								>Size</button>
							</div>
						</div>

						<!-- Constellation Cards Grid -->
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
							{#each sortedConstellations() as constellation (constellation.name)}
								{@const hasEcliptic = constellation.onEcliptic}
								{@const hasEquator = constellation.onEquator}
								{@const hasBoth = hasEcliptic && hasEquator}
								<button
									type="button"
									onclick={() => openConstellationDetail(constellation)}
									class="text-left p-4 border transition-all duration-200 hover:scale-[1.02] group
										{hasBoth
											? 'bg-amber-500/15 border-yellow-400/60 shadow-[0_0_12px_rgba(234,179,8,0.4)] hover:shadow-[0_0_16px_rgba(234,179,8,0.5)]'
											: hasEcliptic
												? 'bg-amber-500/15 border-white/20 hover:border-white/30'
												: hasEquator
													? 'bg-transparent border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_14px_rgba(234,179,8,0.4)]'
													: 'bg-white/[0.02] border-white/10 hover:border-white/30'}"
								>
									<!-- Header -->
									<div class="flex items-start justify-between mb-2">
										<div>
											<h4 class="text-sm font-medium tracking-wider text-white/90 group-hover:text-white">{constellation.name}</h4>
											<p class="text-[10px] tracking-wider {hasEcliptic || hasEquator ? 'text-amber-400/70' : 'text-white/40'}">{constellation.meaning}</p>
										</div>
										{#if constellation.abbreviation}
											<span class="text-[10px] tracking-wider text-white/20 uppercase">{constellation.abbreviation}</span>
										{/if}
									</div>

									<!-- Stats -->
									<div class="grid grid-cols-2 gap-2 text-[10px] mb-2">
										<div>
											<span class="text-white/30">Stars:</span>
											<span class="text-white/60 ml-1">{constellation.stars}</span>
										</div>
										<div>
											<span class="text-white/30">Brightest:</span>
											<span class="text-white/60 ml-1">{constellation.brightest}</span>
										</div>
									</div>

									<!-- Coordinates -->
									<div class="text-[10px] text-white/30 border-t border-white/5 pt-2">
										<span class="text-white/20">RA:</span> {constellation.ra}
										<span class="text-white/20 ml-2">Dec:</span> {constellation.dec}
									</div>

									<!-- Celestial path badges -->
									{#if hasEcliptic || hasEquator}
										<div class="mt-2 flex flex-wrap gap-1">
											{#if hasEcliptic}
												<span class="text-[9px] tracking-wider text-amber-300 uppercase px-1.5 py-0.5 bg-amber-500/30 border border-amber-500/20">☉ Ecliptic</span>
											{/if}
											{#if hasEquator}
												<span class="text-[9px] tracking-wider text-yellow-300 uppercase px-1.5 py-0.5 bg-transparent border border-yellow-400/60 shadow-[0_0_6px_rgba(234,179,8,0.3)]">☽ Equatorial</span>
											{/if}
										</div>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Constellation Detail Overlay -->
				{#if selectedConstellation}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick={closeConstellationDetail} onkeydown={(e) => e.key === 'Escape' && closeConstellationDetail()} role="dialog" aria-modal="true" aria-label="Constellation details" tabindex="-1">
						<!-- Three Pane Container -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="flex flex-col xl:flex-row gap-4 max-w-7xl w-full max-h-[90vh]" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>

							<!-- Header Bar (spans both panes on mobile) -->
							<div class="lg:hidden bg-black border {currentColors.border} p-4">
								<div class="flex items-center justify-between">
									<div>
										<h3 class="text-xl font-light tracking-wider {currentColors.accent} uppercase">{selectedConstellation.name}</h3>
										<p class="text-xs tracking-wider text-white/50">{selectedConstellation.meaning}</p>
									</div>
									<button type="button" onclick={closeConstellationDetail} aria-label="Close dialog" class="text-white/40 hover:text-white/80 transition-colors p-2">
										<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>

							<!-- LEFT PANE: Science / Technical Data -->
							<div class="flex-1 bg-black border border-yellow-500/30 overflow-y-auto">
								<!-- Pane Header -->
								<div class="border-b border-yellow-500/20 p-4 bg-yellow-500/5 sticky top-0">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-3">
											<div class="w-8 h-8 bg-yellow-500/20 flex items-center justify-center">
												<svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
												</svg>
											</div>
											<div>
												<h4 class="text-sm tracking-[0.2em] text-yellow-400 uppercase font-medium">Science</h4>
												<p class="text-[10px] text-white/40">Technical Data</p>
											</div>
										</div>
										<!-- Desktop close button -->
										<button type="button" onclick={closeConstellationDetail} aria-label="Close dialog" class="hidden lg:block text-white/40 hover:text-white/80 transition-colors p-1">
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</div>
								</div>

								<div class="p-4 space-y-4">
									<!-- Constellation Name (Desktop) -->
									<div class="hidden lg:block pb-3 border-b border-white/5">
										<h3 class="text-2xl font-light tracking-wider text-white/90">{selectedConstellation.name}</h3>
										<p class="text-sm tracking-wider text-white/40">{selectedConstellation.meaning}</p>
										{#if selectedConstellation.onEcliptic || selectedConstellation.onEquator}
											<div class="flex flex-wrap gap-2 mt-2">
												{#if selectedConstellation.onEcliptic}
													<span class="inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase bg-amber-500/30 text-amber-300 border border-amber-500/20">☉ Ecliptic Path</span>
												{/if}
												{#if selectedConstellation.onEquator}
													<span class="inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase bg-transparent text-yellow-300 border border-yellow-400/60 shadow-[0_0_8px_rgba(234,179,8,0.4)]">☽ Celestial Equator</span>
												{/if}
											</div>
										{/if}
									</div>

									<!-- Position Data -->
									<div class="grid grid-cols-2 gap-3">
										<div class="p-3 bg-yellow-500/5 border border-yellow-500/20">
											<p class="text-[10px] tracking-wider text-yellow-400/60 uppercase">Right Ascension</p>
											<p class="text-lg font-light text-white/90">{selectedConstellation.ra}</p>
										</div>
										<div class="p-3 bg-yellow-500/5 border border-yellow-500/20">
											<p class="text-[10px] tracking-wider text-yellow-400/60 uppercase">Declination</p>
											<p class="text-lg font-light text-white/90">{selectedConstellation.dec}</p>
										</div>
									</div>

									<!-- Stats Grid -->
									<div class="grid grid-cols-3 gap-3">
										<div class="text-center p-3 bg-white/[0.02] border border-white/10">
											<p class="text-[10px] tracking-wider text-white/30 uppercase">Stars</p>
											<p class="text-xl font-light text-yellow-400">{selectedConstellation.stars}</p>
										</div>
										<div class="text-center p-3 bg-white/[0.02] border border-white/10">
											<p class="text-[10px] tracking-wider text-white/30 uppercase">Brightest</p>
											<p class="text-sm font-light text-white/80">{selectedConstellation.brightest}</p>
											{#if selectedConstellation.brightestMag !== undefined}
												<p class="text-[10px] text-yellow-400/70">mag {selectedConstellation.brightestMag}</p>
											{/if}
										</div>
										<div class="text-center p-3 bg-white/[0.02] border border-white/10">
											<p class="text-[10px] tracking-wider text-white/30 uppercase">Area</p>
											<p class="text-sm font-light text-white/80">{selectedConstellation.area ? `${selectedConstellation.area} sq°` : '—'}</p>
											{#if selectedConstellation.quadrant}
												<p class="text-[10px] text-white/40">{selectedConstellation.quadrant}</p>
											{/if}
										</div>
									</div>

									<!-- Major Stars Table -->
									{#if selectedConstellation.majorStars && selectedConstellation.majorStars.length > 0}
										<div class="border-t border-white/5 pt-4">
											<h5 class="text-[10px] tracking-[0.2em] text-yellow-400/70 uppercase mb-3 flex items-center gap-2">
												<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>
												Major Stars
											</h5>
											<div class="overflow-x-auto">
												<table class="w-full text-xs">
													<thead>
														<tr class="border-b border-yellow-500/20">
															<th class="text-left py-2 px-2 text-[9px] tracking-wider text-yellow-400/50 uppercase">Star</th>
															<th class="text-left py-2 px-2 text-[9px] tracking-wider text-yellow-400/50 uppercase">ID</th>
															<th class="text-left py-2 px-2 text-[9px] tracking-wider text-yellow-400/50 uppercase">Mag</th>
															<th class="text-left py-2 px-2 text-[9px] tracking-wider text-yellow-400/50 uppercase">Dist</th>
															<th class="text-left py-2 px-2 text-[9px] tracking-wider text-yellow-400/50 uppercase">Type</th>
														</tr>
													</thead>
													<tbody>
														{#each selectedConstellation.majorStars as star}
															<tr class="border-b border-white/5 hover:bg-yellow-500/5">
																<td class="py-2 px-2 text-yellow-400">{star.name}</td>
																<td class="py-2 px-2 text-white/40">{star.designation}</td>
																<td class="py-2 px-2 text-white/70">{star.magnitude}</td>
																<td class="py-2 px-2 text-white/50">{star.distance}</td>
																<td class="py-2 px-2 text-white/30 text-[10px]">{star.spectralType}</td>
															</tr>
														{/each}
													</tbody>
												</table>
											</div>
										</div>
									{/if}

									{#if selectedConstellation.abbreviation}
										<div class="text-[10px] text-white/30 pt-2 border-t border-white/5">
											IAU Abbreviation: <span class="text-yellow-400/70">{selectedConstellation.abbreviation}</span>
										</div>
									{/if}
								</div>
							</div>

							<!-- RIGHT PANE: Mythology / Humanities -->
							<div class="flex-1 bg-black border border-amber-500/30 overflow-y-auto">
								<!-- Pane Header -->
								<div class="border-b border-amber-500/20 p-4 bg-amber-500/5 sticky top-0">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-amber-500/20 flex items-center justify-center">
											<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
											</svg>
										</div>
										<div>
											<h4 class="text-sm tracking-[0.2em] text-amber-400 uppercase font-medium">Mythology</h4>
											<p class="text-[10px] text-white/40">Stories & Meaning</p>
										</div>
									</div>
								</div>

								<div class="p-4 space-y-5">
									{#if selectedConstellation.mythologyDetails}
										<!-- The Figure -->
										{#if selectedConstellation.mythologyDetails.figure}
											<div>
												<h5 class="text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2 flex items-center gap-2">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
													Who is {selectedConstellation.name}?
												</h5>
												<p class="text-sm text-white/70 leading-relaxed">{selectedConstellation.mythologyDetails.figure}</p>
											</div>
										{/if}

										<!-- The Story -->
										{#if selectedConstellation.mythologyDetails.story}
											<div class="border-t border-amber-500/10 pt-4">
												<h5 class="text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2 flex items-center gap-2">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
													The Legend
												</h5>
												<p class="text-sm text-white/70 leading-relaxed">{selectedConstellation.mythologyDetails.story}</p>
											</div>
										{/if}

										<!-- Celestial Meaning -->
										{#if selectedConstellation.mythologyDetails.celestialMeaning}
											<div class="border-t border-amber-500/10 pt-4">
												<h5 class="text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2 flex items-center gap-2">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>
													Why is it There?
												</h5>
												<p class="text-sm text-white/70 leading-relaxed">{selectedConstellation.mythologyDetails.celestialMeaning}</p>
											</div>
										{/if}

										<!-- Cultural Significance -->
										{#if selectedConstellation.mythologyDetails.culturalSignificance}
											<div class="border-t border-amber-500/10 pt-4">
												<h5 class="text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2 flex items-center gap-2">
													<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
													Practical & Cultural Meaning
												</h5>
												<p class="text-sm text-white/70 leading-relaxed">{selectedConstellation.mythologyDetails.culturalSignificance}</p>
											</div>
										{/if}
									{:else}
										<!-- Fallback to simple mythology -->
										<div>
											<h5 class="text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2">Legend & Lore</h5>
											<p class="text-sm text-white/70 leading-relaxed">{selectedConstellation.mythology}</p>
										</div>
										<div class="p-4 bg-amber-500/5 border border-amber-500/20 text-center">
											<p class="text-xs text-white/40 italic">Detailed mythology coming soon for this constellation.</p>
										</div>
									{/if}
								</div>
							</div>

							<!-- THIRD PANE: Visual / Star Chart -->
							<div class="flex-1 bg-black border border-cyan-500/30 overflow-y-auto xl:max-w-sm">
								<!-- Pane Header -->
								<div class="border-b border-cyan-500/20 p-4 bg-cyan-500/5 sticky top-0">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 bg-cyan-500/20 flex items-center justify-center">
											<svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
											</svg>
										</div>
										<div>
											<h4 class="text-sm tracking-[0.2em] text-cyan-400 uppercase font-medium">Visual</h4>
											<p class="text-[10px] text-white/40">Star Chart</p>
										</div>
									</div>
								</div>

								<div class="p-4 space-y-4">
									{#if selectedConstellation.diagramUrl}
										<!-- Actual diagram when available -->
										<div class="aspect-square bg-gradient-to-b from-slate-900 to-black border border-cyan-500/20 overflow-hidden">
											<img
												src={selectedConstellation.diagramUrl}
												alt="{selectedConstellation.name} star chart"
												class="w-full h-full object-contain"
											/>
										</div>
										<p class="text-[10px] text-white/30 text-center">
											Star positions and connecting lines for {selectedConstellation.name}
										</p>
									{:else}
										<!-- Placeholder for future diagrams -->
										<div class="aspect-square bg-gradient-to-b from-slate-900 to-black border border-cyan-500/20 flex flex-col items-center justify-center p-6 relative overflow-hidden">
											<!-- Decorative stars background -->
											<div class="absolute inset-0 opacity-30">
												<div class="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full"></div>
												<div class="absolute top-[25%] left-[60%] w-1.5 h-1.5 bg-cyan-300 rounded-full"></div>
												<div class="absolute top-[40%] left-[30%] w-1 h-1 bg-white rounded-full"></div>
												<div class="absolute top-[35%] left-[75%] w-0.5 h-0.5 bg-white rounded-full"></div>
												<div class="absolute top-[55%] left-[45%] w-2 h-2 bg-yellow-200 rounded-full"></div>
												<div class="absolute top-[60%] left-[15%] w-1 h-1 bg-white rounded-full"></div>
												<div class="absolute top-[70%] left-[70%] w-1 h-1 bg-cyan-200 rounded-full"></div>
												<div class="absolute top-[80%] left-[40%] w-0.5 h-0.5 bg-white rounded-full"></div>
												<div class="absolute top-[85%] left-[85%] w-1 h-1 bg-white rounded-full"></div>
												<!-- Connecting lines hint -->
												<svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
													<line x1="20" y1="10" x2="60" y2="25" stroke="currentColor" stroke-width="0.3" class="text-cyan-400"/>
													<line x1="60" y1="25" x2="30" y2="40" stroke="currentColor" stroke-width="0.3" class="text-cyan-400"/>
													<line x1="30" y1="40" x2="45" y2="55" stroke="currentColor" stroke-width="0.3" class="text-cyan-400"/>
													<line x1="45" y1="55" x2="70" y2="70" stroke="currentColor" stroke-width="0.3" class="text-cyan-400"/>
												</svg>
											</div>

											<!-- Placeholder content -->
											<div class="relative z-10 text-center">
												<svg class="w-12 h-12 text-cyan-500/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-width="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
												</svg>
												<p class="text-sm text-cyan-400/70 font-medium tracking-wider uppercase mb-1">
													{selectedConstellation.name}
												</p>
												<p class="text-[10px] text-white/30">
													Star chart coming soon
												</p>
											</div>
										</div>

										<!-- Future feature note -->
										<div class="p-3 bg-cyan-500/5 border border-cyan-500/20 text-center">
											<p class="text-[10px] text-cyan-400/50 uppercase tracking-wider mb-1">Future Feature</p>
											<p class="text-xs text-white/40">
												Interactive star charts with labeled stars and constellation lines.
											</p>
										</div>
									{/if}

									<!-- Quick facts for the visual pane -->
									<div class="border-t border-cyan-500/10 pt-4 space-y-2">
										<h5 class="text-[10px] tracking-[0.2em] text-cyan-400/70 uppercase mb-2">Quick Reference</h5>
										<div class="grid grid-cols-2 gap-2 text-[10px]">
											<div class="p-2 bg-cyan-500/5 border border-cyan-500/10">
												<span class="text-white/30">Quadrant:</span>
												<span class="text-cyan-400/70 ml-1">{selectedConstellation.quadrant || '—'}</span>
											</div>
											<div class="p-2 bg-cyan-500/5 border border-cyan-500/10">
												<span class="text-white/30">Stars:</span>
												<span class="text-cyan-400/70 ml-1">{selectedConstellation.stars}</span>
											</div>
										</div>
										{#if selectedConstellation.abbreviation}
											<div class="text-[10px] text-white/30 text-center pt-2">
												IAU: "<span class="text-cyan-400/70">{selectedConstellation.abbreviation}</span>"
											</div>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

			<!-- Solar System Section -->
			{:else if activeSection === 'solar-system'}
				<div class="flex flex-col lg:flex-row gap-6">
					<!-- Category Sidebar -->
					<div class="lg:w-56 flex-shrink-0 space-y-2 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						{#each SOLAR_SYSTEM_CATEGORIES as category}
							<button
								onclick={() => { selectedSolarCategory = category.id; selectedSolarObject = null; }}
								class="w-full text-left p-3 border transition-all duration-200 {selectedSolarCategory === category.id
									? 'bg-orange-500/20 border-orange-500/50'
									: 'bg-white/[0.02] border-white/10 hover:border-orange-500/30'}"
							>
								<div class="flex items-center justify-between">
									<div>
										<div class="text-sm font-medium tracking-wider text-white/90">{category.name}</div>
										<div class="text-[10px] tracking-wider {selectedSolarCategory === category.id ? 'text-orange-400/70' : 'text-white/30'}">{category.subtitle}</div>
									</div>
									<span class="text-xs text-white/30">{category.count}</span>
								</div>
							</button>
						{/each}
					</div>

					<!-- Objects Grid -->
					<div class="flex-1">
						<div class="mb-4 flex items-center gap-4">
							<span class="text-xs tracking-[0.2em] text-orange-400/70 uppercase">
								{SOLAR_SYSTEM_CATEGORIES.find(c => c.id === selectedSolarCategory)?.name}
							</span>
							<span class="text-xs text-white/30">
								{SOLAR_SYSTEM_CATEGORIES.find(c => c.id === selectedSolarCategory)?.subtitle}
							</span>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							{#each getSolarSystemObjects(selectedSolarCategory) as obj}
								<button
									onclick={() => openSolarObject(obj)}
									class="group text-left bg-white/[0.02] border border-white/10 hover:border-orange-500/40 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
								>
									<div class="flex items-start gap-3">
										<div class="w-12 h-12 rounded-full {obj.color} flex-shrink-0 flex items-center justify-center">
											{#if obj.type === 'star'}
												<svg class="w-6 h-6 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
													<circle cx="12" cy="12" r="5"/>
													<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
												</svg>
											{:else if obj.type === 'comet'}
												<svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<circle cx="18" cy="6" r="3" stroke-width="2"/>
													<path stroke-width="2" d="M15 9l-12 12M14 10l-10 8M16 8l-8 10"/>
												</svg>
											{:else}
												<span class="text-lg font-bold text-white/70">{obj.name.charAt(0)}</span>
											{/if}
										</div>
										<div class="flex-1 min-w-0">
											<h4 class="text-sm font-medium tracking-wider text-white/90 group-hover:text-orange-400 transition-colors">{obj.name}</h4>
											<p class="text-[10px] tracking-wider text-orange-400/70 uppercase">{obj.subtype || obj.type}</p>
											<p class="text-xs text-white/50 mt-1">{obj.diameter}</p>
										</div>
									</div>
									<div class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
										<span class="text-[10px] text-white/30">{obj.distanceFromSun}</span>
										<span class="text-[10px] text-orange-400/50 uppercase tracking-wider group-hover:text-orange-400 transition-colors">Details →</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

			<!-- Hall of Fame Section -->
			{:else if activeSection === 'hall-of-fame'}
				<div class="space-y-8">
					<!-- In Memoriam - At the top to honor the fallen -->
					<div class="bg-white/[0.02] border border-white/20 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-white/80 uppercase">In Memoriam</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">Those who gave their lives in the pursuit of space exploration</p>
						<div class="space-y-4">
							{#each PIONEERS.memorial as fallen}
								<div class="bg-black/30 border border-white/10 p-4">
									<div class="flex items-start justify-between mb-2">
										<div>
											<h4 class="text-sm font-medium tracking-wider text-white/90">{fallen.name}</h4>
											<p class="text-[10px] tracking-wider text-white/50 uppercase">{fallen.mission} • {fallen.year}</p>
										</div>
										<span class="text-[10px] tracking-wider text-white/30 uppercase">{fallen.country}</span>
									</div>
									<p class="text-xs text-white/60 mb-1">{fallen.cause}</p>
									{#if fallen.members}
										<p class="text-[10px] text-white/40">{fallen.members}</p>
									{/if}
									{#if fallen.note}
										<p class="text-[10px] text-white/30 italic mt-1">{fallen.note}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Historic Firsts -->
					<div class="bg-white/[0.02] border border-amber-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-amber-400 uppercase">Historic Firsts</h3>
						</div>

						<!-- Orbital Firsts -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase mb-3 border-b border-amber-500/20 pb-2">Orbital Pioneers</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.firsts.filter(f => f.category === 'orbital') as person}
									<div class="bg-white/[0.02] border border-amber-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-amber-400/70">{person.mission} • {person.year}</p>
										<p class="text-xs text-amber-400">{person.achievement}</p>
										{#if person.duration}
											<p class="text-[10px] text-white/40">Duration: {person.duration}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- EVA Firsts -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase mb-3 border-b border-amber-500/20 pb-2">Spacewalk Pioneers</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
								{#each PIONEERS.firsts.filter(f => f.category === 'eva') as person}
									<div class="bg-white/[0.02] border border-amber-500/20 p-3 space-y-1">
										<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
										<p class="text-[10px] text-amber-400/70">{person.mission} • {person.year}</p>
										<p class="text-xs text-amber-400">{person.achievement}</p>
										{#if person.duration}
											<p class="text-[10px] text-white/40">{person.duration}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>

						<!-- Lunar Firsts -->
						<div>
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase mb-3 border-b border-amber-500/20 pb-2">Lunar Explorers</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
								{#each PIONEERS.firsts.filter(f => f.category === 'lunar') as person}
									<div class="bg-white/[0.02] border border-amber-500/20 p-3 space-y-1">
										<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
										<p class="text-[10px] text-amber-400/70">{person.mission} • {person.year}</p>
										<p class="text-xs text-amber-400">{person.achievement}</p>
										{#if person.duration}
											<p class="text-[10px] text-white/40">{person.duration}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Breaking Barriers -->
					<div class="bg-white/[0.02] border border-violet-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-violet-400 uppercase">Breaking Barriers</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">Pioneers who opened doors for underrepresented groups in space exploration</p>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{#each PIONEERS.barriers as person}
								<div class="bg-white/[0.02] border border-violet-500/20 p-3 space-y-1">
									<div class="flex items-start justify-between">
										<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
										<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
									</div>
									<p class="text-[10px] text-violet-400/70">{person.mission} • {person.year}</p>
									<p class="text-xs text-violet-400">{person.achievement}</p>
									{#if person.note}
										<p class="text-[10px] text-white/40 italic">{person.note}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Endurance Records -->
					<div class="bg-white/[0.02] border border-cyan-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-cyan-400 uppercase">Endurance Records</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">Those who pushed the limits of human duration in space</p>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{#each PIONEERS.endurance as person}
								<div class="bg-white/[0.02] border border-cyan-500/20 p-3 space-y-1">
									<div class="flex items-start justify-between">
										<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
										<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
									</div>
									<p class="text-[10px] text-cyan-400/70">{person.mission} • {person.year}</p>
									<p class="text-xs text-cyan-400">{person.achievement}</p>
									{#if person.note}
										<p class="text-[10px] text-white/40 italic">{person.note}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Station Commanders -->
					<div class="bg-white/[0.02] border border-emerald-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-emerald-400 uppercase">Station Commanders</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">Leaders of orbital outposts</p>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{#each PIONEERS.commanders as person}
								<div class="bg-white/[0.02] border border-emerald-500/20 p-3 space-y-1">
									<div class="flex items-start justify-between">
										<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
										<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
									</div>
									<p class="text-[10px] text-emerald-400/70">{person.mission} • {person.year}</p>
									<p class="text-xs text-emerald-400">{person.achievement}</p>
									{#if person.note}
										<p class="text-[10px] text-white/40 italic">{person.note}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<!-- Astronomers & Scientists -->
					<div class="bg-white/[0.02] border border-sky-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="3" stroke-width="1.5"/>
								<path stroke-width="1.5" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-sky-400 uppercase">Astronomers & Scientists</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">Those who expanded our understanding of the cosmos through observation, theory, and discovery</p>

						<!-- Ancient & Medieval -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-sky-400/70 uppercase mb-3 border-b border-sky-500/20 pb-2">Ancient & Medieval</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.astronomers.filter(a => a.category === 'ancient') as person}
									<div class="bg-white/[0.02] border border-sky-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-sky-400/70">{person.era}</p>
										<p class="text-xs text-sky-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Scientific Revolution -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-sky-400/70 uppercase mb-3 border-b border-sky-500/20 pb-2">Scientific Revolution</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.astronomers.filter(a => a.category === 'revolution') as person}
									<div class="bg-white/[0.02] border border-sky-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-sky-400/70">{person.era}</p>
										<p class="text-xs text-sky-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Classical Era (18th-19th Century) -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-sky-400/70 uppercase mb-3 border-b border-sky-500/20 pb-2">18th–19th Century</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.astronomers.filter(a => a.category === 'classical') as person}
									<div class="bg-white/[0.02] border border-sky-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-sky-400/70">{person.era}</p>
										<p class="text-xs text-sky-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Modern Era (20th Century) -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-sky-400/70 uppercase mb-3 border-b border-sky-500/20 pb-2">20th Century</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.astronomers.filter(a => a.category === 'modern') as person}
									<div class="bg-white/[0.02] border border-sky-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-sky-400/70">{person.era}</p>
										<p class="text-xs text-sky-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Contemporary -->
						<div>
							<h4 class="text-xs tracking-[0.2em] text-sky-400/70 uppercase mb-3 border-b border-sky-500/20 pb-2">Contemporary</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.astronomers.filter(a => a.category === 'contemporary') as person}
									<div class="bg-white/[0.02] border border-sky-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.country}</span>
										</div>
										<p class="text-[10px] text-sky-400/70">{person.era}</p>
										<p class="text-xs text-sky-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Unsung Heroes -->
					<div class="bg-white/[0.02] border border-rose-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-rose-400 uppercase">Unsung Heroes</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">The mathematicians, engineers, and support staff who made space exploration possible but rarely received recognition</p>

						<!-- Hidden Figures -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-rose-400/70 uppercase mb-3 border-b border-rose-500/20 pb-2">Hidden Figures — NASA Human Computers</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								{#each PIONEERS.unsungHeroes.filter(h => h.category === 'hidden-figures') as person}
									<div class="bg-white/[0.02] border border-rose-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.organization}</span>
										</div>
										<p class="text-[10px] text-rose-400/70">{person.role} • {person.era}</p>
										<p class="text-xs text-rose-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Engineers & Programmers -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-rose-400/70 uppercase mb-3 border-b border-rose-500/20 pb-2">Engineers & Programmers</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								{#each PIONEERS.unsungHeroes.filter(h => h.category === 'engineers') as person}
									<div class="bg-white/[0.02] border border-rose-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.organization}</span>
										</div>
										<p class="text-[10px] text-rose-400/70">{person.role} • {person.era}</p>
										<p class="text-xs text-rose-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Mission Control -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-rose-400/70 uppercase mb-3 border-b border-rose-500/20 pb-2">Mission Control Heroes</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.unsungHeroes.filter(h => h.category === 'mission-control') as person}
									<div class="bg-white/[0.02] border border-rose-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.organization}</span>
										</div>
										<p class="text-[10px] text-rose-400/70">{person.role} • {person.era}</p>
										<p class="text-xs text-rose-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Support & Mercury 13 -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-rose-400/70 uppercase mb-3 border-b border-rose-500/20 pb-2">Support Staff & Mercury 13</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.unsungHeroes.filter(h => h.category === 'support') as person}
									<div class="bg-white/[0.02] border border-rose-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.organization}</span>
										</div>
										<p class="text-[10px] text-rose-400/70">{person.role} • {person.era}</p>
										<p class="text-xs text-rose-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- International Contributors -->
						<div>
							<h4 class="text-xs tracking-[0.2em] text-rose-400/70 uppercase mb-3 border-b border-rose-500/20 pb-2">International Contributors</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.unsungHeroes.filter(h => h.category === 'international') as person}
									<div class="bg-white/[0.02] border border-rose-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{person.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{person.organization}</span>
										</div>
										<p class="text-[10px] text-rose-400/70">{person.role} • {person.era}</p>
										<p class="text-xs text-rose-400">{person.achievement}</p>
										<p class="text-[10px] text-white/40 italic">{person.contribution}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Animal Pioneers -->
					<div class="bg-white/[0.02] border border-orange-500/30 p-6">
						<div class="flex items-center gap-3 mb-4">
							<svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
							</svg>
							<h3 class="text-lg font-medium tracking-wider text-orange-400 uppercase">Animal Pioneers</h3>
						</div>
						<p class="text-xs text-white/40 mb-4">In honor of the brave creatures who paved the way for human spaceflight</p>

						<!-- Suborbital -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase mb-3 border-b border-orange-500/20 pb-2">Suborbital Flights</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.animals.filter(a => a.category === 'suborbital') as animal}
									<div class="bg-white/[0.02] border border-orange-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{animal.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{animal.country}</span>
										</div>
										<p class="text-[10px] text-orange-400/70">{animal.species} • {animal.year}</p>
										<p class="text-xs text-white/50">{animal.mission}</p>
										<p class="text-xs text-orange-400">{animal.achievement}</p>
										<p class="text-[10px] text-white/30 italic">{animal.fate}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Orbital -->
						<div class="mb-6">
							<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase mb-3 border-b border-orange-500/20 pb-2">Orbital Flights</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.animals.filter(a => a.category === 'orbital') as animal}
									<div class="bg-white/[0.02] border border-orange-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{animal.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{animal.country}</span>
										</div>
										<p class="text-[10px] text-orange-400/70">{animal.species} • {animal.year}</p>
										<p class="text-xs text-white/50">{animal.mission}</p>
										<p class="text-xs text-orange-400">{animal.achievement}</p>
										<p class="text-[10px] text-white/30 italic">{animal.fate}</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Deep Space & Modern -->
						<div>
							<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase mb-3 border-b border-orange-500/20 pb-2">Deep Space & Modern Era</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{#each PIONEERS.animals.filter(a => a.category === 'deep' || a.category === 'modern') as animal}
									<div class="bg-white/[0.02] border border-orange-500/20 p-3 space-y-1">
										<div class="flex items-start justify-between">
											<h5 class="text-sm font-medium text-white/90">{animal.name}</h5>
											<span class="text-[10px] text-white/30 uppercase">{animal.country}</span>
										</div>
										<p class="text-[10px] text-orange-400/70">{animal.species} • {animal.year}</p>
										<p class="text-xs text-white/50">{animal.mission}</p>
										<p class="text-xs text-orange-400">{animal.achievement}</p>
										<p class="text-[10px] text-white/30 italic">{animal.fate}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Link to Complete Astronaut Lists -->
					<div class="bg-white/[0.02] border border-white/10 p-6 text-center">
						<h3 class="text-sm font-medium tracking-wider text-white/70 uppercase mb-4">Complete Astronaut Records</h3>
						<p class="text-xs text-white/40 mb-4">For comprehensive lists of all astronauts, cosmonauts, and taikonauts:</p>
						<div class="flex flex-wrap justify-center gap-3">
							<a href="https://www.nasa.gov/humans-in-space/astronauts/" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-amber-500/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-500/50 text-xs tracking-wider uppercase transition-colors">NASA Astronaut Corps</a>
							<a href="https://www.spacefacts.de/english/e_astronauts.htm" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-cyan-500/30 text-cyan-400/70 hover:text-cyan-400 hover:border-cyan-500/50 text-xs tracking-wider uppercase transition-colors">Spacefacts Database</a>
							<a href="https://www.worldspaceflight.com/bios/astronauts.php" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-violet-500/30 text-violet-400/70 hover:text-violet-400 hover:border-violet-500/50 text-xs tracking-wider uppercase transition-colors">World Spaceflight</a>
							<a href="https://en.wikipedia.org/wiki/List_of_space_travelers_by_name" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-emerald-500/30 text-emerald-400/70 hover:text-emerald-400 hover:border-emerald-500/50 text-xs tracking-wider uppercase transition-colors">Wikipedia List</a>
						</div>
					</div>
				</div>

			<!-- Cosmic Distance Ladder Section -->
			{:else if activeSection === 'cosmic-ladder'}
				<div class="space-y-6">
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase mb-4">The Cosmic Distance Ladder</h3>
						<p class="text-sm text-white/50 mb-6">
							How astronomers measure distances across the universe, building from nearby objects to the edge of the observable cosmos.
						</p>
						<div class="space-y-3">
							{#each DISTANCE_METHODS as method, i}
								<div class="flex items-stretch gap-4 bg-white/[0.02] border border-white/5 overflow-hidden">
									<div class="w-2 {method.color}"></div>
									<div class="flex-1 p-4">
										<div class="flex items-start justify-between">
											<div>
												<h4 class="text-sm font-medium tracking-wider text-white/90">{method.name}</h4>
												<p class="text-[10px] tracking-wider {currentColors.text} uppercase">{method.range}</p>
											</div>
											<span class="text-[10px] tracking-wider text-white/30 uppercase">Accuracy: {method.accuracy}</span>
										</div>
										<p class="text-xs text-white/50 mt-2">{method.description}</p>
									</div>
									<div class="flex items-center px-4 text-2xl font-light text-white/10">{i + 1}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

			<!-- HR Diagram Section -->
			{:else if activeSection === 'hr-diagram'}
				<div class="space-y-6">
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase mb-4">Stellar Classification</h3>
						<p class="text-sm text-white/50 mb-6">
							Stars are classified by spectral type (O, B, A, F, G, K, M) based on temperature and color.
							Remember: <span class="{currentColors.accent}">"Oh Be A Fine Girl/Guy, Kiss Me"</span>
						</p>
						<div class="space-y-3">
							{#each STAR_TYPES as star}
								<div class="flex items-stretch gap-4 bg-white/[0.02] border border-white/5 overflow-hidden">
									<div class="w-12 {star.color} flex items-center justify-center">
										<span class="text-lg font-bold text-black/50">{star.class}</span>
									</div>
									<div class="flex-1 p-4">
										<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
											<div>
												<p class="text-white/30 uppercase text-[10px]">Temperature</p>
												<p class="text-white/70">{star.temp}</p>
											</div>
											<div>
												<p class="text-white/30 uppercase text-[10px]">Mass</p>
												<p class="text-white/70">{star.mass}</p>
											</div>
											<div>
												<p class="text-white/30 uppercase text-[10px]">Luminosity</p>
												<p class="text-white/70">{star.luminosity}</p>
											</div>
											<div>
												<p class="text-white/30 uppercase text-[10px]">Lifespan</p>
												<p class="text-white/70">{star.lifespan}</p>
											</div>
										</div>
										<p class="text-xs {currentColors.text} mt-2">Examples: {star.examples}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/50 text-center">
				Data compiled from <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer" class="{currentColors.text} hover:opacity-100 transition-colors">NASA</a>,
				<a href="https://iau.org" target="_blank" rel="noopener noreferrer" class="{currentColors.text} hover:opacity-100 transition-colors">IAU</a>, and
				<a href="https://galactictick.com" target="_blank" rel="noopener noreferrer" class="{currentColors.text} hover:opacity-100 transition-colors">Galactic Tick</a>
			</p>
		</div>
	</footer>
</div>

<!-- Solar Object Detail Modal (outside main container for proper layering) -->
{#if selectedSolarObject}
	<div
		class="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
		onclick={(e) => { if (e.target === e.currentTarget) closeSolarObject(); }}
		onkeydown={(e) => { if (e.key === 'Escape') closeSolarObject(); }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="flex flex-col xl:flex-row gap-4 max-w-7xl w-full max-h-[90vh]" onclick={(e) => e.stopPropagation()} role="presentation">
			<!-- FIRST PANE: Science Data (Orange) -->
			<div class="flex-1 bg-zinc-950 border border-orange-500/30 overflow-y-auto">
				<div class="border-b border-orange-500/20 p-4 bg-zinc-950 sticky top-0 z-10">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full {selectedSolarObject.color} flex items-center justify-center">
								{#if selectedSolarObject.type === 'star'}
									<svg class="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
										<circle cx="12" cy="12" r="5"/>
									</svg>
								{:else}
									<span class="text-sm font-bold text-white/70">{selectedSolarObject.name.charAt(0)}</span>
								{/if}
							</div>
							<div>
								<h3 class="text-xl font-light tracking-wider text-orange-400 uppercase">{selectedSolarObject.name}</h3>
								<p class="text-xs tracking-wider text-white/50">{selectedSolarObject.subtype || selectedSolarObject.type}</p>
							</div>
						</div>
						<button onclick={closeSolarObject} class="text-white/50 hover:text-white p-2" aria-label="Close details">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					</div>
				</div>

				<div class="p-4 space-y-4">
					<!-- Physical Characteristics -->
					<div class="space-y-2">
						<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase">Physical Characteristics</h4>
						<div class="grid grid-cols-2 gap-2 text-xs">
							<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
								<span class="text-white/40">Diameter:</span>
								<span class="text-white/80 ml-1">{selectedSolarObject.diameter}</span>
							</div>
							<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
								<span class="text-white/40">Mass:</span>
								<span class="text-white/80 ml-1">{selectedSolarObject.mass}</span>
							</div>
							{#if selectedSolarObject.gravity}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Gravity:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.gravity}</span>
								</div>
							{/if}
							{#if selectedSolarObject.density}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Density:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.density}</span>
								</div>
							{/if}
							{#if selectedSolarObject.rotationPeriod}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Rotation:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.rotationPeriod}</span>
								</div>
							{/if}
							{#if selectedSolarObject.axialTilt}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Axial Tilt:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.axialTilt}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Orbital Characteristics -->
					<div class="space-y-2">
						<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase">Orbital Data</h4>
						<div class="grid grid-cols-2 gap-2 text-xs">
							<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
								<span class="text-white/40">Distance:</span>
								<span class="text-white/80 ml-1">{selectedSolarObject.distanceFromSun}</span>
							</div>
							<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
								<span class="text-white/40">Orbital Period:</span>
								<span class="text-white/80 ml-1">{selectedSolarObject.orbitalPeriod}</span>
							</div>
							{#if selectedSolarObject.orbitalVelocity}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Velocity:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.orbitalVelocity}</span>
								</div>
							{/if}
							{#if selectedSolarObject.eccentricity}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Eccentricity:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.eccentricity}</span>
								</div>
							{/if}
							{#if selectedSolarObject.inclination}
								<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
									<span class="text-white/40">Inclination:</span>
									<span class="text-white/80 ml-1">{selectedSolarObject.inclination}</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Atmosphere/Composition -->
					{#if selectedSolarObject.atmosphere || selectedSolarObject.composition || selectedSolarObject.surfaceTemp}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase">Composition & Environment</h4>
							<div class="space-y-2 text-xs">
								{#if selectedSolarObject.surfaceTemp}
									<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
										<span class="text-white/40">Temperature:</span>
										<span class="text-white/80 ml-1">{selectedSolarObject.surfaceTemp}</span>
									</div>
								{/if}
								{#if selectedSolarObject.atmosphere}
									<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
										<span class="text-white/40">Atmosphere:</span>
										<span class="text-white/80 ml-1">{selectedSolarObject.atmosphere}</span>
									</div>
								{/if}
								{#if selectedSolarObject.composition}
									<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
										<span class="text-white/40">Composition:</span>
										<span class="text-white/80 ml-1">{selectedSolarObject.composition}</span>
									</div>
								{/if}
								{#if selectedSolarObject.magneticField}
									<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
										<span class="text-white/40">Magnetic Field:</span>
										<span class="text-white/80 ml-1">{selectedSolarObject.magneticField}</span>
									</div>
								{/if}
								{#if selectedSolarObject.rings}
									<div class="bg-white/[0.02] p-2 border-l-2 border-orange-500/30">
										<span class="text-white/40">Rings:</span>
										<span class="text-white/80 ml-1">{selectedSolarObject.rings}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Notable Features -->
					{#if selectedSolarObject.notableFeatures && selectedSolarObject.notableFeatures.length > 0}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-orange-400/70 uppercase">Notable Features</h4>
							<ul class="space-y-1 text-xs">
								{#each selectedSolarObject.notableFeatures as feature}
									<li class="flex items-start gap-2 text-white/70">
										<span class="text-orange-400 mt-0.5">•</span>
										{feature}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- NASA Fact Sheet Link -->
					{#if selectedSolarObject.nasaFactSheet}
						<a
							href={selectedSolarObject.nasaFactSheet}
							target="_blank"
							rel="noopener noreferrer"
							class="block text-center py-2 border border-orange-500/30 text-orange-400/70 hover:text-orange-400 hover:border-orange-500/50 text-xs tracking-wider uppercase transition-colors"
						>
							NASA Fact Sheet →
						</a>
					{/if}
				</div>
			</div>

			<!-- SECOND PANE: Humanities/Culture (Amber) -->
			<div class="flex-1 bg-zinc-950 border border-amber-500/30 overflow-y-auto">
				<div class="border-b border-amber-500/20 p-4 bg-zinc-950 sticky top-0 z-10">
					<div class="flex items-center gap-2">
						<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-width="1.5" d="M12 6.5V19M12 6.5C10.5 5 8 4 5 4v13c3 0 5.5 1 7 2.5M12 6.5C13.5 5 16 4 19 4v13c-3 0-5.5 1-7 2.5"/>
						</svg>
						<span class="text-sm tracking-[0.2em] text-amber-400 uppercase">Mythology & Culture</span>
					</div>
				</div>

				<div class="p-4 space-y-4">
					<!-- Etymology -->
					<div class="space-y-2">
						<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Etymology</h4>
						<p class="text-sm text-white/70 leading-relaxed">{selectedSolarObject.etymology}</p>
					</div>

					<!-- Mythology Origin -->
					{#if selectedSolarObject.mythologyOrigin}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Mythological Origin</h4>
							<p class="text-sm text-white/70 leading-relaxed">{selectedSolarObject.mythologyOrigin}</p>
						</div>
					{/if}

					<!-- Cultural Significance -->
					{#if selectedSolarObject.culturalSignificance}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Cultural Significance</h4>
							<p class="text-sm text-white/70 leading-relaxed">{selectedSolarObject.culturalSignificance}</p>
						</div>
					{/if}

					<!-- Historical Observations -->
					{#if selectedSolarObject.historicalObservations}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Historical Observations</h4>
							<p class="text-sm text-white/70 leading-relaxed">{selectedSolarObject.historicalObservations}</p>
						</div>
					{/if}

					<!-- Symbolism -->
					{#if selectedSolarObject.symbolism}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Symbolism</h4>
							<p class="text-sm text-white/70 leading-relaxed">{selectedSolarObject.symbolism}</p>
						</div>
					{/if}

					<!-- Missions Timeline -->
					{#if selectedSolarObject.missions && selectedSolarObject.missions.length > 0}
						<div class="space-y-2">
							<h4 class="text-xs tracking-[0.2em] text-amber-400/70 uppercase">Exploration History</h4>
							<div class="space-y-2">
								{#each selectedSolarObject.missions as mission}
									<div class="bg-white/[0.02] p-3 border-l-2 border-amber-500/30">
										<div class="flex items-center justify-between mb-1">
											<span class="text-sm text-white/90 font-medium">{mission.name}</span>
											<span class="text-xs text-amber-400/70">{mission.year}</span>
										</div>
										<div class="flex items-center gap-2 text-[10px] text-white/40">
											<span>{mission.agency}</span>
											<span>•</span>
											<span>{mission.type}</span>
										</div>
										{#if mission.notable}
											<p class="text-xs text-white/60 mt-1">{mission.notable}</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- THIRD PANE: Moons (Cyan) -->
			<div class="flex-1 bg-zinc-950 border border-cyan-500/30 overflow-y-auto xl:max-w-sm">
				<div class="border-b border-cyan-500/20 p-4 bg-zinc-950 sticky top-0 z-10">
					<div class="flex items-center gap-2">
						<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<circle cx="12" cy="12" r="9" stroke-width="1.5"/>
							<circle cx="12" cy="12" r="3" stroke-width="1.5"/>
						</svg>
						<span class="text-sm tracking-[0.2em] text-cyan-400 uppercase">
							{selectedSolarObject.moons && selectedSolarObject.moons.length > 0 ? 'Moons' : 'Quick Reference'}
						</span>
					</div>
				</div>

				<div class="p-4 space-y-4">
					{#if selectedSolarObject.moons && selectedSolarObject.moons.length > 0}
						<!-- Moon Count Badge -->
						{#if selectedSolarObject.moonCount && selectedSolarObject.moonCount > selectedSolarObject.moons.length}
							<div class="text-center py-2 bg-cyan-500/10 border border-cyan-500/20">
								<span class="text-sm text-cyan-400">{selectedSolarObject.moonCount} known moons</span>
								<span class="text-xs text-white/40 block">Showing {selectedSolarObject.moons.length} major moons</span>
							</div>
						{/if}

						<!-- Moon Cards -->
						<div class="space-y-3">
							{#each selectedSolarObject.moons as moon}
								<div class="bg-white/[0.02] border border-cyan-500/20 p-3">
									<div class="flex items-center justify-between mb-2">
										<h5 class="text-sm font-medium text-white/90">{moon.name}</h5>
										<span class="text-[10px] text-cyan-400/70">{moon.diameter}</span>
									</div>
									<p class="text-xs text-white/60 mb-2">{moon.description}</p>
									{#if moon.notable}
										<p class="text-xs text-cyan-400/70 italic">{moon.notable}</p>
									{/if}
									<div class="flex items-center gap-4 mt-2 pt-2 border-t border-white/5 text-[10px] text-white/40">
										<span>Orbit: {moon.orbitalPeriod}</span>
										{#if moon.discoveryYear}
											<span>Discovered: {moon.discoveryYear}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- No Moons - Show Quick Reference Instead -->
						<div class="text-center py-4 text-white/40">
							{#if selectedSolarObject.type === 'planet' && selectedSolarObject.moonCount === 0}
								<svg class="w-12 h-12 mx-auto mb-2 text-cyan-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<circle cx="12" cy="12" r="9" stroke-width="1" stroke-dasharray="4 2"/>
									<path stroke-width="1" d="M8 12a4 4 0 018 0" opacity="0.5"/>
								</svg>
								<p class="text-sm">No natural satellites</p>
								<p class="text-xs text-white/30 mt-1">{selectedSolarObject.name} has no moons</p>
							{:else}
								<svg class="w-12 h-12 mx-auto mb-2 text-cyan-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<circle cx="12" cy="12" r="9" stroke-width="1"/>
									<path stroke-width="1" d="M12 3v18M3 12h18" opacity="0.3"/>
								</svg>
								<p class="text-sm">Quick Reference</p>
							{/if}
						</div>

						<!-- Quick Stats Grid -->
						<div class="space-y-2">
							<div class="grid grid-cols-2 gap-2 text-xs">
								<div class="bg-cyan-500/5 p-2 text-center">
									<span class="block text-cyan-400/70 text-[10px] uppercase">Type</span>
									<span class="text-white/80">{selectedSolarObject.type}</span>
								</div>
								{#if selectedSolarObject.subtype}
									<div class="bg-cyan-500/5 p-2 text-center">
										<span class="block text-cyan-400/70 text-[10px] uppercase">Class</span>
										<span class="text-white/80 text-[11px]">{selectedSolarObject.subtype.split(' ')[0]}</span>
									</div>
								{/if}
							</div>

							{#if selectedSolarObject.moonCount !== undefined}
								<div class="bg-cyan-500/5 p-2 text-center text-xs">
									<span class="text-cyan-400/70 text-[10px] uppercase">Moon Count: </span>
									<span class="text-white/80">{selectedSolarObject.moonCount}</span>
								</div>
							{/if}
						</div>

						<!-- Decorative Element -->
						<div class="relative h-32 overflow-hidden opacity-30">
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="w-20 h-20 rounded-full {selectedSolarObject.color} opacity-50"></div>
								<div class="absolute w-32 h-32 border border-cyan-500/30 rounded-full animate-pulse"></div>
								<div class="absolute w-40 h-40 border border-cyan-500/20 rounded-full" style="animation: pulse 3s infinite;"></div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
