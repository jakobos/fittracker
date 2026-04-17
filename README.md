# FitTracker

A calorie and fitness tracking web app built with React and TypeScript. Log meals and exercises, track weight, manage reusable templates, and visualize progress over time.

## Features

- **Onboarding / TDEE calculator** — first-run setup collects age, weight, height, gender, and activity level to compute a personalized daily calorie goal
- **Daily log** — navigate by date, log meals and exercises with calorie counts, and track body weight
- **Calorie balance** — net calories (consumed minus burned) displayed against your daily goal with a progress bar
- **Templates** — save frequently used meals and exercises for one-tap logging
- **Stats view** — charts for calorie history, weight trends, and exercise data via Recharts
- **Settings** — update daily goal or re-run the TDEE setup at any time
- **Persistent state** — data saved to `localStorage`, no backend required

## Tech Stack

| Layer         | Library                         |
| ------------- | ------------------------------- |
| UI            | React 19 + TypeScript           |
| Build         | Vite 6                          |
| Styling       | Tailwind CSS 4                  |
| Charts        | Recharts                        |
| Icons         | Lucide React                    |
| Animations    | Motion                          |
| Date handling | date-fns                        |
| AI (optional) | Google Gemini (`@google/genai`) |

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Set Gemini API key for AI features
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start dev server (port 3000, all interfaces) |
| `npm run build`   | Production build to `dist/`                  |
| `npm run preview` | Preview production build locally             |
| `npm run lint`    | Type-check with `tsc --noEmit`               |
| `npm run clean`   | Remove `dist/` directory                     |

## Project Structure

```
src/
  App.tsx              # Root component, tab navigation, layout
  main.tsx             # Entry point
  types.ts             # Shared TypeScript types
  index.css            # Global styles
  context/
    FitTrackerContext.tsx  # Global state (settings, daily data, templates)
    ToastContext.tsx       # Toast notification state
  views/
    Onboarding.tsx     # First-run TDEE setup wizard
    Dashboard.tsx      # Daily meal/exercise logging
    TemplatesView.tsx  # Saved meal and exercise templates
    StatsView.tsx      # Progress charts and statistics
  lib/
    utils.ts           # Utility functions (cn, etc.)
```

## Environment Variables

| Variable         | Required | Description                                    |
| ---------------- | -------- | ---------------------------------------------- |
| `GEMINI_API_KEY` | No       | Google Gemini API key for AI-assisted features |
