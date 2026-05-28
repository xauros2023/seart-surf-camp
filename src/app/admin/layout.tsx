import { Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Admin layout is intentionally separate from [locale] — admin is single-language
 * (English) and not exposed to public crawlers. It provides its own <html>/<body>
 * because the root layout is now an i18n passthrough.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-950">
        {children}
      </body>
    </html>
  );
}
