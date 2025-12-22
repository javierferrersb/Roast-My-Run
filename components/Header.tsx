/**
 * Header Component
 *
 * Displays the main title and branding with brutalist style
 */
interface HeaderProps {
  isSignedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ isSignedIn = false, onLogout }: HeaderProps) {
  return (
    <header className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Fire Icon */}
          <div className="text-4xl font-bold sm:text-6xl">🔥</div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black sm:text-5xl">
              ROAST MY RUN
            </h1>
            <p className="mt-1 font-mono text-xs font-bold text-black sm:text-sm">
              Get your runs destroyed by AI
            </p>
          </div>
        </div>

        {/* Right side - Logout button */}
        {isSignedIn && (
          <button
            onClick={onLogout}
            className="cursor-pointer border-2 border-black bg-white px-3 py-1 text-xs font-black text-black uppercase transition-all hover:bg-black hover:text-white sm:border-3 sm:px-6 sm:py-2 sm:text-sm"
          >
            LOGOUT
          </button>
        )}
      </div>
    </header>
  );
}
