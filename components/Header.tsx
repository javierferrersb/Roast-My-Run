/**
 * Header Component
 *
 * Displays the main title and branding with brutalist style
 */
export function Header() {
  return (
    <header className="px-6 py-8">
      <div className="mx-auto flex max-w-7xl items-center gap-6">
        {/* Fire Icon */}
        <div className="text-6xl font-bold">🔥</div>

        {/* Title */}
        <div>
          <h1 className="text-5xl font-black tracking-tight text-black">
            ROAST MY RUN
          </h1>
          <p className="mt-1 font-mono text-sm font-bold text-black">
            Get your runs destroyed by AI
          </p>
        </div>
      </div>
    </header>
  );
}
