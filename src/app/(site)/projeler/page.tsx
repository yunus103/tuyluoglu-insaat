import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { projectsPageQuery, projectListQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(projectsPageQuery, {}, { next: { tags: ["projectsPage"] } });
  return buildMetadata({
    title: data?.pageTitle || "Projelerimiz",
    description: data?.pageSubtitle,
    canonicalPath: "/projeler",
    pageSeo: data?.seo,
  });
}

export default async function ProjectsListPage() {
  const [pageData, projects] = await Promise.all([
    client.fetch(projectsPageQuery, {}, { next: { tags: ["projectsPage"] } }),
    client.fetch(projectListQuery, {}, { next: { tags: ["projects"] } }),
  ]);

  const orderedProjects = pageData?.orderedProjects || [];
  const allProjects = projects || [];

  // De-duplicate and apply manual ordering
  const orderedIds = new Set(orderedProjects.map((p: any) => p._id).filter(Boolean));
  const remainingProjects = allProjects.filter((p: any) => !orderedIds.has(p._id));
  const finalProjects = [...orderedProjects, ...remainingProjects];

  return (
    <>
      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Portfolio"
        title={pageData?.heroTitle || "Projelerimiz"}
        subtitle={pageData?.heroSubtitle || "Tamamladığımız ve devam eden projelerimize göz atın."}
        decorativeText="Projeler"
      />

      {/* ── Grid + Filter (Client Component) ─────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-16 md:py-20">
          <ProjectsGrid projects={finalProjects} />
        </div>
      </section>
    </>
  );
}
