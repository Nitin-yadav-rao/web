import { get, put } from "@vercel/blob";
import type { DigestIssue, NavLink, Post, Resource, SiteProfile, Subscriber } from "@/types";
import { navLinks as defaultNavLinks, profile as defaultProfile } from "@/data/site";
import { posts as defaultPosts } from "@/data/posts";
import { digestIssues as defaultDigestIssues } from "@/data/digest";
import { resources as defaultResources } from "@/data/resources";

/**
 * Content is stored as small private JSON blobs in Vercel Blob storage, so
 * the admin panel at /admin can publish edits instantly, without a git
 * commit or a redeploy. Until a store is connected (or before the first
 * save), every read falls back to the shipped defaults below — the site
 * always renders something sensible.
 *
 * Reads use `useCache: false` so a save is reflected on the very next page
 * load instead of waiting out Vercel's CDN propagation window.
 */

const PATHS = {
  profile: "content/profile.json",
  posts: "content/posts.json",
  digest: "content/digest.json",
  resources: "content/resources.json",
  subscribers: "content/subscribers.json",
} as const;

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN);
}

async function readJson<T>(pathname: string, fallback: T): Promise<T> {
  if (!blobConfigured()) return fallback;

  try {
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return fallback;
    const text = await new Response(result.stream).text();
    if (!text) return fallback;
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`content-store: failed to read ${pathname}`, error);
    return fallback;
  }
}

async function writeJson(pathname: string, data: unknown): Promise<void> {
  if (!blobConfigured()) {
    throw new Error(
      "Storage isn't connected yet. In your Vercel project, go to Storage → Create Database → Blob (Private) and connect it to this project, then try saving again."
    );
  }

  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export async function getProfile(): Promise<SiteProfile> {
  return readJson(PATHS.profile, defaultProfile);
}

export async function saveProfile(data: SiteProfile): Promise<void> {
  await writeJson(PATHS.profile, data);
}

export async function getPosts(): Promise<Post[]> {
  return readJson(PATHS.posts, defaultPosts);
}

export async function savePosts(data: Post[]): Promise<void> {
  await writeJson(PATHS.posts, data);
}

export async function getDigestIssues(): Promise<DigestIssue[]> {
  return readJson(PATHS.digest, defaultDigestIssues);
}

export async function saveDigestIssues(data: DigestIssue[]): Promise<void> {
  await writeJson(PATHS.digest, data);
}

export async function getResources(): Promise<Resource[]> {
  return readJson(PATHS.resources, defaultResources);
}

export async function saveResources(data: Resource[]): Promise<void> {
  await writeJson(PATHS.resources, data);
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return readJson(PATHS.subscribers, []);
}

export async function saveSubscribers(data: Subscriber[]): Promise<void> {
  await writeJson(PATHS.subscribers, data);
}

/**
 * Adds an email to the subscriber list unless it's already there
 * (case-insensitive). Returns whether it was newly added, so the caller
 * (the /api/subscribe route) knows whether to send a welcome email.
 */
export async function addSubscriber(email: string): Promise<{ added: boolean }> {
  const list = await getSubscribers();
  const normalized = email.trim().toLowerCase();
  if (list.some((s) => s.email.toLowerCase() === normalized)) {
    return { added: false };
  }
  const next = [...list, { email: email.trim(), subscribedAt: new Date().toISOString() }];
  await saveSubscribers(next);
  return { added: true };
}

/** Topics are derived from whatever posts actually exist, so a new topic typed into the admin panel shows up in the archive filter without any extra step. */
export function deriveTopics(posts: Post[]): string[] {
  const seen: string[] = [];
  for (const p of posts) {
    if (p.topic && !seen.includes(p.topic)) seen.push(p.topic);
  }
  return ["All", ...seen];
}

export const navLinks: NavLink[] = defaultNavLinks;
