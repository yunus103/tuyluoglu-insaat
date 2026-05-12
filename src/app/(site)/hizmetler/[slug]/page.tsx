import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { serviceBySlugQuery, serviceListQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd, singleServiceJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { RiArrowRightLine } from "react-icons/ri";

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

  const faqItems: { question: string; answer: string }[] = service.faq || [];
  const otherServices = (service.allServices || []).filter(
    (s: any) => s.slug?.current !== slug
  );

  const imageUrl = service.mainImage?.asset?.url
    ? urlForImage(service.mainImage)?.width(1200).height(675).quality(80).url()
    : null;

  const siteBase = getSiteUrl();

  return (
    <>
      {/* ── JSON-LD ─────────────────────────────────────────────────── */}
      <JsonLd data={singleServiceJsonLd(layoutData?.settings, service)} />
      {faqItems.length > 0 && <JsonLd data={faqPageJsonLd(faqItems)} />}
      <JsonLd
        data={breadcrumbJsonLd(siteBase, [
          { name: "Hizmetler",   href: "/hizmetler" },
          { name: service.title, href: `/hizmetler/${slug}` },
        ])}
      />

      {/* ── PageHero ─────────────────────────────────────────────────── */}
      <PageHero
        eyebrow={CATEGORY_LABELS[service.serviceCategory] || "Hizmet"}
        title={service.title}
        subtitle={service.excerpt}
        decorativeText={service.title?.split(" ")[0]}
        breadcrumbItems={[
          { label: "Hizmetler", href: "/hizmetler" },
          { label: service.title, active: true },
        ]}
      />

      {/* ── Ana İçerik ───────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

            {/* ── Makale ─────────────────────────────────────────── */}
            <article className="lg:col-span-8 min-w-0">

              {/* Öne çıkan görsel */}
              {imageUrl && (
                <div className="relative w-full overflow-hidden mb-10 md:mb-14 bg-[var(--color-surface)]"
                  style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={imageUrl}
                    alt={service.mainImage?.alt || service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              {/* İçerik (RichText) */}
              {service.body && (
                <div className="prose prose-neutral max-w-none text-[var(--color-gray)] leading-relaxed mb-12">
                  <RichText value={service.body} />
                </div>
              )}

              {/* SSS */}
              {faqItems.length > 0 && (
                <div className="mt-12 pt-12 border-t border-[var(--color-border)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="accent-line" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">SSS</span>
                  </div>
                  <h2 className="font-heading text-[var(--color-black)] text-2xl md:text-3xl mb-8">
                    Sıkça Sorulan Sorular
                  </h2>
                  <FAQ items={faqItems} />
                </div>
              )}

              {/* CTA */}
              <div className="mt-12 pt-10 border-t border-[var(--color-border)]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mb-3">
                  Bu hizmet hakkında bilgi almak ister misiniz?
                </p>
                <h3 className="font-heading text-[var(--color-black)] text-2xl md:text-3xl mb-6 leading-tight">
                  Projenizi Birlikte Değerlendirelim
                </h3>
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-3 bg-[var(--color-black)] text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--color-accent-dark)] transition-colors duration-300"
                >
                  Teklif Alın
                  <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>

            {/* ── Sidebar ────────────────────────────────────────── */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="bg-[var(--color-surface)] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="accent-line" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                    Diğer Hizmetlerimiz
                  </span>
                </div>

                {otherServices.length > 0 ? (
                  <ul className="divide-y divide-[var(--color-border)]">
                    {otherServices.map((s: any) => (
                      <li key={s.slug?.current}>
                        <Link
                          href={`/hizmetler/${s.slug?.current}`}
                          className="group flex items-center justify-between py-3.5 hover:text-[var(--color-accent-dark)] transition-colors duration-200"
                        >
                          <span className="font-heading text-[var(--color-black)] text-base group-hover:text-[var(--color-accent-dark)] transition-colors duration-200 leading-snug">
                            {s.title}
                          </span>
                          <RiArrowRightLine
                            size={14}
                            className="text-[var(--color-muted)] shrink-0 ml-3 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all duration-200"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--color-muted)]">Başka hizmet bulunamadı.</p>
                )}

                {/* Sidebar CTA */}
                <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
                    Hızlı İletişim
                  </p>
                  <Link
                    href="/iletisim"
                    className="group flex items-center justify-between w-full border border-[var(--color-border)] px-5 py-3.5 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300"
                  >
                    İletişime Geç
                    <RiArrowRightLine size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}
