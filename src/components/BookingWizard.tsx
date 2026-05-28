"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Calendar,
  CheckCircle,
  CreditCard,
  IdCard,
  Loader2,
  Minus,
  Plus,
  UserRound,
} from "lucide-react";
import { submitBooking } from "@/app/actions";
import {
  BookingInput,
  IdDocumentType,
  RoomType,
  calculateNights,
  parsePrice,
} from "@/lib/content";
import { useCurrency } from "@/components/providers/CurrencyProvider";

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
  adults: "1",
  childrenHalf: "0",
  childrenFree: "0",
  roomType: "dorm",
  message: "",
  idType: "",
  idNumber: "",
};

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

const ID_TYPES: IdDocumentType[] = ["national_id", "residence_permit", "passport", "driver_license"];

export default function BookingWizard({
  dormPrice,
  privatePrice,
}: {
  dormPrice: string;
  privatePrice: string;
}) {
  const t = useTranslations("booking.wizard");
  const { format } = useCurrency();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingInput>(defaultFormData);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const nights = useMemo(
    () => calculateNights(formData.checkIn, formData.checkOut),
    [formData.checkIn, formData.checkOut],
  );

  const adultsN = Number.parseInt(formData.adults || "0", 10) || 0;
  const kidsHalfN = Number.parseInt(formData.childrenHalf || "0", 10) || 0;
  const kidsFreeN = Number.parseInt(formData.childrenFree || "0", 10) || 0;

  const estimatedTotalEur = useMemo(() => {
    const nightly = parsePrice(formData.roomType === "dorm" ? dormPrice : privatePrice);
    const personUnits = formData.roomType === "dorm" ? Math.max(1, adultsN) : 1;
    const kidSupplement = kidsHalfN * 0.5;
    return Math.round(nights * nightly * (personUnits + kidSupplement));
  }, [dormPrice, privatePrice, formData.roomType, nights, adultsN, kidsHalfN]);

  const updateField = (field: keyof BookingInput, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const chooseRoom = (roomType: RoomType) => {
    setFormData((current) => ({ ...current, roomType }));
  };

  const canContinueDates = formData.checkIn !== "" && formData.checkOut !== "" && nights > 0;
  const canSubmit = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "";

  const canGoToStep = (target: number) => {
    if (target === 1) return true;
    if (target === 2 || target === 3) return canContinueDates;
    return false;
  };

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
          <h3 className="mb-3 font-serif text-3xl font-medium tracking-tight">
            {t("success.title")}
          </h3>
          <p className="mx-auto mb-8 max-w-md text-foreground/65">{t("success.body")}</p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setStep(1);
              setFormData(defaultFormData);
            }}
            className="font-semibold text-ocean-dark underline-offset-4 hover:underline dark:text-ocean"
          >
            {t("success.again")}
          </button>
        </div>
      </motion.div>
    );
  }

  const steps = [
    { number: 1, labelKey: "stepDates", icon: Calendar },
    { number: 2, labelKey: "stepStay", icon: Bed },
    { number: 3, labelKey: "stepContact", icon: UserRound },
  ] as const;

  return (
    <div className="flex min-h-[560px] flex-col">
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
                className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 text-start text-sm font-semibold transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
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
                <span className="block">{t(item.labelKey)}</span>
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] opacity-60">
                  {t("stepCount")} {item.number}
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
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">{t("dates.title")}</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldError id="checkIn-error" message={fieldErrors.checkIn}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="checkIn">
                  {t("dates.checkIn")}
                </label>
                <input
                  id="checkIn"
                  type="date"
                  min={todayIso}
                  value={formData.checkIn}
                  onChange={(event) => updateField("checkIn", event.target.value)}
                  onInput={(event) => updateField("checkIn", event.currentTarget.value)}
                  className="form-field"
                />
              </FieldError>
              <FieldError id="checkOut-error" message={fieldErrors.checkOut}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="checkOut">
                  {t("dates.checkOut")}
                </label>
                <input
                  id="checkOut"
                  type="date"
                  min={formData.checkIn || todayIso}
                  value={formData.checkOut}
                  onChange={(event) => updateField("checkOut", event.target.value)}
                  onInput={(event) => updateField("checkOut", event.currentTarget.value)}
                  className="form-field"
                />
              </FieldError>
            </div>
            {formData.checkIn && formData.checkOut && nights === 0 && (
              <p className="mt-4 text-sm font-semibold text-red-500">{t("dates.errorOrder")}</p>
            )}
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canContinueDates}
              className="primary-button mt-auto"
            >
              {t("dates.continue")} <ArrowRight className="ml-1" size={18} aria-hidden="true" />
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
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">{t("stay.title")}</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <RoomChoice
                active={formData.roomType === "dorm"}
                title={t("roomChoice.dorm")}
                description={t("roomChoice.dormDesc", { price: dormPrice })}
                onClick={() => chooseRoom("dorm")}
              />
              <RoomChoice
                active={formData.roomType === "private"}
                title={t("roomChoice.private")}
                description={t("roomChoice.privateDesc", { price: privatePrice })}
                onClick={() => chooseRoom("private")}
              />
            </div>

            <p className="mt-6 mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              {t("stay.guestsTitle")}
            </p>
            <div className="grid gap-3">
              <Counter
                label={t("stay.adults")}
                help={t("stay.adultsHelp")}
                value={adultsN}
                min={1}
                max={8}
                onChange={(n) => updateField("adults", String(n))}
              />
              <Counter
                label={t("stay.childrenHalf")}
                help={t("stay.childrenHalfHelp")}
                value={kidsHalfN}
                min={0}
                max={6}
                onChange={(n) => updateField("childrenHalf", String(n))}
              />
              <Counter
                label={t("stay.childrenFree")}
                help={t("stay.childrenFreeHelp")}
                value={kidsFreeN}
                min={0}
                max={4}
                onChange={(n) => updateField("childrenFree", String(n))}
              />
            </div>

            <motion.div
              layout
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5"
            >
              <div className="flex items-center justify-between text-sm text-foreground/65">
                <span className="font-medium">{t("stay.nights", { count: nights })}</span>
                <motion.span
                  key={estimatedTotalEur}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-3xl font-medium text-terracotta"
                >
                  {format(estimatedTotalEur)}
                </motion.span>
              </div>
            </motion.div>

            <div className="mt-auto flex gap-3 pt-6">
              <button type="button" onClick={() => setStep(1)} className="secondary-icon-button" aria-label={t("stay.back")}>
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setStep(3)} className="primary-button">
                {t("stay.continue")} <ArrowRight className="ml-1" size={18} aria-hidden="true" />
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
            <h3 className="mb-6 font-serif text-2xl font-medium tracking-tight">{t("contact.title")}</h3>
            <div className="grid gap-4">
              <FieldError id="name-error" message={fieldErrors.name}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="name">
                  {t("contact.name")}
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="form-field"
                  autoComplete="name"
                />
              </FieldError>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldError id="email-error" message={fieldErrors.email}>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="email">
                    {t("contact.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="form-field"
                    autoComplete="email"
                  />
                </FieldError>
                <FieldError id="phone-error" message={fieldErrors.phone}>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="phone">
                    {t("contact.phone")}
                  </label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className="form-field"
                    autoComplete="tel"
                  />
                </FieldError>
              </div>

              {/* ID Document — optional */}
              <div className="mt-2 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-4">
                <div className="mb-3 flex items-start gap-2.5">
                  <IdCard size={16} className="mt-0.5 shrink-0 text-terracotta" />
                  <div>
                    <p className="text-sm font-semibold">{t("contact.idHeader")}</p>
                    <p className="text-xs text-foreground/55">{t("contact.idHelp")}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="idType">
                      {t("contact.idType")}
                    </label>
                    <select
                      id="idType"
                      value={formData.idType || ""}
                      onChange={(event) => updateField("idType", event.target.value)}
                      className="form-field"
                    >
                      <option value="">—</option>
                      {ID_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {t(`contact.idTypes.${type}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FieldError id="idNumber-error" message={fieldErrors.idNumber}>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="idNumber">
                      {t("contact.idNumber")}
                    </label>
                    <input
                      id="idNumber"
                      value={formData.idNumber || ""}
                      onChange={(event) => updateField("idNumber", event.target.value)}
                      className="form-field"
                      autoComplete="off"
                    />
                  </FieldError>
                </div>
              </div>

              <FieldError id="message-error" message={fieldErrors.message}>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55" htmlFor="message">
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={3}
                  className="form-field resize-none"
                />
              </FieldError>
            </div>

            <div className="mt-5 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-foreground/70">
                  <p className="font-medium text-foreground">
                    {t("contact.recap", { checkIn: formData.checkIn, checkOut: formData.checkOut })}
                  </p>
                  <p className="capitalize">
                    {t("contact.recapStay", {
                      room: formData.roomType === "dorm" ? t("roomChoice.dorm") : t("roomChoice.private"),
                      adults: adultsN,
                      children: kidsHalfN + kidsFreeN,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-serif text-3xl font-medium text-terracotta">
                  <CreditCard size={20} aria-hidden="true" />
                  {format(estimatedTotalEur)}
                </div>
              </div>
            </div>

            <div className="mt-auto flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={status === "loading"}
                className="secondary-icon-button"
                aria-label={t("contact.back")}
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
                    {t("contact.sending")}
                  </>
                ) : (
                  t("contact.submit")
                )}
              </button>
            </div>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-sm font-semibold text-red-500"
              >
                {t("contact.errorFields")}
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
      className={`relative overflow-hidden rounded-2xl border p-5 text-start transition-all duration-500 ${
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
          className="absolute end-4 top-4 grid size-6 place-items-center rounded-full bg-ocean text-white"
        >
          <CheckCircle size={14} />
        </motion.span>
      )}
    </motion.button>
  );
}

function Counter({
  label,
  help,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background/60 p-4">
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        <p className="text-xs text-foreground/55">{help}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="grid size-9 place-items-center rounded-full border border-foreground/15 transition-colors hover:border-foreground/40 hover:bg-foreground/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center font-serif text-xl font-medium tabular-nums">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="grid size-9 place-items-center rounded-full border border-foreground/15 transition-colors hover:border-foreground/40 hover:bg-foreground/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
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
