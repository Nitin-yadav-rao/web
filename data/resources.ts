import type { Resource } from "@/types";

export const resources: Resource[] = [
  {
    kind: "Foundation",
    title: "Networking before security",
    body: "You cannot triage traffic you can't picture. Two weeks on TCP/IP, DNS and HTTP pays back for years.",
    meta: "free · ~20 hrs",
  },
  {
    kind: "Hands-on",
    title: "Build the smallest useful lab",
    body: "One Windows VM, one Linux VM, Sysmon and a log collector. That's it. Add pieces only when a question forces you to.",
    meta: "free · ongoing",
  },
  {
    kind: "Certs",
    title: "Pick one, finish it, move on",
    body: "Security+ for the filter, BTL1 if you want defensive practicals. Collecting certs is a way of avoiding building.",
    meta: "paid · pick one",
  },
  {
    kind: "Practice",
    title: "Write up every lab you finish",
    body: "200 words: what fired, what you checked, what you concluded. Ten of these is a portfolio.",
    meta: "free · 30 min each",
  },
  {
    kind: "Community",
    title: "Find three practitioners, not three hundred",
    body: 'Ask specific questions about their week. Generic "can you mentor me" messages go unanswered, and rightly so.',
    meta: "free",
  },
  {
    kind: "Reading",
    title: "Read incident reports, not threat blogs",
    body: "Public post-incident write-ups teach you how organisations actually fail. Marketing blogs teach you vendor names.",
    meta: "free · weekly",
  },
];
