import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about transfers, surf gear, Wi-Fi, food options and the best season for surfing in Morocco.",
};

export default async function FAQPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <JsonLd data={faqSchema()} />
      <SiteHeader />
      <main>
        <PageHero
          kicker="FAQ"
          title="Useful answers before you arrive."
          subtitle="For anything specific about your dates, surf level or transfer, send a message and we will confirm directly."
        />

        <section className="mx-auto max-w-4xl px-5 pb-32">
          <SectionReveal>
            <FaqAccordion items={faqs} />
          </SectionReveal>

          <SectionReveal>
            <div className="mt-14 overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-terracotta/[0.08] via-sunset/[0.05] to-transparent p-10 text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight">
                Still have questions?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-foreground/65">
                Send your travel dates, group size and surf level. We will help you choose the right stay.
              </p>
              <a
                href={content.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button mx-auto mt-7 max-w-xs"
              >
                WhatsApp us
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
