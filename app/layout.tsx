import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast My Run",
  description: "AI-powered roasting of your Strava runs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="main-content min-h-screen bg-orange-200">
          {children}
        </main>
      </body>
    </html>
  );
}
