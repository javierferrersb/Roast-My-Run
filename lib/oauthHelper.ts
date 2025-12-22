export function buildStravaOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI ||
    "http://localhost:3000/api/auth/strava/callback";
  const scope = "activity:read_all";

  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
}
