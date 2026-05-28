"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { currencies, defaultCurrency, formatPrice, type Currency } from "@/i18n/config";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (next: Currency) => void;
  format: (amountEur: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const COOKIE_NAME = "currency";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function persistCurrency(next: Currency) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function CurrencyProvider({
  children,
  initialCurrency = defaultCurrency,
}: {
  children: ReactNode;
  initialCurrency?: Currency;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  // Re-sync if the SSR-provided cookie differs from a manually set one
  useEffect(() => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
    if (match) {
      const fromCookie = match[1] as Currency;
      if (currencies.includes(fromCookie) && fromCookie !== currency) {
        setCurrencyState(fromCookie);
      }
    }
    // We deliberately don't depend on `currency` — first mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    persistCurrency(next);
  }, []);

  const format = useCallback((amountEur: number) => formatPrice(amountEur, currency), [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
