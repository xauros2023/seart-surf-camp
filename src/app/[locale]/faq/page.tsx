import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import Noise from "@/components/motion/Noise";
import { faqs } from "@/lib/content";
import { getSiteContent } from "@/lib/data-store";
import { faqSchema } from "@/lib/schema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return { title: t("kicker"), description: t("subtitle") };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.faq");
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <JsonLd data={faqSchema()} />
      <SiteHeader />
      <main>
        <PageHero kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")} />

        <section className="mx-auto max-w-4xl px-5 pb-32">
          <SectionReveal>
            <FaqAccordion items={faqs} />
          </SectionReveal>

          <SectionReveal>
            <div className="mt-14 overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-terracotta/[0.08] via-sunset/[0.05] to-transparent p-10 text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight">{t("stillTitle")}</h2>
              <p className="mx-auto mt-3 max-w-xl text-foreground/65">{t("stillBody")}</p>
              <a
                href={content.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button mx-auto mt-7 max-w-xs"
              >
                {t("stillCta")}
              </a>
            </div>
          </SectionReveal>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}
