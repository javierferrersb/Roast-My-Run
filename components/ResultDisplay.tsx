import { parseMarkdown } from "@/lib/markdown";

interface ResultDisplayProps {
  roast: string | null;
  isLoading: boolean;
  onRetry: () => void;
  onCopy: () => void;
  onShare: () => void;
  isCopied: boolean;
}

export function ResultDisplay({
  roast,
  isLoading,
  onRetry,
  onCopy,
  onShare,
  isCopied,
}: ResultDisplayProps) {
  if (!roast && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-6 border-4 border-black bg-red-100 p-4 sm:p-8">
      {/* Result Text */}
      {roast && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-black sm:text-3xl">
            YOUR ROAST
          </h2>
          <p className="border-3 border-black bg-white p-4 font-mono text-sm leading-relaxed text-black sm:p-6 sm:text-base">
            {parseMarkdown(roast)}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="animate-fast-pulse text-2xl">🔥</div>
          <p className="animate-fast-pulse font-mono text-xs font-bold text-black sm:text-sm">
            Generating your roast...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {roast && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={onCopy}
            className={`border-3 border-black px-4 py-2 text-xs font-black uppercase transition-all hover:cursor-pointer sm:px-6 sm:py-2 sm:text-sm ${
              isCopied
                ? "border-black bg-orange-400 text-black"
                : "bg-white text-black hover:bg-orange-400"
            }`}
          >
            {isCopied ? "✓ COPIED" : "COPY"}
          </button>
          <button
            onClick={onShare}
            className="border-3 border-black bg-white px-4 py-2 text-xs font-black text-black uppercase transition-all hover:cursor-pointer hover:bg-orange-400 sm:px-6 sm:py-2 sm:text-sm"
          >
            SHARE
          </button>
          <button
            onClick={onRetry}
            className="border-3 border-black bg-white px-4 py-2 text-xs font-black text-black uppercase transition-all hover:cursor-pointer hover:bg-orange-400 sm:px-6 sm:py-2 sm:text-sm"
          >
            REGENERATE
          </button>
        </div>
      )}
    </div>
  );
}
