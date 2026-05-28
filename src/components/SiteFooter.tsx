"use client";

import { ArrowUpRight, Mail, MapPin, MessageCircle, Waves } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SiteContent } from "@/lib/content";

const navKeys = ["about", "rooms", "packages", "gallery", "faq", "contact"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  about: "/about",
  rooms: "/rooms",
  packages: "/packages",
  gallery: "/gallery",
  faq: "/faq",
  contact: "/contact",
};

export default function SiteFooter({ content }: { content: SiteContent }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative overflow-hidden bg-foreground text-background dark:bg-[#020611]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 size-[600px] rounded-full bg-terracotta/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-ocean/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pt-24 sm:pb-12">
        <div className="border-b border-background/10 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-sunset">{t("ctaKicker")}</p>
          <h2 className="mt-5 max-w-4xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            {t("ctaTitleStart")} <br className="hidden sm:block" />
            <span className="italic text-sunset">{t("ctaTitleAccent")}</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#booking"
              className="group inline-flex items-center gap-2 rounded-full bg-sunset px-7 py-4 text-sm font-semibold text-[#17130e] transition-transform duration-500 hover:-translate-y-0.5"
            >
              {t("ctaCheck")}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={content.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-background/20 px-7 py-4 text-sm font-semibold text-background backdrop-blur-md transition-colors hover:border-background/60 hover:bg-background/[0.06]"
            >
              {t("ctaWhatsapp")}
            </a>
          </div>
        </div>

        <div className="grid gap-12 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-full bg-sunset/15 text-sunset">
                <Waves size={20} aria-hidden="true" />
              </span>
              <span className="font-serif text-3xl font-medium tracking-tight">SeArt.</span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-background/65">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-background/45">{t("explore")}</h3>
            <ul className="grid gap-3 text-sm">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link href={navPaths[key]} className="text-background/75 transition-colors hover:text-sunset">
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-background/45">{t("visit")}</h3>
            <p className="flex gap-3 text-sm leading-7 text-background/75">
              <MapPin className="mt-1 shrink-0 text-sunset" size={16} aria-hidden="true" />
              <span>
                {content.contact.addressLine1}
                <br />
                {content.contact.addressLine2}
              </span>
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-background/45">{t("contact")}</h3>
            <div className="grid gap-3 text-sm">
              <a className="inline-flex items-center gap-3 text-background/75 transition-colors hover:text-sunset" href={`mailto:${content.contact.email}`}>
                <Mail size={16} className="text-sunset" aria-hidden="true" />
                {content.contact.email}
              </a>
              <a className="inline-flex items-center gap-3 text-background/75 transition-colors hover:text-sunset" href={content.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} className="text-sunset" aria-hidden="true" />
                {content.contact.whatsappLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/45 md:flex-row md:items-center">
          <p>{t("rights")}</p>
          <p className="font-serif italic">{t("signature")}</p>
        </div>
      </div>
    </footer>
  );
}
