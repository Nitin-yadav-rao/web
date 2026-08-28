import type { Metadata } from "next";
import { getResources } from "@/lib/content-store";

export const metadata: Metadata = { title: "Resources for Beginners" };
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <main className="mx-auto max-w-content px-6 pb-10 pt-[72px] sm:px-8">
      <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg3">Start here</div>
      <h1 className="mb-5 font-display text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-[-0.02em] text-fg">
        Resources for beginners
      </h1>
      <p className="mb-[52px] max-w-[58ch] text-pretty text-lg leading-[1.6] text-fg2">
        The short list I&rsquo;d hand my first-year self. No affiliate links, no 47-step roadmap graphic.
      </p>

      <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <div
            key={r.title}
            className="border-b border-r border-line p-8 transition-colors duration-200 hover:bg-bg2"
          >
            <div className="mb-[18px] flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              <span className="block h-1.5 w-1.5 rounded-[1px] bg-accent" />
              {r.kind}
            </div>
            <h2 className="mb-3 font-display text-[27px] font-normal leading-[1.14] text-fg">{r.title}</h2>
            <p className="mb-4 text-pretty text-[16.5px] leading-[1.58] text-fg2">{r.body}</p>
            <div className="font-mono text-[10.5px] text-fg3">{r.meta}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
