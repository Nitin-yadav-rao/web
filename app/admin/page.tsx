import Link from "next/link";
import { getDigestIssues, getPosts, getProfile, getResources, getSubscribers } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [profile, posts, digestIssues, resources, subscribers] = await Promise.all([
    getProfile(),
    getPosts(),
    getDigestIssues(),
    getResources(),
    getSubscribers(),
  ]);

  const cards = [
    {
      href: "/admin/profile",
      title: "Profile & about",
      desc: "Your name, bio, location, “now” list, and career timeline.",
      meta: `Editing as ${profile.name}`,
    },
    {
      href: "/admin/posts",
      title: "Posts",
      desc: "Everything in the writing archive, including drafts marked “coming soon.”",
      meta: `${posts.length} post${posts.length === 1 ? "" : "s"}`,
    },
    {
      href: "/admin/digest",
      title: "Digest",
      desc: "Weekly digest issues shown on the home page and /digest.",
      meta: `${digestIssues.length} issue${digestIssues.length === 1 ? "" : "s"}`,
    },
    {
      href: "/admin/resources",
      title: "Resources",
      desc: "The beginner resource list on /resources.",
      meta: `${resources.length} resource${resources.length === 1 ? "" : "s"}`,
    },
    {
      href: "/admin/subscribers",
      title: "Subscribers",
      desc: "Everyone who's signed up on the home page — each gets a welcome email automatically.",
      meta: `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}`,
    },
  ];

  const blobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN);

  return (
    <div>
      <div className="mb-10">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Admin</div>
        <h1 className="font-display text-[36px] font-normal leading-none text-fg">Manage your site</h1>
      </div>

      {!blobConnected && (
        <div className="mb-8 border border-accent/40 bg-bg2 p-5 text-[14px] leading-[1.6] text-fg2">
          <span className="mr-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Setup needed</span>
          Storage isn&rsquo;t connected on this deployment yet, so edits here won&rsquo;t save. In your Vercel
          project: <strong className="text-fg">Storage → Create Database → Blob</strong> (choose{" "}
          <strong className="text-fg">Private</strong>), then connect it to this project and redeploy. See the
          README for the full walkthrough.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-line bg-bg2 p-6 transition-colors hover:border-accent"
          >
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{card.meta}</div>
            <h2 className="mb-2 font-display text-[24px] font-normal leading-tight text-fg">{card.title}</h2>
            <p className="m-0 text-[14.5px] leading-[1.55] text-fg2">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
