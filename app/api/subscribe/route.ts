import { NextResponse } from "next/server";
import { subscribeSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/**
 * POST /api/subscribe
 * Validates the email, then either forwards it to your newsletter provider
 * (set NEWSLETTER_PROVIDER_URL + NEWSLETTER_PROVIDER_KEY) or just logs it
 * server-side for now. Swap the fetch call below for your provider's API
 * (Buttondown, ConvertKit, beehiiv, Mailchimp, …) when you're ready.
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
  const providerUrl = process.env.NEWSLETTER_PROVIDER_URL;
  const providerKey = process.env.NEWSLETTER_PROVIDER_KEY;

  if (!providerUrl || !providerKey) {
    console.info("[subscribe] (no provider configured) new signup:", email);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(providerUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${providerKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      console.error("[subscribe] provider request failed:", await res.text());
      return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[subscribe] Unexpected error:", error);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }
}
