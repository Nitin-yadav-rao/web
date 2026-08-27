import type { Metadata } from "next";
import { digestIssues } from "@/data/digest";

export const metadata: Metadata = { title: "The Digest" };

export default function DigestPage() {
  return (
    <main className="mx-auto max-w-[1000px] px-6 pb-10 pt-[72px] sm:px-8">
      <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg3">
        Weekly · every Sunday
      </div>
      <h1 className="mb-5 font-display text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-[-0.02em] text-fg">
        The digest
      </h1>
      <p className="mb-12 max-w-[58ch] text-pretty text-lg leading-[1.6] text-fg2">
        Three things that moved in entry-level cyber hiring this week, with the source and what I think it
        means for students.
      </p>

      {digestIssues.map((issue) => (
        <div
          key={issue.no}
          className="grid grid-cols-1 items-start gap-6 border-t border-line2 py-[34px] sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-9"
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Issue {issue.no}
            </div>
            <div className="mt-2 font-mono text-[11px] text-fg3">{issue.date}</div>
          </div>
          <div>
            <h2 className="mb-[18px] font-display text-[30px] font-normal leading-[1.14] text-fg">
              {issue.title}
            </h2>
            <div className="grid gap-3">
              {issue.items.map((item) => (
                <div key={item.n} className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-fg3">{item.n}</span>
                  <span className="text-pretty text-[17.5px] leading-[1.55] text-fg2">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
