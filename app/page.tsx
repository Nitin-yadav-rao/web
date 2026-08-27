import { Hero } from "@/components/home/Hero";
import { FeaturedPost } from "@/components/home/FeaturedPost";
import { LatestWriting } from "@/components/home/LatestWriting";
import { NowAndDigest } from "@/components/home/NowAndDigest";
import { NewsletterCta } from "@/components/home/NewsletterCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPost />
      <LatestWriting />
      <NowAndDigest />
      <NewsletterCta />
    </>
  );
}
