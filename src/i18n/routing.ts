import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  // "as-needed" → default locale (EN) has no prefix: "/about"
  // Other locales get prefix: "/fr/about", "/ar/about"
  localePrefix: "as-needed",
});
