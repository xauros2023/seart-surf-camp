"use client";

import { Menu, Waves, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { defaultLocale, type Locale } from "@/i18n/config";
import CurrencySwitcher from "./CurrencySwitcher";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";

const navKeys = ["about", "rooms", "packages", "gallery", "faq", "contact"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  about: "/about",
  rooms: "/rooms",
  packages: "/packages",
  gallery: "/gallery",
  faq: "/faq",
  contact: "/contact",
};

/**
 * Build a locale-aware href. With "as-needed" mode, default locale (EN) is unprefixed.
 */
function localizedHref(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export default function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 30);
    if (latest > previous && latest > 200 && !open) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const stripLocale = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments[0] && segments[0].length === 2) segments.shift();
    return `/${segments.join("/")}`;
  };
  const currentPath = stripLocale(pathname);
  const isActive = (path: string) => currentPath === path;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-foreground/10 bg-background/80 backdrop-blur-2xl"
          : "border-b border-transparent bg-background/0 backdrop-blur-0"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <a
          href={localizedHref(locale, "/")}
          className="group flex items-center gap-2.5 font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <motion.span
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid size-9 place-items-center rounded-full bg-terracotta/12 text-terracotta"
          >
            <Waves size={20} aria-hidden="true" />
          </motion.span>
          <span className="text-2xl font-serif font-medium tracking-tight">SeArt.</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navKeys.map((key) => {
            const path = navPaths[key];
            return (
              <a
                key={key}
                href={localizedHref(locale, path)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(path)
                    ? "text-foreground"
                    : "text-foreground/65 hover:text-foreground"
                }`}
              >
                {isActive(path) && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.07] dark:bg-white/[0.08]"
                  />
                )}
                {t(key)}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href={localizedHref(locale, "/#booking")}
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_18px_45px_-12px_rgba(31,42,37,0.5)] sm:inline-flex"
          >
            {t("bookNow")}
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-background/70 lg:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-foreground/10 bg-background/[0.98] px-5 py-5 backdrop-blur-2xl lg:hidden"
          >
            <nav className="mx-auto grid max-w-7xl gap-1.5" aria-label="Mobile navigation">
              {navKeys.map((key, index) => {
                const path = navPaths[key];
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
                  >
                    <a
                      href={localizedHref(locale, path)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                        isActive(path)
                          ? "bg-foreground/[0.08] text-foreground"
                          : "text-foreground/75 hover:bg-foreground/[0.05]"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {t(key)}
                      <span className="text-foreground/30" aria-hidden="true">→</span>
                    </a>
                  </motion.div>
                );
              })}
              <a
                href={localizedHref(locale, "/#booking")}
                className="mt-3 rounded-full bg-foreground px-5 py-3.5 text-center font-semibold text-background"
                onClick={() => setOpen(false)}
              >
                {t("bookNow")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
