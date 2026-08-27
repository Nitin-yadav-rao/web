"use client";

import { useState, type FormEvent } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("✓ You're in — the next issue lands Sunday.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <RevealOnScroll>
      <section className="border-t border-line bg-bg2">
        <div className="mx-auto grid max-w-content items-center gap-16 px-6 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="m-0 font-display text-[clamp(30px,3.2vw,44px)] font-normal leading-[1.06] tracking-[-0.015em] text-fg">
              One email a week. Job-market signal, no hype.
            </h2>
            <p className="mt-[18px] max-w-[44ch] text-pretty text-[17.5px] leading-[1.6] text-fg2">
              What changed in entry-level cyber hiring, one lab worth trying, and one thing I got wrong.
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-3.5">
            <div className="flex border border-line2 bg-bg">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="you@domain.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-[18px] py-4 font-mono text-[13px] text-fg outline-none placeholder:text-fg3"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-fg px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent disabled:opacity-60"
              >
                {status === "submitting" ? "Sending" : "Subscribe"}
              </button>
            </div>
            <div
              aria-live="polite"
              className={`min-h-[16px] font-mono text-[11px] ${status === "error" ? "text-red-400" : "text-accent"}`}
            >
              {message}
            </div>
          </form>
        </div>
      </section>
    </RevealOnScroll>
  );
}
