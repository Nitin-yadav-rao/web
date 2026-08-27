"use client";

import { useEffect, useState } from "react";

/**
 * Dark is always the server-rendered default (see globals.css — the bare
 * :root is the dark palette), so toggling here never causes a hydration
 * mismatch: we only ever add `data-theme="light"` after the user asks for
 * it, and reset to dark on toggle-back or on a fresh page load.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="ml-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line font-mono text-[11px] text-fg2 transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? "☾" : "☀"}
    </button>
  );
}
