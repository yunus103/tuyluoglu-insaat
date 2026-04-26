"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { RiArrowRightLine } from "react-icons/ri";

interface CtaSectionProps {
  data: {
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaButtonLabel?: string;
  } | null;
}

export function CtaSection({ data }: CtaSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const title    = data?.ctaTitle       || "Güvenli Yapılar, Sağlam Gelecekler";
  const subtitle = data?.ctaSubtitle    || "Yılların Tecrübesiyle, Güvenli Yaşam Alanları İnşa Ediyoruz";
  const btnLabel = data?.ctaButtonLabel || "İletişime Geçin";

  return (
    <section className="relative bg-[var(--color-black)] overflow-hidden">
      {/* Subtle accent texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(107,151,196,0.08) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="site-container relative z-10 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="h-px w-10 bg-[var(--color-accent)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">İletişim</span>
            <span className="h-px w-10 bg-[var(--color-accent)]" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-white mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/45 text-base leading-relaxed mb-12 max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <Link
              href="/iletisim"
              className="group inline-flex items-center gap-3 px-10 py-4 border border-white/25 text-white text-[11px] uppercase tracking-[0.2em] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-400"
            >
              {btnLabel}
              <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
