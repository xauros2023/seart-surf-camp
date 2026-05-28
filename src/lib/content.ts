export type RoomType = "dorm" | "private";

export type IdDocumentType = "national_id" | "residence_permit" | "passport" | "driver_license";

export type SiteContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  rooms: {
    dormPrice: string;
    privatePrice: string;
  };
  contact: {
    email: string;
    instagram: string;
    whatsapp: string;
    whatsappLabel: string;
    addressLine1: string;
    addressLine2: string;
  };
  seo: {
    siteUrl: string;
    title: string;
    description: string;
  };
};

export type BookingInput = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  // Legacy free-text "guests" kept for backwards-compat with old bookings in data.json.
  // New bookings populate adults/childrenHalf/childrenFree and we keep `guests` in sync as a total.
  guests: string;
  adults: string;
  childrenHalf: string;
  childrenFree: string;
  roomType: RoomType;
  message: string;
  // Optional identity document — accelerates check-in
  idType?: IdDocumentType | "";
  idNumber?: string;
};

export type Booking = BookingInput & {
  id: string;
  timestamp: string;
  status: BookingStatus;
  nights: number;
  estimatedTotal: number;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "Welcome to SeArt Surf Camp",
    subtitle:
      "Your summer sanctuary at Banana Beach, Tamraght. Surf, chill, and experience the real Moroccan vibe.",
  },
  rooms: {
    dormPrice: "15€",
    privatePrice: "45€",
  },
  contact: {
    email: "contact@seartsurfcamp.com",
    instagram: "https://www.instagram.com/seartsurfcamp/",
    whatsapp: "https://wa.me/212600000000",
    whatsappLabel: "+212 600 000 000",
    addressLine1: "Tamraght Ouzdar, Banana Beach",
    addressLine2: "Agadir, Morocco",
  },
  seo: {
    siteUrl: "https://seartsurfcamp.com",
    title: "SeArt Surf Camp | Tamraght & Banana Beach",
    description:
      "Surf camp in Tamraght, Morocco with accommodation, surf coaching, yoga, coworking, Moroccan food and Banana Beach access.",
  },
};

const textOrDefault = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

export function normalizeSiteContent(raw: unknown): SiteContent {
  const source = raw && typeof raw === "object" ? (raw as Partial<SiteContent>) : {};

  return {
    hero: {
      title: textOrDefault(source.hero?.title, DEFAULT_CONTENT.hero.title),
      subtitle: textOrDefault(source.hero?.subtitle, DEFAULT_CONTENT.hero.subtitle),
    },
    rooms: {
      dormPrice: textOrDefault(source.rooms?.dormPrice, DEFAULT_CONTENT.rooms.dormPrice),
      privatePrice: textOrDefault(source.rooms?.privatePrice, DEFAULT_CONTENT.rooms.privatePrice),
    },
    contact: {
      email: textOrDefault(source.contact?.email, DEFAULT_CONTENT.contact.email),
      instagram: textOrDefault(source.contact?.instagram, DEFAULT_CONTENT.contact.instagram),
      whatsapp: textOrDefault(source.contact?.whatsapp, DEFAULT_CONTENT.contact.whatsapp),
      whatsappLabel: textOrDefault(source.contact?.whatsappLabel, DEFAULT_CONTENT.contact.whatsappLabel),
      addressLine1: textOrDefault(source.contact?.addressLine1, DEFAULT_CONTENT.contact.addressLine1),
      addressLine2: textOrDefault(source.contact?.addressLine2, DEFAULT_CONTENT.contact.addressLine2),
    },
    seo: {
      siteUrl: textOrDefault(source.seo?.siteUrl, DEFAULT_CONTENT.seo.siteUrl),
      title: textOrDefault(source.seo?.title, DEFAULT_CONTENT.seo.title),
      description: textOrDefault(source.seo?.description, DEFAULT_CONTENT.seo.description),
    },
  };
}

export function parsePrice(value: string): number {
  const amount = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(amount) ? amount : 0;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diff = end.getTime() - start.getTime();
  return diff > 0 ? Math.ceil(diff / 86_400_000) : 0;
}

