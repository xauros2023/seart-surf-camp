import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteContent } from "@/lib/data-store";

export default async function NotFound() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="section-shell flex min-h-[70vh] flex-col justify-center pt-32">
        <p className="section-kicker">404</p>
        <h1 className="section-title">This page drifted out to sea.</h1>
        <p className="section-copy">The route does not exist. Head back to the camp homepage or send us a message if you were looking for something specific.</p>
        <Link href="/" className="primary-button mt-8 max-w-xs">
          Back to homepage
        </Link>
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
