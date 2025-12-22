# Roast My Run

Connect your Strava account and get AI-generated roasts of your running activities using Google Gemini.

## Prerequisites

- Node.js 18+
- pnpm
- Strava API credentials (<https://www.strava.com/settings/api>)
- Google Gemini API key (<https://ai.google.dev>)

## Setup

1. Clone and install

```bash
git clone <repository-url>
cd roast-my-run
pnpm install
```

1. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `NEXT_PUBLIC_GEMINI_API_KEY`

1. Run development server

```bash
pnpm dev
```

Visit <http://localhost:3000>

## Build for Production

```bash
pnpm build
pnpm start
```
