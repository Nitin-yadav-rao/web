import { deriveTopics, getPosts } from "@/lib/content-store";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const posts = await getPosts();
  const topics = deriveTopics(posts).filter((t) => t !== "All");

  return <PostForm mode="new" existingTopics={topics} />;
}
