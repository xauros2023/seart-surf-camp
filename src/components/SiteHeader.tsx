"use client";

import { Menu, Waves, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/rooms", label: "Rooms" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
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

  const isActive = (href: string) => pathname === href;

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
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <motion.span
            animate={{ rotate: scrolled ? 0 : 0 }}
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid size-9 place-items-center rounded-full bg-terracotta/12 text-terracotta"
          >
            <Waves size={20} aria-hidden="true" />
          </motion.span>
          <span className="text-2xl font-serif font-medium tracking-tight">SeArt.</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-foreground"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.07] dark:bg-white/[0.08]"
                />
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/#booking"
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_18px_45px_-12px_rgba(31,42,37,0.5)] sm:inline-flex"
          >
            Book Now
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-background/70 lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
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
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                      isActive(item.href)
                        ? "bg-foreground/[0.08] text-foreground"
                        : "text-foreground/75 hover:bg-foreground/[0.05]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <span className="text-foreground/30" aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#booking"
                className="mt-3 rounded-full bg-foreground px-5 py-3.5 text-center font-semibold text-background"
                onClick={() => setOpen(false)}
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
