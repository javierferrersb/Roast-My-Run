import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/services/stravaService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (state) {
      const storedState = request.cookies.get("oauth_state")?.value;
      if (!storedState || storedState !== state) {
        return NextResponse.json(
          { error: "Invalid state parameter" },
          { status: 403 },
        );
      }
    }

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 },
      );
    }

    const tokenResponse = await getAccessToken(code);

    if (!tokenResponse) {
      return NextResponse.json(
        { error: "Failed to exchange authorization code for access token" },
        { status: 401 },
      );
    }

    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("strava_access_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokenResponse.expires_in,
      path: "/",
    });

    response.cookies.set("strava_refresh_token", tokenResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    response.cookies.set(
      "strava_token_expires_at",
      (Date.now() + tokenResponse.expires_in * 1000).toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenResponse.expires_in,
        path: "/",
      },
    );

    response.cookies.delete("oauth_state");

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }
}
