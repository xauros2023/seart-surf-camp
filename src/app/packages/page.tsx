import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { packages } from "@/lib/content";
import { getSiteContent } from "@/lib/data-store";
import { offersSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Surf Packages",
  description:
    "Compare SeArt Surf Camp packages for surf, yoga, digital nomad stays and beginner progression in Tamraght.",
};

export default async function PackagesPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <JsonLd data={offersSchema(content)} />
      <SiteHeader />
      <main>
        <PageHero
          kicker="Packages"
          title="Choose the rhythm of your Moroccan surf holiday."
          subtitle="All packages include accommodation, breakfast, camp facilities and local guidance. We confirm exact dates and room availability after your request."
        >
          <Link href="/#booking" className="secondary-button">
            Request dates →
          </Link>
        </PageHero>

        <section className="section-shell pt-4">
          <StaggerContainer className="grid gap-6 lg:grid-cols-3" staggerChildren={0.1}>
            {packages.map((pack) => (
              <StaggerItem key={pack.id}>
                <PackageCard pack={pack} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <SectionReveal>
            <div className="mt-16 rounded-3xl border border-foreground/[0.08] bg-foreground/[0.025] p-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/50">Need something custom?</p>
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                Tell us about your <span className="italic text-terracotta">group, your level, your dates.</span>
              </h2>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-transform duration-500 hover:-translate-y-0.5"
              >
                Build a custom stay →
              </Link>
            </div>
          </SectionReveal>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}

function PackageCard({ pack }: { pack: (typeof packages)[number] }) {
  const highlighted = "highlighted" in pack && pack.highlighted;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface p-8 transition-all duration-500 hover:-translate-y-1 dark:bg-white/[0.03] ${
        highlighted
          ? "border-ocean/50 shadow-glow-ocean"
          : "border-foreground/[0.08] shadow-soft hover:border-foreground/20"
      }`}
    >
      {highlighted && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-ocean px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#061014]">
          <span className="size-1.5 rounded-full bg-[#061014]" />
          Popular
        </span>
      )}
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/50">{pack.duration}</p>
      <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">{pack.title}</h2>
      <p className="mt-6 font-serif text-5xl font-medium text-terracotta">{pack.price}</p>
      <p className="mt-5 leading-7 text-foreground/65">{pack.description}</p>
      <ul className="mt-8 grid flex-1 gap-3 text-sm text-foreground/75">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ocean-dark dark:bg-ocean" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/#booking"
        className={`mt-10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${
          highlighted
            ? "bg-foreground text-background hover:scale-[1.02]"
            : "border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        Select package →
      </Link>
    </article>
  );
}
