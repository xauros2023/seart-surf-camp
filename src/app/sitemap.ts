import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

const routes = ["", "/about", "/rooms", "/packages", "/gallery", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${DEFAULT_CONTENT.seo.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
