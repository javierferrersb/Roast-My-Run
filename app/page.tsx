"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ErrorAlert } from "@/components/ErrorAlert";
import { buildStravaOAuthUrl } from "@/lib/oauthHelper";
import { StravaActivity } from "@/types/strava";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

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
      const response = await fetch("/api/activities");

      if (response.status === 401) {
        setActivities([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data: StravaActivity[] = await response.json();
      setActivities(data);
    } catch (err) {
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

      const data = await response.json();
      setRoastResult(data.roast);
    } catch (err) {
      setError("Failed to roast activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!roastResult) return;
    try {
      await navigator.clipboard.writeText(roastResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setActivities([]);
        setSelectedActivityId(null);
        setRoastResult(null);
        setError(null);
        setCopied(false);
        window.location.href = "/";
      }
    } catch (err) {
      setError("Failed to logout");
    }
  };

  const handleShare = async () => {
    if (!roastResult) return;
    const shareText = `Check out my run roast: "${roastResult}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Roast My Run",
          text: shareText,
        });
      } catch (err) {
        // User cancelled share dialog
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError("Failed to copy to clipboard");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header isSignedIn={activities.length > 0} onLogout={handleLogout} />

      <HeroSection
        onStravaLogin={handleStravaLogin}
        activities={activities}
        selectedActivityId={selectedActivityId}
        isLoadingActivities={isLoadingActivities}
        isRoasting={isLoading}
        onSelectActivity={setSelectedActivityId}
        onRoast={handleRoastActivity}
        roast={roastResult}
        isLoading={isLoading}
        onRetry={handleRoastActivity}
        onCopy={handleCopyToClipboard}
        onShare={handleShare}
        isCopied={copied}
      />

      {error && <ErrorAlert message={error} />}
    </div>
  );
}
