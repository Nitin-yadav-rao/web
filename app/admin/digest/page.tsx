"use client";

import { useEffect, useState } from "react";
import type { DigestIssue } from "@/types";
import { getJson, putJson } from "@/lib/admin-client";
import { AdminButton, ArrayRow, Field, Input, Panel, StatusMessage, Textarea } from "@/components/admin/ui";

type Status = "loading" | "idle" | "saving" | "saved" | "error";

function nextIssueNumber(issues: DigestIssue[]): string {
  const max = issues.reduce((acc, issue) => Math.max(acc, Number(issue.no) || 0), 0);
  return String(max + 1);
}

export default function AdminDigestPage() {
  const [issues, setIssues] = useState<DigestIssue[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    getJson<DigestIssue[]>("/api/admin/content/digest")
      .then((data) => {
        setIssues(data);
        setStatus("idle");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
        setStatus("error");
      });
  }, []);

  function updateIssue(index: number, patch: Partial<DigestIssue>) {
    setIssues((prev) => prev!.map((issue, i) => (i === index ? { ...issue, ...patch } : issue)));
  }

  function updateItemText(issueIndex: number, itemIndex: number, text: string) {
    setIssues((prev) =>
      prev!.map((issue, i) =>
        i === issueIndex
          ? { ...issue, items: issue.items.map((item, j) => (j === itemIndex ? { ...item, text } : item)) }
          : issue
      )
    );
  }

  function addItem(issueIndex: number) {
    setIssues((prev) =>
      prev!.map((issue, i) =>
        i === issueIndex ? { ...issue, items: [...issue.items, { n: "", text: "" }] } : issue
      )
    );
  }

  function removeItem(issueIndex: number, itemIndex: number) {
    setIssues((prev) =>
      prev!.map((issue, i) =>
        i === issueIndex ? { ...issue, items: issue.items.filter((_, j) => j !== itemIndex) } : issue
      )
    );
  }

  function addIssue() {
    setIssues((prev) => {
      const list = prev ?? [];
      const fresh: DigestIssue = {
        no: nextIssueNumber(list),
        date: new Date().toISOString().slice(0, 10),
        title: "",
        items: [{ n: "01", text: "" }],
      };
      return [fresh, ...list];
    });
  }

  function removeIssue(index: number) {
    if (!confirm("Delete this digest issue?")) return;
    setIssues((prev) => prev!.filter((_, i) => i !== index));
  }

  async function save() {
    if (!issues) return;
    setStatus("saving");
    setError("");
    try {
      // Renumber each issue's items (01, 02, ...) so the display order always matches.
      const normalized = issues.map((issue) => ({
        ...issue,
        items: issue.items.map((item, i) => ({ ...item, n: String(i + 1).padStart(2, "0") })),
      }));
      await putJson("/api/admin/content/digest", normalized);
      setIssues(normalized);
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("error");
    }
  }

  if (status === "loading" || !issues) {
    return <div className="font-mono text-[13px] text-fg3">Loading…</div>;
  }

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">Digest</h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusMessage status={status} message={status === "error" ? error : undefined} />
          <AdminButton onClick={addIssue}>+ New issue</AdminButton>
          <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save all"}
          </AdminButton>
        </div>
      </div>

      <div className="grid gap-6">
        {issues.map((issue, i) => (
          <Panel key={i} className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Issue {issue.no || "—"}</div>
              <button
                type="button"
                onClick={() => removeIssue(i)}
                className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg3 hover:text-red-400"
              >
                Delete issue
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[100px_150px_minmax(0,1fr)]">
              <Field label="No.">
                <Input value={issue.no} onChange={(e) => updateIssue(i, { no: e.target.value })} />
              </Field>
              <Field label="Date">
                <Input type="date" value={issue.date} onChange={(e) => updateIssue(i, { date: e.target.value })} />
              </Field>
              <Field label="Title">
                <Input value={issue.title} onChange={(e) => updateIssue(i, { title: e.target.value })} />
              </Field>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">Items</span>
                <AdminButton onClick={() => addItem(i)}>+ Add item</AdminButton>
              </div>
              <div className="grid gap-2.5">
                {issue.items.map((item, j) => (
                  <ArrayRow key={j} onRemove={() => removeItem(i, j)}>
                    <Textarea rows={2} value={item.text} onChange={(e) => updateItemText(i, j, e.target.value)} />
                  </ArrayRow>
                ))}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save all"}
        </AdminButton>
        <StatusMessage status={status} message={status === "error" ? error : undefined} />
      </div>
    </div>
  );
}
