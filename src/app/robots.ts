import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${DEFAULT_CONTENT.seo.siteUrl}/sitemap.xml`,
  };
}
