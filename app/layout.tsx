import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { getProfile, navLinks } from "@/lib/content-store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

// Content now comes from Vercel Blob storage via the admin panel, so every
// route renders fresh per-request instead of being cached as static HTML —
// otherwise an edit in /admin wouldn't show up until the next deploy.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.name}.log — Field Notes on Cybersecurity Careers`;
  const description = profile.subheadline;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s — ${profile.name}.log`,
    },
    description,
    keywords: [
      "cybersecurity careers",
      "SOC analyst",
      "cybersecurity student",
      "blue team",
      "Security+",
      "career notes",
      profile.name,
    ],
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    applicationName: `${profile.name}.log`,
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: `${profile.name}.log`,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    icons: { icon: "/icon" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${profile.name}.log`,
    description: profile.subheadline,
    url: siteUrl,
    author: { "@type": "Person", name: profile.name, address: profile.location },
  };

  return (
    <html lang="en" className={`${newsreader.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>

        <ScrollProgress />
        <CustomCursor />
        <SmoothScrollProvider>
          <Header profile={profile} navLinks={navLinks} />
          <div id="main">{children}</div>
          <Footer profile={profile} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
