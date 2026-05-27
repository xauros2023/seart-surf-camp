import { promises as fs } from "fs";
import path from "path";
import {
  Booking,
  BookingInput,
  BookingStatus,
  DEFAULT_CONTENT,
  SiteContent,
  calculateBookingTotal,
  calculateNights,
  normalizeSiteContent,
} from "./content";

const dataFile = path.join(process.cwd(), "data.json");
const bookingsFile = path.join(process.cwd(), "bookings.json");

type BookingErrors = Partial<Record<keyof BookingInput, string>>;

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tempPath, filePath);
}

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readJsonFile<unknown>(dataFile, DEFAULT_CONTENT);
  return normalizeSiteContent(raw);
}

export async function saveSiteContent(content: SiteContent) {
  await writeJsonFile(dataFile, content);
}

export async function getBookings(): Promise<Booking[]> {
  const raw = await readJsonFile<unknown>(bookingsFile, []);
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter(isBooking);
}

export async function saveBookings(bookings: Booking[]) {
  await writeJsonFile(bookingsFile, bookings);
}

export function validateBookingInput(input: BookingInput) {
  const errors: BookingErrors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(`${input.checkIn}T00:00:00`);
  const checkOutDate = new Date(`${input.checkOut}T00:00:00`);
  const guests = Number.parseInt(input.guests, 10);

  if (!input.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "A valid email is required.";
  }

  if (!input.phone.trim() || input.phone.trim().length < 7) {
    errors.phone = "A phone or WhatsApp number is required.";
  }

  if (Number.isNaN(checkInDate.getTime())) {
    errors.checkIn = "Choose a check-in date.";
  } else if (checkInDate < today) {
    errors.checkIn = "Check-in cannot be in the past.";
  }

  if (Number.isNaN(checkOutDate.getTime())) {
    errors.checkOut = "Choose a check-out date.";
  } else if (!Number.isNaN(checkInDate.getTime()) && checkOutDate <= checkInDate) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  if (!Number.isFinite(guests) || guests < 1 || guests > 6) {
    errors.guests = "Choose between 1 and 6 guests.";
  }

  if (input.roomType !== "dorm" && input.roomType !== "private") {
    errors.roomType = "Choose a valid room type.";
  }

  if (input.message.length > 600) {
    errors.message = "Message must be under 600 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export async function createBooking(input: BookingInput) {
  const content = await getSiteContent();
  const booking: Booking = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    status: "pending",
    nights: calculateNights(input.checkIn, input.checkOut),
    estimatedTotal: calculateBookingTotal(input, content),
  };

  const bookings = await getBookings();
  bookings.push(booking);
  await saveBookings(bookings);

  return booking;
}

export async function updateBookingStatusById(id: string, status: BookingStatus) {
  const bookings = await getBookings();
  const nextBookings = bookings.map((booking) => (booking.id === id ? { ...booking, status } : booking));
  const changed = nextBookings.some((booking, index) => booking.status !== bookings[index]?.status);

  if (!changed) {
    return false;
  }

  await saveBookings(nextBookings);
  return true;
}

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") {
    return false;
  }

  const booking = value as Partial<Booking>;
  return (
    typeof booking.id === "string" &&
    typeof booking.name === "string" &&
    typeof booking.email === "string" &&
    typeof booking.checkIn === "string" &&
    typeof booking.checkOut === "string" &&
    (booking.status === "pending" || booking.status === "confirmed" || booking.status === "cancelled")
  );
}
