import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/data/posts";
import { PostBody } from "@/components/writing/PostBody";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.blurb };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main>
      <article className="mx-auto max-w-[760px] px-6 pb-10 pt-[72px] sm:px-8">
        <Link
          href="/writing"
          className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg3 transition-colors hover:text-accent"
        >
          ← Archive
        </Link>

        <div className="my-[34px] flex flex-wrap gap-3.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg3">
          <span className="text-accent">{post.topic}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.read}</span>
        </div>

        <h1 className="m-0 font-display text-[clamp(38px,5vw,64px)] font-normal leading-[1.02] tracking-[-0.02em] text-fg">
          {post.title}
        </h1>

        {post.body ? (
          <>
            <p className="mt-7 text-pretty text-xl italic leading-[1.6] text-fg2">{post.blurb}</p>
            <div className="my-10 h-px bg-line2" />
            <div className="diagonal-fill mb-11 flex h-[300px] items-end border border-line p-[18px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">
                [ photo — shift handover whiteboard ]
              </span>
            </div>

            <PostBody blocks={post.body} />

            <div className="flex flex-wrap gap-3 border-t border-line pt-8">
              <Link
                href="/writing"
                className="border border-line2 px-5 py-[13px] font-mono text-[11px] uppercase tracking-[0.16em] text-fg2 transition-colors hover:border-accent hover:text-accent"
              >
                More writing
              </Link>
              <Link
                href="/about"
                className="bg-fg px-5 py-[13px] font-mono text-[11px] uppercase tracking-[0.16em] text-bg transition-colors hover:bg-accent"
              >
                Get in touch
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-7 text-pretty text-xl italic leading-[1.6] text-fg2">{post.blurb}</p>
            <div className="my-11 border border-line p-8">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Draft — coming soon
              </div>
              <p className="m-0 text-pretty text-lg leading-[1.6] text-fg2">
                This piece is still being written. Subscribe on the home page and it&rsquo;ll land in your
                inbox the week it&rsquo;s published — or check back here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-line pt-8">
              <Link
                href="/writing"
                className="border border-line2 px-5 py-[13px] font-mono text-[11px] uppercase tracking-[0.16em] text-fg2 transition-colors hover:border-accent hover:text-accent"
              >
                ← Back to archive
              </Link>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
