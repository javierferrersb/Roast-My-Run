# Strava API Setup Guide

## Creating Strava API Credentials

1. Go to [Strava Settings > API](https://www.strava.com/settings/api)
2. Fill in the application details:
   - **Application Name**: Roast My Run
   - **Website**: `http://localhost:3000` (for local development)
   - **Authorization Callback Domain**: `localhost:3000`

## Authorization Callback Configuration

When prompted for the **Authorization Callback Domain**, use:

```
localhost:3000
```

For production, replace `localhost:3000` with your actual domain:

```
yourdomain.com
```

## OAuth Redirect URI

The full redirect URI for your app is:

```
http://localhost:3000/api/auth/strava/callback
```

This is the endpoint where Strava will redirect users after they authorize your app.

## Environment Variables

After creating your credentials, add them to `.env.local`:

```env
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/strava/callback
```

## Google Gemini API Setup

1. Go to [Google AI Studio](https://ai.google.dev)
2. Create a new API key
3. Add to `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## Testing OAuth Flow

Once credentials are set up:

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Click "Connect with Strava"
4. You'll be redirected to Strava login
5. After authorization, Strava redirects back to `/api/auth/strava/callback`
