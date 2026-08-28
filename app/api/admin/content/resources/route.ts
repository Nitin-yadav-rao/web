import { NextResponse } from "next/server";
import { getResources, saveResources } from "@/lib/content-store";
import type { Resource } from "@/types";

export async function GET() {
  const resources = await getResources();
  return NextResponse.json(resources);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Resource[];
    if (!Array.isArray(body)) throw new Error("Expected an array of resources.");
    await saveResources(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 }
    );
  }
}
