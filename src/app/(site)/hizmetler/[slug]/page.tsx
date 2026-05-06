import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { serviceBySlugQuery, serviceListQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { JsonLd, singleServiceJsonLd } from "@/components/seo/JsonLd";
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine } from "react-icons/ri";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await client.fetch(serviceListQuery, {}, { next: { tags: ["services"] } });
  return (services || []).map((s: any) => ({ slug: s.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getClient().fetch(serviceBySlugQuery, { slug }, { next: { tags: ["services"] } });
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.excerpt,
    canonicalPath: `/hizmetler/${slug}`,
    pageSeo: service.seo,
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  insaat:   "İnşaat",
  mimarlik: "Mimarlık",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;
  const [service, layoutData] = await Promise.all([
    getClient(isDraft).fetch(serviceBySlugQuery, { slug }, { next: { tags: ["services"] } }),
    client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } }),
  ]);

  if (!service) notFound();

  const imageUrl = service.mainImage?.asset?.url
    ? urlForImage(service.mainImage)?.width(900).height(1100).quality(80).url()
    : null;

  const relatedProjects = service.relatedProjects || [];

  return (
    <>
      <JsonLd data={singleServiceJsonLd(layoutData?.settings, service)} />

      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow={CATEGORY_LABELS[service.serviceCategory] || "Hizmet"}
        title={service.title}
        subtitle={service.excerpt}
        decorativeText={service.title?.split(" ")[0]}
      />

      {/* ── Ana İçerik ───────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-20 md:py-28">

          {/* Geri bağlantısı */}
          <Link
            href="/hizmetler"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 mb-12"
          >
            <RiArrowLeftLine size={14} className="transition-transform group-hover:-translate-x-1" />
            Tüm Hizmetler
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Görsel — sol */}
            {imageUrl && (
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)] corner-accent">
                  <Image
                    src={imageUrl}
                    alt={service.mainImage?.alt || service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* İçerik — sağ */}
            <div className={imageUrl ? "lg:col-span-7" : "lg:col-span-12"}>
              {/* Body */}
              {service.body && (
                <div className="prose prose-neutral max-w-none text-[var(--color-gray)] leading-relaxed mb-10">
                  <RichText value={service.body} />
                </div>
              )}

              {/* Özellikler */}
              {service.features?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
                  <h3 className="font-heading text-[var(--color-black)] text-2xl mb-6">Neler Sunuyoruz</h3>
                  <ul className="space-y-3">
                    {service.features.map((f: any, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 w-5 h-5 flex items-center justify-center bg-[var(--color-accent-light)] rounded-full shrink-0">
                          <RiCheckLine size={11} className="text-[var(--color-accent-dark)]" />
                        </span>
                        <span className="text-[var(--color-gray)] text-sm leading-relaxed">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mb-4">
                  Bu hizmet hakkında bilgi almak ister misiniz?
                </p>
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-3 bg-[var(--color-black)] text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--color-accent-dark)] transition-colors duration-300"
                >
                  Teklif Alın
                  <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── İlgili Projeler ───────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <section className="bg-[#F4F4F2]">
          <div className="site-container py-20 md:py-24">
            <div className="flex items-end justify-between mb-12 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="accent-line" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Portfolio</span>
                </div>
                <h2 className="font-heading text-[var(--color-black)]">İlgili Projeler</h2>
              </div>
              <Link
                href="/projeler"
                className="group hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] border-b border-[var(--color-border)] pb-1 hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 shrink-0"
              >
                Tüm Projeler
                <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProjects.map((project: any) => {
                const pImgUrl = project.mainImage?.asset?.url
                  ? urlForImage(project.mainImage)?.width(600).height(700).quality(80).url()
                  : null;
                return (
                  <Link
                    key={project.slug?.current}
                    href={`/projeler/${project.slug?.current}`}
                    className="group relative overflow-hidden block"
                  >
                    <div className="relative" style={{ aspectRatio: "3/4" }}>
                      {pImgUrl ? (
                        <Image
                          src={pImgUrl}
                          alt={project.mainImage?.alt || project.title}
                          fill
                          className="object-cover transition-transform duration-600 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--color-surface)]" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                        <p className="font-heading text-white text-lg">{project.title}</p>
                        {project.year && (
                          <p className="text-[10px] text-white/50 mt-1">{project.year}</p>
                        )}
                      </div>
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
