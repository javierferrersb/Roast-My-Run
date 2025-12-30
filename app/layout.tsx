import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { Footer } from "@/components/Footer";
import { Locale } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast My Run",
  description: "AI-powered roasting of your Strava runs",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <main className="main-content flex-1 min-h-screen bg-orange-200">
              {children}
            </main>
            <Footer />
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
