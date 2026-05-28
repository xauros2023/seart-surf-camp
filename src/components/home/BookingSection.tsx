"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import BookingWizard from "@/components/BookingWizard";
import SectionReveal from "@/components/motion/SectionReveal";
import type { SiteContent } from "@/lib/content";

export default function BookingSection({ data }: { data: SiteContent }) {
  const t = useTranslations("booking");

  return (
    <section id="booking" className="section-shell pb-24 sm:pb-24 lg:pb-32">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <SectionReveal direction="right">
          <div className="glass-card p-6 sm:p-9">
            <BookingWizard dormPrice={data.rooms.dormPrice} privatePrice={data.rooms.privatePrice} />
          </div>
        </SectionReveal>

        <SectionReveal direction="left" delay={0.15}>
          <div className="grid gap-5">
            <div className="glass-card p-7">
              <div className="flex items-start gap-5">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-terracotta/[0.12] text-terracotta">
                  <MapPin size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium tracking-tight">{t("location.title")}</h2>
                  <p className="mt-2 text-foreground/65">
                    {data.contact.addressLine1}
                    <br />
                    {data.contact.addressLine2}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              whileHover="hover"
              className="group relative min-h-[380px] overflow-hidden rounded-3xl border border-foreground/10 shadow-soft"
            >
              <motion.div
                variants={{ hover: { scale: 1.06 } }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/rooftop.webp"
                  alt="Sunset rooftop view at SeArt Surf Camp"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-sunset">{t("map.eyebrow")}</p>
                <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight">
                  {t("map.titleStart")} <span className="italic">{t("map.titleAccent")}</span>
                </h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Tamraght%20Ouzdar%20Banana%20Beach%20Agadir%20Morocco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-10px_rgba(255,255,255,0.35)]"
                >
                  {t("map.cta")}
                </a>
              </div>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
