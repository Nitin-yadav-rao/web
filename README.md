# Nitin.log

Field notes on cybersecurity careers — a personal writing site built with Next.js 15
(App Router), React 19, TypeScript, Tailwind CSS, and Framer Motion. Ported from your
design draft, now as a real, deployable multi-page site instead of a static mockup.

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
  api/contact/route.ts      Contact form handler
  api/subscribe/route.ts    Newsletter signup handler
  layout.tsx                Fonts, metadata, JSON-LD, header/footer/cursor
  globals.css               Design tokens (dark/light theme), keyframes

components/
  layout/   Header, Footer, ThemeToggle, CustomCursor, ScrollProgress, SmoothScrollProvider
  home/     Hero, FeaturedPost, LatestWriting, NowAndDigest, NewsletterCta
  writing/  WritingArchive, PostBody (renders article content blocks)
  about/    ContactForm
  ui/       Button, RevealOnScroll

data/     Typed content — site.ts (profile/now/timeline), posts.ts, digest.ts, resources.ts
types/    Shared TypeScript interfaces for everything in /data
lib/      cn() class helper, Zod schemas for both forms
```

## Getting started

Requires Node 18.18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm run start`,
`npm run lint`, `npm run typecheck`.

## Content you'll want to edit

Everything rendered comes from `/data` — no content is hardcoded in components.

1. **`data/site.ts`** — your real email (currently a placeholder), location, bio
   paragraphs, "now/currently" facts, timeline
2. **`data/posts.ts`** — write real `body` blocks for the 7 stub articles as you finish
   them (paragraph / heading / quote / callout block types — see `types/index.ts`)
3. **`data/digest.ts`** and **`data/resources.ts`** — add new issues / resources here
4. A portrait photo: replace the placeholder box in `app/about/page.tsx` with a real
   `next/image`
5. The featured-post and article hero images are still placeholder "[ photo ]" boxes in
   `components/home/FeaturedPost.tsx` and `app/writing/[slug]/page.tsx` — swap for real
   images when you have them

## Wiring up the forms

Both forms work end-to-end right now — without any environment variables they validate
input and log submissions to the server console, so you can test the full flow locally.

**Contact form** (`/api/contact`): create a [Resend](https://resend.com) account, verify
a sending domain, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`
(see `.env.example`).

**Newsletter signup** (`/api/subscribe`): point `NEWSLETTER_PROVIDER_URL` and
`NEWSLETTER_PROVIDER_KEY` at your provider's API (Buttondown, ConvertKit, beehiiv,
Mailchimp, ...). The route just does a `fetch` — swap the body shape in
`app/api/subscribe/route.ts` for whatever your provider expects.

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
