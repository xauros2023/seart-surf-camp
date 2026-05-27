import { DEFAULT_CONTENT, faqs, packages, type SiteContent } from "./content";

/**
 * Schema.org JSON-LD generators for rich Google snippets.
 * Use the helpers below in page Server Components, inject the
 * returned object via `<script type="application/ld+json" />`.
 */

export function lodgingBusinessSchema(content: SiteContent = DEFAULT_CONTENT) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "SeArt Surf Camp",
    description: content.seo.description,
    url: content.seo.siteUrl,
    image: `${content.seo.siteUrl}/images/hero-bg.png`,
    priceRange: `${content.rooms.dormPrice} - ${content.rooms.privatePrice}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.contact.addressLine1,
      addressLocality: "Tamraght",
      addressRegion: "Souss-Massa",
      postalCode: "80022",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.5083,
      longitude: -9.6731,
    },
    telephone: content.contact.whatsappLabel,
    email: content.contact.email,
    sameAs: [content.contact.instagram, content.contact.whatsapp],
    amenityFeature: [
      "Surf coaching",
      "Free Wi-Fi",
      "Rooftop terrace",
      "Shared kitchen",
      "Airport transfer",
      "Coworking space",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function offersSchema(content: SiteContent = DEFAULT_CONTENT) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: packages.map((pack, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: pack.title,
        description: pack.description,
        url: `${content.seo.siteUrl}/packages#${pack.id}`,
        offers: {
          "@type": "Offer",
          price: pack.price.replace(/[^\d]/g, ""),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function breadcrumbsSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
