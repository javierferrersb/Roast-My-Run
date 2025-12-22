export function ActivitySelectorSkeleton() {
  return (
    <div className="space-y-6 border-4 border-black bg-white p-4 sm:p-8">
      <h2 className="text-2xl font-black text-black sm:text-3xl">ROAST</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-black text-black sm:mb-3 sm:text-sm">
            SELECT YOUR RUN
          </label>
          {/* Skeleton select */}
          <div className="animate-fast-pulse h-10 w-full border-3 border-black bg-gray-300 px-3 py-2 sm:h-12 sm:px-4 sm:py-3"></div>
        </div>

        {/* Skeleton button */}
        <div className="animate-fast-pulse h-10 w-28 border-3 border-black bg-gray-300 px-4 sm:h-12"></div>
      </div>
    </div>
  );
}
