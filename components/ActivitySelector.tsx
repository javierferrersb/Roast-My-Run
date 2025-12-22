/**
 * ActivitySelector Component
 *
 * Dropdown to select an activity + roast button
 */
interface ActivitySelectorProps {
  activities: Array<{ id: number; name: string }>;
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
    <div className="bg-white border-4 border-black p-8 space-y-6">
      <h2 className="text-3xl font-black text-black">ROAST</h2>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-black mb-3 text-black">
            SELECT YOUR RUN
          </label>
          <select
            value={selectedActivityId || ""}
            onChange={(e) => onSelectActivity(Number(e.target.value))}
            disabled={isLoadingActivities}
            className="w-full border-3 border-black px-4 py-3 font-mono text-base bg-white text-black disabled:opacity-50 focus:outline-none focus:bg-red-100"
          >
            <option value="">Choose a run...</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Roast Button */}
        <button
          onClick={onRoast}
          disabled={isRoasting || !selectedActivityId}
          className="border-3 border-black bg-red-600 text-white px-8 py-3 font-black uppercase disabled:opacity-50 hover:bg-black hover:text-red-600 transition-all h-12"
        >
          {isRoasting ? "🔥" : "ROAST"}
        </button>
      </div>
    </div>
  );
}
