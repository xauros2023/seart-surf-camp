/**
 * Server-safe component to inject schema.org JSON-LD.
 * Use one per page or pass an array of schemas.
 *
 * NOTE on dangerouslySetInnerHTML: the only sanctioned way to inject JSON-LD
 * per https://nextjs.org/docs/app/guides/json-ld. The data flows exclusively
 * from server-side schema generators (src/lib/schema.ts) reading static content
 * — there is no user input on the path. JSON.stringify additionally escapes
 * the payload to a safe JSON literal.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
