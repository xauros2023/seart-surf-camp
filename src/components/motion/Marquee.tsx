"use client";

import type { ReactNode } from "react";

export default function Marquee({
  children,
  speed = 40,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={`group relative flex overflow-hidden ${className ?? ""}`}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}
    >
      <div
        className={`flex shrink-0 items-center gap-12 pr-12 ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center gap-12 pr-12 ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {children}
      </div>
    </div>
  );
}
