"use client";

import { useEffect, useState } from "react";
import type { Subscriber } from "@/types";
import { getJson, putJson } from "@/lib/admin-client";
import { AdminButton, Panel, StatusMessage } from "@/components/admin/ui";

type Status = "loading" | "idle" | "saving" | "error";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getJson<Subscriber[]>("/api/admin/content/subscribers")
      .then((data) => {
        setSubscribers(data);
        setStatus("idle");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
        setStatus("error");
      });
  }, []);

  async function remove(email: string) {
    if (!subscribers) return;
    if (!confirm(`Remove ${email} from the list?`)) return;
    const next = subscribers.filter((s) => s.email !== email);
    setStatus("saving");
    setError("");
    try {
      await putJson("/api/admin/content/subscribers", next);
      setSubscribers(next);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("error");
    }
  }

  async function copyAll() {
    if (!subscribers || subscribers.length === 0) return;
    const text = subscribers.map((s) => s.email).join(", ");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "loading" || !subscribers) {
    return <div className="font-mono text-[13px] text-fg3">Loading…</div>;
  }

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">Subscribers</h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusMessage status={status === "saving" ? "saving" : status === "error" ? "error" : "idle"} message={status === "error" ? error : undefined} />
          <AdminButton onClick={copyAll} disabled={subscribers.length === 0}>
            {copied ? "Copied!" : "Copy all emails"}
          </AdminButton>
        </div>
      </div>

      <Panel className="grid gap-4">
        <p className="m-0 text-[13.5px] leading-[1.6] text-fg2">
          Everyone who has subscribed on the home page — each gets a one-time welcome email automatically.
          There&rsquo;s no automatic weekly send yet: when you&rsquo;re ready to send an issue, click{" "}
          <strong className="text-fg">Copy all emails</strong> and paste the list into Resend, or your own
          email client&rsquo;s BCC field.
        </p>
      </Panel>

      {subscribers.length === 0 ? (
        <div className="text-[13px] text-fg3">No subscribers yet.</div>
      ) : (
        <div className="grid gap-2.5">
          {[...subscribers]
            .sort((a, b) => (a.subscribedAt < b.subscribedAt ? 1 : -1))
            .map((s) => (
              <div
                key={s.email}
                className="flex flex-wrap items-center justify-between gap-3 border border-line bg-bg2 px-4 py-3"
              >
                <span className="font-mono text-[13px] text-fg">{s.email}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-fg3">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(s.email)}
                    className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg3 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
