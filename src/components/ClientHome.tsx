"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, MapPin, Waves, Music, Users, Coffee, BedDouble, Tent, ArrowRight, Sun, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";
import { submitBooking } from "../app/actions";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger: any = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function ClientHome({ data }: { data: any }) {
  const [formData, setFormData] = useState({ checkIn: "", checkOut: "", guests: "1", message: "" });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const dormPrice = data?.rooms?.dormPrice || "15€";
  const privatePrice = data?.rooms?.privatePrice || "45€";

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("loading");
    const res = await submitBooking(formData);
    if(res.success) {
      setBookingStatus("success");
      setFormData({ checkIn: "", checkOut: "", guests: "1", message: "" });
      setTimeout(() => setBookingStatus("idle"), 5000);
    } else {
      setBookingStatus("error");
    }
  };

  return (
    <main className="min-h-screen">
      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/123456789" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform animate-pulse">
        <MessageCircle size={32} />
      </a>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.png" alt="Surfers at sunset" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/40 via-transparent to-background dark:to-background"></div>
        </div>
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="relative z-10 text-center px-4 max-w-4xl glass-card rounded-3xl p-8 md:p-12 mx-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-glow">
            {data.hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-foreground mb-8">
            {data.hero.subtitle}
          </p>
          <button className="px-8 py-4 bg-sunset text-white font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,145,77,0.6)] hover:shadow-[0_0_30px_rgba(255,145,77,0.8)] transition-all hover:-translate-y-1">
            Book Your Stay
          </button>
        </motion.div>
      </section>

      {/* About Us / The Vibe */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-terracotta mb-4">The Vibe</h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">More than just a hostel, we are a family. Come for the surf, stay for the community.</p>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, title: "Community", desc: "Meet travelers from all over the world and make lifelong friends." },
            { icon: Waves, title: "Surf", desc: "World-class waves just minutes away. Perfect for all levels." },
            { icon: Music, title: "Music", desc: "Jam sessions and live music under the Moroccan stars." },
            { icon: Coffee, title: "Chilling", desc: "Relax on our rooftop, sip mint tea, and watch the sunset." }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-sand dark:bg-ocean/30 flex items-center justify-center mb-4 text-terracotta group-hover:scale-110 transition-transform">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-foreground/70">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Activities Grid */}
      <section id="activities" className="py-24 px-4 bg-[#0a0f1a] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-ocean dark:text-sunset mb-4">The Experience</h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">Immerse yourself in the local culture and adventure.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { img: "/images/hero-bg.png", title: "Surf Packages", desc: "Daily surf lessons, boards, wetsuits & airport transfers." },
              { img: "/images/quad.png", title: "Moroccan Cuisine", desc: "Fresh breakfast, lunch, and dinner prepared daily." },
              { img: "/images/campfire.png", title: "Banana Beach Vibe", desc: "Private beach area, garden, and shared terrace." },
              { img: "/images/interior.png", title: "Live Music & Events", desc: "Local musicians and traveler jam sessions." }
            ].map((act, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer shadow-lg">
                <Image src={act.img} alt={act.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">{act.title}</h3>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold text-white">{dormPrice}<span className="text-sm font-normal text-sand/60">/night</span></span>
                    <button className="bg-ocean text-white p-2 rounded-full hover:bg-sunset transition-colors shadow-lg">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="rooms" className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-terracotta mb-4">Accommodation</h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">Sleep comfortably in our beautifully designed rooms.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row">
            <div className="relative h-64 md:h-auto md:w-1/2">
              <Image src="/images/interior.png" alt="Dorms" fill className="object-cover" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 bg-sunset text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">From {dormPrice}/night</div>
              <Tent className="text-terracotta mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-2">Mixed Dorms</h3>
              <p className="text-foreground/70 mb-6">Cozy bunk beds with privacy curtains, reading lights, and secure lockers. Perfect for solo travelers.</p>
              <a href="#booking" className="w-full text-center py-3 border-2 border-ocean dark:border-white text-ocean dark:text-white rounded-full font-bold hover:bg-ocean hover:text-white dark:hover:bg-white dark:hover:text-ocean-dark transition-colors">Book a Bed</a>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row">
            <div className="relative h-64 md:h-auto md:w-1/2">
              <Image src="/images/interior.png" alt="Private Room" fill className="object-cover" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center relative">
              <div className="absolute top-4 right-4 bg-sunset text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">From {privatePrice}/night</div>
              <BedDouble className="text-terracotta mb-4" size={32} />
              <h3 className="text-2xl font-bold mb-2">Private Rooms</h3>
              <p className="text-foreground/70 mb-6">Your own private sanctuary with an en-suite bathroom, queen-size bed, and bohemian decor.</p>
              <a href="#booking" className="w-full text-center py-3 border-2 border-ocean dark:border-white text-ocean dark:text-white rounded-full font-bold hover:bg-ocean hover:text-white dark:hover:bg-white dark:hover:text-ocean-dark transition-colors">Book a Room</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location & Booking */}
      <section id="booking" className="py-24 px-4 bg-ocean-dark text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Booking Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card !bg-white/10 !border-white/20 p-8 rounded-3xl">
            <h3 className="text-3xl font-bold text-white mb-6">Request a Booking</h3>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sand/80 flex items-center"><Calendar size={14} className="mr-1"/> Check-in</label>
                  <input type="date" required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sunset transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sand/80 flex items-center"><Calendar size={14} className="mr-1"/> Check-out</label>
                  <input type="date" required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sunset transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-sand/80 flex items-center"><Users size={14} className="mr-1"/> Guests</label>
                <select value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-[#131b2b] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sunset transition-colors">
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>Group (4+)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-sand/80 flex items-center"><MessageSquare size={14} className="mr-1"/> Message</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Tell us about your trip..." className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-sunset transition-colors"></textarea>
              </div>
              <button disabled={bookingStatus === "loading"} type="submit" className="w-full bg-sunset text-[#0a0f1a] font-bold py-4 rounded-lg hover:bg-[#ffb142] transition-colors shadow-[0_0_15px_rgba(253,203,110,0.4)] disabled:opacity-50">
                {bookingStatus === "loading" ? "Sending..." : "Send Request"}
              </button>
              {bookingStatus === "success" && <p className="text-green-400 text-center text-sm font-bold mt-2">Request sent successfully! We will contact you soon.</p>}
              {bookingStatus === "error" && <p className="text-red-400 text-center text-sm font-bold mt-2">Error sending request. Please try again.</p>}
            </form>
          </motion.div>

          {/* Location Info */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-sunset mb-6">Find Us in Tamraght</h2>
            <p className="text-lg text-sand/80 mb-8">
              Nestled between Agadir and Taghazout, Tamraght is the perfect mix of traditional Moroccan culture and vibrant surf lifestyle. Just a 40-minute drive from Agadir Airport.
            </p>
            <div className="flex items-start space-x-4 mb-6">
              <MapPin className="text-terracotta mt-1" size={24} />
              <div>
                <h4 className="font-bold text-xl">Address</h4>
                <p className="text-sand/70">Tamraght Ouzdar, Banana Beach<br />Agadir, Morocco</p>
              </div>
            </div>
            {/* Interactive Map */}
            <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13753.844057850554!2d-9.6896174!3d30.5093766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e8284534f5%3A0xb30ea2775f564756!2sTamraght!5e0!3m2!1sen!2sma!4v1714578125866!5m2!1sen!2sma" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="rounded-2xl absolute inset-0 z-0">
              </iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1a] text-sand py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">SeArt Surf Camp</h3>
            <p className="text-sand/60">© 2026 SeArt Surf Camp. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6 text-sand/80">
            <a href="https://www.instagram.com/seartsurfcamp/" target="_blank" className="hover:text-sunset transition-colors font-bold text-white">Instagram</a>
            <a href="#" className="hover:text-sunset transition-colors">TikTok</a>
            <a href="mailto:contact@seartsurfcamp.com" className="hover:text-sunset transition-colors">contact@seartsurfcamp.com</a>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-bold text-sand/80">
            <a href="#about" className="hover:text-sunset transition-colors">The Vibe</a>
            <a href="#activities" className="hover:text-sunset transition-colors">Activities</a>
            <a href="#rooms" className="hover:text-sunset transition-colors">Rooms</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#booking" className="bg-sunset text-[#0a0f1a] px-6 py-2 rounded-full font-bold hover:bg-[#ffb142] transition-colors shadow-[0_0_15px_rgba(253,203,110,0.5)]">Book Now</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
