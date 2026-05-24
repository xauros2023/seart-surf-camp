"use client";

import { useState } from "react";
import { Waves, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const faqs = [
  { q: "How do I get to Tamraght from Agadir Airport?", a: "We offer an airport transfer service for 30€ (one way). Alternatively, you can take a taxi to Agadir bus station, then the bus number 32 or 33 to Tamraght. We highly recommend booking our transfer for peace of mind!" },
  { q: "Do I need to bring my own wetsuit and surfboard?", a: "Not at all! All our surf packages include high-quality wetsuits and surfboards suited for your level. If you prefer to bring your own gear, we have secure storage available." },
  { q: "Is the Wi-Fi good enough for remote work?", a: "Yes! We cater heavily to digital nomads. We have a dedicated fiber-optic connection (100 Mbps+) and multiple comfortable coworking areas, both indoors and on the rooftop." },
  { q: "Do you cater to vegan or gluten-free diets?", a: "Absolutely. Our Moroccan chefs prepare fresh daily meals and can accommodate vegan, vegetarian, gluten-free, and other dietary requirements. Just let us know when booking." },
  { q: "What is the best time of year to surf in Morocco?", a: "Morocco has waves year-round! Beginners will find fun, manageable waves all year. Advanced surfers looking for big swells should aim for the winter months (October to March)." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-4">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center glass-card !rounded-none !border-t-0 !border-l-0 !border-r-0 !bg-background/40">
        <Link href="/" className="flex items-center space-x-2">
          <Waves className="text-terracotta" size={32} />
          <span className="text-2xl font-bold tracking-tighter">SeArt.</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="max-w-4xl mx-auto py-16">
        <Link href="/" className="inline-flex items-center text-ocean-dark hover:text-ocean transition-colors mb-10 font-bold">
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-ocean-dark">Questions?</span></h1>
        <p className="text-xl text-foreground/70 mb-16 font-light">Everything you need to know before arriving at SeArt Surf Camp.</p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-bold">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="text-terracotta" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-foreground/70 font-light"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center glass-card p-10">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-foreground/70 mb-6 font-light">We are here to help. Send us an email or message us on WhatsApp.</p>
          <a href="https://wa.me/212600000000" target="_blank" className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">WhatsApp Us</a>
        </div>
      </main>
    </div>
  );
}
