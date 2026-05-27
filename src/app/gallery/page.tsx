import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { galleryImages } from "@/lib/content";
import { getSiteContent } from "@/lib/data-store";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from SeArt Surf Camp, Banana Beach, shared spaces and Tamraght surf days.",
};

export default async function GalleryPage() {
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero
          kicker="Gallery"
          title="A look at the waves, rooms and shared camp moments."
          subtitle="Real visual texture matters for a travel decision."
        >
          <a
            href={content.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            Follow on Instagram →
          </a>
        </PageHero>

        <section className="section-shell pt-4">
          <StaggerContainer
            className="columns-1 gap-5 space-y-5 md:columns-2 lg:columns-3"
            staggerChildren={0.06}
          >
            {galleryImages.map((img, index) => (
              <StaggerItem key={`${img.src}-${img.alt}-${index}`}>
                <figure className={`group relative mb-5 overflow-hidden rounded-2xl break-inside-avoid bg-foreground/5 ${img.aspect}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-6 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {img.alt}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
      <SiteFooter content={content} />
      <Noise opacity={0.04} />
    </div>
  );
}
