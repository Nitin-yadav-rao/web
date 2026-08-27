import Link from "next/link";
import { profile } from "@/data/site";
import { digestIssues } from "@/data/digest";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function NowAndDigest() {
  const latestIssue = digestIssues[0];

  return (
    <RevealOnScroll>
      <section className="mx-auto max-w-content px-6 py-[60px] sm:px-8">
        <div className="grid border border-line sm:grid-cols-2">
          <div className="border-b border-line p-10 sm:border-b-0 sm:border-r">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Now / currently</div>
            <div className="grid gap-[18px]">
              {profile.now.map((item) => (
                <div key={item.label} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {item.label}
                  </span>
                  <span className="text-[17px] leading-[1.5] text-fg2">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg2 p-10">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">
              Weekly digest · issue {latestIssue?.no}
            </div>
            <div className="grid gap-[14px]">
              {latestIssue?.items.map((item) => (
                <div key={item.n} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent">{item.n}</span>
                  <span className="text-[17px] leading-[1.5] text-fg2">{item.text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/digest"
              className="mt-[26px] inline-block border-b border-accent pb-[5px] font-mono text-[11px] uppercase tracking-[0.16em] text-fg transition-colors hover:text-accent"
            >
              All issues →
            </Link>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
