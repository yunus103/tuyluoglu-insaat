import { Metadata } from "next";
import { draftMode } from "next/headers";
import { getClient } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HeroSection }     from "@/components/home/HeroSection";
import { AboutSection }    from "@/components/home/AboutSection";
import { WhyUsSection }    from "@/components/home/WhyUsSection";
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

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled;
  const data = await getClient(isDraft).fetch(
    homePageQuery,
    {},
    { next: { tags: ["home"] } }
  );

  return (
    <>
      <HeroSection data={data} />
      <AboutSection data={data} />
      <WhyUsSection data={data} />
      <ServicesSection data={data} />
      <ProjectsSection data={data} />
      <CtaSection data={data} />
    </>
  );
}
