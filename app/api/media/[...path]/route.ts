import { NextResponse, type NextRequest } from "next/server";
import { get } from "@vercel/blob";

// Node runtime — @vercel/blob's get() needs it.
export const runtime = "nodejs";

/**
 * GET /api/media/<pathname> — streams a photo uploaded from /admin back to
 * any visitor, unauthenticated. This route is intentionally NOT under
 * /api/admin (see middleware.ts), since site visitors need to load these
 * images without logging in. The underlying blob is stored privately (the
 * connected store only accepts private-access blobs); this route is what
 * makes those photos publicly viewable on the live site.
 *
 * Pathnames are unique per upload (timestamp + random suffix, see
 * app/api/admin/upload/route.ts), so a given URL's content never changes —
 * safe to cache aggressively.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");

  if (!pathname.startsWith("uploads/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`media: failed to stream ${pathname}`, error);
    return new NextResponse("Not found", { status: 404 });
  }
}
