/**
 * Single source of truth for supported locales and currencies.
 * Imported by middleware, request config, and switcher components.
 */

export const locales = ["en", "fr", "ar", "es", "pt", "de", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { native: string; flag: string }> = {
  en: { native: "English", flag: "🇬🇧" },
  fr: { native: "Français", flag: "🇫🇷" },
  ar: { native: "العربية", flag: "🇲🇦" },
  es: { native: "Español", flag: "🇪🇸" },
  pt: { native: "Português", flag: "🇵🇹" },
  de: { native: "Deutsch", flag: "🇩🇪" },
  nl: { native: "Nederlands", flag: "🇳🇱" },
};

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

// ============ CURRENCY ============

export const currencies = ["EUR", "MAD", "USD"] as const;
export type Currency = (typeof currencies)[number];

export const defaultCurrency: Currency = "EUR";

// Hardcoded rates (1 EUR = ...). Refreshed manually; admin can adjust.
// Last updated: 2026-05-27.
export const exchangeRates: Record<Currency, number> = {
  EUR: 1,
  MAD: 10.85,
  USD: 1.09,
};

export const currencyMeta: Record<Currency, { symbol: string; label: string; locale: string }> = {
  EUR: { symbol: "€", label: "Euro", locale: "fr-FR" },
  MAD: { symbol: "DH", label: "Moroccan Dirham", locale: "fr-MA" },
  USD: { symbol: "$", label: "US Dollar", locale: "en-US" },
};

export function convertFromEur(amountEur: number, target: Currency): number {
  return amountEur * exchangeRates[target];
}

export function formatPrice(amountEur: number, currency: Currency = defaultCurrency): string {
  const value = convertFromEur(amountEur, currency);
  const rounded = Math.round(value);
  const { symbol } = currencyMeta[currency];
  // EUR/MAD/USD: simple int formatting with symbol position by currency
  if (currency === "USD") return `$${rounded}`;
  if (currency === "MAD") return `${rounded} DH`;
  return `${rounded}€`;
}
