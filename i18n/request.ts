import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async () => {
  // Try to get locale from cookie first (user preference)
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  let locale: Locale = defaultLocale;

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  } else {
    // Fall back to browser language
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      // Parse accept-language header and find the best match
      const browserLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

      for (const browserLocale of browserLocales) {
        if (locales.includes(browserLocale as Locale)) {
          locale = browserLocale as Locale;
          break;
        }
      }
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
