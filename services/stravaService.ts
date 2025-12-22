import { StravaActivity, StravaAccessTokenResponse } from "@/types/strava";

/**
 * Exchange an authorization code from Strava OAuth flow for an access token
 * @param authCode - The authorization code returned by Strava OAuth callback
 * @returns Promise resolving to an access token response with token and expiration info
 */
export async function getAccessToken(
  authCode: string
): Promise<StravaAccessTokenResponse | null> {
  try {
    // 1. Validate the authCode is not empty
    if (!authCode || authCode.trim().length === 0) {
      console.error("Authorization code is empty or invalid");
      return null;
    }

    // 2. Make POST request to Strava token endpoint
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Missing Strava credentials in environment variables");
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

    // 3. Handle rate limiting and Strava API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Strava API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Handle specific error cases
      if (response.status === 429) {
        console.error("Rate limited by Strava API");
      } else if (response.status === 401) {
        console.error("Invalid credentials or authorization code");
      }

      return null;
    }

    // 4. Parse and return the token response
    const tokenData: StravaAccessTokenResponse = await response.json();
    return tokenData;
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error
    );
    return null;
  }
}

/**
 * Retrieve recent activities for an authenticated user
 * @param accessToken - Valid Strava access token
 * @param limit - Maximum number of activities to retrieve (optional, defaults to 10)
 * @returns Promise resolving to an array of StravaActivity objects
 *
 * Steps to implement:
 * 1. Validate accessToken is not empty
 * 2. Make GET request to Strava activities endpoint with Authorization header
 * 3. Include pagination parameters (page, per_page) if needed
 * 4. Transform response to match StravaActivity interface
 * 5. Filter or sort activities as needed
 */
export async function getRecentActivities(
  accessToken: string,
  limit: number = 10
): Promise<StravaActivity[]> {
  if (!accessToken || accessToken.trim().length === 0) {
    console.error("Access token is empty or invalid");
    return [];
  }

  if (limit <= 0) {
    console.error("Limit must be a positive integer");
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Strava API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return [];
    }

    const activitiesData = await response.json();

    // Transform to StravaActivity[]
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
      })
    );

    return activities;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}
