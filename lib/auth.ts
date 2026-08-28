/**
 * Minimal single-user session auth for /admin, gated by ADMIN_PASSWORD.
 * Uses Web Crypto (available in both the Node and Edge runtimes) so it
 * works unmodified inside middleware. No database, no user table — this
 * site has exactly one editor.
 */

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-only-insecure-secret";
}

async function importKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signPayload(payload: string): Promise<string> {
  const key = await importKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(sigBuffer);
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  const sig = await signPayload(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = await signPayload(payload);
  if (expected !== sig) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return true;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
