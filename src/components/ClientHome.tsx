"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { MessageCircle, MapPin, Waves, Music, Users, Coffee, BedDouble, Tent, ArrowRight, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";
import { submitBooking } from "../app/actions";

// Magnetic Button Component for Premium Feel
const MagneticButton = ({ children, onClick, className, type = "button" }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      type={type}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Text Reveal Component
const RevealText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
};

const stagger: any = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function ClientHome({ data }: { data: any }) {
  const [formData, setFormData] = useState({ checkIn: "", checkOut: "", guests: "1", message: "" });
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const dormPrice = data?.rooms?.dormPrice || "15€";
  const privatePrice = data?.rooms?.privatePrice || "45€";
  const heroTitle = data?.hero?.title || "SeArt Surf Camp";
  const heroSubtitle = data?.hero?.subtitle || "Premium surf experience in Tamraght";

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

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
    <div className="bg-background min-h-screen text-foreground selection:bg-terracotta selection:text-white">
      {/* Background Blobs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ocean/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-terracotta/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center glass-card !rounded-none !border-t-0 !border-l-0 !border-r-0 !bg-background/40"
      >
        <div className="flex items-center space-x-2">
          <Waves className="text-terracotta" size={32} />
          <span className="text-2xl font-bold tracking-tighter">SeArt.</span>
        </div>
        <div className="hidden md:flex space-x-10 text-sm font-bold tracking-wide text-sand/80">
          <a href="#about" className="hover:text-white transition-colors relative group">
            The Vibe
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta to-sunset group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#activities" className="hover:text-white transition-colors relative group">
            Activities
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta to-sunset group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#rooms" className="hover:text-white transition-colors relative group">
            Rooms
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta to-sunset group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
        <div className="flex items-center">
          <a href="#booking" className="bg-gradient-to-r from-terracotta to-sunset text-[#050811] px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,95,109,0.3)]">Book Now</a>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.png" alt="SeArt Surf Camp" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/30 via-[#050811]/60 to-[#050811]"></div>
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tighter leading-[1.1]">
            <RevealText text={heroTitle} />
          </h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1, duration: 1 }}
            className="text-xl md:text-2xl text-sand/80 mb-10 font-light max-w-2xl mx-auto"
          >
            {heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 1.2, type: "spring" }}
          >
            <a href="#about" className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
              <ArrowRight className="rotate-90 text-white" size={24} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* The Vibe */}
      <section id="about" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sunset">SeArt Vibe</span></h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed font-light">
              Located at the famous Banana Beach in Tamraght, SeArt is a sanctuary for surfers, digital nomads, and travelers. We blend traditional Moroccan hospitality with a modern, aesthetic coastal design.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 group">
                <div className="p-3 glass-card rounded-full group-hover:border-terracotta/50 transition-colors"><Waves className="text-ocean" /></div>
                <span className="font-bold">World-Class Waves</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-3 glass-card rounded-full group-hover:border-terracotta/50 transition-colors"><Coffee className="text-sunset" /></div>
                <span className="font-bold">Oceanview Rooftop</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-3 glass-card rounded-full group-hover:border-terracotta/50 transition-colors"><Music className="text-terracotta" /></div>
                <span className="font-bold">Live Music Nights</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-3 glass-card rounded-full group-hover:border-terracotta/50 transition-colors"><Users className="text-ocean" /></div>
                <span className="font-bold">Amazing Community</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="md:w-1/2 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2 relative z-10">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image src="/images/interior.png" alt="Hostel Interior" fill className="object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 glass-card p-6 z-20 shadow-2xl">
              <div className="flex items-center space-x-2 text-sunset mb-2">
                {[1,2,3,4,5].map(i => <motion.svg key={i} initial={{ opacity:0 }} whileInView={{opacity:1}} transition={{delay: i*0.1}} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></motion.svg>)}
              </div>
              <p className="font-bold text-lg">"The best hostel in Morocco!"</p>
              <p className="text-sm text-foreground/50">HostelWorld Reviews</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section id="activities" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-ocean-dark">Experience</span></h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">Everything you need for an unforgettable Moroccan adventure.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "/images/hero-bg.png", title: "Surf Packages", desc: "Daily surf lessons, boards, wetsuits & airport transfers." },
              { img: "/images/quad.png", title: "Moroccan Cuisine", desc: "Fresh breakfast, lunch, and dinner prepared daily." },
              { img: "/images/campfire.png", title: "Banana Beach Vibe", desc: "Private beach area, garden, and shared terrace." }
            ].map((act, i) => (
              <motion.div key={i} variants={fadeInUp} className="group relative overflow-hidden glass-card h-[400px] cursor-pointer">
                <Image src={act.img} alt={act.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{act.title}</h3>
                  <p className="text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-light">{act.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="rooms" className="py-32 px-4 max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sunset">With Us</span></h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">Sleep comfortably in our beautifully designed premium rooms.</p>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card flex flex-col md:flex-row overflow-hidden group">
            <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
              <Image src="/images/interior.png" alt="Dorms" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-12 md:w-1/2 flex flex-col justify-center relative">
              <Tent className="text-terracotta mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Premium Dorms</h3>
              <p className="text-foreground/70 mb-8 font-light text-lg">Cozy bunk beds with privacy curtains, reading lights, and secure lockers. Perfect for solo travelers.</p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-sm text-foreground/50 uppercase tracking-widest font-bold">Starting at</span>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sunset">{dormPrice}<span className="text-lg text-foreground/50">/night</span></div>
                </div>
                <a href="#booking" className="inline-flex items-center justify-center p-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <ArrowRight className="text-white" size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card flex flex-col md:flex-row-reverse overflow-hidden group">
            <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
              <Image src="/images/interior.png" alt="Private Room" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-12 md:w-1/2 flex flex-col justify-center relative">
              <BedDouble className="text-ocean" size={40} />
              <h3 className="text-3xl font-bold mb-4 tracking-tight mt-6">Private Suites</h3>
              <p className="text-foreground/70 mb-8 font-light text-lg">Your own private sanctuary with an en-suite bathroom, queen-size bed, and bohemian aesthetic decor.</p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-sm text-foreground/50 uppercase tracking-widest font-bold">Starting at</span>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ocean to-ocean-dark">{privatePrice}<span className="text-lg text-foreground/50">/night</span></div>
                </div>
                <a href="#booking" className="inline-flex items-center justify-center p-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
                  <ArrowRight className="text-white" size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking & Location */}
      <section id="booking" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Booking Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="glass-card p-10 lg:p-14">
            <h3 className="text-4xl font-bold text-white mb-2 tracking-tighter">Reserve Your Spot</h3>
            <p className="text-foreground/60 mb-10 font-light">Secure your bed or room at SeArt Surf Camp today.</p>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sand/80 uppercase tracking-widest">Check-in</label>
                  <input type="date" required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-terracotta transition-colors backdrop-blur-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sand/80 uppercase tracking-widest">Check-out</label>
                  <input type="date" required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-terracotta transition-colors backdrop-blur-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-sand/80 uppercase tracking-widest">Guests</label>
                <select value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-[#0a0f1a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-terracotta transition-colors">
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>3 People</option>
                  <option>Group (4+)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-sand/80 uppercase tracking-widest">Message</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Tell us about your trip..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-terracotta transition-colors backdrop-blur-sm"></textarea>
              </div>
              
              <MagneticButton 
                type="submit" 
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-terracotta to-sunset disabled:opacity-50 mt-4"
              >
                <div className="relative z-10 font-bold text-[#050811] py-4 text-lg tracking-wide">
                  {bookingStatus === "loading" ? "Processing..." : "Submit Request"}
                </div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </MagneticButton>
              
              <AnimatePresence>
                {bookingStatus === "success" && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-ocean text-center text-sm font-bold mt-4">
                    Request sent successfully! We will contact you soon.
                  </motion.p>
                )}
                {bookingStatus === "error" && (
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-terracotta text-center text-sm font-bold mt-4">
                    Error sending request. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col justify-between">
            <div className="glass-card p-10 mb-8">
              <div className="flex items-start space-x-6">
                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="text-terracotta" size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-2xl mb-2 tracking-tight">Our Location</h4>
                  <p className="text-foreground/70 font-light text-lg">Tamraght Ouzdar, Banana Beach<br />Agadir, Morocco</p>
                </div>
              </div>
            </div>
            {/* Interactive Map */}
            <div className="h-full min-h-[300px] rounded-3xl border border-white/10 relative overflow-hidden group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
              <div className="absolute inset-0 bg-ocean/20 mix-blend-overlay pointer-events-none z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13753.844057850554!2d-9.6896174!3d30.5093766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e8284534f5%3A0xb30ea2775f564756!2sTamraght!5e0!3m2!1sen!2sma!4v1714578125866!5m2!1sen!2sma" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                className="absolute inset-0 z-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
              </iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-bold tracking-tighter mb-2">SeArt.</h3>
            <p className="text-foreground/50 font-light text-sm tracking-wide">© 2026 SeArt Surf Camp. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-8 text-sm font-bold tracking-widest uppercase">
            <a href="https://www.instagram.com/seartsurfcamp/" target="_blank" className="hover:text-sunset transition-colors">Instagram</a>
            <a href="mailto:contact@seartsurfcamp.com" className="hover:text-sunset transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <a href="https://wa.me/212600000000" target="_blank" className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform">
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
