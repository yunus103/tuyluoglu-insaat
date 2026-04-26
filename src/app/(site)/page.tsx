import { Metadata } from "next";
import { draftMode } from "next/headers";
import { getClient } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HeroSection }     from "@/components/home/HeroSection";
import { AboutSection }    from "@/components/home/AboutSection";
import { WhyUsSection }    from "@/components/home/WhyUsSection";
import { MarqueeSection }  from "@/components/home/MarqueeSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { CtaSection }      from "@/components/home/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getClient().fetch(homePageQuery, {}, { next: { tags: ["home"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

/** Extract the origin (protocol + host) from a URL for preconnect */
function getOrigin(url: string): string | null {
  try { return new URL(url).origin; } catch { return null; }
}

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled;
  const data = await getClient(isDraft).fetch(
    homePageQuery,
    {},
    { next: { tags: ["home"] } }
  );

  const videoUrl    = data?.heroVideoUrl;
  const videoOrigin = videoUrl ? getOrigin(videoUrl) : null;

  return (
    <>
      {/* ── Video preload hints — injected into <head> by Next.js ── */}
      {videoOrigin && (
        <>
          <link rel="preconnect" href={videoOrigin} />
          <link rel="dns-prefetch" href={videoOrigin} />
        </>
      )}
      {videoUrl && (
        <link
          rel="preload"
          href={videoUrl}
          as="video"
          type="video/mp4"
          fetchPriority="high"
        />
      )}

      <HeroSection data={data} />
      <AboutSection data={data} />
      <WhyUsSection data={data} />
      <MarqueeSection />
      <ServicesSection data={data} />
      <ProjectsSection data={data} />
      <CtaSection data={data} />
    </>
  );
}
