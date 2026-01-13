import { NextRequest, NextResponse } from "next/server";
import {
  getValidAccessToken,
  getRecentActivities,
} from "@/services/stravaService";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("strava_access_token")?.value;
    const refreshToken = request.cookies.get("strava_refresh_token")?.value;
    const expiresAt = request.cookies.get("strava_token_expires_at")?.value;

    const { accessToken: validAccessToken, newTokens } =
      await getValidAccessToken(accessToken, refreshToken, expiresAt);

    if (!validAccessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const activities = await getRecentActivities(validAccessToken, limit);

    // Filter for Run activities
    const runActivities = activities.filter(
      (activity) => activity.type === "Run",
    );

    const jsonResponse = NextResponse.json(runActivities, { status: 200 });

    if (newTokens) {
      jsonResponse.cookies.set("strava_access_token", newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: newTokens.expires_in,
        path: "/",
      });

      jsonResponse.cookies.set(
        "strava_refresh_token",
        newTokens.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        },
      );

      jsonResponse.cookies.set(
        "strava_token_expires_at",
        (Date.now() + newTokens.expires_in * 1000).toString(),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: newTokens.expires_in,
          path: "/",
        },
      );
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error in activities route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
