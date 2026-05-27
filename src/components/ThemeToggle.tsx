"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
      }}
      className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-background/70 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
      aria-label="Toggle color theme"
    >
      <Sun size={18} className="hidden text-sunset dark:block" />
      <Moon size={18} className="text-ocean-dark dark:hidden" />
    </button>
  );
}
