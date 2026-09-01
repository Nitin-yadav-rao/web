"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hey — I can answer questions about cybersecurity careers, certs, the job market, or anything on this site. What do you want to know?",
};

// Soft cap so a single visitor can't run up an unbounded number of paid API
// calls in one sitting. The server has its own per-IP rate limit too — this
// is just a friendlier, earlier nudge in the UI.
const MAX_TURNS = 20;

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Keep the admin area free of this — it's a visitor-facing widget.
  if (pathname?.startsWith("/admin")) return null;

  const turnsUsed = messages.filter((m) => m.role === "user").length;
  const limitReached = turnsUsed >= MAX_TURNS;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || limitReached) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[250] sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[70vh] max-h-[520px] w-[92vw] max-w-[380px] flex-col border border-line bg-bg shadow-2xl">
          <div className="flex items-center justify-between border-b border-line bg-bg2 px-4 py-3.5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Ask</div>
              <div className="font-display text-[17px] leading-none text-fg">Cyber &amp; site questions</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-fg3 transition-colors hover:text-fg"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] px-3.5 py-2.5 text-[13.5px] leading-[1.55]",
                  m.role === "user" ? "ml-auto bg-fg text-bg" : "border border-line bg-bg2 text-fg2"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[88%] border border-line bg-bg2 px-3.5 py-2.5 font-mono text-[12px] text-fg3">
                Thinking…
              </div>
            )}
            {error && <div className="font-mono text-[11.5px] text-red-400">{error}</div>}
            {limitReached && (
              <div className="font-mono text-[11px] text-fg3">
                This conversation&rsquo;s gotten long — refresh the page to start a new one.
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex border-t border-line">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={limitReached ? "Refresh to keep chatting" : "Ask something…"}
              aria-label="Message"
              disabled={loading || limitReached}
              maxLength={2000}
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 font-mono text-[13px] text-fg outline-none placeholder:text-fg3 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || limitReached || !input.trim()}
              className="bg-fg px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-bg transition-colors hover:bg-accent disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="ml-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-fg text-bg shadow-xl transition-colors hover:bg-accent"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
