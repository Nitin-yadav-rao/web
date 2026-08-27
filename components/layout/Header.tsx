"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[150] border-b border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-[14px]">
      <div className="mx-auto flex h-[66px] max-w-content items-center justify-between gap-6 px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-[11px] text-fg" onClick={() => setOpen(false)}>
          <span className="block h-2.5 w-2.5 rounded-[1px] bg-accent" />
          <span className="font-mono text-[12.5px] font-bold uppercase tracking-[0.14em]">
            {profile.name}
            <span className="text-fg3">{profile.logoSuffix}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-[13px] py-[9px] font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors duration-200",
                  active ? "text-fg" : "text-fg2 hover:bg-bg3 hover:text-fg"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line text-fg2"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line bg-bg sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fg2 last:border-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
