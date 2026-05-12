"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeroProps {
  /** Küçük üst etiket, ör: "Hakkımızda" */
  eyebrow?: string;
  /** Büyük Cormorant başlık */
  title: string;
  /** Bir-iki cümle açıklama */
  subtitle?: string;
  /** Arka planda çok büyük dekoratif metin (blueprint estetiği) */
  decorativeText?: string;
  /** Breadcrumb linkleri — Ana Sayfa otomatik eklenir */
  breadcrumbItems?: BreadcrumbItem[];
}

export function PageHero({ eyebrow, title, subtitle, decorativeText, breadcrumbItems }: PageHeroProps) {
  return (
    <section
      className="relative bg-[var(--color-black)] overflow-hidden"
      style={{ minHeight: "clamp(240px, 36vh, 400px)" }}
    >
      {/* ── Diagonal texture ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 28px,
            rgba(255,255,255,0.022) 28px,
            rgba(255,255,255,0.022) 29px
          )`,
        }}
      />

      {/* ── Dekoratif büyük metin (arka plan) ───────────── */}
      {decorativeText && (
        <div
          className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-heading italic text-white leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(6rem, 16vw, 14rem)", opacity: 0.04 }}
          >
            {decorativeText}
          </span>
        </div>
      )}

      {/* ── Left accent bar ──────────────────────────────── */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-accent)] opacity-30" />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="site-container relative z-10 flex flex-col justify-center py-16 md:py-20"
        style={{ minHeight: "inherit" }}
      >
        {/* Breadcrumb */}
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-[0.15em] transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              {breadcrumbItems.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-white/20 text-[10px]">/</span>
                  {crumb.href && !crumb.active ? (
                    <Link href={crumb.href} className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-[0.15em] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/55 text-[10px] uppercase tracking-[0.15em]">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="accent-line" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">
              {eyebrow}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-heading text-white mb-4"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.0 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-body text-white/55 max-w-xl leading-relaxed"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ── Bottom accent line ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--color-accent)]/40 via-[var(--color-accent)]/10 to-transparent" />
    </section>
  );
}
