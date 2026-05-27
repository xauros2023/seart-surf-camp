"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle, ImageUp, Mail, MessageSquare, Save, Users } from "lucide-react";
import { updateBookingStatus, updateContent, uploadImage } from "@/app/actions";
import { Booking, BookingStatus, SiteContent } from "@/lib/content";

type AdminTab = "content" | "images" | "bookings";
type EditableImage =
  | "hero-bg.png"
  | "lounge.png"
  | "rooftop.png"
  | "coaching.png"
  | "breakfast.png"
  | "room-dorm.png"
  | "room-private.png"
  | "quad.png"
  | "campfire.png"
  | "yoga.png";

const editableImages: EditableImage[] = [
  "hero-bg.png",
  "lounge.png",
  "rooftop.png",
  "coaching.png",
  "breakfast.png",
  "room-dorm.png",
  "room-private.png",
  "quad.png",
  "campfire.png",
  "yoga.png",
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("content");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [dormPrice, setDormPrice] = useState("");
  const [privatePrice, setPrivatePrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImg, setUploadingImg] = useState<EditableImage | null>(null);
  const [cacheBusts, setCacheBusts] = useState<Partial<Record<EditableImage, string>>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const bookingStats = useMemo(
    () => ({
      pending: bookings.filter((booking) => booking.status === "pending").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
    }),
    [bookings],
  );

  const fetchBookings = async () => {
    const response = await fetch("/api/bookings");
    if (!response.ok) {
      setError("Unable to load reservations.");
      return;
    }
    setBookings((await response.json()) as Booking[]);
  };

  useEffect(() => {
    let ignore = false;

    async function loadAdminData() {
      try {
        const [contentResponse] = await Promise.all([fetch("/api/data"), fetchBookings()]);
        if (!contentResponse.ok || ignore) {
          return;
        }

        const content = (await contentResponse.json()) as SiteContent;
        setHeroTitle(content.hero.title);
        setHeroSubtitle(content.hero.subtitle);
        setDormPrice(content.rooms.dormPrice);
        setPrivatePrice(content.rooms.privatePrice);
      } catch {
        if (!ignore) {
          setError("Unable to load admin data.");
        }
      }
    }

    void loadAdminData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    const response = await updateBookingStatus(id, newStatus);
    if (response.success) {
      await fetchBookings();
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    const result = await updateContent(heroTitle, heroSubtitle, dormPrice, privatePrice);
    setSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(result.error || "Unable to save content.");
    }
  };

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>, fileName: EditableImage) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingImg(fileName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const result = await uploadImage(formData);
    setUploadingImg(null);
    event.target.value = "";

    if (result.success) {
      setCacheBusts((current) => ({ ...current, [fileName]: new Date().toISOString() }));
    } else {
      setError(result.error || "Unable to upload image.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Camp dashboard</h1>
        <p className="mt-2 text-slate-600">Manage homepage content, key images and reservation requests.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending" value={bookingStats.pending} />
        <StatCard label="Confirmed" value={bookingStats.confirmed} tone="green" />
        <StatCard label="Cancelled" value={bookingStats.cancelled} tone="red" />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")}>
          Edit content
        </TabButton>
        <TabButton active={activeTab === "images"} onClick={() => setActiveTab("images")}>
          Manage images
        </TabButton>
        <TabButton active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")}>
          Reservations
        </TabButton>
      </div>

      {activeTab === "content" && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">Website content</h2>
            {saveSuccess && <span className="flex items-center gap-2 text-sm font-bold text-green-700"><CheckCircle size={18} /> Saved</span>}
          </div>
          <div className="grid gap-5">
            <AdminField label="Hero title">
              <input className="admin-field" value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} />
            </AdminField>
            <AdminField label="Hero subtitle">
              <textarea className="admin-field min-h-28 resize-none" value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} />
            </AdminField>
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminField label="Dorms price">
                <input className="admin-field" value={dormPrice} onChange={(event) => setDormPrice(event.target.value)} placeholder="15€" />
              </AdminField>
              <AdminField label="Private room price">
                <input className="admin-field" value={privatePrice} onChange={(event) => setPrivatePrice(event.target.value)} placeholder="45€" />
              </AdminField>
            </div>
            <button
              type="button"
              onClick={handleSaveContent}
              disabled={saving}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-black text-white hover:bg-green-800 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>
      )}

      {activeTab === "images" && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-black tracking-tight">Image gallery</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {editableImages.map((img) => (
              <div key={img} className="rounded-lg border border-slate-200 p-4">
                <Image
                  src={`/images/${img}${cacheBusts[img] ? `?v=${cacheBusts[img]}` : ""}`}
                  alt={img}
                  width={640}
                  height={360}
                  className="mb-4 aspect-video w-full rounded-md object-cover"
                />
                <p className="mb-4 font-mono text-sm text-slate-600">{img}</p>
                <label className="relative flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ocean-dark px-4 py-2 text-sm font-black text-ocean-dark hover:bg-ocean-dark hover:text-white">
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleUploadImage(event, img)} disabled={uploadingImg === img} />
                  <ImageUp size={18} />
                  {uploadingImg === img ? "Uploading..." : "Replace"}
                </label>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "bookings" && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-black tracking-tight">Reservation requests</h2>
          {bookings.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-6 text-slate-500">No bookings yet.</p>
          ) : (
            <div className="grid gap-4">
              {[...bookings].reverse().map((booking) => (
                <article key={booking.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-2 font-black text-ocean-dark">
                          <CalendarDays size={16} /> {booking.checkIn} to {booking.checkOut}
                        </span>
                        <span className="flex items-center gap-2 text-slate-700">
                          <Users size={16} /> {booking.guests}
                        </span>
                        <StatusBadge status={booking.status} />
                      </div>
                      <h3 className="mt-4 text-xl font-black">{booking.name}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={15} /> {booking.email} · {booking.phone}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">{formatBookingDate(booking.timestamp)}</div>
                  </div>
                  <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 md:grid-cols-3">
                    <p>
                      <strong>Room:</strong> {booking.roomType}
                    </p>
                    <p>
                      <strong>Nights:</strong> {booking.nights}
                    </p>
                    <p>
                      <strong>Total:</strong> {booking.estimatedTotal}€
                    </p>
                  </div>
                  {booking.message && (
                    <p className="mt-4 flex gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <MessageSquare className="mt-0.5 shrink-0" size={16} />
                      {booking.message}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusButton status="confirmed" current={booking.status} onClick={() => handleStatusChange(booking.id, "confirmed")} />
                    <StatusButton status="pending" current={booking.status} onClick={() => handleStatusChange(booking.id, "pending")} />
                    <StatusButton status="cancelled" current={booking.status} onClick={() => handleStatusChange(booking.id, "cancelled")} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-sm font-black ${
        active ? "border-ocean-dark text-ocean-dark" : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, tone = "slate" }: { label: string; value: number; tone?: "slate" | "green" | "red" }) {
  const toneClass = tone === "green" ? "text-green-700" : tone === "red" ? "text-red-700" : "text-slate-950";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className={`mt-2 text-4xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const className =
    status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-800";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ${className}`}>{status}</span>;
}

function StatusButton({ status, current, onClick }: { status: BookingStatus; current: BookingStatus; onClick: () => void }) {
  const active = status === current;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-black capitalize ${
        active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {status}
    </button>
  );
}

function formatBookingDate(timestamp?: string) {
  if (!timestamp) {
    return "Date unavailable";
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString();
}
