"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function WhatsAppFab({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact SeArt Surf Camp on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      style={{ bottom: "max(env(safe-area-inset-bottom), 1rem)" }}
      className="fixed right-4 z-40 grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_45px_-8px_rgba(37,211,102,0.55)] sm:right-6 sm:size-14"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]" />
      <motion.span
        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-[#25D366]"
      />
      <MessageCircle size={24} aria-hidden="true" className="relative z-10" />
    </motion.a>
  );
}
