interface ActivitySelectorProps {
  activities: Array<{ id: number; name: string; distance: number }>;
  selectedActivityId: number | null;
  isLoadingActivities: boolean;
  isRoasting: boolean;
  onSelectActivity: (id: number) => void;
  onRoast: () => void;
}

export function ActivitySelector({
  activities,
  selectedActivityId,
  isLoadingActivities,
  isRoasting,
  onSelectActivity,
  onRoast,
}: ActivitySelectorProps) {
  return (
    <div className="space-y-6 border-4 border-black bg-white p-4 sm:p-8">
      <h2 className="text-2xl font-black text-black sm:text-3xl">ROAST</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-black text-black sm:mb-3 sm:text-sm">
            SELECT YOUR RUN
          </label>
          <select
            value={selectedActivityId || ""}
            onChange={(e) => onSelectActivity(Number(e.target.value))}
            disabled={isLoadingActivities}
            className="w-full border-3 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:bg-red-100 focus:outline-none disabled:opacity-50 sm:px-4 sm:py-3"
          >
            <option value="">Choose a run...</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name} • {(activity.distance / 1000).toFixed(2)} km
              </option>
            ))}
          </select>
        </div>

        {/* Roast Button */}
        <button
          onClick={onRoast}
          disabled={isRoasting || !selectedActivityId}
          className="h-10 w-28 border-3 border-black bg-red-600 px-4 py-2 font-black text-white uppercase transition-all hover:cursor-pointer hover:bg-black hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12"
        >
          {isRoasting ? "🔥" : "ROAST"}
        </button>
      </div>
    </div>
  );
}
