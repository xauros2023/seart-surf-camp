import type { Metadata } from "next";
import { ArrowUpRight, AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { getSiteContent } from "@/lib/data-store";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SeArt Surf Camp by WhatsApp, email or Instagram for surf camp availability in Tamraght, Morocco.",
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          kicker="Contact"
          title="Tell us your dates and we will help shape the stay."
          subtitle="Share your group size, surf level, preferred room type and arrival airport. The fastest way to confirm availability is WhatsApp."
        />

        <section className="section-shell pt-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <SectionReveal>
              <div className="rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-terracotta/[0.08] via-sunset/[0.04] to-transparent p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/55">Visit</p>
                <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                  Find us at the heart of <span className="italic text-terracotta">Tamraght.</span>
                </h2>
                <p className="mt-5 flex gap-3 text-foreground/70">
                  <MapPin className="mt-1 shrink-0 text-terracotta" aria-hidden="true" />
                  <span>
                    {content.contact.addressLine1}
                    <br />
                    {content.contact.addressLine2}
                  </span>
                </p>
              </div>
            </SectionReveal>

            <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerChildren={0.08}>
              <StaggerItem>
                <ContactCard
                  icon={<MessageCircle aria-hidden="true" />}
                  title="WhatsApp"
                  label={content.contact.whatsappLabel}
                  href={content.contact.whatsapp}
                  accent="bg-[#25D366]/12 text-[#1aa852]"
                  external
                />
              </StaggerItem>
              <StaggerItem>
                <ContactCard
                  icon={<Mail aria-hidden="true" />}
                  title="Email"
                  label={content.contact.email}
                  href={`mailto:${content.contact.email}`}
                  accent="bg-terracotta/12 text-terracotta"
                />
              </StaggerItem>
              <StaggerItem>
                <ContactCard
                  icon={<AtSign aria-hidden="true" />}
                  title="Instagram"
                  label="@seartsurfcamp"
                  href={content.contact.instagram}
                  accent="bg-sunset/15 text-sunset"
                  external
                />
              </StaggerItem>
              <StaggerItem>
                <ContactCard
                  icon={<MapPin aria-hidden="true" />}
                  title="Google Maps"
                  label="Open in Maps"
                  href="https://www.google.com/maps/search/?api=1&query=Tamraght%20Ouzdar%20Banana%20Beach%20Agadir%20Morocco"
                  accent="bg-ocean/12 text-ocean-dark dark:text-ocean"
                  external
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}

function ContactCard({
  icon,
  title,
  label,
  href,
  external,
  accent,
}: {
  icon: ReactNode;
  title: string;
  label: string;
  href: string;
  external?: boolean;
  accent: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group relative block h-full overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface p-8 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-soft dark:bg-white/[0.03]"
    >
      <div className={`mb-6 grid size-14 place-items-center rounded-2xl ${accent} [&_svg]:size-6`}>
        {icon}
      </div>
      <h2 className="font-serif text-2xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 truncate text-foreground/65">{label}</p>
      <ArrowUpRight
        size={18}
        className="absolute right-7 top-7 text-foreground/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
      />
    </a>
  );
}
