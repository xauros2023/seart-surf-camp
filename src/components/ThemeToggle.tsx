"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <Sun size={20} className="text-sunset" /> : <Moon size={20} className="text-ocean-dark" />}
    </button>
  );
}
