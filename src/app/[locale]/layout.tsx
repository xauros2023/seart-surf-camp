import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import "../globals.css";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { defaultCurrency, isRtl, locales, type Currency } from "@/i18n/config";
import { DEFAULT_CONTENT } from "@/lib/content";
import { cookies } from "next/headers";

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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_CONTENT.seo.title,
    description: DEFAULT_CONTENT.seo.description,
    images: ["/images/hero-bg.png"],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const cookieStore = await cookies();
  const initialCurrency = (cookieStore.get("currency")?.value as Currency | undefined) ?? defaultCurrency;
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <CurrencyProvider initialCurrency={initialCurrency}>
              {children}
            </CurrencyProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
