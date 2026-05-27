"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import AnimatedText from "@/components/motion/AnimatedText";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function PageHero({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <section className="relative overflow-hidden border-b border-foreground/[0.06] pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-24">
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-br from-terracotta/15 via-sunset/10 to-ocean/5 blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-5">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="section-kicker"
        >
          {kicker}
        </motion.p>
        <AnimatedText text={title} as="h1" className="section-title text-balance" />
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="section-copy text-pretty"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
    </>
  );
}
