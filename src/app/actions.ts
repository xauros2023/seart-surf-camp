"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE, createAdminSessionToken, isValidAdminPassword } from "@/lib/auth";
import { BookingInput, BookingStatus, DEFAULT_CONTENT, normalizeSiteContent } from "@/lib/content";
import { createBooking, getSiteContent, updateBookingStatusById, validateBookingInput } from "@/lib/data-store";
import { sendBookingConfirmation } from "@/lib/mailer";
import { requireAdmin } from "@/lib/server-auth";

export async function updateContent(newHeroTitle: string, newHeroSubtitle: string, dormPrice: string, privatePrice: string) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return auth;
  }

  try {
    const data = normalizeSiteContent(await getSiteContent());
    data.hero.title = newHeroTitle;
    data.hero.subtitle = newHeroSubtitle;
    data.rooms.dormPrice = dormPrice;
    data.rooms.privatePrice = privatePrice;
    await fs.writeFile(path.join(process.cwd(), "data.json"), JSON.stringify(data, null, 2), "utf8");
    revalidatePath("/");
    revalidatePath("/rooms");
    revalidatePath("/packages");
    return { success: true };
  } catch (error) {
    console.error("Failed to update content", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function submitBooking(data: BookingInput) {
  const validation = validateBookingInput(data);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  try {
    const booking = await createBooking(data);
    revalidatePath("/admin");

    // Fire-and-forget email confirmation. If RESEND_API_KEY is missing,
    // sendBookingConfirmation skips silently — the booking still succeeds.
    const siteContent = await getSiteContent();
    await sendBookingConfirmation({
      to: booking.email,
      data: {
        name: booking.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        roomType: booking.roomType,
        nights: booking.nights,
        estimatedTotal: booking.estimatedTotal,
        siteUrl: siteContent.seo.siteUrl || DEFAULT_CONTENT.seo.siteUrl,
        whatsapp: siteContent.contact.whatsapp,
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error) {
    console.error("Error saving booking:", error);
    return { success: false, error: "Failed to save booking" };
  }
}

export async function updateBookingStatus(id: string, newStatus: BookingStatus) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return auth;
  }

  try {
    const changed = await updateBookingStatusById(id, newStatus);
    revalidatePath("/admin");
    return { success: changed };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false };
  }
}

export async function uploadImage(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.success) {
    return auth;
  }

  const file = formData.get("file");
  const fileName = formData.get("fileName");
  const allowedImages = new Set([
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
  ]);
  
  if (!(file instanceof File) || typeof fileName !== "string") {
    return { success: false, error: "Missing file or filename" };
  }

  if (!allowedImages.has(fileName)) {
    return { success: false, error: "Invalid image target" };
  }

  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Upload an image under 5 MB" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public", "images", fileName);
    await fs.writeFile(filePath, buffer);
    revalidatePath("/");
    revalidatePath("/gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to upload image", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function loginAction(password: string) {
  if (await isValidAdminPassword(password)) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, await createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return { success: true };
  }
  return { success: false };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
