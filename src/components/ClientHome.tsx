import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import HeroSection from "./home/HeroSection";
import MarqueeBand from "./home/MarqueeBand";
import AboutSection from "./home/AboutSection";
import ExperiencesSection from "./home/ExperiencesSection";
import TestimonialsSection from "./home/TestimonialsSection";
import RoomsSection from "./home/RoomsSection";
import BookingSection from "./home/BookingSection";
import WhatsAppFab from "./home/WhatsAppFab";
import Noise from "./motion/Noise";
import ScrollProgress from "./motion/ScrollProgress";
import { SiteContent } from "@/lib/content";

export default function ClientHome({ data }: { data: SiteContent }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <SiteHeader />

      <main>
        <HeroSection title={data.hero.title} subtitle={data.hero.subtitle} />
        <MarqueeBand />
        <AboutSection />
        <ExperiencesSection />
        <TestimonialsSection />
        <RoomsSection dormPrice={data.rooms.dormPrice} privatePrice={data.rooms.privatePrice} />
        <BookingSection data={data} />
      </main>

      <SiteFooter content={data} />
      <WhatsAppFab href={data.contact.whatsapp} />
      <Noise opacity={0.04} />
    </div>
  );
}
