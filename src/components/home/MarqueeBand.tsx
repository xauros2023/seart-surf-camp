"use client";

import { useTranslations } from "next-intl";
import Marquee from "@/components/motion/Marquee";

export default function MarqueeBand() {
  const t = useTranslations();
  // next-intl array-of-strings access pattern: read raw array via t.raw
  const items = t.raw("marquee") as string[];

  return (
    <section className="border-y border-foreground/[0.08] bg-foreground/[0.025] py-7">
      <Marquee speed={45}>
        {items.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-12 text-xl font-serif italic text-foreground/55">
            <span>{item}</span>
            <span className="size-1.5 rounded-full bg-terracotta/70" aria-hidden="true" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
