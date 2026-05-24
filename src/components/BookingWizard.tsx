"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, Users, Bed, CreditCard } from "lucide-react";
import { submitBooking } from "../app/actions";

export default function BookingWizard({ dormPrice, privatePrice }: { dormPrice: string, privatePrice: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    checkIn: "", 
    checkOut: "", 
    guests: "1", 
    roomType: "dorm",
    message: "" 
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights <= 0) return 0;
    
    const priceStr = formData.roomType === "dorm" ? dormPrice : privatePrice;
    const priceNum = parseInt(priceStr.replace(/\D/g, '')) || 0;
    return nights * priceNum * parseInt(formData.guests);
  };

  const handleSubmit = async () => {
    setStatus("loading");
    const res = await submitBooking(formData);
    if(res.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <CheckCircle className="text-ocean mx-auto mb-6" size={64} />
        <h3 className="text-3xl font-bold mb-4 text-white">Booking Requested!</h3>
        <p className="text-foreground/70 mb-8 font-light">We've received your request and will be in touch shortly to confirm your stay.</p>
        <button onClick={() => {setStatus("idle"); setStep(1);}} className="text-ocean font-bold hover:underline">Make another booking</button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-[400px] flex flex-col">
      {/* Steps Header */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= i ? 'bg-terracotta text-white' : 'bg-[#0a0f1a] border border-white/20 text-white/50'}`}>
            {i === 1 ? <Calendar size={16} /> : i === 2 ? <Bed size={16} /> : <CreditCard size={16} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={1}>
        {step === 1 && (
          <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-6">When are you joining us?</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-sand/80 uppercase tracking-widest">Check-in</label>
                <input type="date" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-terracotta transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-sand/80 uppercase tracking-widest">Check-out</label>
                <input type="date" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-terracotta transition-colors" />
              </div>
            </div>
            <button onClick={nextStep} disabled={!formData.checkIn || !formData.checkOut} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50">
              Continue <ArrowRight className="ml-2" size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-6">Choose your comfort</h3>
            <div className="space-y-4 mb-8">
              <div className="flex space-x-4">
                <button onClick={() => setFormData({...formData, roomType: 'dorm'})} className={`flex-1 p-4 rounded-xl border text-left transition-colors ${formData.roomType === 'dorm' ? 'border-ocean bg-ocean/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <h4 className="font-bold text-white mb-1">Premium Dorm</h4>
                  <p className="text-xs text-white/50">{dormPrice} / night / person</p>
                </button>
                <button onClick={() => setFormData({...formData, roomType: 'private'})} className={`flex-1 p-4 rounded-xl border text-left transition-colors ${formData.roomType === 'private' ? 'border-ocean bg-ocean/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <h4 className="font-bold text-white mb-1">Private Suite</h4>
                  <p className="text-xs text-white/50">{privatePrice} / night / room</p>
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-sand/80 uppercase tracking-widest">Number of Guests</label>
                <select value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-terracotta transition-colors">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#050811]">{n} {n===1?'Person':'People'}</option>)}
                </select>
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={prevStep} className="w-16 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center transition-colors"><ArrowLeft size={20} /></button>
              <button onClick={nextStep} className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center transition-colors">Continue <ArrowRight className="ml-2" size={20} /></button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-6">Review & Send Request</h3>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-white/70 font-light">Stay:</span>
                <span className="font-bold text-white">{formData.checkIn} to {formData.checkOut}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 font-light">Room:</span>
                <span className="font-bold text-white capitalize">{formData.roomType} x {formData.guests}</span>
              </div>
              <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-center">
                <span className="text-white font-bold">Estimated Total:</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-sunset">{calculateTotal()}€</span>
              </div>
            </div>

            <textarea placeholder="Any special requests? (Airport transfer, surf lessons, diet...)" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-terracotta transition-colors mb-6"></textarea>

            <div className="flex space-x-4 mt-auto">
              <button onClick={prevStep} disabled={status === "loading"} className="w-16 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center transition-colors"><ArrowLeft size={20} /></button>
              <button onClick={handleSubmit} disabled={status === "loading"} className="flex-1 py-4 bg-gradient-to-r from-terracotta to-sunset text-[#050811] rounded-xl font-bold flex items-center justify-center transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,95,109,0.3)]">
                {status === "loading" ? "Processing..." : "Submit Reservation"}
              </button>
            </div>
            {status === "error" && <p className="text-red-500 text-sm mt-4 text-center">Error submitting request. Try again.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
