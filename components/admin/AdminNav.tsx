"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile & about" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/digest", label: "Digest" },
  { href: "/admin/resources", label: "Resources" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-line bg-bg2">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <div className="flex flex-wrap items-center gap-1">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors",
                  active ? "text-fg" : "text-fg3 hover:text-fg"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg3 transition-colors hover:text-accent"
          >
            ← Back to site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg3 transition-colors hover:text-red-400"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
