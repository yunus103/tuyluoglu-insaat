"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

export function WhyUsSection({ data }: WhyUsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const title = data?.whyUsTitle || "Neden Tüylüoğlu İnşaat?";
  const items = data?.whyUsItems?.length ? data.whyUsItems : FALLBACK_ITEMS;

  return (
    <section className="bg-[#F4F4F2]">
      <div ref={ref} className="site-container py-24 md:py-32">

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

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)]">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="bg-white px-7 py-10 md:py-12 group"
            >
              {/* Accent top line */}
              <div className="w-8 h-0.5 bg-[var(--color-accent)] mb-7 group-hover:w-12 transition-all duration-400" />

              {/* Number */}
              <span className="text-[11px] font-body text-[var(--color-muted)] block mb-3">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Title */}
              <h3 className="font-heading text-[var(--color-black)] text-xl mb-3 !leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--color-gray)] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
