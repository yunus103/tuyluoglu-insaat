import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery, blogPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { PageHero } from "@/components/ui/PageHero";
import { BlogFilterClient } from "@/components/blog/BlogFilterClient";
import { formatDate } from "@/lib/utils";
import { RiArrowRightLine } from "react-icons/ri";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(blogPageQuery, {}, { next: { tags: ["blogPage"] } });
  return buildMetadata({
    title: pageData?.pageTitle || "Blog",
    description: pageData?.pageSubtitle,
    canonicalPath: "/blog",
    pageSeo: pageData?.seo,
  });
}

export default async function BlogListPage() {
  const [posts, categories, pageData] = await Promise.all([
    client.fetch(blogListQuery, {},     { next: { tags: ["blog"] } }),
    client.fetch(blogCategoriesQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch(blogPageQuery, {},     { next: { tags: ["blogPage"] } }),
  ]);

  const allPosts = posts || [];

  // 1. Öne çıkan yazıyı belirle (CMS'ten seçilen varsa onu kullan, yoksa fallback olarak en sonuncuyu al)
  let featured = null;
  if (pageData?.featuredPost?.slug?.current) {
    featured = pageData.featuredPost;
  } else {
    featured = allPosts[0] || null;
  }

  // 2. Kalan yazılardan öne çıkanı filtrele (aynı yazı listede iki kere çıkmasın)
  const rest = featured
    ? allPosts.filter((post: any) => post.slug?.current !== featured.slug?.current)
    : allPosts;

  return (
    <>
      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Blog"
        title={pageData?.heroTitle || "Blog"}
        subtitle={pageData?.heroSubtitle || "Sektörel haberler, proje güncellemeleri ve inşaat dünyasından yazılar."}
        decorativeText="Blog"
      />

      <section className="bg-white">
        <div className="site-container py-16 md:py-20">

          {/* ── Öne Çıkan Yazı ──────────────────────────────────── */}
          {featured && (
            <div className="mb-14 md:mb-20">
              <div className="flex items-center gap-3 mb-8">
                <span className="accent-line" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Öne Çıkan</span>
              </div>
              <FeaturedPostCard post={featured} />
            </div>
          )}

          {/* ── Filtre + Grid ────────────────────────────────────── */}
          {rest.length > 0 && (
            <Suspense fallback={<div className="h-40 animate-pulse bg-[var(--color-surface)] border border-[var(--color-border)]" />}>
              <BlogFilterClient posts={rest} categories={categories || []} />
            </Suspense>
          )}

          {allPosts.length === 0 && (
            <p className="text-center text-[var(--color-muted)] text-sm py-20">
              Henüz blog yazısı eklenmemiş.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function FeaturedPostCard({ post }: { post: any }) {
  const imgUrl = post.mainImage?.asset?.url
    ? urlForImage(post.mainImage)?.width(1200).height(600).quality(80).url()
    : null;

  return (
    <Link
      href={`/${post.slug?.current}`}
      className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300"
    >
      {/* Görsel */}
      <div className="relative overflow-hidden bg-[var(--color-surface)]" style={{ aspectRatio: "16/9" }}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover transition-transform duration-600 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading italic text-[var(--color-muted)] opacity-20 text-6xl select-none">
              {post.title?.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
        <div className="flex items-center gap-3 mb-5">
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

        <h2 className="font-heading text-[var(--color-black)] mb-4 group-hover:text-[var(--color-accent-dark)] transition-colors duration-300"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-6 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-dark)] group-hover:gap-3 transition-all duration-300">
          <span>Devamını Oku</span>
          <RiArrowRightLine size={13} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
