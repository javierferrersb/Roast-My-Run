"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "@/i18n/LocaleContext";
import { Locale, locales } from "@/i18n/config";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const { locale, setLocale } = useLocale();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black transition-all hover:cursor-pointer hover:bg-orange-100 sm:border-3 sm:px-3 sm:py-1 sm:text-sm"
      aria-label={t("label")}
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}
