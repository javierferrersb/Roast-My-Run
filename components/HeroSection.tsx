/**
 * HeroSection Component
 *
 * Displays description, Strava login button, or activity selector + roast results
 */
import { ActivitySelector } from "./ActivitySelector";
import { ResultDisplay } from "./ResultDisplay";
import { StravaActivity } from "@/types/strava";

interface HeroSectionProps {
  onStravaLogin: () => void;
  activities?: StravaActivity[];
  selectedActivityId?: number | null;
  isLoadingActivities?: boolean;
  isRoasting?: boolean;
  onSelectActivity?: (id: number) => void;
  onRoast?: () => void;
  roast?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  isCopied?: boolean;
}

export function HeroSection({
  onStravaLogin,
  activities = [],
  selectedActivityId,
  isLoadingActivities = false,
  isRoasting = false,
  onSelectActivity,
  onRoast,
  roast = null,
  isLoading = false,
  onRetry,
  onCopy,
  onShare,
  isCopied = false,
}: HeroSectionProps) {
  const isSignedIn = activities.length > 0;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-start gap-12">
        {/* Left Side - Content or Activity Selector */}
        {!isSignedIn ? (
          <div className="space-y-8 border-4 border-black bg-white p-8">
            <div>
              <h2 className="mb-4 text-4xl font-black text-black">ABOUT</h2>
              <p className="font-mono text-base leading-relaxed text-black">
                Tired of soft, supportive running communities? Connect your
                Strava, pick a run, and let an elite AI coach roast your pace,
                effort, and HR zones. No excuses. No mercy. Only truth.
              </p>
            </div>

            {/* Strava Button */}
            <button
              onClick={onStravaLogin}
              className="bg-strava hover:border-strava cursor-pointer border-3 border-black px-8 py-4 text-lg font-black text-white uppercase transition-all hover:bg-black"
            >
              CONNECT WITH STRAVA
            </button>
          </div>
        ) : (
          <ActivitySelector
            activities={activities}
            selectedActivityId={selectedActivityId || null}
            isLoadingActivities={isLoadingActivities}
            isRoasting={isRoasting}
            onSelectActivity={onSelectActivity || (() => {})}
            onRoast={onRoast || (() => {})}
          />
        )}

        {/* Right Side - Roast Results */}
        {isSignedIn && (
          <div>
            {roast || isLoading ? (
              <ResultDisplay
                roast={roast}
                isLoading={isLoading}
                onRetry={onRetry || (() => {})}
                onCopy={onCopy || (() => {})}
                onShare={onShare || (() => {})}
                isCopied={isCopied}
              />
            ) : (
              <div className="border-4 border-black bg-white p-8 text-center">
                <p className="font-mono text-lg text-gray-600">
                  Select a run and click ROAST to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
