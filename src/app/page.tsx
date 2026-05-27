import ClientHome from "@/components/ClientHome";
import JsonLd from "@/components/JsonLd";
import { getSiteContent } from "@/lib/data-store";
import { lodgingBusinessSchema, offersSchema } from "@/lib/schema";

export default async function Page() {
  const data = await getSiteContent();
  return (
    <>
      <JsonLd data={[lodgingBusinessSchema(data), offersSchema(data)]} />
      <ClientHome data={data} />
    </>
  );
}
