"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/types";

export function LatestWriting({ posts }: { posts: Post[] }) {
  const latest = posts.slice(0, 5);
  const [hoverIndex, setHoverIndex] = useState(0);
  const preview = latest[hoverIndex] ?? latest[0];

  return (
    <section className="mx-auto max-w-content px-6 pb-10 pt-20 sm:px-8">
      <div className="mb-2 flex items-baseline justify-between gap-5 border-b border-line2 pb-4">
        <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-fg">Latest writing</h2>
        <Link
          href="/writing"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg3 transition-colors hover:text-accent"
        >
          All {posts.length} →
        </Link>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {latest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              onMouseEnter={() => setHoverIndex(i)}
              className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-baseline gap-5 border-b border-line px-1 py-[22px] text-fg transition-colors hover:bg-bg2"
            >
              <span className="font-mono text-[11px] text-fg3">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-display text-[26px] leading-[1.16] tracking-[-0.01em]">
                  {post.title}
                </span>
                <span className="mt-2 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg3">
                  {post.topic} · {post.read}
                </span>
              </span>
              <span className="font-mono text-[11px] text-fg3">{post.date}</span>
            </Link>
          ))}
        </div>

        <aside className="sticky top-24 min-h-[300px] border border-line bg-bg2 p-6">
          <div className="mb-[18px] font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Preview</div>
          <div className="diagonal-fill mb-5 flex h-[150px] items-end border border-line p-3">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg3">
              [ article thumbnail ]
            </span>
          </div>
          {preview && (
            <>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {preview.topic}
              </div>
              <div className="mb-3 font-display text-[23px] leading-[1.18] text-fg">{preview.title}</div>
              <p className="m-0 text-pretty text-base leading-[1.6] text-fg2">{preview.blurb}</p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
