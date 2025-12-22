import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/activities
 *
 * Fetch recent Strava activities for authenticated user.
 *
 * Requires: strava_access_token cookie (HTTP-only)
 * Query: ?limit=10 (optional)
 *
 * Response: StravaActivity[]
 *
 * Errors:
 * - 401: Not authenticated (missing/expired token)
 * - 500: Strava API error
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Extract access token from cookies
    const accessToken = request.cookies.get("strava_access_token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Parse query parameters
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // 3. Fetch recent activities from Strava
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${limit}&page=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      const errorData = await activitiesResponse.json().catch(() => ({}));
      console.error("Strava API error:", {
        status: activitiesResponse.status,
        data: errorData,
      });
      return NextResponse.json(
        { error: "Failed to fetch activities from Strava" },
        { status: 500 }
      );
    }
    const activities = await activitiesResponse.json();

    // 4. Return activities as JSON
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
