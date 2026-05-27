import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export type BookingConfirmationProps = {
  name: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  roomType: "dorm" | "private";
  nights: number;
  estimatedTotal: number;
  siteUrl: string;
  whatsapp: string;
};

const formatDateLong = (iso: string) => {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const buildCalendarLink = (data: Pick<BookingConfirmationProps, "checkIn" | "checkOut" | "roomType">) => {
  const start = data.checkIn.replace(/-/g, "");
  const end = data.checkOut.replace(/-/g, "");
  const title = encodeURIComponent("Stay at SeArt Surf Camp — Tamraght");
  const details = encodeURIComponent(
    `Your ${data.roomType === "dorm" ? "Premium Dorm" : "Private Suite"} stay. We will confirm the final details before arrival.`,
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=Tamraght+Ouzdar%2C+Banana+Beach%2C+Agadir%2C+Morocco`;
};

export default function BookingConfirmation({
  name,
  checkIn,
  checkOut,
  guests,
  roomType,
  nights,
  estimatedTotal,
  siteUrl,
  whatsapp,
}: BookingConfirmationProps) {
  const firstName = name.split(" ")[0];
  const heroImg = `${siteUrl.replace(/\/$/, "")}/images/hero-bg.png`;
  const calendarLink = buildCalendarLink({ checkIn, checkOut, roomType });

  return (
    <Html>
      <Head />
      <Preview>Booking received — we&apos;ll confirm your SeArt stay within hours</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Hero image */}
          <Section style={{ padding: 0 }}>
            <Img
              src={heroImg}
              alt="SeArt Surf Camp, Tamraght"
              width="600"
              height="240"
              style={heroImage}
            />
          </Section>

          {/* Brand + greeting */}
          <Section style={greetingSection}>
            <Text style={brand}>SeArt.</Text>
            <Text style={tag}>Booking received</Text>
            <Text style={greetingTitle}>Hi {firstName} — your stay is on its way.</Text>
            <Text style={greetingBody}>
              We just got your request. A team member will reply within a few hours to confirm dates and walk you through the final details. In the meantime, here&apos;s a recap.
            </Text>
          </Section>

          {/* Stay card */}
          <Section style={card}>
            <Text style={cardLabel}>Your stay</Text>

            <Row>
              <Column style={col50}>
                <Text style={fieldLabel}>Check-in</Text>
                <Text style={fieldValue}>{formatDateLong(checkIn)}</Text>
              </Column>
              <Column style={col50}>
                <Text style={fieldLabel}>Check-out</Text>
                <Text style={fieldValue}>{formatDateLong(checkOut)}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Row>
              <Column style={col33}>
                <Text style={fieldLabel}>Nights</Text>
                <Text style={fieldValue}>{nights}</Text>
              </Column>
              <Column style={col33}>
                <Text style={fieldLabel}>Guests</Text>
                <Text style={fieldValue}>{guests}</Text>
              </Column>
              <Column style={col33}>
                <Text style={fieldLabel}>Room</Text>
                <Text style={fieldValue}>{roomType === "dorm" ? "Premium Dorm" : "Private Suite"}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={totalLabel}>Estimated total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>{estimatedTotal}€</Text>
              </Column>
            </Row>
            <Text style={muted}>
              An indicative price based on your dates. Our team confirms the final amount, transfer options and add-ons by reply.
            </Text>
          </Section>

          {/* CTAs */}
          <Section style={ctaSection}>
            <Row>
              <Column align="center" style={{ paddingBottom: 12 }}>
                <Link href={whatsapp} style={primaryBtn}>
                  💬  Continue on WhatsApp
                </Link>
              </Column>
            </Row>
            <Row>
              <Column align="center">
                <Link href={calendarLink} style={secondaryBtn}>
                  Add to Google Calendar
                </Link>
              </Column>
            </Row>
          </Section>

          {/* What's next */}
          <Section style={nextSection}>
            <Text style={cardLabel}>What happens next</Text>
            <Text style={listItem}>
              <span style={listBullet}>1.</span> We confirm availability and reserve your room within a few hours.
            </Text>
            <Text style={listItem}>
              <span style={listBullet}>2.</span> You receive payment options (acompte at booking, balance on arrival).
            </Text>
            <Text style={listItem}>
              <span style={listBullet}>3.</span> We organise your airport transfer if you need one.
            </Text>
            <Text style={listItem}>
              <span style={listBullet}>4.</span> Pack a swimsuit, sunscreen, and a soft towel — we handle the rest.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCopy}>
              Tamraght Ouzdar, Banana Beach — Agadir, Morocco
            </Text>
            <Text style={footerCopy}>
              <Link href={siteUrl} style={footerLink}>
                {siteUrl.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
            <Text style={signature}>Crafted with salt, sun &amp; ocean.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============ STYLES ============

const body: React.CSSProperties = {
  backgroundColor: "#fbf7f1",
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "32px 16px",
};

const container: React.CSSProperties = {
  maxWidth: 600,
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: 20,
  overflow: "hidden",
  border: "1px solid rgba(31,42,37,0.08)",
};

const heroImage: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  objectFit: "cover",
};

const greetingSection: React.CSSProperties = {
  padding: "32px 32px 24px",
  textAlign: "center",
};

const brand: React.CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 26,
  fontWeight: 500,
  letterSpacing: "-0.02em",
  color: "#1f2a25",
};

const tag: React.CSSProperties = {
  display: "inline-block",
  margin: "0 0 14px",
  padding: "4px 12px",
  backgroundColor: "rgba(223,107,79,0.10)",
  color: "#df6b4f",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  borderRadius: 999,
};

const greetingTitle: React.CSSProperties = {
  margin: "0 0 12px",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 26,
  fontWeight: 500,
  lineHeight: 1.2,
  color: "#1f2a25",
};

const greetingBody: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.65,
  color: "rgba(31,42,37,0.65)",
};

const card: React.CSSProperties = {
  margin: "0 32px",
  padding: "28px",
  backgroundColor: "#fbf7f1",
  borderRadius: 16,
  border: "1px solid rgba(31,42,37,0.06)",
};

const cardLabel: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "rgba(31,42,37,0.5)",
};

const col50: React.CSSProperties = {
  width: "50%",
  paddingRight: 8,
};

const col33: React.CSSProperties = {
  width: "33.33%",
  paddingRight: 8,
};

const fieldLabel: React.CSSProperties = {
  margin: "0 0 4px",
  fontSize: 12,
  color: "rgba(31,42,37,0.55)",
};

const fieldValue: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
  color: "#1f2a25",
  lineHeight: 1.3,
};

const totalLabel: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 600,
  color: "rgba(31,42,37,0.7)",
};

const totalValue: React.CSSProperties = {
  margin: 0,
  fontFamily: "Georgia, serif",
  fontSize: 30,
  fontWeight: 500,
  color: "#df6b4f",
};

const hr: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid rgba(31,42,37,0.08)",
  margin: "18px 0",
};

const muted: React.CSSProperties = {
  margin: "14px 0 0",
  fontSize: 12,
  color: "rgba(31,42,37,0.5)",
  lineHeight: 1.55,
};

const ctaSection: React.CSSProperties = {
  padding: "28px 32px 8px",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-block",
  background: "linear-gradient(135deg, #df6b4f 0%, #f2b35e 100%)",
  color: "#17130e",
  padding: "16px 32px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 8px 24px -8px rgba(223,107,79,0.45)",
};

const secondaryBtn: React.CSSProperties = {
  display: "inline-block",
  color: "rgba(31,42,37,0.7)",
  padding: "10px 20px",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
  borderBottom: "1px solid rgba(31,42,37,0.2)",
};

const nextSection: React.CSSProperties = {
  margin: "32px 32px 8px",
  padding: "24px 28px",
  backgroundColor: "#ffffff",
  borderRadius: 16,
  border: "1px solid rgba(31,42,37,0.08)",
};

const listItem: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 14,
  lineHeight: 1.55,
  color: "rgba(31,42,37,0.7)",
  paddingLeft: 28,
  position: "relative",
};

const listBullet: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  fontFamily: "Georgia, serif",
  fontWeight: 600,
  color: "#df6b4f",
  fontStyle: "italic",
};

const footer: React.CSSProperties = {
  borderTop: "1px solid rgba(31,42,37,0.08)",
  padding: "24px 32px",
  textAlign: "center",
  marginTop: 16,
};

const footerCopy: React.CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12,
  lineHeight: 1.55,
  color: "rgba(31,42,37,0.55)",
};

const footerLink: React.CSSProperties = {
  color: "#df6b4f",
  textDecoration: "none",
  fontWeight: 600,
};

const signature: React.CSSProperties = {
  margin: "12px 0 0",
  fontFamily: "Georgia, serif",
  fontStyle: "italic",
  fontSize: 12,
  color: "rgba(31,42,37,0.4)",
};
