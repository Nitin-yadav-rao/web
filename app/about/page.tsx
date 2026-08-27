import type { Metadata } from "next";
import { profile } from "@/data/site";
import { ContactForm } from "@/components/about/ContactForm";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-content px-6 pb-10 pt-[72px] sm:px-8">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-[72px]">
        <div>
          <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg3">About</div>
          <h1 className="mb-[26px] font-display text-[clamp(38px,4.6vw,66px)] font-normal leading-[1.02] tracking-[-0.02em] text-fg">
            {profile.aboutHeadline}
          </h1>
          {profile.aboutParagraphs.map((p, i) => (
            <p
              key={i}
              className="mb-6 max-w-[60ch] text-pretty text-[19.5px] leading-[1.68] text-fg2 last:mb-11"
            >
              {p}
            </p>
          ))}

          <div className="border-t border-line2 pt-8">
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">
              The journey so far
            </div>
            {profile.timeline.map((t) => (
              <div
                key={t.year}
                className="grid grid-cols-[90px_minmax(0,1fr)] gap-6 border-b border-line py-4"
              >
                <span className="font-mono text-[11px] text-accent">{t.year}</span>
                <span className="text-pretty text-[17.5px] leading-[1.55] text-fg2">{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:sticky lg:top-24">
          <div className="diagonal-fill flex h-[260px] items-end border border-line p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg3">
              [ portrait photo ]
            </span>
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
