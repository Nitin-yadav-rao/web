import Link from "next/link";
import { profile } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-6 px-6 py-11 sm:px-8">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg3">
          © {new Date().getFullYear()} {profile.name} · Field notes on cyber careers
        </span>
        <div className="flex gap-[22px]">
          <Link
            href="/writing"
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-accent"
          >
            Writing
          </Link>
          <Link
            href="/digest"
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-accent"
          >
            Digest
          </Link>
          <Link
            href="/about"
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-accent"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
