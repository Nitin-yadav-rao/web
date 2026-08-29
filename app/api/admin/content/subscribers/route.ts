import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers } from "@/lib/content-store";
import type { Subscriber } from "@/types";

export async function GET() {
  const subscribers = await getSubscribers();
  return NextResponse.json(subscribers);
}

// Used only to remove entries from /admin/subscribers — visitors are added
// through /api/subscribe, not this route (which requires an admin session).
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Subscriber[];
    if (!Array.isArray(body)) throw new Error("Expected an array of subscribers.");
    await saveSubscribers(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 }
    );
  }
}
