import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import Noise from "@/components/motion/Noise";
import { galleryImages } from "@/lib/content";
import { getSiteContent } from "@/lib/data-store";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.gallery" });
  return { title: t("kicker"), description: t("subtitle") };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.gallery");
  const content = await getSiteContent();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <PageHero kicker={t("kicker")} title={t("title")} subtitle={t("subtitle")}>
          <a
            href={content.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            {t("follow")} →
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
