import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roast My Run",
  description: "AI-powered roasting of your Strava activities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav">
            <h1>🔥 Roast My Run</h1>
            <p className="subtitle">
              Your Strava activities deserve to be roasted
            </p>
          </nav>
        </header>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>&copy; 2025 Roast My Run. Powered by Strava + Gemini AI</p>
        </footer>
      </body>
    </html>
  );
}
