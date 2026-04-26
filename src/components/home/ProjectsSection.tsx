"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { urlForImage } from "@/sanity/lib/image";

interface ProjectsSectionProps {
  data: {
    projectsTitle?: string;
    featuredProjects?: any[];
  } | null;
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const title    = data?.projectsTitle || "Projelerimiz";
  const projects = data?.featuredProjects || [];

  // Take first 3 for this layout
  const displayProjects = projects.slice(0, 3);

  return (
    <section className="bg-[var(--color-bg)]">
      <div ref={ref} className="site-container py-24 md:py-32 lg:py-40">

        {/* ── Header: title left, description + button right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end mb-14 md:mb-20">

          {/* Title — large serif, left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="accent-line" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)]">Portföy</span>
            </div>
            <h2 className="font-heading text-[var(--color-black)]">
              <span className="block">{title.split(" ")[0]}</span>
              <span className="block italic text-[var(--color-accent-dark)]">{title.split(" ").slice(1).join(" ") || ""}</span>
            </h2>
          </motion.div>

          {/* Description + button — right */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 lg:col-start-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <p className="text-[var(--color-gray)] text-sm leading-relaxed max-w-sm">
              Tamamlanan projelerimizden seçmeler. Her biri kalite ve güvenin somut ifadesidir.
            </p>
            <Link
              href="/projeler"
              className="group inline-flex items-center gap-3 px-7 py-3 border border-[var(--color-black)] text-[var(--color-black)] text-[11px] uppercase tracking-[0.15em] shrink-0 hover:bg-[var(--color-black)] hover:text-white transition-all duration-300"
            >
              Tümünü Gör
              <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ── Project grid — 3 equal columns ─────────────────── */}
        {displayProjects.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-muted)] text-sm">
            Henüz proje eklenmemiş. Sanity Studio'dan proje ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProjects.map((project: any, i: number) => {
              const imgUrl = project.mainImage?.asset?.url
                ? urlForImage(project.mainImage)?.width(600).quality(80).url()
                : null;

              return (
                <motion.div
                  key={project.slug?.current || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 * i }}
                >
                  <Link
                    href={`/projeler/${project.slug?.current ?? ""}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)] mb-4">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted)] text-sm">
                          Görsel Eklenmedi
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                      <span className="text-sm text-[var(--color-dark)] group-hover:text-[var(--color-accent-dark)] transition-colors duration-300">
                        {project.title}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
