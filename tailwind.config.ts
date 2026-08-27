import type { Config } from "tailwindcss";

const config: Config = {
  // Theming here isn't done via Tailwind's dark: variant — it's plain CSS
  // custom properties in globals.css that swap value when
  // `[data-theme="light"]` is set on <html> (see ThemeToggle). The colors
  // below just point at those variables, so no `darkMode` strategy is needed.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // These map straight onto the CSS custom properties defined in
        // globals.css, which flip value when `[data-theme="light"]` is set
        // on <html> — so `bg-bg2`, `text-fg2` etc. re-theme automatically,
        // no `dark:` variants needed anywhere.
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        line: "var(--line)",
        line2: "var(--line2)",
        fg: "var(--fg)",
        fg2: "var(--fg2)",
        fg3: "var(--fg3)",
        accent: "var(--accent)",
        "accent-soft": "var(--accentSoft)",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      keyframes: {
        mark: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        drift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
      animation: {
        mark: "mark 0.9s 0.4s cubic-bezier(0.2,0.8,0.2,1) both",
        blink: "blink 1.6s steps(1) infinite",
        drift: "drift 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
