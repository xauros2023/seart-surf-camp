"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionReveal from "@/components/motion/SectionReveal";
import { testimonials } from "@/lib/content";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section className="section-shell overflow-hidden">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionReveal>
            <p className="section-kicker">{t("kicker")}</p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2 className="section-title text-balance">
              {t("titleStart")} <span className="font-serif italic text-terracotta">{t("titleAccent")}</span>
            </h2>
          </SectionReveal>
        </div>
        <SectionReveal delay={0.2}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label={t("prev")}
              className="grid size-12 place-items-center rounded-full border border-foreground/15 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label={t("next")}
              className="grid size-12 place-items-center rounded-full border border-foreground/15 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </SectionReveal>
      </div>

      <SectionReveal>
        <div
          ref={trackRef}
          className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item, i) => (
            <motion.article
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border border-foreground/[0.08] bg-surface p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 sm:w-[420px] dark:bg-white/[0.04]"
            >
              <Quote
                aria-hidden="true"
                className="absolute end-7 top-7 text-terracotta/15 transition-colors duration-500 group-hover:text-terracotta/30"
                size={48}
              />
              <div className="mb-5 flex items-center gap-1 text-sunset">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <Star key={idx} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="relative font-serif text-lg leading-[1.5] text-foreground/85">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-foreground/[0.08] pt-6">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-terracotta to-sunset font-serif text-lg font-medium text-[#17130e]">
                  {item.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{item.name}</p>
                  <p className="truncate text-xs text-foreground/55">
                    {item.origin} · <span className="text-foreground/40">{item.source}</span>
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}
