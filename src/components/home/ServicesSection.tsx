"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { urlForImage } from "@/sanity/lib/image";

const FALLBACK_INSAAT = [
  { _id: "f1", title: "Kentsel Dönüşüm", excerpt: "Riskli yapıların yıkım ve yeniden inşa süreçlerini uçtan uca yönetiyoruz.", serviceCategory: "insaat", slug: { current: "kentsel-donusum" }, mainImage: null },
  { _id: "f2", title: "Yerinde Dönüşüm", excerpt: "Mevcut yapıların güçlendirme ve yenileme projeleri ile değerini artırıyoruz.", serviceCategory: "insaat", slug: { current: "yerinde-donusum" }, mainImage: null },
  { _id: "f3", title: "Taahhüt", excerpt: "Konut, ticari ve kamu projelerinde anahtar teslim inşaat hizmeti sunuyoruz.", serviceCategory: "insaat", slug: { current: "taahhut" }, mainImage: null },
];

const FALLBACK_MIMARLIK = [
  { _id: "f4", title: "Projelendirme", excerpt: "Mimari çizimden statik hesaba kadar tüm proje sürecini yürütüyoruz.", serviceCategory: "mimarlik", slug: { current: "projelendirme" }, mainImage: null },
  { _id: "f5", title: "Uygulama Mimarlığı", excerpt: "Sahada proje uygulamasının her aşamasını titizlikle kontrol ediyoruz.", serviceCategory: "mimarlik", slug: { current: "uygulama-mimarligi" }, mainImage: null },
  { _id: "f6", title: "Konsept Tasarım", excerpt: "Yaşam alanlarınız için özgün ve işlevsel mimari konseptler geliştiriyoruz.", serviceCategory: "mimarlik", slug: { current: "konsept-tasarim" }, mainImage: null },
  { _id: "f7", title: "Mimari Danışmanlık", excerpt: "İnşaat ve mimarlık süreçlerinde profesyonel danışmanlık desteği veriyoruz.", serviceCategory: "mimarlik", slug: { current: "mimari-danismanlik" }, mainImage: null },
];

const TABS = [
  { key: "insaat", label: "İnşaat" },
  { key: "mimarlik", label: "Mimarlık" },
] as const;

interface ServicesSectionProps {
  data: {
    servicesTitle?: string;
    featuredServices?: any[];
    insaatTabImage?: any;
    mimarlikTabImage?: any;
  } | null;
}

export function ServicesSection({ data }: ServicesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeTab, setActiveTab] = useState<"insaat" | "mimarlik">("insaat");

  const title = data?.servicesTitle || "Hizmetlerimiz";
  const allServices = data?.featuredServices?.length
    ? data.featuredServices
    : [...FALLBACK_INSAAT, ...FALLBACK_MIMARLIK];

  const grouped = useMemo(() => ({
    insaat: allServices.filter((s: any) => s.serviceCategory === "insaat"),
    mimarlik: allServices.filter((s: any) => s.serviceCategory === "mimarlik"),
  }), [allServices]);

  const activeServices = (grouped[activeTab].length ? grouped[activeTab] : (activeTab === "insaat" ? FALLBACK_INSAAT : FALLBACK_MIMARLIK));

  // Resolve representative image: tab-specific first, then fallback to first service image
  const representativeImg = useMemo(() => {
    const tabImg = activeTab === "insaat" ? data?.insaatTabImage : data?.mimarlikTabImage;
    if (tabImg?.asset?.url) {
      return urlForImage(tabImg)?.width(900).height(1100).quality(80).url() ?? null;
    }
    // Fallback: first service in active tab that has an image
    const withImg = activeServices.find((s: any) => s.mainImage?.asset?.url);
    if (!withImg) return null;
    return urlForImage(withImg.mainImage)?.width(900).height(1100).quality(80).url() ?? null;
  }, [activeTab, activeServices, data?.insaatTabImage, data?.mimarlikTabImage]);

  return (
    <section className="bg-[#0C0C0C] relative overflow-hidden">
      <div ref={ref} className="site-container py-24 md:py-32 lg:py-40">

        {/* ── Section header + tabs ─────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="h-px w-10 bg-[var(--color-accent)]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)]">Ne Yapıyoruz</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-white"
            >
              {title}
            </motion.h2>
          </div>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-0 border border-white/15 self-start"
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-7 py-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-white text-[var(--color-black)]"
                    : "bg-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Split: image + service list ────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0"
          >
            {/* Left: image panel */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full min-h-[400px] lg:min-h-[500px] overflow-hidden bg-white/5">
                {representativeImg ? (
                  <Image
                    src={representativeImg}
                    alt={activeTab === "insaat" ? "İnşaat hizmetleri" : "Mimarlık hizmetleri"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-white/8 select-none" style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}>
                      {activeTab === "insaat" ? "İnşaat" : "Mimarlık"}
                    </span>
                  </div>
                )}
                {/* Bottom gradient + category label */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0C0C0C] to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {activeTab === "insaat" ? "İnşaat Hizmetleri" : "Mimarlık Hizmetleri"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: service list */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
              {activeServices.map((service: any, i: number) => (
                <Link
                  key={service._id}
                  href={`/hizmetler#${service.slug?.current ?? ""}`}
                  className="group block border-b border-white/[0.07] py-7 first:border-t first:border-white/[0.07] transition-all duration-300 hover:pl-2"
                >
                  <div className="flex items-start gap-5">
                    {/* Number */}
                    <span className="text-[12px] font-body tabular-nums text-white/15 group-hover:text-[var(--color-accent)] transition-colors duration-300 pt-1 shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-heading text-white/80 group-hover:text-white transition-colors duration-300 mb-2 !leading-tight" style={{ fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)" }}>
                        {service.title}
                      </h3>

                      {/* Excerpt */}
                      {service.excerpt && (
                        <p className="text-sm text-white/30 group-hover:text-white/45 leading-relaxed transition-colors duration-300 max-w-md">
                          {service.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <RiArrowRightLine
                      size={16}
                      className="text-white/10 group-hover:text-[var(--color-accent)] transition-all duration-300 group-hover:translate-x-1 mt-2 shrink-0"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 md:mt-16 flex justify-center lg:justify-end"
        >
          <Link
            href="/hizmetler"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-white text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[var(--color-black)] transition-all duration-400"
          >
            Tüm Hizmetlerimizi İnceleyin
            <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
