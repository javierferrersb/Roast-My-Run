# Roast My Run

A fun web app that connects to your Strava account and generates humorous AI roasts of your running activities.

## Features

- 🏃 **Strava Integration**: Connect your Strava account via OAuth
- 🤖 **AI Roasting**: Get your runs roasted by Google Gemini AI
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Brutalist UI**: Bold, high-contrast design

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Strava API credentials
- Google Gemini API key

## Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd roast-my-run
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Configure environment variables
   - Copy `.env.example` to `.env.local`
   - Fill in your Strava OAuth credentials (get from <https://www.strava.com/settings/api>)
   - Add your Google Gemini API key (get from <https://ai.google.dev>)

4. Run development server

   ```bash
   pnpm dev
   ```

   Open <http://localhost:3000> in your browser.

## Building for Production

```bash
pnpm build
pnpm start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **AI**: Google Generative AI SDK (Gemini 2.5 Flash)
- **Authentication**: Strava OAuth 2.0
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── activities/route.ts    # Fetch user's runs
│   │   ├── roast/route.ts          # Generate AI roast
│   │   └── auth/
│   │       └── strava/
│   │           ├── callback/       # OAuth callback handler
│   │           └── logout/         # Logout endpoint
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main page
│   └── globals.css                  # Global styles
├── components/                      # React components
├── services/                        # Strava API service
├── lib/                             # Utilities (OAuth, markdown parsing)
├── types/                           # TypeScript interfaces
└── public/                          # Static assets
```

## License

MIT
