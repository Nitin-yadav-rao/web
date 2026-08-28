import type { Metadata } from "next";
import { WritingArchive } from "@/components/writing/WritingArchive";
import { deriveTopics, getPosts } from "@/lib/content-store";

export const metadata: Metadata = { title: "Writing" };
export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const posts = await getPosts();
  const topics = deriveTopics(posts);
  return <WritingArchive posts={posts} topics={topics} />;
}
