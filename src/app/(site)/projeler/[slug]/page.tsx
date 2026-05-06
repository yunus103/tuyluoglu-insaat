import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { projectBySlugQuery, projectListQuery, relatedProjectsQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { RichText } from "@/components/ui/RichText";
import { LightboxGallery } from "@/components/ui/Lightbox";
import { JsonLd, projectJsonLd } from "@/components/seo/JsonLd";
import { RiArrowLeftLine, RiArrowRightLine, RiMapPin2Line, RiCalendarLine, RiLayoutGridLine } from "react-icons/ri";

type Props = { params: Promise<{ slug: string }> };

const CATEGORY_LABELS: Record<string, string> = {
  "konut":            "Konut",
  "villa":            "Villa",
  "apartman":         "Apartman",
  "rezidans":         "Rezidans",
  "ticari":           "Ticari",
  "ofis":             "Ofis",
  "otel":             "Otel",
  "kentsel-donusum":  "Kentsel Dönüşüm",
  "kat-karsiligi":    "Kat Karşılığı",
  "mimarlik-projesi": "Mimarlık Projesi",
  "restorasyon":      "Restorasyon",
  "endustriyel":      "Endüstriyel",
};

export async function generateStaticParams() {
  const projects = await client.fetch(projectListQuery, {}, { next: { tags: ["projects"] } });
  return (projects || []).map((p: any) => ({ slug: p.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getClient().fetch(projectBySlugQuery, { slug }, { next: { tags: ["projects"] } });
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.excerpt,
    canonicalPath: `/projeler/${slug}`,
    pageSeo: project.seo,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;

  const [project, layoutData] = await Promise.all([
    getClient(isDraft).fetch(projectBySlugQuery, { slug }, { next: { tags: ["projects"] } }),
    client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } }),
  ]);

  if (!project) notFound();

  // İlgili projeler (aynı kategori)
  let relatedProjects: any[] = [];
  if (project.category) {
    relatedProjects = await getClient(isDraft).fetch(
      relatedProjectsQuery,
      { category: project.category, slug },
      { next: { tags: ["projects"] } }
    );
  }

  const heroImageUrl = project.mainImage?.asset?.url
    ? urlForImage(project.mainImage)?.width(1920).height(900).quality(80).url()
    : null;

  const catLabel = project.category ? (CATEGORY_LABELS[project.category] ?? project.category) : null;

  return (
    <>
      <JsonLd data={projectJsonLd(layoutData?.settings, project)} />

      {/* ── Hero — Full viewport görsel ─────────────────────────── */}
      <section className="relative h-[55vh] md:h-[70vh] bg-[var(--color-black)] overflow-hidden">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={project.mainImage?.alt || project.title}
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Breadcrumb */}
        <div className="absolute top-8 left-0 right-0 z-20 site-container">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <Link href="/projeler" className="hover:text-white transition-colors">Projeler</Link>
            <span>/</span>
            <span className="text-white/70">{project.title}</span>
          </nav>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 site-container pb-10 md:pb-14">
          <h1
            className="font-heading text-white mb-4 leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            {project.title}
          </h1>
          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {catLabel && (
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                <RiLayoutGridLine size={12} />
                {catLabel}
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                <RiMapPin2Line size={12} />
                {project.location}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                <RiCalendarLine size={12} />
                {project.year}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Proje İçeriği ─────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-20 md:py-28">

          {/* Geri bağlantısı */}
          <Link
            href="/projeler"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 mb-12"
          >
            <RiArrowLeftLine size={14} className="transition-transform group-hover:-translate-x-1" />
            Tüm Projeler
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Body metin — sol */}
            <div className="lg:col-span-7">
              {project.excerpt && (
                <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-8 font-body pl-5 border-l-2 border-[var(--color-accent)]">
                  {project.excerpt}
                </p>
              )}
              {project.body && (
                <div className="prose prose-neutral max-w-none text-[var(--color-gray)] leading-relaxed">
                  <RichText value={project.body} />
                </div>
              )}
              {!project.excerpt && !project.body && (
                <p className="text-[var(--color-muted)] text-sm italic py-4">
                  Proje detay içeriği yakında eklenecek.
                </p>
              )}
            </div>

            {/* Proje bilgi kartı — sağ */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="border border-[var(--color-border)] p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)] mb-6">Proje Bilgileri</p>
                <div className="space-y-5">
                  {catLabel && (
                    <div className="flex items-start gap-4">
                      <RiLayoutGridLine size={15} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">Kategori</p>
                        <p className="text-sm text-[var(--color-dark)]">{catLabel}</p>
                      </div>
                    </div>
                  )}
                  {project.location && (
                    <div className="flex items-start gap-4">
                      <RiMapPin2Line size={15} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">Konum</p>
                        <p className="text-sm text-[var(--color-dark)]">{project.location}</p>
                      </div>
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-start gap-4">
                      <RiCalendarLine size={15} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">Yapım Yılı</p>
                        <p className="text-sm text-[var(--color-dark)]">{project.year}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                  <Link
                    href="/iletisim"
                    className="group flex items-center justify-between w-full bg-[var(--color-black)] text-white px-6 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--color-accent-dark)] transition-colors duration-300"
                  >
                    Benzer Proje İçin Ulaşın
                    <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galeri ────────────────────────────────────────────────── */}
      {project.gallery?.length > 0 && (
        <section className="bg-[#F4F4F2]">
          <div className="site-container py-20 md:py-24">
            <div className="flex items-center gap-3 mb-5">
              <span className="accent-line" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Fotoğraf Galerisi</span>
            </div>
            <h2 className="font-heading text-[var(--color-black)] mb-12">Proje Görselleri</h2>
            <LightboxGallery images={project.gallery} />
          </div>
        </section>
      )}

      {/* ── Diğer Projeler ────────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <section className="bg-white">
          <div className="site-container py-20 md:py-24">
            <div className="flex items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="accent-line" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                    {catLabel ? `Diğer ${catLabel} Projeleri` : "Benzer Projeler"}
                  </span>
                </div>
                <h2 className="font-heading text-[var(--color-black)]">Diğer Projeler</h2>
              </div>
              <Link
                href="/projeler"
                className="group hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] border-b border-[var(--color-border)] pb-1 hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 shrink-0"
              >
                Tümünü Gör
                <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProjects.map((rp: any) => {
                const rpImg = rp.mainImage?.asset?.url
                  ? urlForImage(rp.mainImage)?.width(600).height(720).quality(80).url()
                  : null;
                return (
                  <Link
                    key={rp.slug?.current}
                    href={`/projeler/${rp.slug?.current}`}
                    className="group relative block overflow-hidden"
                    style={{ aspectRatio: "5/6" }}
                  >
                    {rpImg ? (
                      <Image
                        src={rpImg}
                        alt={rp.mainImage?.alt || rp.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--color-surface)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-5">
                      <p className="font-heading text-white text-lg">{rp.title}</p>
                      {rp.year && <p className="text-[9px] text-white/40 mt-1">{rp.year}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
