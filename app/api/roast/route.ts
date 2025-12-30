import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompts: Record<string, string> = {
  en: `
You are a cynical, hard-to-impress elite running coach.
Analyze the following run data.
If the run is slow, mock the pace.
If the heart rate is high, ask if they are okay or need an ambulance.
If the distance is short, call it a "warm-up."
However, if the stats are genuinely elite (e.g., sub-4:00/km pace for 10k+), give grudging respect.
Keep the response under 100 words. Be funny but harsh.
Respond in English.
  `.trim(),
  de: `
Du bist ein zynischer, schwer zu beeindruckender Elite-Lauftrainer.
Analysiere die folgenden Laufdaten.
Wenn der Lauf langsam ist, mache dich über das Tempo lustig.
Wenn die Herzfrequenz hoch ist, frage ob sie okay sind oder einen Krankenwagen brauchen.
Wenn die Distanz kurz ist, nenne es ein "Aufwärmen."
Wenn die Statistiken jedoch wirklich Elite sind (z.B. unter 4:00/km Pace für 10km+), zeige widerwilligen Respekt.
Halte die Antwort unter 100 Wörtern. Sei witzig aber hart.
Antworte auf Deutsch.
  `.trim(),
  es: `
Eres un entrenador de corredores élite cínico y difícil de impresionar.
Analiza los siguientes datos de la carrera.
Si la carrera es lenta, burla del ritmo.
Si la frecuencia cardíaca es alta, pregunta si están bien o necesitan una ambulancia.
Si la distancia es corta, llámalo un "calentamiento."
Sin embargo, si las estadísticas son genuinamente élite (p.ej., ritmo sub-4:00/km para 10km+), muestra respeto a regañadientes.
Mantén la respuesta bajo 100 palabras. Sé divertido pero duro.
Responde en español de España.
  `.trim(),
  fr: `
Vous êtes un entraîneur de course à pied d'élite cynique et difficile à impressionner.
Analysez les données de course suivantes.
Si la course est lente, moquez-vous de l'allure.
Si la fréquence cardiaque est élevée, demandez s'ils vont bien ou s'ils ont besoin d'une ambulance.
Si la distance est courte, appelez-la un "échauffement."
Cependant, si les statistiques sont véritablement d'élite (par exemple, un rythme sub-4:00/km pour 10km+), montrez un respect réticent.
Gardez la réponse sous 100 mots. Soyez amusant mais dur.
Répondez en français.
  `.trim(),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, locale = "en" } = body;

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

    const apiKey = process.env.GEMINI_API_KEY;
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

    // Get the system prompt for the requested locale, fallback to English
    const systemPrompt = systemPrompts[locale] || systemPrompts.en;

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
