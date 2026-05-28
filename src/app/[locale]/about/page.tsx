import type { Metadata } from "next";
import { Coffee, Laptop, MapPin, Utensils, Waves } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { getSiteContent } from "@/lib/data-store";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("kicker"), description: t("subtitle") };
}

const valueKeys = [
  { key: "waves", icon: Waves },
  { key: "rooftop", icon: Coffee },
  { key: "remote", icon: Laptop },
  { key: "food", icon: Utensils },
] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />

        <section className="section-shell pt-4">
          <SectionReveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/images/hero-bg.webp"
                alt="Banana Beach surf coastline near Tamraght"
                fill
                sizes="100vw"
                className="object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </SectionReveal>
        </section>

        <section className="section-shell pt-0">
          <SectionReveal>
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-5xl">{t("valuesTitle")}</h2>
          </SectionReveal>
          <StaggerContainer className="mt-12 grid gap-5 md:grid-cols-2">
            {valueKeys.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.key}>
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface p-8 transition-colors hover:border-terracotta/30 dark:bg-white/[0.03]">
                    <div className="absolute -end-12 -top-12 size-40 rounded-full bg-terracotta/[0.04] transition-all duration-700 group-hover:scale-150 group-hover:bg-terracotta/[0.08]" />
                    <Icon className="relative mb-6 text-terracotta" size={32} aria-hidden="true" />
                    <h3 className="relative font-serif text-2xl font-medium tracking-tight">{t(`values.${value.key}.title`)}</h3>
                    <p className="relative mt-3 leading-7 text-foreground/65">{t(`values.${value.key}.copy`)}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        <section className="section-shell grid gap-10 pt-4 lg:grid-cols-2 lg:items-center">
          <SectionReveal direction="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src="/images/lounge.webp"
                alt="Shared lounge and interior at SeArt Surf Camp"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </SectionReveal>
          <div>
            <SectionReveal>
              <p className="section-kicker">{t("whereKicker")}</p>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="section-title text-balance">
                {t("whereTitleStart")} <span className="font-serif italic text-ocean">{t("whereTitleAccent")}</span>
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="section-copy">{t("whereCopy")}</p>
            </SectionReveal>
            <SectionReveal delay={0.3}>
              <p className="mt-8 flex gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-5 text-foreground/75">
                <MapPin className="mt-1 shrink-0 text-ocean-dark dark:text-ocean" aria-hidden="true" />
                <span>
                  {content.contact.addressLine1}
                  <br />
                  {content.contact.addressLine2}
                </span>
              </p>
            </SectionReveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}
