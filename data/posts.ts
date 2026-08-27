import type { Post } from "@/types";

/**
 * Only the first post has a full `body` — that's the one real piece from
 * your draft. The other seven are index entries only; their article pages
 * render a "coming soon" state until you write them (see the article
 * content question we discussed). Add more posts here as you write them —
 * everything else (archive, filters, home page "latest") reads from this
 * one array.
 */
export const posts: Post[] = [
  {
    slug: "soc-analyst-job-is-not-the-job-you-were-sold",
    title: "The SOC analyst job is not the job you were sold",
    topic: "Blue team",
    date: "2026-08-19",
    read: "14 min",
    blurb:
      "A month of shifts with three tier-1 analysts, and what I'd practise differently if I were starting over.",
    body: [
      {
        type: "paragraph",
        text: "The recruitment pitch for a security operations centre is a dark room, six monitors, and a graph turning red. The reality of a tier-1 shift is a queue. The queue does not care that you can read a PCAP. It cares whether you can look at four hundred alerts and be consistently, boringly correct about which twelve deserve a human.",
      },
      {
        type: "paragraph",
        text: "I spent a month shadowing handovers at a mid-size MSSP. Three analysts, all under two years in, all hired without a security degree. I asked each of them the same question at the end of a shift: what do you wish you'd practised before you started?",
      },
      { type: "heading", text: "1. Writing, not tooling" },
      {
        type: "paragraph",
        text: "Every escalation is a piece of writing. If tier-2 has to re-run your investigation to understand it, you have cost the team more time than the alert was worth. The analysts who got promoted fastest were the ones whose notes read like a short argument: what fired, what I checked, what I ruled out, what I recommend.",
      },
      {
        type: "quote",
        text: "Nobody failed my probation review over a missed detection. People fail it over notes nobody can follow.",
      },
      { type: "heading", text: "2. Knowing the estate beats knowing the attack" },
      {
        type: "paragraph",
        text: 'Half of triage is answering "is this normal here?" That question is about the customer, not about the technique. The fastest ramp-up I saw came from an analyst who spent her first fortnight reading asset inventories and change tickets instead of threat reports.',
      },
      { type: "heading", text: "3. Practise the interview you'll actually get" },
      {
        type: "paragraph",
        text: "Two of the three were hired off a live exercise: here's an alert, talk me through it. No trick questions, no port-number quizzes. Build a home lab, fire real attacks at it, and then narrate your own triage out loud until it stops sounding like a checklist.",
      },
      {
        type: "callout",
        label: "If you do one thing",
        text: "Take the last lab you finished and rewrite it as a 200-word escalation note. That single artefact does more in an interview than another certificate badge on your profile.",
      },
    ],
  },
  {
    slug: "security-plus-in-2026",
    title: "Security+ in 2026: still worth it, for a narrower reason",
    topic: "Certs",
    date: "2026-08-11",
    read: "9 min",
    blurb: "It no longer gets you the interview. It gets you past the filter that never reads your projects.",
  },
  {
    slug: "40-internship-rejections",
    title: "I applied to 40 internships and logged every rejection",
    topic: "Job market",
    date: "2026-08-02",
    read: "11 min",
    blurb:
      "The patterns in what got a reply, and the three lines in my CV that changed the response rate.",
  },
  {
    slug: "home-lab-is-a-portfolio",
    title: "Your home lab is a portfolio. Stop treating it as practice.",
    topic: "Labs",
    date: "2026-07-25",
    read: "8 min",
    blurb: "Write-ups beat screenshots. A repo of detections beats a list of tools you've installed.",
  },
  {
    slug: "what-cloud-means-entry-level",
    title: "What cloud actually means on an entry-level job spec",
    topic: "Cloud",
    date: "2026-07-16",
    read: "12 min",
    blurb:
      "Nobody expects you to architect a landing zone. They expect you to read an IAM policy without panicking.",
  },
  {
    slug: "reading-a-job-ad-like-a-threat-model",
    title: "Reading a job ad like a threat model",
    topic: "Job market",
    date: "2026-07-06",
    read: "7 min",
    blurb: "Every listing leaks the team's real problem. Here's how to find it and answer it in the cover note.",
  },
  {
    slug: "the-interview-question-i-kept-failing",
    title: "The interview question I kept failing",
    topic: "Blue team",
    date: "2026-06-28",
    read: "6 min",
    blurb: '"Walk me through an alert you closed as benign." Why the benign ones test you harder.',
  },
  {
    slug: "notes-from-a-purple-team-workshop",
    title: "Notes from a purple-team workshop",
    topic: "Labs",
    date: "2026-06-19",
    read: "10 min",
    blurb: "Running my own attacks taught me more about detection gaps than any course module.",
  },
];

export const topics = ["All", "Blue team", "Certs", "Job market", "Labs", "Cloud"] as const;
