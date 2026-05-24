import { Waves, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

const images = [
  { src: "/images/hero-bg.png", alt: "Surfing at Sunset", aspect: "aspect-[4/3]" },
  { src: "/images/interior.png", alt: "Hostel Interior", aspect: "aspect-[3/4]" },
  { src: "/images/quad.png", alt: "Quad Biking", aspect: "aspect-square" },
  { src: "/images/campfire.png", alt: "Campfire", aspect: "aspect-[4/5]" },
  { src: "/images/hero-bg.png", alt: "Waves", aspect: "aspect-square" },
  { src: "/images/interior.png", alt: "Lounge", aspect: "aspect-[16/9]" }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-4">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center glass-card !rounded-none !border-t-0 !border-l-0 !border-r-0 !bg-background/40">
        <Link href="/" className="flex items-center space-x-2">
          <Waves className="text-terracotta" size={32} />
          <span className="text-2xl font-bold tracking-tighter">SeArt.</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="max-w-7xl mx-auto py-16">
        <Link href="/" className="inline-flex items-center text-ocean-dark hover:text-ocean transition-colors mb-10 font-bold">
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Link>
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset to-terracotta">Gallery</span></h1>
            <p className="text-xl text-foreground/70 max-w-2xl font-light">Glimpses of life at SeArt Surf Camp. The waves, the community, the vibe.</p>
          </div>
          <a href="https://www.instagram.com/seartsurfcamp/" target="_blank" className="hidden md:inline-block px-6 py-3 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors">Follow our Instagram</a>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => (
            <div key={i} className={`relative w-full ${img.aspect} break-inside-avoid rounded-2xl overflow-hidden glass-card group cursor-pointer`}>
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold tracking-widest uppercase">{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
