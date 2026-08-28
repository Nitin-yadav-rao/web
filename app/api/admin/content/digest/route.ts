import { NextResponse } from "next/server";
import { getDigestIssues, saveDigestIssues } from "@/lib/content-store";
import type { DigestIssue } from "@/types";

export async function GET() {
  const issues = await getDigestIssues();
  return NextResponse.json(issues);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as DigestIssue[];
    if (!Array.isArray(body)) throw new Error("Expected an array of digest issues.");
    await saveDigestIssues(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 }
    );
  }
}
