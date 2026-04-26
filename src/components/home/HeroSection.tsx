"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RiArrowDownLine } from "react-icons/ri";
import { urlForImage } from "@/sanity/lib/image";

interface HeroSectionProps {
  data: {
    heroVideoUrl?: string;
    heroPosterImage?: any;
    heroCtaLabel?: string;
    heroCtaLink?: string;
  } | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const ctaLabel = data?.heroCtaLabel || "Projelerimizi İnceleyin";
  const ctaLink  = data?.heroCtaLink  || "/projeler";

  // Poster URL — slightly lower quality for faster initial paint
  const posterUrl = data?.heroPosterImage?.asset?.url
    ? urlForImage(data.heroPosterImage)?.width(1600).quality(70).url() ?? undefined
    : undefined;

  // Ensure muted autoplay on all browsers (especially iOS Safari)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {/* autoplay blocked — poster stays visible */});
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Background: poster only (no video URL) ─────────────── */}
      {posterUrl && !data?.heroVideoUrl && (
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={85}
          />
        </div>
      )}

      {/* ── Video element ──────────────────────────────────────── */}
      {data?.heroVideoUrl && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          /* poster attribute intentionally omitted — 
             the <Image> overlay below handles it with responsive sizing,
             avoiding a redundant full-size download */
          // @ts-expect-error — fetchPriority is valid HTML but not yet in React types
          fetchPriority="high"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={data.heroVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* ── Poster overlay while video buffers ─────────────────── */}
      {data?.heroVideoUrl && posterUrl && !videoReady && (
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
        </div>
      )}

      {/* ── Overlay gradient ──────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/65 z-10" />

      {/* ── Center content ────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-10"
        >
          <Image
            src="/images/logo/tuyluoglu-logo.png"
            alt="Tüylüoğlu İnşaat"
            width={320}
            height={96}
            className="w-72 md:w-[26rem] h-auto object-contain"
            priority
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href={ctaLink}
            className="inline-block px-10 py-3.5 border border-white text-white text-[11px] tracking-[0.2em] uppercase font-body transition-all duration-300 hover:bg-white hover:text-[var(--color-black)]"
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Kaydır</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <RiArrowDownLine size={16} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
