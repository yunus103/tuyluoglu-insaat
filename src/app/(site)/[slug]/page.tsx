import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { blogPostBySlugQuery, blogListQuery, blogRelatedPostsQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { JsonLd, articleJsonLd } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

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
  const post = await getClient(isDraft).fetch(
    blogPostBySlugQuery,
    { slug },
    { next: { tags: ["blog"] } }
  );

  if (!post) notFound();

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

            {/* Sağ kolon — sidebar için boşluk */}
            <div className="hidden lg:block lg:col-span-4" />
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
