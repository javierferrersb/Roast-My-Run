"use client";

import { useTranslations } from "next-intl";
import { ActivitySelector } from "./ActivitySelector";
import { ActivitySelectorSkeleton } from "./ActivitySelectorSkeleton";
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
  const t = useTranslations("hero");
  const isSignedIn = activities.length > 0 || isLoadingActivities;

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {!isSignedIn ? (
          <div className="mx-auto max-w-lg space-y-6 border-4 border-black bg-white p-4 sm:space-y-8 sm:p-8">
            <div>
              <h2 className="mb-3 text-2xl font-black text-black sm:mb-4 sm:text-4xl">
                {t("about")}
              </h2>
              <p className="font-mono text-xs leading-relaxed text-black sm:text-base">
                {t("aboutText")}
              </p>
            </div>

            {/* Strava Button */}
            <button
              onClick={onStravaLogin}
              className="bg-strava hover:border-strava w-full border-3 border-black px-4 py-3 text-sm font-black text-white uppercase transition-all hover:cursor-pointer hover:bg-black sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              {t("connectStrava")}
            </button>
          </div>
        ) : isLoadingActivities ? (
          <ActivitySelectorSkeleton />
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-12">
            <ActivitySelector
              activities={activities}
              selectedActivityId={selectedActivityId || null}
              isLoadingActivities={isLoadingActivities}
              isRoasting={isRoasting}
              onSelectActivity={onSelectActivity || (() => {})}
              onRoast={onRoast || (() => {})}
            />

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
                      {t("selectPrompt")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
