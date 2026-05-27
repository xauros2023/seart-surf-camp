"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Bed, Calendar, CheckCircle, CreditCard, Loader2, UserRound } from "lucide-react";
import { submitBooking } from "@/app/actions";
import { BookingInput, RoomType, calculateNights, parsePrice } from "@/lib/content";

type BookingStatus = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<keyof BookingInput, string>>;

const todayIso = new Date().toISOString().slice(0, 10);

const defaultFormData: BookingInput = {
  name: "",
  email: "",
  phone: "",
  checkIn: "",
  checkOut: "",
  guests: "1",
  roomType: "dorm",
  message: "",
};

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function BookingWizard({ dormPrice, privatePrice }: { dormPrice: string; privatePrice: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingInput>(defaultFormData);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nights = useMemo(
    () => calculateNights(formData.checkIn, formData.checkOut),
    [formData.checkIn, formData.checkOut],
  );
  const estimatedTotal = useMemo(() => {
    const guests = Number.parseInt(formData.guests, 10);
    const price = parsePrice(formData.roomType === "dorm" ? dormPrice : privatePrice);
    return nights * price * (formData.roomType === "dorm" ? guests : 1);
  }, [dormPrice, formData.guests, formData.roomType, nights, privatePrice]);

  const updateField = (field: keyof BookingInput, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const chooseRoom = (roomType: RoomType) => {
    setFormData((current) => ({ ...current, roomType }));
  };

  const canContinueDates = formData.checkIn !== "" && formData.checkOut !== "" && nights > 0;
  const canSubmit = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";

  const handleSubmit = async () => {
    setStatus("loading");
    const response = await submitBooking(formData);

    if (response.success) {
      setStatus("success");
      setFieldErrors({});
      return;
    }

    setStatus("error");
    if ("errors" in response && response.errors) {
      setFieldErrors(response.errors);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid min-h-[420px] place-items-center text-center"
      >
        <div>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-ocean/15 text-ocean"
          >
            <CheckCircle size={42} aria-hidden="true" />
          </motion.div>
          <h3 className="mb-3 font-serif text-3xl font-medium tracking-tight">Request sent</h3>
          <p className="mx-auto mb-8 max-w-md text-foreground/65">
            We received your request and will contact you shortly to confirm availability, transfers and final details.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setStep(1);
              setFormData(defaultFormData);
            }}
            className="font-semibold text-ocean-dark underline-offset-4 hover:underline dark:text-ocean"
          >
            Make another booking
          </button>
        </div>
      </motion.div>
    );
  }

  const steps = [
    { number: 1, label: "Dates", icon: Calendar },
    { number: 2, label: "Stay", icon: Bed },
    { number: 3, label: "Contact", icon: UserRound },
  ];

  // A step is "reachable" if every previous step was filled in correctly
  const canGoToStep = (target: number) => {
    if (target === 1) return true;
    if (target === 2) return canContinueDates;
    if (target === 3) return canContinueDates;
    return false;
  };

  return (
    <div className="flex min-h-[520px] flex-col">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="mb-4 grid grid-cols-3 gap-3">
          {steps.map((item) => {
            const Icon = item.icon;
            const active = step >= item.number;
            const current = step === item.number;
            const reachable = canGoToStep(item.number);
            const isClickable = reachable && !current;

            return (
              <motion.button
                key={item.number}
                type="button"
                onClick={isClickable ? () => setStep(item.number) : undefined}
                disabled={!isClickable}
                whileTap={isClickable ? { scale: 0.97 } : undefined}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${item.number}: ${item.label}${current ? " (current)" : ""}`}
                className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
                  current
                    ? "border-terracotta bg-terracotta/[0.10] text-terracotta shadow-glow-terracotta cursor-default"
                    : active
                      ? "border-terracotta/40 bg-terracotta/[0.06] text-terracotta hover:border-terracotta/70"
                      : reachable
                        ? "border-foreground/10 text-foreground/55 hover:border-foreground/30 hover:bg-foreground/[0.03]"
                        : "border-foreground/10 text-foreground/35 cursor-not-allowed opacity-70"
                }`}
              >
                <Icon className="mb-2" size={16} aria-hidden="true" />
                <span className="block">{item.label}</span>
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] opacity-60">
                  Step {item.number}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Animated progress bar */}
        <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            initial={false}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-terracotta to-sunset"
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 && (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">When are you joining us?</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldError id="checkIn-error" message={fieldErrors.checkIn}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="checkIn">
                  Check-in
                </label>
                <input
                  id="checkIn"
                  type="date"
                  min={todayIso}
                  value={formData.checkIn}
                  onChange={(event) => updateField("checkIn", event.target.value)}
                  onInput={(event) => updateField("checkIn", event.currentTarget.value)}
                  className="form-field"
                  aria-describedby={fieldErrors.checkIn ? "checkIn-error" : undefined}
                />
              </FieldError>
              <FieldError id="checkOut-error" message={fieldErrors.checkOut}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="checkOut">
                  Check-out
                </label>
                <input
                  id="checkOut"
                  type="date"
                  min={formData.checkIn || todayIso}
                  value={formData.checkOut}
                  onChange={(event) => updateField("checkOut", event.target.value)}
                  onInput={(event) => updateField("checkOut", event.currentTarget.value)}
                  className="form-field"
                  aria-describedby={fieldErrors.checkOut ? "checkOut-error" : undefined}
                />
              </FieldError>
            </div>
            {formData.checkIn && formData.checkOut && nights === 0 && (
              <p className="mt-4 text-sm font-semibold text-red-500">Check-out must be after check-in.</p>
            )}
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canContinueDates}
              className="primary-button mt-auto"
            >
              Continue <ArrowRight className="ml-1 transition-transform duration-300" size={18} aria-hidden="true" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">Choose your comfort</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <RoomChoice
                active={formData.roomType === "dorm"}
                title="Premium Dorm"
                description={`${dormPrice} / night / person`}
                onClick={() => chooseRoom("dorm")}
              />
              <RoomChoice
                active={formData.roomType === "private"}
                title="Private Suite"
                description={`${privatePrice} / night / room`}
                onClick={() => chooseRoom("private")}
              />
            </div>

            <div className="mt-5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="guests">
                Number of guests
              </label>
              <select
                id="guests"
                value={formData.guests}
                onChange={(event) => updateField("guests", event.target.value)}
                className="form-field"
              >
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>

            <motion.div
              layout
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5"
            >
              <div className="flex items-center justify-between text-sm text-foreground/65">
                <span className="font-medium">
                  {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <motion.span
                  key={estimatedTotal}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-3xl font-medium text-terracotta"
                >
                  {estimatedTotal}€
                </motion.span>
              </div>
            </motion.div>

            <div className="mt-auto flex gap-3 pt-6">
              <button type="button" onClick={() => setStep(1)} className="secondary-icon-button" aria-label="Back to dates">
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setStep(3)} className="primary-button">
                Continue <ArrowRight className="ml-1" size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">Send your request</h3>
            <div className="grid gap-4">
              <FieldError id="name-error" message={fieldErrors.name}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="form-field"
                  autoComplete="name"
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
              </FieldError>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldError id="email-error" message={fieldErrors.email}>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="form-field"
                    autoComplete="email"
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                </FieldError>
                <FieldError id="phone-error" message={fieldErrors.phone}>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="phone">
                    WhatsApp / phone
                  </label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className="form-field"
                    autoComplete="tel"
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  />
                </FieldError>
              </div>
              <FieldError id="message-error" message={fieldErrors.message}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="message">
                  Notes
                </label>
                <textarea
                  id="message"
                  placeholder="Airport transfer, surf level, dietary needs..."
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={3}
                  className="form-field resize-none"
                  aria-describedby={fieldErrors.message ? "message-error" : undefined}
                />
              </FieldError>
            </div>

            <div className="mt-5 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-foreground/70">
                  <p className="font-medium text-foreground">
                    {formData.checkIn} to {formData.checkOut}
                  </p>
                  <p className="capitalize">
                    {formData.roomType} · {formData.guests} guests
                  </p>
                </div>
                <div className="flex items-center gap-2 font-serif text-3xl font-medium text-terracotta">
                  <CreditCard size={20} aria-hidden="true" />
                  {estimatedTotal}€
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={status === "loading"}
                className="secondary-icon-button"
                aria-label="Back to stay"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "loading" || !canSubmit}
                className="primary-button"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  "Submit reservation"
                )}
              </button>
            </div>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm font-semibold text-red-500"
              >
                Please check the highlighted fields or try again in a moment.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoomChoice({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ${
        active
          ? "border-ocean bg-ocean/[0.08] shadow-glow-ocean"
          : "border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.03]"
      }`}
    >
      <span className="block font-serif text-lg font-medium tracking-tight">{title}</span>
      <span className="mt-1 block text-sm text-foreground/60">{description}</span>
      {active && (
        <motion.span
          layoutId="room-choice-dot"
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-ocean text-white"
        >
          <CheckCircle size={14} />
        </motion.span>
      )}
    </motion.button>
  );
}

function FieldError({ id, message, children }: { id: string; message?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      {children}
      <AnimatePresence>
        {message && (
          <motion.p
            id={id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm font-semibold text-red-500"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
