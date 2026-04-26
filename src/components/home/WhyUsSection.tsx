"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  RiTimeLine,
  RiAwardLine,
  RiShieldCheckLine,
  RiCompass3Line,
} from "react-icons/ri";

interface WhyUsSectionProps {
  data: {
    whyUsTitle?: string;
    whyUsItems?: { title: string; description: string }[];
  } | null;
}

const FALLBACK_ITEMS = [
  { title: "Deneyim", description: "1985'ten bu yana inşaat ve mimarlık sektöründe kesintisiz faaliyet gösteriyoruz." },
  { title: "Kalite", description: "Her projede en yüksek kalite standartlarını ve malzeme seçimini uyguluyoruz." },
  { title: "Güven", description: "Zamanında teslimat ve şeffaf iletişim politikamızla müşteri memnuniyetini ön planda tutuyoruz." },
  { title: "Uzmanlık", description: "İnşaat ve mimarlık alanında uzman kadromuzla projelerin her aşamasını titizlikle yönetiyoruz." },
];

const ICON_SET = [RiTimeLine, RiAwardLine, RiShieldCheckLine, RiCompass3Line];

export function WhyUsSection({ data }: WhyUsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const title = data?.whyUsTitle || "Neden Tüylüoğlu İnşaat?";
  const items = data?.whyUsItems?.length ? data.whyUsItems : FALLBACK_ITEMS;

  return (
    <section className="bg-[#F4F4F2] texture-blueprint relative overflow-hidden">
      <div ref={ref} className="site-container py-24 md:py-32 lg:py-36">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-[var(--color-accent)]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">Farkımız</span>
            <span className="h-px w-10 bg-[var(--color-accent)]" />
          </div>
          <h2 className="font-heading text-[var(--color-black)]">{title}</h2>
        </motion.div>

        {/* Items — 2x2 grid with icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {items.map((item, i) => {
            const Icon = ICON_SET[i % ICON_SET.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.12 * i }}
                className="bg-white p-8 md:p-10 group hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 transition-all duration-400 relative"
              >
                {/* Top row: icon + number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-accent-light)] rounded-lg">
                    <Icon size={22} className="text-[var(--color-accent-dark)]" />
                  </div>
                  <span
                    className="font-heading text-[var(--color-accent)] select-none leading-none"
                    style={{ fontSize: "3.5rem", opacity: 0.1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-[var(--color-black)] text-xl md:text-2xl mb-3 !leading-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Accent bottom line — extends on hover */}
                <div className="w-8 h-0.5 bg-[var(--color-accent)] group-hover:w-16 transition-all duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Angled SVG Divider — sharp architectural cut into dark zone ── */}
      <div className="relative -mb-px">
        <svg
          className="block w-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ height: "clamp(50px, 7vw, 100px)" }}
        >
          <polygon points="0,100 1440,0 1440,100" fill="#0A0A0A" />
        </svg>
      </div>
    </section>
  );
}
