"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const items = [
  { key: "coaching", img: "/images/coaching.webp" },
  { key: "daysOut", img: "/images/quad.webp" },
  { key: "nights", img: "/images/campfire.webp" },
] as const;

export default function ExperiencesSection() {
  const t = useTranslations("experiences");

  return (
    <section id="activities" className="section-shell">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionReveal>
            <p className="section-kicker">{t("kicker")}</p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2 className="section-title text-balance">
              {t("titleStart")} <span className="font-serif italic text-ocean">{t("titleAccent")}</span>
            </h2>
          </SectionReveal>
        </div>
        <SectionReveal delay={0.2}>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground"
          >
            {t("seeMore")}
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </SectionReveal>
      </div>

      <StaggerContainer className="grid gap-5 md:grid-cols-3" staggerChildren={0.1}>
        {items.map((exp) => (
          <StaggerItem key={exp.key}>
            <motion.article
              whileHover="hover"
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-foreground/5"
            >
              <motion.div
                variants={{ hover: { scale: 1.06 } }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={exp.img}
                  alt={t(`items.${exp.key}.title`)}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
                  {t(`items.${exp.key}.eyebrow`)}
                </p>
                <h3 className="font-serif text-3xl font-medium tracking-tight">{t(`items.${exp.key}.title`)}</h3>
                <motion.p
                  variants={{
                    hover: { opacity: 1, height: "auto", marginTop: 14 },
                  }}
                  initial={{ opacity: 0.85, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden text-sm leading-6 text-white/80"
                >
                  {t(`items.${exp.key}.desc`)}
                </motion.p>
              </div>

              <motion.div
                variants={{ hover: { opacity: 1, scale: 1 } }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="absolute end-5 top-5 grid size-11 place-items-center rounded-full bg-white/95 text-black backdrop-blur-md"
              >
                <ArrowUpRight size={18} />
              </motion.div>
            </motion.article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
