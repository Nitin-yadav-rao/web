"use client";

import { useEffect, useState } from "react";
import type { Resource } from "@/types";
import { getJson, putJson } from "@/lib/admin-client";
import { AdminButton, Field, Input, Panel, StatusMessage, Textarea } from "@/components/admin/ui";

type Status = "loading" | "idle" | "saving" | "saved" | "error";

const empty: Resource = { kind: "", title: "", body: "", meta: "" };

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    getJson<Resource[]>("/api/admin/content/resources")
      .then((data) => {
        setResources(data);
        setStatus("idle");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
        setStatus("error");
      });
  }, []);

  function update(index: number, patch: Partial<Resource>) {
    setResources((prev) => prev!.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addResource() {
    setResources((prev) => [...(prev ?? []), { ...empty }]);
  }

  function removeResource(index: number) {
    if (!confirm("Delete this resource?")) return;
    setResources((prev) => prev!.filter((_, i) => i !== index));
  }

  async function save() {
    if (!resources) return;
    setStatus("saving");
    setError("");
    try {
      await putJson("/api/admin/content/resources", resources);
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("error");
    }
  }

  if (status === "loading" || !resources) {
    return <div className="font-mono text-[13px] text-fg3">Loading…</div>;
  }

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">Resources</h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusMessage status={status} message={status === "error" ? error : undefined} />
          <AdminButton onClick={addResource}>+ New resource</AdminButton>
          <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save all"}
          </AdminButton>
        </div>
      </div>

      <div className="grid gap-5">
        {resources.map((r, i) => (
          <Panel key={i} className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">Resource {i + 1}</span>
              <button
                type="button"
                onClick={() => removeResource(i)}
                className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg3 hover:text-red-400"
              >
                Delete
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" hint="e.g. Foundation, Hands-on, Certs">
                <Input value={r.kind} onChange={(e) => update(i, { kind: e.target.value })} />
              </Field>
              <Field label="Meta" hint="e.g. “free · ~20 hrs”">
                <Input value={r.meta} onChange={(e) => update(i, { meta: e.target.value })} />
              </Field>
            </div>
            <Field label="Title">
              <Input value={r.title} onChange={(e) => update(i, { title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={2} value={r.body} onChange={(e) => update(i, { body: e.target.value })} />
            </Field>
          </Panel>
        ))}
        {resources.length === 0 && <div className="text-[13px] text-fg3">No resources yet.</div>}
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
