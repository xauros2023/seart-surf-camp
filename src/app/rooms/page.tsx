import type { Metadata } from "next";
import { BedDouble, Lock, ShowerHead, Tent, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SectionReveal from "@/components/motion/SectionReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { getSiteContent } from "@/lib/data-store";

export const metadata: Metadata = {
  title: "Rooms",
  description:
    "Dorm and private room options at SeArt Surf Camp in Tamraght, with Wi-Fi, lockers, shared spaces and rooftop access.",
};

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Lock, label: "Secure storage" },
  { icon: ShowerHead, label: "Clean shared spaces" },
];

export default async function RoomsPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          kicker="Rooms"
          title="Choose the stay that fits your trip."
          subtitle="Both room types keep you close to shared camp life, the rooftop and the surf schedule."
        />

        <section className="section-shell pt-4">
          <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerChildren={0.12}>
            <StaggerItem>
              <RoomDetail
                title="Premium Dorms"
                icon={<Tent size={28} aria-hidden="true" />}
                price={`${content.rooms.dormPrice} / night / person`}
                image="/images/room-dorm.webp"
                copy="A social and budget-friendly option for solo travelers, friends and anyone who wants to meet the camp community quickly."
                points={["Privacy curtains", "Reading lights", "Lockers", "Shared bathroom access"]}
              />
            </StaggerItem>
            <StaggerItem>
              <RoomDetail
                title="Private Suites"
                icon={<BedDouble size={28} aria-hidden="true" />}
                price={`${content.rooms.privatePrice} / night / room`}
                image="/images/room-private.webp"
                copy="A quieter base for couples, remote workers or travelers who want privacy while keeping access to the camp experience."
                points={["Queen-size bed", "Private feel", "Bohemian coastal decor", "Ideal for longer stays"]}
              />
            </StaggerItem>
          </StaggerContainer>

          <SectionReveal>
            <div className="mt-12">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/50">
                Every stay includes
              </p>
              <StaggerContainer className="grid gap-3 sm:grid-cols-3" staggerChildren={0.06}>
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <StaggerItem key={amenity.label}>
                      <div className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-5 transition-colors hover:bg-foreground/[0.06]">
                        <span className="grid size-11 place-items-center rounded-full bg-ocean/[0.1] text-ocean-dark dark:text-ocean">
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <p className="font-medium">{amenity.label}</p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </SectionReveal>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}

function RoomDetail({
  title,
  icon,
  price,
  image,
  copy,
  points,
}: {
  title: string;
  icon: ReactNode;
  price: string;
  image: string;
  copy: string;
  points: string[];
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface shadow-soft dark:bg-white/[0.03]">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-8">
        <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-terracotta/[0.12] text-terracotta">
          {icon}
        </div>
        <h2 className="font-serif text-3xl font-medium tracking-tight">{title}</h2>
        <p className="mt-2 font-serif text-xl font-medium italic text-ocean-dark dark:text-ocean">{price}</p>
        <p className="mt-5 leading-7 text-foreground/65">{copy}</p>
        <ul className="mt-7 grid gap-2.5 text-sm text-foreground/75">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        <Link href="/#booking" className="primary-button mt-auto pt-4 sm:mt-10">
          Request this room
        </Link>
      </div>
    </article>
  );
}
