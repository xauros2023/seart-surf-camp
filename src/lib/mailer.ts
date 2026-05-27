import { Resend } from "resend";
import BookingConfirmation, { type BookingConfirmationProps } from "@/emails/BookingConfirmation";
import { DEFAULT_CONTENT } from "@/lib/content";

/**
 * Email service wrapper around Resend.
 *
 * Required env vars:
 *   RESEND_API_KEY           - your Resend project API key
 *   RESEND_FROM_EMAIL        - sender, e.g. "SeArt Surf Camp <hello@seartsurfcamp.com>"
 *   RESEND_REPLY_TO          - optional reply-to address
 *
 * If RESEND_API_KEY is missing, calls become no-ops (logs and returns null).
 * This lets the form keep working in local dev without keys.
 */

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "SeArt Surf Camp <onboarding@resend.dev>";
const replyTo = process.env.RESEND_REPLY_TO ?? DEFAULT_CONTENT.contact.email;

const client = apiKey ? new Resend(apiKey) : null;

export async function sendBookingConfirmation({
  to,
  data,
}: {
  to: string;
  data: BookingConfirmationProps;
}) {
  if (!client) {
    console.warn("[mailer] RESEND_API_KEY not set — skipping booking confirmation email");
    return { skipped: true as const };
  }

  try {
    const result = await client.emails.send({
      from: fromEmail,
      to,
      replyTo,
      subject: "We received your SeArt booking request",
      react: BookingConfirmation(data),
    });

    if (result.error) {
      console.error("[mailer] Resend error:", result.error);
      return { skipped: false as const, error: result.error };
    }

    return { skipped: false as const, id: result.data?.id };
  } catch (error) {
    console.error("[mailer] Unexpected error sending email:", error);
    return { skipped: false as const, error };
  }
}
