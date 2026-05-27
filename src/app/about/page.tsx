import type { Metadata } from "next";
import { Coffee, Laptop, MapPin, Utensils, Waves } from "lucide-react";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { getSiteContent } from "@/lib/data-store";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SeArt Surf Camp in Tamraght: surf coaching, Moroccan hospitality, coworking, rooftop life and Banana Beach access.",
};

const values = [
  { icon: Waves, title: "Surf that fits your level", copy: "Lessons and spot choices are matched to the conditions and your confidence in the water." },
  { icon: Coffee, title: "A social rooftop rhythm", copy: "Breakfast, sunsets and relaxed evenings make it easy to meet people without forcing a party hostel mood." },
  { icon: Laptop, title: "Remote-work friendly", copy: "Wi-Fi, calmer corners and longer-stay packages make work days realistic between surf sessions." },
  { icon: Utensils, title: "Moroccan food culture", copy: "Fresh local meals, dietary options and shared dinners are part of the stay." },
];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          kicker="About the camp"
          title="Built for travelers who want surf, comfort and community."
          subtitle="SeArt Surf Camp sits in Tamraght, close to Banana Beach and the classic Agadir surf coastline. Quality surf days, warm Moroccan hosting, calm shared spaces and enough flexibility for beginners, solo travelers and digital nomads."
        />

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
            <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-5xl">
              Four things we obsess over.
            </h2>
          </SectionReveal>
          <StaggerContainer className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface p-8 transition-colors hover:border-terracotta/30 dark:bg-white/[0.03]">
                    <div className="absolute -right-12 -top-12 size-40 rounded-full bg-terracotta/[0.04] transition-all duration-700 group-hover:scale-150 group-hover:bg-terracotta/[0.08]" />
                    <Icon className="relative mb-6 text-terracotta" size={32} aria-hidden="true" />
                    <h3 className="relative font-serif text-2xl font-medium tracking-tight">{value.title}</h3>
                    <p className="relative mt-3 leading-7 text-foreground/65">{value.copy}</p>
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
              <p className="section-kicker">Where we are</p>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="section-title text-balance">
                Tamraght gives you the surf coast without losing the <span className="font-serif italic text-ocean">local feel.</span>
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="section-copy">
                You are close to surf breaks, cafes, markets and Agadir airport while staying in a quieter village atmosphere.
              </p>
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
