import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

interface BaseProps {
  variant?: "solid" | "outline" | "text";
  children: ReactNode;
  className?: string;
}

type AsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };
type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

const base =
  "inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 px-[22px] py-[14px]";

const variants = {
  solid: "bg-fg text-bg hover:bg-accent hover:text-bg",
  outline: "border border-line2 text-fg2 hover:border-accent hover:text-accent",
  text: "text-fg border-b border-accent pb-[5px] px-0 py-0 hover:text-accent",
};

/** Shared CTA — mono, uppercase, no rounded corners, matching the field-notes design language. */
export function Button({ variant = "solid", children, className, href, ...props }: AsLink | AsButton) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as Omit<AsLink, keyof BaseProps | "href">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as AsButton)}>
      {children}
    </button>
  );
}
