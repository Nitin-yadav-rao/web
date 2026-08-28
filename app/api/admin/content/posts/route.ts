import { NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/content-store";
import type { Post } from "@/types";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Post[];
    if (!Array.isArray(body)) throw new Error("Expected an array of posts.");

    const slugs = new Set<string>();
    for (const post of body) {
      if (!post.slug || !post.title) throw new Error("Every post needs a title and a slug.");
      if (slugs.has(post.slug)) throw new Error(`Duplicate slug: "${post.slug}". Slugs must be unique.`);
      slugs.add(post.slug);
    }

    await savePosts(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 }
    );
  }
}
