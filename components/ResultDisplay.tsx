/**
 * ResultDisplay Component
 *
 * Displays the AI-generated roast with action buttons
 */
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
    <div className="border-4 border-black bg-red-100 p-8 space-y-6">
      {/* Result Text */}
      {roast && (
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-black">YOUR ROAST</h2>
          <p className="text-base font-mono text-black leading-relaxed bg-white border-3 border-black p-6">
            {roast}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">🔥</div>
          <p className="font-mono text-black font-bold">
            Generating your roast...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {roast && (
        <div className="flex gap-3">
          <button
            onClick={onCopy}
            className={`border-3 border-black px-6 py-2 font-black uppercase transition-all ${
              isCopied
                ? "bg-orange-400 text-black border-black"
                : "bg-white hover:bg-orange-400 text-black"
            }`}
          >
            {isCopied ? "✓ COPIED" : "COPY"}
          </button>
          <button
            onClick={onShare}
            className="border-3 border-black bg-white text-black px-6 py-2 font-black uppercase hover:bg-orange-400 transition-all"
          >
            SHARE
          </button>
          <button
            onClick={onRetry}
            className="border-3 border-black bg-white text-black px-6 py-2 font-black uppercase hover:bg-orange-400 transition-all"
          >
            REGENERATE
          </button>
        </div>
      )}
    </div>
  );
}
