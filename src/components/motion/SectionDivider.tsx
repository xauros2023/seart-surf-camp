"use client";

import { motion } from "motion/react";

/**
 * Slim, elegant divider — animated line with terracotta dot center.
 * Used between major homepage sections for rhythm.
 */
export default function SectionDivider() {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "100% 50%" }}
        className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-foreground/15"
      />
      <motion.span
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="size-1.5 rounded-full bg-terracotta"
        aria-hidden="true"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "0% 50%" }}
        className="h-px flex-1 bg-gradient-to-l from-transparent via-foreground/10 to-foreground/15"
      />
    </div>
  );
}
