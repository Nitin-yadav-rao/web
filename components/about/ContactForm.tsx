"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", body: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, message: values.body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("✓ Sent — I reply within a couple of days.");
      setValues({ name: "", email: "", body: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3.5 border border-line p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Say hello</div>
      <input
        required
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        placeholder="Name"
        aria-label="Name"
        className="border border-line bg-bg2 px-3.5 py-[13px] font-mono text-[12.5px] text-fg outline-none placeholder:text-fg3 focus:border-accent"
      />
      <input
        required
        type="email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        placeholder="Email"
        aria-label="Email"
        className="border border-line bg-bg2 px-3.5 py-[13px] font-mono text-[12.5px] text-fg outline-none placeholder:text-fg3 focus:border-accent"
      />
      <textarea
        required
        value={values.body}
        onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
        placeholder="Message"
        rows={4}
        aria-label="Message"
        className="resize-y border border-line bg-bg2 px-3.5 py-[13px] font-mono text-[12.5px] text-fg outline-none placeholder:text-fg3 focus:border-accent"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-fg py-[14px] font-mono text-[11px] uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "submitting" ? "Sending" : "Send"}
      </button>
      <div
        aria-live="polite"
        className={`min-h-[16px] font-mono text-[11px] ${status === "error" ? "text-red-400" : "text-accent"}`}
      >
        {message}
      </div>
    </form>
  );
}
