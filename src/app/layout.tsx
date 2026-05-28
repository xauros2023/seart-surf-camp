import type { Metadata } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

/**
 * Root layout is intentionally minimal — the real <html>/<body> lives in
 * app/[locale]/layout.tsx because it depends on the active locale
 * (lang + dir attributes, NextIntlClientProvider, fonts, theme).
 *
 * Next.js still requires a root layout, even when [locale] catches everything.
 */

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_CONTENT.seo.siteUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
