import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD isn't set on the server yet. In Vercel, go to Settings → Environment Variables, add ADMIN_PASSWORD, then redeploy.",
      },
      { status: 500 }
    );
  }

  if (!password || password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
