"use client";

/** Small fetch helpers shared by every /admin page. Cookies are same-origin, so no auth header needed — middleware handles that. */

async function parseResponse(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data && typeof data.error === "string" ? data.error : `Request failed (${res.status}).`;
    throw new Error(message);
  }
  return data;
}

export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  return parseResponse(res) as Promise<T>;
}

export async function putJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse(res) as Promise<T>;
}

/** Uploads a single image file to Blob storage and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = (await parseResponse(res)) as { url: string };
  return data.url;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}
