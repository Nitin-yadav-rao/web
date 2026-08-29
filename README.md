# Nitin.log

Field notes on cybersecurity careers — a personal writing site built with Next.js 15
(App Router), React 19, TypeScript, Tailwind CSS, and Framer Motion. Ported from your
design draft, now as a real, deployable multi-page site instead of a static mockup.

**Everything shown on the site — your bio, posts, digest issues, resources — can be
edited from a password-protected admin panel at `/admin`, with no code editing, no git
commit, and no redeploy required.** See "Managing content" below.

## What changed from the design draft

- **Real routing.** Home, Writing (archive), individual articles, Digest, Resources, and
  About are actual pages (`/writing`, `/writing/[slug]`, `/digest`, `/resources`,
  `/about`) with their own URLs — not client-side page-state switching. That's what makes
  articles shareable and indexable by search engines.
- **Honest numbers.** The design draft's "Index" stats (24 articles, 18 digest issues,
  2,140 readers) were vanity placeholders not backed by the actual content underneath.
  The live site now shows real counts computed from `/data` (currently 8 pieces in the
  archive, 3 digest issues) and drops the fabricated reader count entirely — add a real
  one back in `components/home/Hero.tsx` once you actually have the number.
- **7 of 8 articles are stubs.** Only "The SOC analyst job is not the job you were sold"
  has a full body — that's the one real piece from your draft. The other seven show a
  "draft — coming soon" state on their article page rather than invented personal
  anecdotes. Add real bodies to `data/posts.ts` as you write them.
- **Newsletter + contact forms are real**, validated with Zod and posting to API routes
  (logging server-side until you wire up a provider — see below).

## Project structure

```
app/
  page.tsx                 Home (hero, featured post, latest writing, now/digest, newsletter)
  writing/page.tsx           Archive with topic filter
  writing/[slug]/page.tsx      Article (full body, or "coming soon")
  digest/page.tsx           Weekly digest issues
  resources/page.tsx        Beginner resource list
  about/page.tsx            Bio, timeline, contact form
  admin/                    Password-protected content editor (see "Managing content")
  api/contact/route.ts      Contact form handler
  api/subscribe/route.ts    Newsletter signup handler
  api/admin/                Login/logout + content read-write endpoints for /admin
  layout.tsx                Fonts, metadata, JSON-LD, header/footer/cursor
  globals.css               Design tokens (dark/light theme), keyframes

components/
  layout/   Header, Footer, ThemeToggle, CustomCursor, ScrollProgress, SmoothScrollProvider
  home/     Hero, FeaturedPost, LatestWriting, NowAndDigest, NewsletterCta
  writing/  WritingArchive, PostBody (renders article content blocks)
  about/    ContactForm
  admin/    Admin panel forms and shared UI primitives
  ui/       Button, RevealOnScroll

data/       Fallback content — used to seed the site the first time, and as a
            safety net if storage isn't connected. Once you save anything in
            /admin, the live site reads from storage instead of these files.
types/      Shared TypeScript interfaces for everything in /data
lib/        content-store.ts (storage read/write), auth.ts (admin sessions),
            cn() class helper, Zod schemas for the contact/newsletter forms
middleware.ts  Protects /admin and /api/admin behind the login
```

## Getting started

Requires Node 18.18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm run start`,
`npm run lint`, `npm run typecheck`.

## Managing content (the `/admin` panel)

Everything the site shows — your bio, the "now" list and timeline, every post (including
the coming-soon drafts), digest issues, and the resources list — can be edited from
`/admin` on the live site. Saving there publishes instantly: no code change, no commit,
no redeploy.

### One-time setup (do this once, on Vercel)

1. **Connect storage.** In your Vercel project: **Storage** tab → **Create Database** →
   choose **Blob** → set access to **Private** → connect it to this project. Vercel adds
   the credentials automatically — you don't need to copy/paste anything.
2. **Set a password.** Project **Settings** → **Environment Variables** → add
   `ADMIN_PASSWORD` with whatever password you want to use, for all environments →
   **Save**.
3. **Redeploy** (Deployments tab → "..." on the latest deployment → Redeploy), so the
   new environment variable takes effect.
4. Visit `https://your-site.vercel.app/admin`, log in with the password from step 2, and
   start editing.

That's it — steps 1–3 only need to happen once. After that, every save in `/admin` goes
live within seconds.

### What lives where in the admin panel

- **Profile & about** — name, email, location, hero text, the "now" list, the about-page
  bio paragraphs, your career timeline, and your portrait photo (top of the panel — click
  "Upload photo")
- **Posts** — add, edit, or delete any post. Untick "publish full body" to show a
  "coming soon" page for a post instead of writing it yet; article bodies are built from
  simple blocks (paragraph, heading, quote, callout) with reorder/remove controls; each
  post also has a "Cover image" upload, shown at the top of the post (and, for your newest
  post, on the home page too)
- **Digest** — weekly digest issues and their items
- **Resources** — the beginner resource list
- **Subscribers** — everyone who's signed up on the home page; copy the list to send a
  weekly issue, or remove an entry

Photo uploads go through `/api/admin/upload` to the same Blob store as everything else
(as public files, so visitors' browsers can load them directly) — no extra setup beyond
the one-time storage connection above. JPG, PNG, WEBP, GIF, or AVIF, up to 5MB. Until you
upload one, the site shows a placeholder box in that spot.

### If you'd rather edit code directly

The `/data/*.ts` files still exist and work exactly as before — they're the fallback the
site uses before you've connected storage (or before you've saved anything for a given
section in `/admin`). Editing them and pushing to GitHub still works, but once you save
something in `/admin`, that section's live content comes from storage, not from these
files, until you overwrite it again from the admin panel.

## Wiring up the forms

Both forms work end-to-end right now — without any environment variables they validate
input and log submissions to the server console, so you can test the full flow locally.

**Contact form** (`/api/contact`): create a [Resend](https://resend.com) account, verify
a sending domain, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`
(see `.env.example`).

**Newsletter signup** (`/api/subscribe`): uses the same `RESEND_API_KEY` and
`CONTACT_FROM_EMAIL` as the contact form above — nothing extra to set up. Each signup is
recorded in storage (view, copy, or remove entries at `/admin/subscribers`) and gets a
one-time welcome email. There's no automatic weekly send: when you're ready to send an
issue, copy the list from `/admin/subscribers` and paste it into Resend's dashboard or
your email client's BCC field. If you'd rather use a dedicated newsletter provider
(Buttondown, ConvertKit, beehiiv, Mailchimp, ...) instead, swap the `fetch` call in
`app/api/subscribe/route.ts` for their API.

## Deployment (Vercel)

You've already got this repo on GitHub and connected to Vercel — just push these changes
and it redeploys automatically. For a fresh setup: push to a Git repo, import at
[vercel.com/new](https://vercel.com/new), add the environment variables from
`.env.example` (set `NEXT_PUBLIC_SITE_URL` to your real domain), and deploy.

## Design notes

- **Theme toggle** is a simple `data-theme="light"` attribute on `<html>`, no
  localStorage persistence — matches the original draft's behavior (always starts dark).
  Add persistence in `components/layout/ThemeToggle.tsx` if you'd rather it remember the
  visitor's choice.
- **Custom cursor** and the grain/drift background are disabled automatically on touch
  devices and for visitors who prefer reduced motion.
- **Colors** are CSS custom properties in `app/globals.css` (`--bg`, `--fg`, `--accent`,
  etc.), wired into Tailwind via `tailwind.config.ts` — change the palette in one place
  and it updates everywhere, in both themes.
