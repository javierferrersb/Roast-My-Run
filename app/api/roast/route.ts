import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId } = body;

    if (!activityId || typeof activityId !== "number") {
      return NextResponse.json(
        { error: "activityId must be a valid number" },
        { status: 400 },
      );
    }

    const accessToken = request.cookies.get("strava_access_token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const stravaResponse = await fetch(
      `https://www.strava.com/api/v3/activities/${activityId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!stravaResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch activity from Strava" },
        { status: 500 },
      );
    }

    const activity = await stravaResponse.json();

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    const {
      name,
      distance,
      moving_time,
      total_elevation_gain,
      average_heartrate,
    } = activity;

    const distanceKm = distance / 1000;
    const minutesElapsed = moving_time / 60;
    const paceMinPerKm = minutesElapsed / distanceKm;
    const paceParts = Math.floor(paceMinPerKm);
    const paceSeconds = Math.round((paceMinPerKm - paceParts) * 60);

    const formattedActivity = `
Activity: ${name}
Distance: ${distanceKm.toFixed(2)} km
Duration: ${minutesElapsed.toFixed(0)} minutes
Pace: ${paceParts}:${paceSeconds.toString().padStart(2, "0")} min/km
Elevation: ${total_elevation_gain?.toFixed(0) || "0"} meters
Heart Rate: ${average_heartrate ? average_heartrate.toFixed(0) + " bpm" : "N/A"}
    `.trim();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = `
You are a cynical, hard-to-impress elite running coach.
Analyze the following run data.
If the run is slow, mock the pace.
If the heart rate is high, ask if they are okay or need an ambulance.
If the distance is short, call it a "warm-up."
However, if the stats are genuinely elite (e.g., sub-4:00/km pace for 10k+), give grudging respect.
Keep the response under 100 words. Be funny but harsh.
    `.trim();

    const fullPrompt = `${systemPrompt}\n\nRun data:\n${formattedActivity}`;

    const result = await model.generateContent(fullPrompt);
    const roast = result.response.text();

    return NextResponse.json(
      {
        roast: roast,
        activity: {
          name,
          distance: distanceKm.toFixed(2),
          pace: `${paceParts}:${paceSeconds.toString().padStart(2, "0")}`,
          heartRate: average_heartrate?.toFixed(0) || "N/A",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json(
    { message: "Roast API endpoint. Use POST to generate a roast." },
    { status: 200 },
  );
}
