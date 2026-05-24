import { Waves, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function PackagesPage() {
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
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sunset">Packages</span></h1>
        <p className="text-xl text-foreground/70 mb-16 max-w-2xl font-light">Choose the perfect surf holiday. All packages include accommodation, daily breakfast, and access to all camp facilities.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col h-full hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2">Surf & Yoga Experience</h3>
            <p className="text-foreground/60 mb-6 font-light">7 Days / 6 Nights</p>
            <div className="text-4xl font-bold text-terracotta mb-6">450€</div>
            <ul className="space-y-3 mb-8 flex-1 text-foreground/80">
              <li>✓ 6 Nights Accommodation</li>
              <li>✓ Daily Breakfast & 4 Dinners</li>
              <li>✓ 5 Surf Lessons (All equipment)</li>
              <li>✓ 3 Sunset Yoga Sessions</li>
              <li>✓ Agadir Airport Transfer</li>
            </ul>
            <Link href="/#booking" className="w-full text-center py-3 bg-gradient-to-r from-terracotta to-sunset text-[#050811] rounded-full font-bold">Select Package</Link>
          </div>

          <div className="glass-card p-8 flex flex-col h-full hover:scale-105 transition-transform duration-300 border-ocean/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <div className="absolute top-0 right-0 bg-ocean text-[#050811] text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2">Digital Nomad Core</h3>
            <p className="text-foreground/60 mb-6 font-light">14 Days / 13 Nights</p>
            <div className="text-4xl font-bold text-ocean mb-6">650€</div>
            <ul className="space-y-3 mb-8 flex-1 text-foreground/80">
              <li>✓ 13 Nights Accommodation</li>
              <li>✓ Fast Wi-Fi & Coworking Space</li>
              <li>✓ Daily Breakfast</li>
              <li>✓ 4 Surf Lessons</li>
              <li>✓ Weekend Paradise Valley Trip</li>
            </ul>
            <Link href="/#booking" className="w-full text-center py-3 bg-gradient-to-r from-ocean to-ocean-dark text-white rounded-full font-bold">Select Package</Link>
          </div>

          <div className="glass-card p-8 flex flex-col h-full hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2">Zero to Hero Beginner</h3>
            <p className="text-foreground/60 mb-6 font-light">10 Days / 9 Nights</p>
            <div className="text-4xl font-bold text-sunset mb-6">580€</div>
            <ul className="space-y-3 mb-8 flex-1 text-foreground/80">
              <li>✓ 9 Nights Accommodation</li>
              <li>✓ Daily Breakfast & 5 Dinners</li>
              <li>✓ 8 Intensive Surf Lessons</li>
              <li>✓ Video Analysis</li>
              <li>✓ Souk Tour in Agadir</li>
            </ul>
            <Link href="/#booking" className="w-full text-center py-3 bg-white/10 text-foreground border border-white/20 rounded-full font-bold hover:bg-white/20">Select Package</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