function safeInt(value: unknown, fallback: number): number {
  if (typeof value !== "string" && typeof value !== "number") return fallback;
  const n = typeof value === "string" ? Number.parseInt(value, 10) : value;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Pricing rules:
 *  - Adults (12+): full nightly price
 *  - Children 4-11: 50% of nightly price
 *  - Toddlers 0-3: free
 *  - Private suite: charged per ROOM (not per person), but kids 4-11 add 50% per child
 *    (industry-standard: bed-sharing private — adults flat, kids add a half supplement)
 *  - Dorm: charged per PERSON for adults + half-price for kids 4-11
 */
export function calculateBookingTotal(
  input: Pick<BookingInput, "checkIn" | "checkOut" | "guests" | "adults" | "childrenHalf" | "roomType">,
  content: SiteContent,
) {
  const nights = calculateNights(input.checkIn, input.checkOut);
  const nightly = parsePrice(input.roomType === "dorm" ? content.rooms.dormPrice : content.rooms.privatePrice);

  // Prefer new structured fields; fall back to legacy `guests` for old bookings.
  const adults = input.adults
    ? safeInt(input.adults, 1)
    : Math.max(1, safeInt(input.guests, 1));
  const kidsHalf = safeInt(input.childrenHalf, 0);

  const personUnits = input.roomType === "dorm" ? adults : 1; // private = per room
  const kidSupplement = kidsHalf * 0.5;

  return Math.round(nights * nightly * (personUnits + kidSupplement));
}

export const packages = [
  {
    id: "surf-yoga",
    title: "Surf & Yoga Experience",
    duration: "7 Days / 6 Nights",
    price: "450€",
    description: "Balanced surf coaching, rooftop yoga and relaxed Moroccan evenings.",
    features: ["6 nights accommodation", "Daily breakfast and 4 dinners", "5 surf lessons with equipment", "3 sunset yoga sessions", "Agadir airport transfer"],
  },
  {
    id: "digital-nomad",
    title: "Digital Nomad Core",
    duration: "14 Days / 13 Nights",
    price: "650€",
    description: "A longer stay built around reliable work time, surf breaks and community.",
    features: ["13 nights accommodation", "Fast Wi-Fi and coworking areas", "Daily breakfast", "4 surf lessons", "Weekend Paradise Valley trip"],
    highlighted: true,
  },
  {
    id: "beginner",
    title: "Zero to Hero Beginner",
    duration: "10 Days / 9 Nights",
    price: "580€",
    description: "A focused progression plan for beginners who want real confidence in the water.",
    features: ["9 nights accommodation", "Daily breakfast and 5 dinners", "8 intensive surf lessons", "Video analysis", "Souk tour in Agadir"],
  },
] as const;

export const galleryImages = [
  { src: "/images/hero-bg.webp", alt: "Surfers walking on Banana Beach at sunset", aspect: "aspect-[4/3]" },
  { src: "/images/lounge.webp", alt: "Warm interior lounge at SeArt Surf Camp", aspect: "aspect-[3/4]" },
  { src: "/images/coaching.webp", alt: "Surf coaching session at the beach", aspect: "aspect-square" },
  { src: "/images/campfire.webp", alt: "Campfire gathering after sunset", aspect: "aspect-[4/5]" },
  { src: "/images/rooftop.webp", alt: "Sunset on the SeArt rooftop", aspect: "aspect-[4/5]" },
  { src: "/images/breakfast.webp", alt: "Moroccan breakfast spread", aspect: "aspect-square" },
  { src: "/images/yoga.webp", alt: "Sunrise yoga on the rooftop", aspect: "aspect-[3/4]" },
  { src: "/images/quad.webp", alt: "Quad ride near Paradise Valley", aspect: "aspect-[4/3]" },
  { src: "/images/room-private.webp", alt: "Private suite with bohemian decor", aspect: "aspect-square" },
] as const;

export const testimonials = [
  {
    id: "lena",
    name: "Lena M.",
    origin: "Berlin, Germany",
    avatar: "L",
    rating: 5,
    quote:
      "Five days in and I was catching unbroken waves. The vibe is just right — relaxed, social, and the rooftop dinners are unreal.",
    source: "Google Reviews",
  },
  {
    id: "thomas",
    name: "Thomas R.",
    origin: "Lyon, France",
    avatar: "T",
    rating: 5,
    quote:
      "Came as a digital nomad, stayed three weeks. Wi-Fi solid, coworking corners quiet, surf right after standups. Best work-life balance I've had.",
    source: "HostelWorld",
  },
  {
    id: "ana",
    name: "Ana P.",
    origin: "Lisbon, Portugal",
    avatar: "A",
    rating: 5,
    quote:
      "The instructors actually adapt to your level. By day 4 I was on green waves, by day 6 a clean bottom turn. The team makes you feel safe.",
    source: "Booking.com",
  },
  {
    id: "joao",
    name: "João S.",
    origin: "São Paulo, Brazil",
    avatar: "J",
    rating: 5,
    quote:
      "Moroccan food, surf, campfire nights and a community that feels like family within 48 hours. Already booked my return.",
    source: "Instagram",
  },
  {
    id: "mia",
    name: "Mia K.",
    origin: "Stockholm, Sweden",
    avatar: "M",
    rating: 5,
    quote:
      "Solo female traveler — felt 100% at home from minute one. Got picked up at the airport, room was warm and cozy, and the rooftop yoga is everything.",
    source: "Tripadvisor",
  },
  {
    id: "rafa",
    name: "Rafael D.",
    origin: "Barcelona, Spain",
    avatar: "R",
    rating: 5,
    quote:
      "Tamraght hits different. SeArt has the right mix of structured surf days and freedom to explore. The Paradise Valley trip was a highlight.",
    source: "Google Reviews",
  },
] as const;

export const faqs = [
  {
    q: "How do I get to Tamraght from Agadir Airport?",
    a: "We offer an airport transfer service for 30€ one way. You can also take a taxi to Agadir bus station, then bus 32 or 33 to Tamraght.",
  },
  {
    q: "Do I need to bring my own wetsuit and surfboard?",
    a: "No. Surf packages include boards and wetsuits matched to your level. If you bring your own gear, secure storage is available.",
  },
  {
    q: "Is the Wi-Fi good enough for remote work?",
    a: "Yes. The camp is set up for digital nomads with fast Wi-Fi and comfortable work areas inside and on the rooftop.",
  },
  {
    q: "Do you cater to vegan or gluten-free diets?",
    a: "Yes. Tell us when booking and the kitchen can prepare vegan, vegetarian, gluten-free and other dietary options.",
  },
  {
    q: "What is the best time of year to surf in Morocco?",
    a: "Morocco has waves year-round. Beginners can come all year; advanced surfers usually prefer the stronger swells from October to March.",
  },
] as const;
