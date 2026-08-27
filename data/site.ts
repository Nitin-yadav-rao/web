import type { NavLink, SiteProfile } from "@/types";

/**
 * Ported from the design draft you shared. A few things to swap in before
 * publishing: `email` is a placeholder, and `location` is inferred from
 * "open to ... remote or Bengaluru" — correct it if that's not right.
 */
export const profile: SiteProfile = {
  name: "Nitin",
  logoSuffix: ".log",
  heroKicker: "Field notes · cybersecurity careers",
  subheadline:
    "I'm Nitin — a cybersecurity student writing down what the career path actually looks like from the inside: what hiring managers ask for in 2026, which certs still move the needle, and the parts of the job nobody puts in a roadmap graphic.",
  location: "Bengaluru, India",
  email: "hello@example.com",
  now: [
    { label: "Studying", text: "Final-year B.Tech, cyber security specialisation" },
    { label: "Prepping", text: "CompTIA Security+ → then BTL1, exam booked for October" },
    {
      label: "Building",
      text: "A home lab: Wazuh + Sysmon, writing detections for the attacks I run at myself",
    },
    { label: "Open to", text: "SOC / detection-engineering internships, remote or Bengaluru" },
  ],
  aboutHeadline: "I'm learning this in public, on purpose.",
  aboutParagraphs: [
    'I\'m Nitin, a final-year cybersecurity student. I started writing because every "how to break into cyber" post I read was either a certificate advert or a roadmap so long it was useless. So I began keeping notes on the real thing: what job listings actually ask for, what practitioners say over coffee, what I break in my own lab.',
    "If you're a student, the archive is for you. If you hire tier-1 analysts, I'd love to be told where I'm wrong.",
  ],
  timeline: [
    { year: "2023", text: "Started my degree wanting to be a pentester because of a YouTube video." },
    { year: "2024", text: "First CTF. Placed badly, learned that I liked the defensive side more." },
    { year: "2025", text: "Built the home lab. Started publishing lab write-ups instead of hoarding them." },
    { year: "2026", text: "Shadowing SOC shifts, writing the digest weekly, applying for internships." },
  ],
};

export const navLinks: NavLink[] = [
  { label: "Writing", href: "/writing" },
  { label: "Digest", href: "/digest" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];
