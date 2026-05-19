import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { blogPostBySlugQuery, blogListQuery, blogRelatedPostsQuery, sidebarProjectsQuery, sidebarServicesQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { JsonLd, articleJsonLd } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await client.fetch(blogListQuery, {}, { next: { tags: ["blog"] } });
  return (posts || []).map((post: any) => ({ slug: post.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getClient().fetch(blogPostBySlugQuery, { slug }, { next: { tags: ["blog"] } });
  if (!post) return {};

  const baseSeo = await buildMetadata({
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/${slug}`,
    pageSeo: post.seo,
  });

  if (post.seoTags?.length) {
    baseSeo.keywords = post.seoTags;
  }

  return baseSeo;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;

  // 1. Blog detay verisi ile birlikte son projeleri ve hizmetleri paralel olarak tek seferde çekelim (Performans için)
  const [post, latestProjects, rawServices] = await Promise.all([
    getClient(isDraft).fetch(blogPostBySlugQuery, { slug }, { next: { tags: ["blog"] } }),
    client.fetch(sidebarProjectsQuery, {}, { next: { tags: ["projects"] } }),
    client.fetch(sidebarServicesQuery, {}, { next: { tags: ["services"] } }),
  ]);

  if (!post) notFound();

  // 2. Hizmetleri "Önce İnşaat, Sonra Mimarlık" olarak sırala ve ilk 5 tanesini al
  const sortedServices = [...(rawServices || [])]
    .sort((a: any, b: any) => {
      const catA = a.serviceCategory || "";
      const catB = b.serviceCategory || "";
      if (catA === "insaat" && catB !== "insaat") return -1;
      if (catA !== "insaat" && catB === "insaat") return 1;
      return 0;
    })
    .slice(0, 5);

  let relatedPosts: any[] = [];
  if (post.category?._id) {
    relatedPosts = await getClient(isDraft).fetch(
      blogRelatedPostsQuery,
      { categoryId: post.category._id, currentPostId: post._id },
      { next: { tags: ["blog"] } }
    );
  }

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />

      {/* ── Hero görseli ──────────────────────────────────────────── */}
      {post.mainImage && (
        <div className="relative h-[45vh] md:h-[60vh] bg-[var(--color-black)] overflow-hidden">
          <SanityImage
            image={post.mainImage}
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 site-container pb-10 md:pb-14">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Link
                  href={`/blog?category=${post.category.slug?.current}`}
                  className="text-[9px] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                >
                  {post.category.title}
                </Link>
              )}
              {post.publishedAt && (
                <time className="text-[9px] uppercase tracking-[0.18em] text-white/50">
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>
            <h1
              className="font-heading text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <article className="bg-white">
        <div className="site-container py-16 md:py-20">
          {/* Başlık — sadece hero görseli yoksa göster */}
          {!post.mainImage && (
            <>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] hover:text-[var(--color-accent-dark)] transition-colors mb-10"
              >
                ← Blog
              </Link>
              <div className="flex items-center gap-3 mb-4">
                {post.category && (
                  <span className="text-[9px] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent-dark)]">
                    {post.category.title}
                  </span>
                )}
                {post.publishedAt && (
                  <time className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {formatDate(post.publishedAt)}
                  </time>
                )}
              </div>
              <h1
                className="font-heading text-[var(--color-black)] mb-8"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                {post.title}
              </h1>
            </>
          )}

          {/* ── Body içerik ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-6">
            <div className="lg:col-span-8">
              <div className="prose prose-neutral max-w-none text-[var(--color-gray)] leading-relaxed">
                <RichText value={post.body} />
              </div>

              {post.seoTags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mb-3">Etiketler</p>
                  <div className="flex flex-wrap gap-2">
                    {post.seoTags.map((tag: string) => (
                      <span key={tag} className="text-xs px-3 py-1 border border-[var(--color-border)] text-[var(--color-gray)]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sağ Kolon: Sidebar ─────────────────────────────── */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 w-full">
              {/* 1. Sade ve Eylem Odaklı CTA Alanı */}
              <div className="bg-[var(--color-black)] text-white p-6 md:p-8 relative overflow-hidden group border border-white/10">
                <div className="absolute right-[-20px] bottom-[-20px] font-heading italic text-white/5 opacity-5 text-9xl pointer-events-none select-none">
                  T
                </div>
                <h4 className="font-heading text-lg md:text-xl text-white mb-2 relative z-10 leading-snug">
                  Projelerinizi Konuşalım
                </h4>
                <p className="text-xs text-white/70 mb-5 leading-relaxed relative z-10">
                  Uzman ekibimizle hemen iletişime geçin, fikirlerinizi hayata geçirelim.
                </p>
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)] hover:text-white border-b border-[var(--color-accent)] hover:border-white pb-1 transition-all duration-300 relative z-10"
                >
                  Hemen İletişime Geç
                  <RiArrowRightLine size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* 2. Son Projelerimiz Listesi (Ultra Optimize Edilmiş Görsel) */}
              {latestProjects?.length > 0 && (
                <div className="bg-[var(--color-surface)] p-6 md:p-8 border border-[var(--color-border)]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="accent-line" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                      Son Projelerimiz
                    </span>
                  </div>
                  <div className="space-y-5">
                    {latestProjects.map((proj: any) => (
                      <Link
                        key={proj._id}
                        href={`/projeler/${proj.slug?.current}`}
                        className="group flex gap-4 items-center"
                      >
                        {/* Çok küçük, optimize edilmiş görsel (80x60px) */}
                        <div className="relative w-16 h-12 shrink-0 bg-[var(--color-border)] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                          {proj.mainImage ? (
                            <SanityImage
                              image={proj.mainImage}
                              width={80}
                              height={60}
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--color-muted)] font-heading bg-[var(--color-surface)]">
                              TİY
                            </div>
                          )}
                        </div>
                        {/* Bilgiler */}
                        <div className="min-w-0">
                          <h5 className="font-heading text-sm text-[var(--color-black)] group-hover:text-[var(--color-accent-dark)] transition-colors leading-snug line-clamp-1">
                            {proj.title}
                          </h5>
                          {proj.location && (
                            <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--color-muted)] block mt-0.5">
                              {proj.location}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Hizmetlerimiz Listesi (Önce İnşaat, Sonra Mimari) */}
              {sortedServices?.length > 0 && (
                <div className="bg-[var(--color-surface)] p-6 md:p-8 border border-[var(--color-border)]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="accent-line" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                      Hizmetlerimiz
                    </span>
                  </div>
                  <ul className="divide-y divide-[var(--color-border)]">
                    {sortedServices.map((srv: any) => (
                      <li key={srv._id}>
                        <Link
                          href={`/hizmetler/${srv.slug?.current}`}
                          className="group flex items-center justify-between py-3 hover:text-[var(--color-accent-dark)] transition-colors duration-200"
                        >
                          <span className="font-heading text-[var(--color-black)] text-sm group-hover:text-[var(--color-accent-dark)] transition-colors duration-200 leading-snug">
                            {srv.title}
                          </span>
                          <RiArrowRightLine
                            size={12}
                            className="text-[var(--color-muted)] shrink-0 ml-3 group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all duration-200"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      {/* ── İlgili Yazılar ────────────────────────────────────────── */}
      {relatedPosts?.length > 0 && (
        <section className="bg-[#F4F4F2]">
          <div className="site-container py-16 md:py-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="accent-line" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">İlgili Yazılar</span>
            </div>
            <h2 className="font-heading text-[var(--color-black)] mb-10">Bunlar da İlginizi Çekebilir</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost: any) => (
                <Link
                  key={rPost.slug.current}
                  href={`/${rPost.slug.current}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-[var(--color-surface)] mb-4" style={{ aspectRatio: "3/2" }}>
                    <SanityImage
                      image={rPost.mainImage}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-600 group-hover:scale-105"
                    />
                  </div>
                  {rPost.publishedAt && (
                    <time className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] block mb-2">
                      {formatDate(rPost.publishedAt)}
                    </time>
                  )}
                  <h3
                    className="font-heading text-[var(--color-black)] group-hover:text-[var(--color-accent-dark)] transition-colors line-clamp-2 mb-3"
                    style={{ fontSize: "clamp(1.2rem, 2vw, 1.4rem)" }}
                  >
                    {rPost.title}
                  </h3>
                  <div className="w-6 h-px bg-[var(--color-accent)] group-hover:w-12 transition-all duration-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
