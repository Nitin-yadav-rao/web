import { NextResponse } from "next/server";
import { subscribeSchema } from "@/lib/schemas";
import { addSubscriber, getProfile } from "@/lib/content-store";

export const runtime = "nodejs";

/**
 * POST /api/subscribe
 * Validates the email, records it (so you have a list to actually email
 * later — see /admin/subscribers), and sends a one-time welcome email via
 * Resend, the same service and credentials already wired up for the
 * contact form (RESEND_API_KEY, CONTACT_FROM_EMAIL). No separate
 * newsletter provider is required. Without RESEND_API_KEY set, it just
 * records the signup and logs it, so the flow is testable locally.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid email." },
      { status: 422 }
    );
  }

  const { email } = parsed.data;

  let added = true;
  try {
    ({ added } = await addSubscriber(email));
  } catch (error) {
    console.error("[subscribe] failed to record subscriber:", error);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }

  // Already on the list — treat it as a success (no need to tell a visitor
  // they've already signed up) but skip sending another welcome email.
  if (!added) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "notes@resend.dev";

  if (!apiKey) {
    console.info("[subscribe] (no RESEND_API_KEY set) new signup recorded:", email);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const profile = await getProfile();
  const siteName = `${profile.name}.log`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        reply_to: profile.email,
        subject: `You're subscribed to ${siteName}`,
        text: `Hey — thanks for subscribing to ${siteName}.\n\nYou'll get an email when a new post or digest issue goes up: job-market signal, no hype.\n\nIf this wasn't you, just ignore this email — you won't be added to anything else.\n\n— ${profile.name}`,
      }),
    });
    if (!res.ok) {
      // The subscriber is already recorded even if the welcome email fails,
      // so this doesn't need to fail the whole request for the visitor.
      console.error("[subscribe] welcome email failed to send:", await res.text());
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[subscribe] Unexpected error sending welcome email:", error);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
