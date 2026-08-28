import { Hero } from "@/components/home/Hero";
import { FeaturedPost } from "@/components/home/FeaturedPost";
import { LatestWriting } from "@/components/home/LatestWriting";
import { NowAndDigest } from "@/components/home/NowAndDigest";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { deriveTopics, getDigestIssues, getPosts, getProfile, getResources } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, posts, digestIssues, resources] = await Promise.all([
    getProfile(),
    getPosts(),
    getDigestIssues(),
    getResources(),
  ]);
  const topics = deriveTopics(posts);

  return (
    <>
      <Hero profile={profile} posts={posts} digestIssues={digestIssues} resources={resources} topics={topics} />
      <FeaturedPost posts={posts} />
      <LatestWriting posts={posts} />
      <NowAndDigest profile={profile} digestIssues={digestIssues} />
      <NewsletterCta />
    </>
  );
}
