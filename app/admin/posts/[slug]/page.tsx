import { notFound } from "next/navigation";
import { deriveTopics, getPosts } from "@/lib/content-store";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const topics = deriveTopics(posts).filter((t) => t !== "All");

  return <PostForm mode="edit" initialPost={post} existingTopics={topics} />;
}
