"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

export function WritingArchive({ posts, topics }: { posts: Post[]; topics: string[] }) {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(
    () => (filter === "All" ? posts : posts.filter((p) => p.topic === filter)),
    [filter, posts]
  );

  return (
    <main className="mx-auto max-w-content px-6 pb-10 pt-[72px] sm:px-8">
      <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg3">
        Archive · {posts.length} pieces
      </div>
      <h1 className="mb-10 font-display text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-[-0.02em] text-fg">
        Writing
      </h1>

      <div className="flex flex-wrap gap-2 border-b border-line2 pb-7">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={cn(
              "border border-line px-[15px] py-[9px] font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-200 hover:border-accent",
              filter === t ? "bg-fg text-bg" : "bg-transparent text-fg2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {filtered.map((post, i) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="grid grid-cols-[44px_minmax(0,1fr)] items-baseline gap-5 border-b border-line px-1 py-6 text-fg transition-colors hover:bg-bg2 sm:grid-cols-[44px_minmax(0,1fr)_130px_96px]"
          >
            <span className="font-mono text-[11px] text-fg3">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block font-display text-[27px] leading-[1.14] tracking-[-0.01em]">
                {post.title}
              </span>
              <span className="mt-[9px] block max-w-[70ch] text-[16.5px] leading-[1.55] text-fg2">
                {post.blurb}
              </span>
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent">
              {post.topic}
            </span>
            <span className="text-right font-mono text-[11px] text-fg3">{post.date}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
