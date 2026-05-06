"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import { RiArrowRightLine } from "react-icons/ri";

interface BlogFilterClientProps {
  posts: any[];
  categories: { _id: string; title: string; slug: { current: string } }[];
}

export function BlogFilterClient({ posts, categories }: BlogFilterClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("tumu");

  const filtered = useMemo(() => {
    if (activeCategory === "tumu") return posts;
    return posts.filter((p) => p.category?.slug?.current === activeCategory);
  }, [posts, activeCategory]);

  return (
    <>
      {/* ── Kategori Filtreleri ──────────────────────────── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("tumu")}
            className={`px-5 py-2 text-[11px] uppercase tracking-[0.15em] border transition-colors duration-200 ${
              activeCategory === "tumu"
                ? "bg-[var(--color-black)] text-white border-[var(--color-black)]"
                : "border-[var(--color-border)] text-[var(--color-gray)] hover:border-[var(--color-black)] hover:text-[var(--color-black)]"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug.current)}
              className={`px-5 py-2 text-[11px] uppercase tracking-[0.15em] border transition-colors duration-200 ${
                activeCategory === cat.slug.current
                  ? "bg-[var(--color-black)] text-white border-[var(--color-black)]"
                  : "border-[var(--color-border)] text-[var(--color-gray)] hover:border-[var(--color-black)] hover:text-[var(--color-black)]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* ── Post Grid ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-center text-[var(--color-muted)] text-sm py-12">
          Bu kategoride yazı bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((post: any) => (
            <BlogPostCard key={post.slug?.current} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

function BlogPostCard({ post }: { post: any }) {
  const imgUrl = post.mainImage?.asset?.url
    ? urlForImage(post.mainImage)?.width(700).height(470).quality(80).url()
    : null;

  return (
    <Link
      href={`/${post.slug?.current}`}
      className="group block"
    >
      {/* Görsel */}
      <div className="relative overflow-hidden bg-[var(--color-surface)] mb-5" style={{ aspectRatio: "3/2" }}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover transition-transform duration-600 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading italic text-[var(--color-muted)] opacity-20 text-5xl select-none">
              {post.title?.charAt(0)}
            </span>
          </div>
        )}
        {/* Category badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="text-[9px] uppercase tracking-[0.18em] px-3 py-1 bg-[var(--color-black)]/80 text-white backdrop-blur-sm">
              {post.category.title}
            </span>
          </div>
        )}
      </div>

      {/* İçerik */}
      {post.publishedAt && (
        <time className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] block mb-2">
          {formatDate(post.publishedAt)}
        </time>
      )}
      <h3
        className="font-heading text-[var(--color-black)] mb-3 group-hover:text-[var(--color-accent-dark)] transition-colors duration-300 line-clamp-2"
        style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-[var(--color-gray)] leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent-dark)] group-hover:gap-3 transition-all duration-300">
        <span>Devamını Oku</span>
        <RiArrowRightLine size={12} />
      </div>

      {/* Bottom accent line */}
      <div className="mt-5 w-6 h-px bg-[var(--color-accent)] group-hover:w-14 transition-all duration-400" />
    </Link>
  );
}
