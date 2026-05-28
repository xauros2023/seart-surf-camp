import { setRequestLocale } from "next-intl/server";
import ClientHome from "@/components/ClientHome";
import JsonLd from "@/components/JsonLd";
import { getSiteContent } from "@/lib/data-store";
import { lodgingBusinessSchema, offersSchema } from "@/lib/schema";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getSiteContent();
  return (
    <>
      <JsonLd data={[lodgingBusinessSchema(data), offersSchema(data)]} />
      <ClientHome data={data} />
    </>
  );
}
