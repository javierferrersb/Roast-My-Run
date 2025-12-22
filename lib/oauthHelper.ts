/**
 * Strava OAuth URL Builder
 */

/**
 * Build Strava OAuth authorization URL
 *
 * @returns Full URL to redirect user to Strava login
 *
 * Strava OAuth flow:
 * 1. Redirect user to this URL
 * 2. User logs in and approves permissions
 * 3. Strava redirects to STRAVA_REDIRECT_URI with authorization code
 * 4. Exchange code for access token at /api/auth/strava/callback
 */
export function buildStravaOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI ||
    "http://localhost:3000/api/auth/strava/callback";
  const scope = "activity:read_all";

  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
}
