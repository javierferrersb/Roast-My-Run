"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  isSignedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ isSignedIn = false, onLogout }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <header className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-4xl font-bold sm:text-6xl">🔥</div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-black sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-1 font-mono text-xs font-bold text-black sm:text-sm">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          {isSignedIn && (
            <button
              onClick={onLogout}
              className="border-2 border-black bg-white px-3 py-1 text-xs font-black text-black uppercase transition-all hover:cursor-pointer hover:bg-black hover:text-white sm:border-3 sm:px-6 sm:py-2 sm:text-sm"
            >
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
