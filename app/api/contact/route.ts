import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";

// Node runtime, not Edge — this route reads server-only env vars.
export const runtime = "nodejs";

/**
 * POST /api/contact
 * Validates the submission, then delivers via Resend if RESEND_API_KEY is
 * set. Without it (e.g. local dev), logs to the server console so the form
 * is fully testable before you wire up a real provider.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 422 }
    );
  }

  const { name, email, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.info("[contact] (no RESEND_API_KEY set) submission received:", { name, email, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend delivery failed:", await res.text());
      return NextResponse.json({ error: "Message could not be sent. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json({ error: "Message could not be sent. Please try again." }, { status: 500 });
  }
}
