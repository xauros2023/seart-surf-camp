"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import AnimatedText from "@/components/motion/AnimatedText";
import MagneticButton from "@/components/motion/MagneticButton";

export default function HeroSection({ title, subtitle }: { title: string; subtitle: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, reduce ? 1.05 : 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.92]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 h-[110%]">
        <Image
          src="/images/hero-bg.webp"
          alt="Surfers walking at Banana Beach near Tamraght"
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/85"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "180px 180px",
        }}
      />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 text-white sm:pb-28 sm:pt-40"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85 backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-terracotta" />
          Tamraght · Banana Beach
        </motion.div>

        <div className="max-w-5xl">
          <AnimatedText
            text={title}
            as="h1"
            className="font-serif text-[2.5rem] font-medium leading-[1] tracking-[-0.025em] sm:text-6xl sm:leading-[0.95] md:text-7xl lg:text-[7.5rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-base leading-[1.65] text-white/80 sm:mt-8 sm:text-lg lg:text-xl"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton strength={0.25}>
            <Link href="#booking" className="hero-button group">
              Check availability
              <ArrowRight size={18} className="ml-2 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.18}>
            <Link href="/packages" className="hero-button-secondary">
              Explore packages
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 text-white/60 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em]"
        >
          Scroll
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
