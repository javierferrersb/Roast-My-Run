import { StravaActivity, StravaAccessTokenResponse } from "@/types/strava";

export async function getAccessToken(
  authCode: string,
): Promise<StravaAccessTokenResponse | null> {
  try {
    if (!authCode || authCode.trim().length === 0) {
      return null;
    }

    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return null;
    }

    const tokenUrl = "https://www.strava.com/api/v3/oauth/token";
    const requestBody = {
      client_id: parseInt(clientId, 10),
      client_secret: clientSecret,
      code: authCode,
      grant_type: "authorization_code",
    };

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return null;
    }

    const tokenData: StravaAccessTokenResponse = await response.json();
    return tokenData;
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<StravaAccessTokenResponse | null> {
  try {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (!clientId || !clientSecret || !refreshToken) {
      return null;
    }

    const tokenUrl = "https://www.strava.com/api/v3/oauth/token";
    const requestBody = {
      client_id: parseInt(clientId, 10),
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return null;
    }

    const tokenData: StravaAccessTokenResponse = await response.json();
    return tokenData;
  } catch (error) {
    console.error("Error refreshing Strava token:", error);
    return null;
  }
}

export async function getValidAccessToken(
  accessToken: string | undefined,
  refreshToken: string | undefined,
  expiresAtMs: string | undefined,
): Promise<{
  accessToken: string | null;
  newTokens: StravaAccessTokenResponse | null;
}> {
  const now = Date.now();
  const expirationBuffer = 60 * 1000; // Refresh 1 minute before expiration
  const expiry = expiresAtMs ? parseInt(expiresAtMs, 10) : 0;

  // If we have an access token and it's not expired (with buffer), return it
  if (accessToken && expiry > now + expirationBuffer) {
    return { accessToken, newTokens: null };
  }

  // If we have a refresh token, try to refresh
  if (refreshToken) {
    const newTokens = await refreshAccessToken(refreshToken);
    if (newTokens) {
      return { accessToken: newTokens.access_token, newTokens };
    }
  }

  return { accessToken: null, newTokens: null };
}

export async function getRecentActivities(
  accessToken: string,
  limit: number = 10,
): Promise<StravaActivity[]> {
  if (!accessToken || accessToken.trim().length === 0) {
    return [];
  }

  if (limit <= 0) {
    return [];
  }

  try {
    const activitiesUrl = `https://www.strava.com/api/v3/athlete/activities?per_page=${limit}&page=1`;

    const response = await fetch(activitiesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const activitiesData = await response.json();

    const activities: StravaActivity[] = activitiesData.map(
      (activity: any) => ({
        id: activity.id,
        name: activity.name,
        distance: activity.distance,
        moving_time: activity.moving_time,
        total_elevation_gain: activity.total_elevation_gain,
        average_heartrate: activity.average_heartrate,
        type: activity.type,
        start_date: activity.start_date,
        sport_type: activity.sport_type,
      }),
    );

    return activities;
  } catch (error) {
    return [];
  }
}
