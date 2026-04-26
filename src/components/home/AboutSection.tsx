"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { urlForImage } from "@/sanity/lib/image";

interface AboutSectionProps {
  data: {
    aboutTitle?: string;
    aboutText?: string;
    aboutImage?: any;
    stats?: { value: string; label: string }[];
  } | null;
}

const FALLBACK_STATS = [
  { value: "1985", label: "Kuruluş Yılı" },
  { value: "19+",  label: "Tamamlanan Proje" },
  { value: "38+",  label: "Yıllık Deneyim" },
  { value: "100%", label: "Zamanında Teslimat" },
];

export function AboutSection({ data }: AboutSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const title = data?.aboutTitle || "1985'ten Beri Güven";
  const text  = data?.aboutText  || "Tüylüoğlu İnşaat olarak 1985'ten bu yana güvenli ve kaliteli yapılar inşa ediyoruz. Konut, ticari ve kentsel dönüşüm projelerinde edindiğimiz derin tecrübe ile her projeyi titizlikle teslim ediyoruz.";
  const stats = data?.stats?.length ? data.stats : FALLBACK_STATS;
  const imageUrl = data?.aboutImage?.asset?.url
    ? urlForImage(data.aboutImage)?.width(1000).quality(80).url()
    : null;

  return (
    <section className="bg-white">
      <div ref={ref} className="site-container py-24 md:py-32 lg:py-40">

        {/* ── Main content grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">

          {/* Image — col 1-7 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[600px] overflow-hidden bg-[var(--color-surface)]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={data?.aboutImage?.alt || "Tüylüoğlu İnşaat hakkımızda"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted)] text-sm">
                  Görsel Eklenecek
                </div>
              )}
            </div>
          </motion.div>

          {/* Text — col 9-12, vertically centered */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="accent-line" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)]">Hakkımızda</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-heading text-[var(--color-black)] mb-6"
            >
              {title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative pl-5 border-l-2 border-[var(--color-accent)] mb-10"
            >
              <p className="text-[var(--color-gray)] leading-relaxed text-base">
                {text}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/hakkimizda"
                className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] border-b border-[var(--color-border)] pb-1 hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300"
              >
                Daha Fazla
                <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── Stats strip ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--color-border)]">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`px-6 py-7 md:py-8 text-center ${
                  i < stats.length - 1 ? "border-r border-[var(--color-border)]" : ""
                } ${i >= 2 ? "border-t md:border-t-0 border-[var(--color-border)]" : ""}`}
              >
                <div className="font-heading text-[var(--color-accent-dark)] mb-1" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
