"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Coins } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { currencies, currencyMeta } from "@/i18n/config";

export default function CurrencySwitcher() {
  const t = useTranslations("switcher");
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("currency")}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/70 px-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <Coins size={14} className="text-foreground/55" />
        {currency}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              role="menu"
              className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-foreground/10 bg-background/95 p-1.5 shadow-deep backdrop-blur-xl"
            >
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
                {t("currency")}
              </p>
              {currencies.map((cur) => {
                const meta = currencyMeta[cur];
                const active = cur === currency;
                return (
                  <button
                    key={cur}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setCurrency(cur);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-foreground/80 hover:bg-foreground/[0.05]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-foreground/[0.06] font-mono text-xs font-semibold">
                        {meta.symbol}
                      </span>
                      <span>
                        <span className="block font-semibold">{cur}</span>
                        <span className="block text-[11px] text-foreground/55">{meta.label}</span>
                      </span>
                    </span>
                    {active && <Check size={14} aria-hidden="true" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
