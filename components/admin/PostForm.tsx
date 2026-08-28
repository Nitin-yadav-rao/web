"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostBlock } from "@/types";
import { getJson, putJson, slugify } from "@/lib/admin-client";
import { AdminButton, Field, Input, Panel, StatusMessage, Textarea } from "@/components/admin/ui";
import { PostBlockEditor } from "@/components/admin/PostBlockEditor";

const emptyPost: Post = {
  slug: "",
  title: "",
  topic: "",
  date: new Date().toISOString().slice(0, 10),
  read: "",
  blurb: "",
};

export function PostForm({ mode, initialPost, existingTopics }: { mode: "new" | "edit"; initialPost?: Post; existingTopics: string[] }) {
  const router = useRouter();
  const originalSlug = initialPost?.slug;
  const [post, setPost] = useState<Post>(initialPost ?? emptyPost);
  const [hasBody, setHasBody] = useState(Boolean(initialPost?.body?.length));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  function onTitleChange(value: string) {
    update("title", value);
    if (!slugTouched) update("slug", slugify(value));
  }

  function onBlocksChange(blocks: PostBlock[]) {
    update("body", blocks);
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      if (!post.title.trim()) throw new Error("Title is required.");
      if (!post.slug.trim()) throw new Error("Slug is required.");

      const all = await getJson<Post[]>("/api/admin/content/posts");
      const withoutThis = all.filter((p) => p.slug !== originalSlug);
      if (withoutThis.some((p) => p.slug === post.slug)) {
        throw new Error(`Another post already uses the slug "${post.slug}". Change it and try again.`);
      }

      const toSave: Post = { ...post, body: hasBody ? post.body?.filter((b) => b) ?? [] : undefined };
      if (hasBody && (!toSave.body || toSave.body.length === 0)) {
        throw new Error('You checked "publish full body" but added no content blocks. Add at least one, or uncheck it.');
      }

      const next = [...withoutThis, toSave].sort((a, b) => (a.date < b.date ? 1 : -1));
      await putJson("/api/admin/content/posts", next);
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
      setStatus("error");
    }
  }

  async function remove() {
    if (!originalSlug) return;
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setStatus("saving");
    try {
      const all = await getJson<Post[]>("/api/admin/content/posts");
      const next = all.filter((p) => p.slug !== originalSlug);
      await putJson("/api/admin/content/posts", next);
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete.");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin · Posts</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">
            {mode === "new" ? "New post" : "Edit post"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusMessage status={status} message={status === "error" ? error : undefined} />
          <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save post"}
          </AdminButton>
        </div>
      </div>

      <Panel className="grid gap-5">
        <Field label="Title">
          <Input value={post.title} onChange={(e) => onTitleChange(e.target.value)} />
        </Field>
        <Field label="Slug" hint={`Will be published at /writing/${post.slug || "…"}`}>
          <Input
            value={post.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Topic">
            <Input list="topic-options" value={post.topic} onChange={(e) => update("topic", e.target.value)} />
            <datalist id="topic-options">
              {existingTopics.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Date">
            <Input type="date" value={post.date} onChange={(e) => update("date", e.target.value)} />
          </Field>
          <Field label="Read time" hint="e.g. “8 min”">
            <Input value={post.read} onChange={(e) => update("read", e.target.value)} />
          </Field>
        </div>
        <Field label="Blurb" hint="The one- or two-line summary shown on the home page and archive">
          <Textarea rows={2} value={post.blurb} onChange={(e) => update("blurb", e.target.value)} />
        </Field>
      </Panel>

      <Panel className="grid gap-4">
        <label className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg">
          <input type="checkbox" checked={hasBody} onChange={(e) => setHasBody(e.target.checked)} />
          Publish full body
        </label>
        <p className="m-0 text-[13px] leading-[1.5] text-fg3">
          Leave this unchecked to show a &ldquo;draft — coming soon&rdquo; page instead of the body below.
        </p>
        {hasBody && <PostBlockEditor blocks={post.body ?? []} onChange={onBlocksChange} />}
      </Panel>

      <div className="flex items-center justify-between gap-4">
        <AdminButton variant="primary" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save post"}
        </AdminButton>
        {mode === "edit" && (
          <AdminButton variant="danger" onClick={remove} disabled={status === "saving"}>
            Delete post
          </AdminButton>
        )}
      </div>
    </div>
  );
}
