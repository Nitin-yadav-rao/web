"use client";

import { useEffect, useState } from "react";
import type { NowItem, SiteProfile, TimelineItem } from "@/types";
import { getJson, putJson } from "@/lib/admin-client";
import { AdminButton, ArrayRow, Field, Input, Panel, StatusMessage, Textarea } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Status = "loading" | "idle" | "saving" | "saved" | "error";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    getJson<SiteProfile>("/api/admin/content/profile")
      .then((data) => {
        setProfile(data);
        setStatus("idle");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load.");
        setStatus("error");
      });
  }, []);

  async function save() {
    if (!profile) return;
    setStatus("saving");
    setError("");
    try {
      await putJson("/api/admin/content/profile", profile);
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("error");
    }
  }

  if (status === "loading" || !profile) {
    return <div className="font-mono text-[13px] text-fg3">Loading…</div>;
  }

  function update<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  }

  function updateNow(index: number, patch: Partial<NowItem>) {
    update(
      "now",
      profile!.now.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function updateParagraph(index: number, value: string) {
    update(
      "aboutParagraphs",
      profile!.aboutParagraphs.map((p, i) => (i === index ? value : p))
    );
  }

  function updateTimeline(index: number, patch: Partial<TimelineItem>) {
    update(
      "timeline",
      profile!.timeline.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">Profile & about</h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusMessage status={status} message={status === "error" ? error : undefined} />
          <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </div>

      <Panel className="grid gap-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">Identity</div>
        <ImageUpload
          label="Portrait photo"
          hint="Shown on the About page. JPG, PNG, WEBP, GIF, or AVIF, up to 5MB."
          value={profile.portraitUrl}
          onChange={(url) => update("portraitUrl", url)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <Input value={profile.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Logo suffix" hint="Shown after your name in the header, e.g. “.log”">
            <Input value={profile.logoSuffix} onChange={(e) => update("logoSuffix", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={profile.location} onChange={(e) => update("location", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
        </div>
        <Field label="Hero kicker" hint="Small line above the headline on the home page">
          <Input value={profile.heroKicker} onChange={(e) => update("heroKicker", e.target.value)} />
        </Field>
        <Field label="Subheadline" hint="The paragraph under the hero headline">
          <Textarea rows={3} value={profile.subheadline} onChange={(e) => update("subheadline", e.target.value)} />
        </Field>
      </Panel>

      <Panel className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">Now / currently</div>
          <AdminButton onClick={() => update("now", [...profile.now, { label: "", text: "" }])}>
            + Add item
          </AdminButton>
        </div>
        <div className="grid gap-3">
          {profile.now.map((item, i) => (
            <ArrayRow key={i} onRemove={() => update("now", profile.now.filter((_, idx) => idx !== i))}>
              <Input placeholder="Label (e.g. Studying)" value={item.label} onChange={(e) => updateNow(i, { label: e.target.value })} />
              <Input placeholder="Text" value={item.text} onChange={(e) => updateNow(i, { text: e.target.value })} />
            </ArrayRow>
          ))}
          {profile.now.length === 0 && <div className="text-[13px] text-fg3">No items yet.</div>}
        </div>
      </Panel>

      <Panel className="grid gap-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">About page</div>
        <Field label="About headline">
          <Input value={profile.aboutHeadline} onChange={(e) => update("aboutHeadline", e.target.value)} />
        </Field>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">About paragraphs</span>
            <AdminButton onClick={() => update("aboutParagraphs", [...profile.aboutParagraphs, ""])}>
              + Add paragraph
            </AdminButton>
          </div>
          <div className="grid gap-3">
            {profile.aboutParagraphs.map((p, i) => (
              <ArrayRow
                key={i}
                onRemove={() => update("aboutParagraphs", profile.aboutParagraphs.filter((_, idx) => idx !== i))}
              >
                <Textarea rows={3} value={p} onChange={(e) => updateParagraph(i, e.target.value)} />
              </ArrayRow>
            ))}
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">Timeline</div>
          <AdminButton onClick={() => update("timeline", [...profile.timeline, { year: "", text: "" }])}>
            + Add year
          </AdminButton>
        </div>
        <div className="grid gap-3">
          {profile.timeline.map((item, i) => (
            <ArrayRow key={i} onRemove={() => update("timeline", profile.timeline.filter((_, idx) => idx !== i))}>
              <Input
                placeholder="Year"
                className="max-w-[120px]"
                value={item.year}
                onChange={(e) => updateTimeline(i, { year: e.target.value })}
              />
              <Textarea rows={2} placeholder="Text" value={item.text} onChange={(e) => updateTimeline(i, { text: e.target.value })} />
            </ArrayRow>
          ))}
        </div>
      </Panel>

      <div className="flex items-center gap-4">
        <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save changes"}
        </AdminButton>
        <StatusMessage status={status} message={status === "error" ? error : undefined} />
      </div>
    </div>
  );
}
