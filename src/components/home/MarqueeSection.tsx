"use client";

/**
 * Infinite scrolling marquee band displaying brand values.
 * Placed between sections to add visual rhythm and break monotony.
 * Uses pure CSS animation — no JS, no framer-motion dependency.
 */

const BRAND_WORDS = [
  "Güven",
  "Kalite",
  "Tecrübe",
  "Sağlamlık",
  "İnşaat",
  "Mimarlık",
  "Kentsel Dönüşüm",
  "Projelendirme",
  "Taahhüt",
  "1985'ten Beri",
];

export function MarqueeSection() {
  // Duplicate for seamless loop
  const items = [...BRAND_WORDS, ...BRAND_WORDS];

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14 bg-[var(--color-surface)] select-none"
      aria-hidden="true"
    >
      <div className="marquee-track flex items-center gap-8 md:gap-12 whitespace-nowrap">
        {items.map((word, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-12 shrink-0">
            <span
              className="font-heading text-[var(--color-border)] leading-none"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              {word}
            </span>
            {/* Diamond separator */}
            <span className="text-[var(--color-accent)] text-lg">◆</span>
          </span>
        ))}
      </div>

      {/* CSS animation */}
      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 35s linear infinite;
          width: max-content;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
