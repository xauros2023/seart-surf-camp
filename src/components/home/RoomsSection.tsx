"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BedDouble, Tent, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { parsePrice } from "@/lib/content";

export default function RoomsSection({ dormPrice, privatePrice }: { dormPrice: string; privatePrice: string }) {
  const t = useTranslations("rooms");
  const { format } = useCurrency();

  return (
    <section id="rooms" className="section-shell">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <SectionReveal>
          <p className="section-kicker mx-auto justify-center">{t("kicker")}</p>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <h2 className="section-title mx-auto text-center text-balance">
            {t("titleStart")} <span className="font-serif italic text-terracotta">{t("titleAccent")}</span>
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.2}>
          <p className="section-copy mx-auto text-center">{t("copy")}</p>
        </SectionReveal>
      </div>

      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerChildren={0.12}>
        <StaggerItem>
          <RoomCard
            image="/images/room-dorm.webp"
            icon={<Tent size={28} aria-hidden="true" />}
            title={t("dorm.title")}
            price={format(parsePrice(dormPrice))}
            priceLabel={t("dorm.priceLabel")}
            copy={t("dorm.copy")}
            from={t("from")}
            bookLabel={t("book")}
          />
        </StaggerItem>
        <StaggerItem>
          <RoomCard
            image="/images/room-private.webp"
            icon={<BedDouble size={28} aria-hidden="true" />}
            title={t("private.title")}
            price={format(parsePrice(privatePrice))}
            priceLabel={t("private.priceLabel")}
            copy={t("private.copy")}
            from={t("from")}
            bookLabel={t("book")}
          />
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}

function RoomCard({
  image,
  icon,
  title,
  price,
  priceLabel,
  copy,
  from,
  bookLabel,
}: {
  image: string;
  icon: ReactNode;
  title: string;
  price: string;
  priceLabel: string;
  copy: string;
  from: string;
  bookLabel: string;
}) {
  return (
    <motion.article
      whileHover="hover"
      className="group relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface shadow-soft dark:bg-white/[0.03]"
    >
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[300px] overflow-hidden lg:min-h-[420px]">
          <motion.div
            variants={{ hover: { scale: 1.08 } }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image src={image} alt={title} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-between p-7 sm:p-9">
          <div>
            <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-terracotta/10 text-terracotta">
              {icon}
            </div>
            <h3 className="font-serif text-3xl font-medium tracking-tight">{title}</h3>
            <p className="mt-4 leading-7 text-foreground/65">{copy}</p>
          </div>
          <div className="mt-10 flex items-end justify-between gap-4 border-t border-foreground/10 pt-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/45">{from}</p>
              <p className="mt-1.5 font-serif text-4xl font-medium text-foreground">
                {price}
                <span className="ms-1 text-sm font-sans font-medium text-foreground/50">{priceLabel}</span>
              </p>
            </div>
            <Link href="/#booking" className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
              {bookLabel}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
