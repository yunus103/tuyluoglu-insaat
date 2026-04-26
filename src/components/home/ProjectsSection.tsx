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

function ProjectCard({
  project,
  className = "",
  priority = false,
  inView = false,
  delay = 0,
}: {
  project: any;
  className?: string;
  priority?: boolean;
  inView?: boolean;
  delay?: number;
}) {
  const imgUrl = project?.mainImage?.asset?.url
    ? urlForImage(project.mainImage)?.width(900).quality(82).url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay }}
      className={`relative overflow-hidden group ${className}`}
    >
      <Link href={`/projeler/${project.slug?.current ?? ""}`} className="block w-full h-full">

        {/* ── Full-bleed image ─────────────────────────────── */}
        <div className="absolute inset-0 bg-white/[0.03]">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
              Görsel Eklenmedi
            </div>
          )}
        </div>

        {/* ── Always-visible bottom gradient + title ───────── */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        {/* ── Project title — always at bottom ─────────────── */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-5 md:p-7 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
          <p className="font-heading text-white text-xl md:text-2xl leading-tight mb-2">
            {project.title}
          </p>
          {/* Accent line — expands on hover */}
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-px bg-[var(--color-accent)] w-5 group-hover:w-10 transition-all duration-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/0 group-hover:text-white/60 transition-colors duration-400">
              İncele
            </span>
            <RiArrowRightLine
              size={12}
              className="text-white/0 group-hover:text-white/60 transition-colors duration-400 group-hover:translate-x-1 transform transition-transform"
            />
          </div>
        </div>

        {/* ── Hover: subtle border frame ───────────────────── */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-500 z-30 pointer-events-none" />
      </Link>
    </motion.div>
  );
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const title    = data?.projectsTitle || "Projelerimiz";
  const projects = data?.featuredProjects || [];
  const [p1, p2, p3] = projects;

  const words = title.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <section className="bg-[#111111] overflow-hidden">
      <div ref={ref} className="site-container py-20 md:py-28 lg:py-36">

        {/* ── Header row: title left, pill button right ───────── */}
        <div className="flex items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="shrink-0"
          >
            <h2
              className="font-heading text-white leading-[0.92]"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
            >
              <span className="block">{line1}</span>
              {line2 && <span className="block italic text-white/70">{line2}</span>}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="shrink-0"
          >
            <Link
              href="/projeler"
              className="group inline-flex items-center gap-0 border border-white/30 rounded-full overflow-hidden text-[11px] uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300"
            >
              <span className="pl-7 pr-3 py-3.5 text-white group-hover:text-[var(--color-black)] transition-colors duration-300">
                Tümünü Gör
              </span>
              <span className="flex items-center justify-center w-10 h-10 bg-white text-[var(--color-black)] rounded-full mr-1 group-hover:bg-[var(--color-black)] group-hover:text-white transition-colors duration-300">
                <RiArrowRightLine size={15} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── Project grid ──────────────────────────────────────── */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            Henüz proje eklenmemiş. Sanity Studio&apos;dan proje ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

            {/* Left: 1 tall featured card */}
            {p1 && (
              <ProjectCard
                project={p1}
                className="md:row-span-2 min-h-[400px] md:min-h-[680px]"
                priority
                inView={inView}
                delay={0}
              />
            )}

            {/* Right: 2 stacked cards */}
            {p2 && (
              <ProjectCard
                project={p2}
                className="min-h-[300px] md:min-h-[330px]"
                inView={inView}
                delay={0.12}
              />
            )}
            {p3 && (
              <ProjectCard
                project={p3}
                className="min-h-[300px] md:min-h-[330px]"
                inView={inView}
                delay={0.22}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
