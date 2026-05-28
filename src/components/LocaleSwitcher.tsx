"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Globe, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { defaultLocale, localeNames, locales, type Locale } from "@/i18n/config";

export default function LocaleSwitcher() {
  const t = useTranslations("switcher");
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    // Strip current locale prefix (if any) and prepend the new one.
    // With "as-needed" mode, defaultLocale (EN) has NO prefix.
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    if (locales.includes(first as Locale)) segments.shift();
    const rest = segments.join("/");
    const target =
      next === defaultLocale
        ? `/${rest}` || "/"
        : `/${next}${rest ? `/${rest}` : ""}`;

    startTransition(() => {
      router.replace(target);
      router.refresh();
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language")}
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-background/70 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <Globe size={18} />
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
                {t("language")}
              </p>
              {locales.map((loc) => {
                const meta = localeNames[loc];
                const active = loc === activeLocale;
                return (
                  <button
                    key={loc}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => switchTo(loc)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-foreground/80 hover:bg-foreground/[0.05]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base leading-none" aria-hidden="true">
                        {meta.flag}
                      </span>
                      <span className="font-medium">{meta.native}</span>
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
