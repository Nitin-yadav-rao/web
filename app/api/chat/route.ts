import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/schemas";
import { getDigestIssues, getPosts, getProfile } from "@/lib/content-store";

// Node runtime — content-store needs it.
export const runtime = "nodejs";

// groq/compound-mini has built-in web search (it decides on its own whether
// a question needs it) and is capped by Groq to a single tool call per
// request, which keeps cost and latency predictable without any extra
// config on our end. It's on Groq's free tier.
const MODEL = "groq/compound-mini";
const MAX_COMPLETION_TOKENS = 600;
const MAX_HISTORY_MESSAGES = 12; // only the most recent turns are sent, to bound cost on long conversations

/**
 * Per-IP rate limiting, so one visitor can't hammer this public,
 * unauthenticated endpoint. In-memory, not a database — resets whenever this
 * serverless function instance goes cold. A speed bump, not a guarantee.
 */
const RATE_LIMIT = 20; // messages
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour, per IP
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

/**
 * Groq's free tier caps this whole API key at 250 requests/day (see
 * console.groq.com/docs/rate-limits) — shared across every visitor to the
 * site, not per-IP. This soft global counter stops a bit short of that so
 * visitors get a friendly message instead of a raw provider error once
 * that's close to used up. Same in-memory caveat as above: resets on a cold
 * start, and doesn't add up across multiple server instances if traffic
 * ever gets big enough to need more than one. If this site outgrows the
 * free tier, upgrade the plan at console.groq.com rather than raising this.
 */
const DAILY_LIMIT = 200;
let dailyCount = 0;
let dailyResetAt = startOfNextDayUTC();

function startOfNextDayUTC(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
}

function isDailyLimitReached(): boolean {
  if (Date.now() >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = startOfNextDayUTC();
  }
  dailyCount += 1;
  return dailyCount > DAILY_LIMIT;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function buildSystemPrompt(): Promise<string> {
  const [profile, posts, digestIssues] = await Promise.all([getProfile(), getPosts(), getDigestIssues()]);

  const postList = posts
    .map((p) => `- "${p.title}" (${p.topic}, ${p.date}): ${p.blurb}${p.body ? "" : " [not yet published — coming soon]"}`)
    .join("\n");

  const digestList = digestIssues.map((d) => `- Issue ${d.no} (${d.date}): ${d.title}`).join("\n");

  return `You are the chat assistant embedded on ${profile.name}'s personal site, ${profile.name}.log — field notes on cybersecurity careers. You appear as a small chat widget on every page.

About ${profile.name}: ${profile.subheadline}
Location: ${profile.location}
About page bio: ${profile.aboutParagraphs.join(" ")}
Currently: ${profile.now.map((n) => `${n.label} — ${n.text}`).join("; ")}

Posts on the site:
${postList || "(none yet)"}

Digest issues on the site:
${digestList || "(none yet)"}

Your job:
1. Answer questions about cybersecurity concepts, entry-level cyber careers, certifications, and the job market — the kind of thing this site covers. Search the web when a question needs current information (recent news, a certification's current cost, a company's current hiring status, etc.) rather than relying on memory for anything time-sensitive.
2. Answer questions about ${profile.name} and this site using the bio and post/digest list above. If asked about something not covered there, say you don't have that detail rather than guessing.
3. When a specific post or digest issue is relevant to the question, mention its title so the visitor can find it.
4. Keep answers conversational and fairly short — this is a small chat widget, not a place for long essays. A few sentences to a short paragraph is usually right.
5. Stay on topic. If someone asks for something unrelated to cybersecurity, careers, or this site (general coding help, unrelated trivia, creative writing, etc.), politely decline and steer back to what you can help with here.
6. Never claim to be ${profile.name} — you're clearly a chat assistant on their site, not the person.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The chat assistant isn't set up yet — add GROQ_API_KEY in Vercel and redeploy." },
      { status: 503 }
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "You're sending messages a little fast — please slow down and try again shortly." },
      { status: 429 }
    );
  }

  if (isDailyLimitReached()) {
    return NextResponse.json(
      { error: "This chat has hit its free daily limit — please check back tomorrow." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 422 });
  }

  const history = parsed.data.messages.slice(-MAX_HISTORY_MESSAGES);

  try {
    const system = await buildSystemPrompt();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        messages: [{ role: "system", content: system }, ...history.map((m) => ({ role: m.role, content: m.content }))],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("chat: Groq request failed", res.status, errorText);
      if (res.status === 429) {
        return NextResponse.json(
          { error: "This chat is getting a lot of use right now — please try again in a bit." },
          { status: 429 }
        );
      }
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "Didn't get a response. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("chat: request failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
