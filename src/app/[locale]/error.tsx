"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="max-w-xl text-center">
        <p className="section-kicker justify-center">Error</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Something went wrong.</h1>
        <p className="mt-5 leading-7 text-foreground/70">Try reloading the page. If the issue continues, contact the camp directly.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="primary-button sm:w-auto">
            Try again
          </button>
          <Link href="/" className="secondary-button">
            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
