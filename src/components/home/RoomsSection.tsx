"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BedDouble, Tent, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

export default function RoomsSection({ dormPrice, privatePrice }: { dormPrice: string; privatePrice: string }) {
  return (
    <section id="rooms" className="section-shell">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <SectionReveal>
          <p className="section-kicker mx-auto justify-center">Accommodation</p>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <h2 className="section-title mx-auto text-center text-balance">
            Stay simple, comfortable and <span className="font-serif italic text-terracotta">close to the beach.</span>
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.2}>
          <p className="section-copy mx-auto text-center">
            Choose a social dorm bed or a private room. Both include access to shared spaces, rooftop, Wi-Fi and camp support.
          </p>
        </SectionReveal>
      </div>

      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerChildren={0.12}>
        <StaggerItem>
          <RoomCard
            image="/images/room-dorm.webp"
            icon={<Tent size={28} aria-hidden="true" />}
            title="Premium Dorms"
            price={dormPrice}
            priceLabel="/night/person"
            copy="Bunk beds with privacy curtains, reading lights and lockers for solo travelers or friends."
          />
        </StaggerItem>
        <StaggerItem>
          <RoomCard
            image="/images/room-private.webp"
            icon={<BedDouble size={28} aria-hidden="true" />}
            title="Private Suites"
            price={privatePrice}
            priceLabel="/night/room"
            copy="A quieter room with a queen-size bed, private feel and bohemian coastal details."
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
}: {
  image: string;
  icon: ReactNode;
  title: string;
  price: string;
  priceLabel: string;
  copy: string;
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/45">From</p>
              <p className="mt-1.5 font-serif text-4xl font-medium text-foreground">
                {price}
                <span className="ml-1 text-sm font-sans font-medium text-foreground/50">{priceLabel}</span>
              </p>
            </div>
            <Link href="/#booking" className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
              Book
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
