# Chess Dashboard

A full-stack chess analytics dashboard built with Next.js 14. Visualizes your game history, ratings, openings, and activity from **Chess.com** and **Lichess** — side by side.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Platform selector** — Chess.com, Lichess, or both at once
- **Player profile** — avatar, country, join date, followers, online status
- **Ratings overview** — current rating per time control (bullet / blitz / rapid / classical / daily / puzzles) with win/loss/draw bar
- **Rating history chart** — filterable line chart per time control
- **Win / Loss / Draw donut chart**
- **Results by time control** — stacked bar chart
- **Move accuracy chart** — trend line over last 100 games *(Chess.com only)*
- **Top openings** — most played openings with win rate, toggle between count and win%
- **Activity heatmap** — games per day of week × hour of day
- **Best wins** — highest-rated opponents you've defeated
- **Win & unbeaten streaks**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data fetching | SWR |
| Date utils | date-fns |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/chess-dashboard.git
cd chess-dashboard

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter any Chess.com or Lichess username.

No API keys required — all data is public.

## Usage

| URL | Description |
|-----|-------------|
| `/` | Landing page with platform selector |
| `/dashboard/chesscom/hikaru` | Chess.com dashboard |
| `/dashboard/lichess/DrNykterstein` | Lichess dashboard |
| `/dashboard/both/hikaru--DrNykterstein` | Both platforms side by side |

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/chess-dashboard)

Or manually:

```bash
npx vercel
```

No environment variables required for the base version.

## Project Structure

```
chess-dashboard/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── api/
│   │   ├── chesscom/route.ts           # Chess.com API proxy
│   │   └── lichess/route.ts            # Lichess API proxy
│   └── dashboard/[platform]/[username]/page.tsx
├── components/
│   ├── dashboard/                      # All dashboard widgets
│   └── landing/                        # Platform selector form
├── lib/
│   ├── chesscom/                       # Chess.com fetcher + normalizer
│   ├── lichess/                        # Lichess fetcher + normalizer
│   └── unified/                        # Shared types + data processors
└── hooks/
    └── useDashboardData.ts             # SWR hooks
```

## API Notes

- **Chess.com** — public API, no auth required. Proxied server-side to avoid CORS issues.
- **Lichess** — public API, no auth required. Games endpoint returns NDJSON.
- Data is cached for 1 hour (`s-maxage=3600`).

## License

MIT — see [LICENSE](LICENSE)
