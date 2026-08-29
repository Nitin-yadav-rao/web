import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function FeaturedPost({ posts }: { posts: Post[] }) {
  const featured = posts[0];
  if (!featured) return null;

  return (
    <RevealOnScroll>
      <section className="border-y border-line bg-bg2">
        <div className="mx-auto grid max-w-content items-stretch gap-0 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="py-14 lg:py-[56px] lg:pr-14">
            <div className="mb-[22px] font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Featured long-read
            </div>
            <h2 className="m-0 font-display text-[clamp(34px,3.6vw,52px)] font-normal leading-[1.05] tracking-[-0.015em] text-fg">
              {featured.title}
            </h2>
            <p className="mt-[22px] max-w-[52ch] text-pretty text-lg leading-[1.62] text-fg2">
              {featured.blurb}
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-[18px] font-mono text-[11px] text-fg3">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.read}</span>
              <span>·</span>
              <span className="text-accent">{featured.topic}</span>
            </div>
            <Link
              href={`/writing/${featured.slug}`}
              className="mt-[30px] inline-block border-b border-accent pb-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-fg transition-colors hover:text-accent"
            >
              Read the piece →
            </Link>
          </div>
          {featured.coverImageUrl ? (
            <div className="relative min-h-[280px] border-t border-line lg:min-h-[420px] lg:border-l lg:border-t-0">
              <Image
                src={featured.coverImageUrl}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="diagonal-fill flex min-h-[280px] items-end border-t border-line p-7 lg:min-h-[420px] lg:border-l lg:border-t-0">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg3">
                [ hero image — shift-handover whiteboard photo ]
              </span>
            </div>
          )}
        </div>
      </section>
    </RevealOnScroll>
  );
}
