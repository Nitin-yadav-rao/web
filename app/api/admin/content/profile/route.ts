import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/content-store";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await saveProfile(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 }
    );
  }
}
