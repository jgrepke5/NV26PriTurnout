# 2026 Nevada Primary Turnout Tracker

A journalism-style reporting site that displays turnout figures from the [2026 Nevada Primary Turnout Statistics](https://docs.google.com/spreadsheets/d/1vxtJSRNtDA6d8IG1UB-XDUuwKJOrk8xtDXazYEoLwG4/edit) Google Sheet. Data refreshes once per day at noon Pacific.

**Published tabs:** Statewide, County, Congressional, Legislative, Commission, Turnout Comparison by State (the raw **Data** tab is excluded; nationwide comparison uses rows 11–14 of the comparison tab on the Statewide page).

## Run locally

```bash
npm install
npm run sync    # optional locally — writes data/cache.json
npm run dev     # http://localhost:3000
```

On Vercel, data is cached in memory via Next.js (no filesystem writes).

## Deploy (Vercel)

1. Import this repo in [Vercel](https://vercel.com).
2. In **Project Settings → Build & Deployment**, set:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** leave **empty** (do not set `public` — that causes deploy errors)
3. Add `CRON_SECRET` in environment variables (any random string).
4. Deploy — `vercel.json` runs `/api/cron` daily at **19:00 UTC** (~noon Pacific during daylight saving; 11:00 AM during standard time). Vercel crons only accept UTC schedules.

The site also revalidates pages every 24 hours via Next.js `revalidate`.

## Manual refresh

```bash
npm run sync
```

Or `POST /api/sync?secret=YOUR_CRON_SECRET` if `CRON_SECRET` is set.

## Requirements

The spreadsheet must remain **Anyone with the link can view** so the public Google visualization API can be read without credentials.
