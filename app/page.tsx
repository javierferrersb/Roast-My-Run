"use client";

import { buildStravaOAuthUrl } from "@/lib/oauthHelper";
import { RoastDisplay } from "@/components/RoastDisplay";
import { StravaActivity } from "@/types/strava";
import { useEffect, useState } from "react";

/**
 * Home Page Component
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleStravaLogin = () => {
    const oauthUrl = buildStravaOAuthUrl();
    window.location.href = oauthUrl;
  };

  const fetchActivities = async () => {
    setIsLoadingActivities(true);
    setError(null);

    try {
      // Call GET /api/activities
      const response = await fetch("/api/activities");

      if (response.status == 401) {
        console.log("User not authenticated with Strava");
        setActivities([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      // Parse activities and set state
      const data: StravaActivity[] = await response.json();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to fetch activities. Please try again.");
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleRoastActivity = async () => {
    if (!selectedActivityId) {
      setError("Please select an activity first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoastResult(null);

    try {
      // Call POST /api/roast
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId: selectedActivityId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate roast");
      }

      // Parse roast result and set state
      const data = await response.json();
      setRoastResult(data.roast);
    } catch (err) {
      console.error("Error roasting activity:", err);
      setError("Failed to roast activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        Let's Roast Your Run 🔥
      </h2>

      {error && <div className="error">{error}</div>}
      {roastResult && <div className="success">Roast generated!</div>}

      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className="button"
          onClick={handleStravaLogin}
          style={{ width: "100%" }}
        >
          🏃 Connect with Strava
        </button>
        <p
          style={{
            textAlign: "center",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          First time? Log in with your Strava account
        </p>
      </div>

      <hr
        style={{
          margin: "1.5rem 0",
          border: "none",
          borderTop: "1px solid #eee",
        }}
      />

      <div style={{ marginBottom: "1.5rem" }}>
        <label
          htmlFor="activity-select"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Select an activity:
        </label>
        <select
          id="activity-select"
          value={selectedActivityId || ""}
          onChange={(e) => setSelectedActivityId(Number(e.target.value))}
          disabled={isLoadingActivities}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "1rem",
          }}
        >
          {isLoadingActivities ? (
            <option>Loading activities...</option>
          ) : activities.length === 0 ? (
            <option value="">No activities found. Connect Strava first.</option>
          ) : (
            <>
              <option value="">-- Select an activity --</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} - {(activity.distance / 1000).toFixed(2)}km
                </option>
              ))}
            </>
          )}
        </select>
        {isLoadingActivities && (
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Loading activities...
          </p>
        )}
      </div>

      <button
        className="button"
        onClick={handleRoastActivity}
        disabled={isLoading || !selectedActivityId}
        style={{ width: "100%" }}
      >
        {isLoading ? "🔥 Roasting..." : "🔥 Roast This Run!"}
      </button>

      <RoastDisplay roast={roastResult || ""} isLoading={isLoading} />
    </div>
  );
}
