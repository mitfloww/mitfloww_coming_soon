import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteFontVariables } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteEffects } from "@/components/site/SiteEffects";

import "@/styles/site.css";
import "@/styles/directory.css";
import "@/styles/home.css";
import "@/styles/deck.css";
import "@/styles/blog.css";
import "@/styles/i18n.css";

/* Site-wide defaults only: each page sets its own title, description, canonical and social tags. */
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={siteFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <I18nProvider>
          <Header />
          {children}
          <Footer />
          <SiteEffects />
        </I18nProvider>
      </body>
    </html>
  );
}
