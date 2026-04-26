"use client";

/**
 * Infinite scrolling marquee band displaying reference/client names.
 * Placed between WhyUs and Services as a rhythm-breaker and dark transition.
 * Uses pure CSS animation — no JS, no framer-motion dependency.
 */

const REFERENCES = [
  "TOKİ",
  "Emlak Konut GYO",
  "KİPTAŞ",
  "İstanbul Büyükşehir Belediyesi",
  "İLBANK",
  "Beyoğlu Belediyesi",
  "Zeytinburnu Belediyesi",
  "Bayrampaşa Belediyesi",
  "Çevre Bakanlığı",
  "Ankara Büyükşehir Belediyesi",
];

export function MarqueeSection() {
  // Triplicate for seamless loop
  const items = [...REFERENCES, ...REFERENCES, ...REFERENCES];

  return (
    <section
      className="relative overflow-hidden py-12 md:py-16 bg-[#0A0A0A] select-none"
      aria-hidden="true"
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Label */}
      <div className="site-container mb-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--color-accent)]/40" />
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/25">
            Referanslarımız
          </span>
        </div>
      </div>

      {/* Marquee track */}
      <div className="marquee-track flex items-center gap-10 md:gap-16 whitespace-nowrap">
        {items.map((name, i) => (
          <span key={i} className="flex items-center gap-10 md:gap-16 shrink-0">
            <span
              className="font-heading text-white/[0.08] leading-none hover:text-white/[0.15] transition-colors duration-500"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {name}
            </span>
            {/* Diamond separator */}
            <span className="text-[var(--color-accent)]/30 text-xs">◆</span>
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* CSS animation */}
      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 45s linear infinite;
          width: max-content;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
