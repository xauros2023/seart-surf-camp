"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Coffee, Music, Star, Users, Waves } from "lucide-react";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

const highlights = [
  { icon: Waves, label: "World-class waves" },
  { icon: Coffee, label: "Oceanview rooftop" },
  { icon: Music, label: "Live music nights" },
  { icon: Users, label: "Friendly community" },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-shell">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionReveal>
            <p className="section-kicker">Tamraght, Morocco</p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2 className="section-title text-balance">
              A surf camp for waves, work and <span className="font-serif italic text-terracotta">slow Moroccan days.</span>
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <p className="section-copy text-pretty">
              SeArt is minutes from Banana Beach and built for travelers who want more than a bed: coached surf sessions,
              a warm social rhythm, reliable work corners and simple access to the Agadir coast.
            </p>
          </SectionReveal>

          <StaggerContainer className="mt-10 grid gap-3 sm:grid-cols-2" staggerChildren={0.07}>
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.label}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/60 p-4 backdrop-blur-sm transition-colors hover:border-terracotta/30 hover:bg-terracotta/[0.04]"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-terracotta/[0.1] text-terracotta transition-colors group-hover:bg-terracotta/[0.18]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        <SectionReveal direction="left" delay={0.15}>
          <div className="relative">
            <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src="/images/lounge.webp"
                alt="Interior lounge at SeArt Surf Camp"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-5 left-5 right-5 z-10 rounded-2xl border border-white/10 bg-[#1a1a1c]/95 p-6 text-white shadow-deep backdrop-blur-md lg:-left-12 lg:bottom-auto lg:right-auto lg:top-10 lg:w-[300px]"
            >
              <div className="mb-3 flex gap-1 text-[#ffb142]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mb-2 font-serif text-xl font-medium leading-tight">
                &ldquo;The best hostel in Morocco!&rdquo;
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                HostelWorld Reviews
              </p>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
