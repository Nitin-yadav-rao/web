/**
 * Central type definitions for the site's content layer. Every page reads
 * from /data, which is typed against these — no content is hardcoded
 * inside components.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NowItem {
  label: string;
  text: string;
}

export interface TimelineItem {
  year: string;
  text: string;
}

export interface SiteProfile {
  name: string;
  logoSuffix: string;
  heroKicker: string;
  subheadline: string;
  location: string;
  email: string;
  now: NowItem[];
  aboutHeadline: string;
  aboutParagraphs: string[];
  timeline: TimelineItem[];
  /** Portrait shown on the About page. Uploaded from /admin; a placeholder shows until one is set. */
  portraitUrl?: string;
}

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "callout"; label: string; text: string };

export interface Post {
  slug: string;
  title: string;
  topic: string;
  date: string;
  read: string;
  blurb: string;
  /** Present only for fully-written pieces; absent posts render a "coming soon" state. */
  body?: PostBlock[];
  dek?: string;
  /** Header image, shown on the post page and (for the newest post) as the homepage feature image. */
  coverImageUrl?: string;
}

export interface DigestItem {
  n: string;
  text: string;
}

export interface DigestIssue {
  no: string;
  date: string;
  title: string;
  items: DigestItem[];
}

export interface Resource {
  kind: string;
  title: string;
  body: string;
  meta: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface SubscribeFormValues {
  email: string;
}
