import { profile } from "@/data/site";
import { posts, topics } from "@/data/posts";
import { digestIssues } from "@/data/digest";
import { resources } from "@/data/resources";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "In the archive", value: posts.length },
  { label: "Digest issues", value: digestIssues.length },
  { label: "Resources", value: resources.length },
  { label: "Topics", value: topics.length - 1 },
];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-content px-6 pb-[76px] pt-24 sm:px-8 sm:pt-[96px]">
      <div
        aria-hidden="true"
        className="grain-bg animate-drift pointer-events-none absolute inset-0"
      />

      <div className="relative grid items-end gap-16 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="mb-[30px] flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg3">
            <span className="animate-blink block h-[7px] w-[7px] rounded-full bg-accent" />
            <span>{profile.heroKicker}</span>
          </div>

          <h1 className="m-0 font-display text-[clamp(46px,6.6vw,92px)] font-normal leading-[0.98] tracking-[-0.02em] text-fg">
            Everyone says{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-[1]">get into cyber.</span>
              <span
                aria-hidden="true"
                className="animate-mark absolute inset-x-[-4px] bottom-[6px] z-0 h-[38%] origin-left bg-accent-soft"
              />
            </span>
            <br />
            Nobody says <em className="italic text-accent">which door</em> to knock on.
          </h1>

          <p className="mt-[30px] max-w-[56ch] text-pretty text-[19.5px] leading-[1.62] text-fg2">
            {profile.subheadline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/writing" variant="solid">
              Read the archive →
            </Button>
            <Button href="/digest" variant="outline">
              This week&rsquo;s digest
            </Button>
          </div>
        </div>

        <div className="border-t border-line pt-[18px]">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Index</div>
          <div className="grid gap-[11px]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between gap-3 font-mono text-xs text-fg2">
                <span>{stat.label}</span>
                <span className="text-fg">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
