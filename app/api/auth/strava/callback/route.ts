import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/services/stravaService";

/**
 * GET /api/auth/strava/callback
 *
 * Strava OAuth Callback Handler
 *
 * Strava redirects here after the user authorizes the app.
 * Query params:
 * - code: Authorization code to exchange for access token
 * - scope: Permissions granted (comma-separated)
 * - state: CSRF protection token (optional, implement if needed)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Extract authorization code from query string
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Validate state parameter for CSRF protection
    // Compare with state stored in session during OAuth initiation
    if (state) {
      const storedState = request.cookies.get("oauth_state")?.value;
      if (!storedState || storedState !== state) {
        console.error("State parameter mismatch. Possible CSRF attack.");
        return NextResponse.json(
          { error: "Invalid state parameter" },
          { status: 403 }
        );
      }
    }

    if (!code) {
      console.error("Authorization code not provided by Strava");
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    // 2. Exchange authorization code for access token
    // Calls getAccessToken(code) from stravaService
    // This makes a POST request to Strava's token endpoint
    const tokenResponse = await getAccessToken(code);

    if (!tokenResponse) {
      console.error("Failed to exchange authorization code for access token");
      return NextResponse.json(
        { error: "Failed to exchange authorization code for access token" },
        { status: 401 }
      );
    }

    // 3. Store tokens securely using HTTP-only cookies (most secure option)
    // HTTP-only cookies prevent XSS attacks from accessing tokens
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set secure HTTP-only cookie with access token
    response.cookies.set("strava_access_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenResponse.expires_in,
      path: "/",
    });

    // Store refresh token for token refresh later
    response.cookies.set("strava_refresh_token", tokenResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Store token expiration time
    response.cookies.set(
      "strava_token_expires_at",
      (Date.now() + tokenResponse.expires_in * 1000).toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenResponse.expires_in,
        path: "/",
      }
    );

    // Clear the oauth_state cookie after successful authentication
    response.cookies.delete("oauth_state");

    // 4. Redirect to home page
    return response;
  } catch (error) {
    // Add proper error logging
    if (error instanceof Error) {
      console.error("Error in Strava OAuth callback:", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Error in Strava OAuth callback:", error);
    }

    // Redirect to home with error message
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }
}
