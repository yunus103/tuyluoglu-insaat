import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { servicesPageQuery, serviceListQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, serviceListJsonLd } from "@/components/seo/JsonLd";
import { RiArrowRightLine } from "react-icons/ri";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(servicesPageQuery, {}, { next: { tags: ["servicesPage"] } });
  return buildMetadata({
    title: data?.pageTitle || "Hizmetlerimiz",
    description: data?.pageSubtitle,
    canonicalPath: "/hizmetler",
    pageSeo: data?.seo,
  });
}

export default async function ServicesListPage() {
  const [pageData, services, layoutData] = await Promise.all([
    client.fetch(servicesPageQuery, {}, { next: { tags: ["servicesPage"] } }),
    client.fetch(serviceListQuery, {}, { next: { tags: ["services"] } }),
    client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } }),
  ]);

  const insaatServices   = (services || []).filter((s: any) => s.serviceCategory === "insaat");
  const mimarlikServices = (services || []).filter((s: any) => s.serviceCategory === "mimarlik");

  return (
    <>
      <JsonLd data={serviceListJsonLd(layoutData?.settings, services || [])} />

      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Hizmetler"
        title={pageData?.heroTitle || "Hizmetlerimiz"}
        subtitle={pageData?.heroSubtitle || "İnşaat ve mimarlık alanında kapsamlı çözümler sunuyoruz."}
        decorativeText="Hizmet"
      />

      {/* ── İnşaat Hizmetleri ─────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-20 md:py-28">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="accent-line" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Yapım</span>
              </div>
              <h2 className="font-heading text-[var(--color-black)]">İnşaat Hizmetleri</h2>
            </div>
          </div>

          {insaatServices.length === 0 ? (
            <p className="text-[var(--color-muted)] text-sm py-12">
              Henüz inşaat hizmeti eklenmemiş.
            </p>
          ) : (
            <ServiceGrid services={insaatServices} />
          )}
        </div>
      </section>

      {/* ── Mimarlık Hizmetleri ───────────────────────────────────── */}
      <section className="bg-[#F4F4F2] texture-blueprint">
        <div className="site-container py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="accent-line" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Tasarım</span>
              </div>
              <h2 className="font-heading text-[var(--color-black)]">Mimarlık Hizmetleri</h2>
            </div>
          </div>

          {mimarlikServices.length === 0 ? (
            <p className="text-[var(--color-muted)] text-sm py-12">
              Henüz mimarlık hizmeti eklenmemiş.
            </p>
          ) : (
            <ServiceGrid services={mimarlikServices} />
          )}
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-black)]">
        <div className="site-container py-14 md:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Birlikte çalışalım</p>
            <h3 className="font-heading text-white text-3xl md:text-4xl">
              {pageData?.ctaLabel ? pageData.ctaLabel : "Projeniz İçin Teklif Alın"}
            </h3>
          </div>
          <Link
            href={pageData?.ctaLink || "/iletisim"}
            className="shrink-0 inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[var(--color-black)] transition-all duration-300"
          >
            İletişime Geç
            <RiArrowRightLine size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ServiceGrid({ services }: { services: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {services.map((service: any) => {
        const imgUrl = service.mainImage?.asset?.url
          ? urlForImage(service.mainImage)?.width(700).height(530).quality(80).url()
          : null;
        return (
          <Link
            key={service.slug?.current}
            href={`/hizmetler/${service.slug?.current}`}
            className="group relative overflow-hidden bg-[var(--color-surface)] block"
          >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={service.mainImage?.alt || service.title}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--color-surface)] flex items-center justify-center">
                  <span className="font-heading italic text-[var(--color-muted)] opacity-30 text-5xl select-none">
                    {service.title?.charAt(0)}
                  </span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[var(--color-accent-darker)]/0 group-hover:bg-[var(--color-accent-darker)]/60 transition-colors duration-400" />
              {/* Arrow on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 border border-white/50 flex items-center justify-center">
                  <RiArrowRightLine size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* Title + Excerpt */}
            <div className="p-5">
              <h3 className="font-heading text-[var(--color-black)] text-xl mb-2 group-hover:text-[var(--color-accent-dark)] transition-colors duration-300">
                {service.title}
              </h3>
              {service.excerpt && (
                <p className="text-sm text-[var(--color-gray)] leading-relaxed line-clamp-2">
                  {service.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <span className="w-5 h-px bg-[var(--color-accent)]" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent-dark)]">
                  Detaylar
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
