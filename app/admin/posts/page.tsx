import Link from "next/link";
import { getPosts } from "@/lib/content-store";
import { AdminButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="grid gap-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
          <h1 className="font-display text-[32px] font-normal leading-none text-fg">Posts</h1>
        </div>
        <Link href="/admin/posts/new">
          <AdminButton variant="primary">+ New post</AdminButton>
        </Link>
      </div>

      <div className="border border-line">
        {posts.length === 0 && <div className="p-6 text-[13px] text-fg3">No posts yet.</div>}
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/admin/posts/${post.slug}`}
            className="grid grid-cols-1 items-baseline gap-2 border-b border-line p-5 transition-colors last:border-none hover:bg-bg2 sm:grid-cols-[minmax(0,1fr)_120px_100px_110px]"
          >
            <span className="font-display text-[19px] leading-tight text-fg">{post.title}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent">{post.topic}</span>
            <span className="font-mono text-[11px] text-fg3">{post.date}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg3">
              {post.body?.length ? "Published" : "Coming soon"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
