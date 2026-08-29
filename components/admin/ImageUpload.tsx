"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/admin-client";
import { AdminButton, Label } from "@/components/admin/ui";

/**
 * A photo field for /admin: shows the current image (if any), lets the
 * editor pick a replacement, and reports the resulting Blob URL back to the
 * parent form via onChange. The parent is responsible for saving that URL
 * onto the relevant profile/post field — this component never saves itself.
 */
export function ImageUpload({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setStatus("uploading");
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setStatus("error");
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-[110px] w-[150px] shrink-0 items-center justify-center overflow-hidden border border-line bg-bg2">
          {value ? (
            <Image src={value} alt="" width={150} height={110} className="h-full w-full object-cover" unoptimized />
          ) : (
            <span className="px-2 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg3">
              No photo yet
            </span>
          )}
        </div>
        <div className="grid gap-2.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={onFileSelected}
          />
          <div className="flex flex-wrap gap-2.5">
            <AdminButton type="button" onClick={() => inputRef.current?.click()} disabled={status === "uploading"}>
              {status === "uploading" ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
            </AdminButton>
            {value && (
              <AdminButton type="button" variant="ghost" onClick={() => onChange(undefined)} disabled={status === "uploading"}>
                Remove
              </AdminButton>
            )}
          </div>
          {status === "error" && <div className="font-mono text-[11.5px] text-red-400">{error}</div>}
        </div>
      </div>
      {hint && <div className="mt-1.5 text-[11.5px] leading-[1.5] text-fg3">{hint}</div>}
    </div>
  );
}
