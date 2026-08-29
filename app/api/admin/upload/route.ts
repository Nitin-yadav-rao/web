import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Node runtime — @vercel/blob's put() needs it, and this route is already
// protected by middleware (see middleware.ts's matcher for /api/admin/:path*).
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN);
}

function extensionFor(type: string): string {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

/**
 * POST /api/admin/upload — accepts a single image as multipart/form-data
 * (field name "file") and stores it as a *public* blob (unlike the private
 * content JSON) so any site visitor's browser can load it directly. Returns
 * { url } for the admin form to save onto the relevant profile/post field.
 */
export async function POST(request: Request) {
  if (!blobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Storage isn't connected yet. In your Vercel project, go to Storage → Create Database → Blob (Private) and connect it to this project, then try uploading again.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was received." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WEBP, GIF, or AVIF image." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That image is larger than 5MB. Please use a smaller file." }, { status: 413 });
  }

  try {
    const pathname = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file.type)}`;
    // The Blob store this project connects to was created as Private, and a
    // private store only accepts private-access uploads (a public upload is
    // rejected). So the file is stored privately, same as everything else,
    // and served back to visitors through /api/media, which streams it
    // without requiring an admin session.
    await put(pathname, file, {
      access: "private",
      contentType: file.type,
    });
    return NextResponse.json({ url: `/api/media/${pathname}` });
  } catch (error) {
    console.error("upload: failed to store image", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
