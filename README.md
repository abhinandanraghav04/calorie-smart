# calorie-smart-mvp

A simple calorie tracking application with 7-day history visualization.

## Features

- **Dashboard**: Overview of your calorie tracking
- **7-Day History**: View per-day calorie totals for the last 7 days
- **Sparkline Charts**: Lightweight area charts showing daily calorie trends
- **Theme Support**: Automatic light/dark mode based on system preferences
- **Loading States**: Skeleton loaders for smooth UX
- **Empty States**: User-friendly messages when no data is available

## Tech Stack

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Recharts** - Lightweight charting library for sparklines
- **CSS Variables** - Theme support via CSS custom properties

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   └── history/route.ts # API endpoint for 7-day history data
│   ├── dashboard/page.tsx   # Dashboard view with navigation
│   ├── history/page.tsx     # History page with 7-day summary & chart
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles with theme support
├── data/
│   └── entries.ts           # Sample calorie entry data
├── lib/
│   └── aggregation.ts       # 7-day aggregation logic
└── public/                  # Static assets (favicons, etc.)
```

## History View Implementation

The history page demonstrates:

- **Accurate 7-day aggregation**: Aggregates per-day calorie totals from raw entries
- **Responsive sparkline charts**: Uses Recharts with area charts that adapt to theme
- **Loading skeletons**: Shows placeholder UI while data is loading
- **Empty state**: Displays helpful message when no data exists
- **Theme-aware**: Charts and colors automatically adjust to light/dark mode

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
