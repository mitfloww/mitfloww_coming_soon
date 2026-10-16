import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteFontVariables } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

import "@/styles/waitlist.css";

/*
 * The waitlist is a focused full-screen flow with its own stylesheet, so it has
 * its own root layout: none of its global styles can leak into the main site.
 */
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-96.png?v=2", sizes: "96x96", type: "image/png" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico?v=2" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest?v=2",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={siteFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
