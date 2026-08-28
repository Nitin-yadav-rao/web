"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const fieldBase =
  "w-full border border-line bg-bg2 px-3.5 py-[11px] font-mono text-[13px] text-fg outline-none placeholder:text-fg3 focus:border-accent";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={cn(fieldBase, className)} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea className={cn(fieldBase, "resize-y leading-[1.5]", className)} {...rest} />;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">{children}</label>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <div className="mt-1.5 text-[11.5px] leading-[1.5] text-fg3">{hint}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("border border-line bg-bg p-6 sm:p-7", className)}>{children}</div>;
}

function buttonBase(variant: "primary" | "secondary" | "danger" | "ghost") {
  const shared =
    "inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 px-[18px] py-[11px] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-fg text-bg hover:bg-accent",
    secondary: "border border-line2 text-fg2 hover:border-accent hover:text-accent",
    danger: "border border-red-900/50 text-red-400 hover:border-red-500 hover:text-red-300",
    ghost: "text-fg3 hover:text-fg underline underline-offset-4 decoration-line2",
  };
  return cn(shared, variants[variant]);
}

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function AdminButton({ variant = "secondary", className, ...props }: AdminButtonProps) {
  return <button className={cn(buttonBase(variant), className)} {...props} />;
}

export function StatusMessage({ status, message }: { status: "idle" | "saving" | "saved" | "error"; message?: string }) {
  if (status === "idle") return null;
  const color = status === "error" ? "text-red-400" : status === "saved" ? "text-accent" : "text-fg3";
  const text = message ?? (status === "saving" ? "Saving…" : status === "saved" ? "Saved." : "");
  if (!text) return null;
  return <div className={cn("font-mono text-[11.5px]", color)}>{text}</div>;
}

export function ArrayRow({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-3 border border-line bg-bg2 p-4">
      <div className="grid flex-1 gap-2.5">{children}</div>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className="mt-0.5 shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg3 hover:text-red-400"
      >
        Remove
      </button>
    </div>
  );
}
