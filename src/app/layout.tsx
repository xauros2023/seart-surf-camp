import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { DEFAULT_CONTENT } from "@/lib/content";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_CONTENT.seo.siteUrl),
  title: {
    default: DEFAULT_CONTENT.seo.title,
    template: "%s | SeArt Surf Camp",
  },
  description: DEFAULT_CONTENT.seo.description,
  keywords: ["Tamraght surf camp", "Banana Beach hostel", "Morocco surf camp", "Agadir surf", "surf and yoga Morocco"],
  openGraph: {
    title: DEFAULT_CONTENT.seo.title,
    description: DEFAULT_CONTENT.seo.description,
    url: DEFAULT_CONTENT.seo.siteUrl,
    siteName: "SeArt Surf Camp",
    images: [{ url: "/images/hero-bg.png", width: 1200, height: 630, alt: "SeArt Surf Camp in Tamraght" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_CONTENT.seo.title,
    description: DEFAULT_CONTENT.seo.description,
    images: ["/images/hero-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
