# Mars Explorer

A clean, modern interface for browsing NASA Mars rover imagery. All four rovers. 20+ years of data. No clunky government UI.

**[Live Demo](#)** (coming soon)

## Features

- **All 4 Mars Rovers**: Perseverance, Curiosity, Opportunity, and Spirit
- **Powerful Filters**: Sol range, Earth date range, camera selection, text search
- **Latest Photos Carousel**: See what Perseverance captured in the last 24 hours
- **Legacy Rover Support**: Spirit & Opportunity images from NASA's Planetary Data System archives
- **Clean UI**: Dark theme, responsive grid, lightbox viewer
- **No API Key Required**: Uses NASA's public APIs directly

## Why This Exists

NASA has incredible Mars imagery spanning 20+ years, but it's scattered across different archives with dated interfaces. This project makes that data accessible through a single, modern UI.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/mars-explorer.git
cd mars-explorer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **[SvelteKit 2](https://kit.svelte.dev/)** + **[Svelte 5](https://svelte.dev/)** - Frontend framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vercel](https://vercel.com/)** - Hosting (serverless functions for MER proxy)

## Data Sources

| Rover | Source | Notes |
|-------|--------|-------|
| Perseverance | [mars.nasa.gov/rss/api](https://mars.nasa.gov) | Active, latest images |
| Curiosity | [mars.nasa.gov/api/v1](https://mars.nasa.gov) | Active, latest images |
| Opportunity | [PDS Archive](https://planetarydata.jpl.nasa.gov) | Mission ended 2018, full archive |
| Spirit | [PDS Archive](https://planetarydata.jpl.nasa.gov) | Mission ended 2010, full archive |

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   └── nasa.ts              # API client for all rovers
│   ├── components/
│   │   ├── FilterPanel.svelte   # Search filters UI
│   │   ├── LatestPhotos.svelte  # Carousel of recent images
│   │   ├── Lightbox.svelte      # Full-screen image viewer
│   │   ├── PhotoGrid.svelte     # Image grid with lazy loading
│   │   ├── RoverSelector.svelte # Rover picker
│   │   ├── SupportSidebar.svelte
│   │   └── AdPlaceholder.svelte
│   └── types/
│       └── mars.ts              # TypeScript types
├── routes/
│   ├── +page.svelte             # Main page
│   └── api/
│       ├── mer/+server.ts       # Proxy for PDS directory listing
│       └── mer-image/+server.ts # Proxy for PDS images (CORS bypass)
└── docs/
    └── FUTURE_FEATURES.md       # Roadmap ideas
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Deploy (auto-detects SvelteKit)

The MER proxy endpoints require serverless functions, so static hosting (GitHub Pages) won't work for Spirit/Opportunity images.

## Contributing

Contributions welcome! Some ideas:

- [ ] Image download button
- [ ] Share to social media
- [ ] Favorites/collections
- [ ] More rovers (InSight, Phoenix, etc.)
- [ ] Community tagging system (see [FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md))

## License

MIT - see [LICENSE](LICENSE)

---

**Data**: NASA/JPL-Caltech (public domain)
**Not affiliated with NASA**
