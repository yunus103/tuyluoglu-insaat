"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { urlForImage } from "@/sanity/lib/image";
import { RiArrowRightLine } from "react-icons/ri";

const CATEGORY_LABELS: Record<string, string> = {
  "konut":             "Konut",
  "villa":             "Villa",
  "apartman":          "Apartman",
  "rezidans":          "Rezidans",
  "ticari":            "Ticari",
  "ofis":              "Ofis",
  "otel":              "Otel",
  "kentsel-donusum":   "Kentsel Dönüşüm",
  "kat-karsiligi":     "Kat Karşılığı",
  "mimarlik-projesi":  "Mimarlık Projesi",
  "restorasyon":       "Restorasyon",
  "endustriyel":       "Endüstriyel",
};

interface ProjectsGridProps {
  projects: any[];
}

const STATUS_LABELS: Record<string, string> = {
  "completed": "Tamamlandı",
  "ongoing":   "Devam Ediyor",
};

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeStatus, setActiveStatus] = useState<string>("tumu");

  const filtered = useMemo(() => {
    if (activeStatus === "tumu") return projects;
    return projects.filter((p) => p.status === activeStatus);
  }, [projects, activeStatus]);

  const statuses = ["tumu", "completed", "ongoing"];

  return (
    <>
      {/* ── Durum filtreleri ───────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {statuses.map((status) => {
          const isActive = activeStatus === status;
          const label = status === "tumu" ? "Tümü" : (STATUS_LABELS[status] ?? status);
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-5 py-2 text-[11px] uppercase tracking-[0.15em] border transition-colors duration-200 ${
                isActive
                  ? "bg-[var(--color-black)] text-white border-[var(--color-black)]"
                  : "border-[var(--color-border)] text-[var(--color-gray)] hover:border-[var(--color-black)] hover:text-[var(--color-black)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Proje grid ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-[var(--color-muted)] text-sm py-16 text-center">
          Bu grupta henüz proje bulunmuyor.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((project: any) => {
            const imgUrl = project.mainImage?.asset?.url
              ? urlForImage(project.mainImage)?.width(700).height(840).quality(80).url()
              : null;
            const catLabel = project.category ? (CATEGORY_LABELS[project.category] ?? project.category) : null;

            return (
              <Link
                key={project.slug?.current}
                href={`/projeler/${project.slug?.current}`}
                className="group relative block overflow-hidden bg-[var(--color-surface)]"
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "5/6" }}>
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={project.mainImage?.alt || project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading italic text-[var(--color-muted)] opacity-20 text-6xl select-none">
                        {project.title?.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Always-visible bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Project info overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-heading text-white text-lg md:text-xl leading-tight mb-1">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-3">
                      {catLabel && (
                        <span className="text-[9px] uppercase tracking-[0.18em] text-white/50">
                          {catLabel}
                        </span>
                      )}
                      {catLabel && project.period && <span className="text-white/20">·</span>}
                      {project.period && (
                        <span className="text-[9px] uppercase tracking-[0.18em] text-white/50">
                          {project.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover border frame */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
