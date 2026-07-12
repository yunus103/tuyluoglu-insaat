import { SanityImage } from "@/components/ui/SanityImage";

/**
 * Infinite scrolling marquee band — reference logos & names.
 * Animation: inline style (guaranteed, cannot be overridden by Tailwind).
 * Logos: SanityImage with square source dims so CSS freely controls display size.
 */

interface ReferenceItem {
  name?: string;
  logo?: any;
}

interface MarqueeSectionProps {
  data: {
    referencesTitle?: string;
    references?: ReferenceItem[];
  } | null;
}

const FALLBACK_ITEMS: ReferenceItem[] = [
  { name: "TOKİ" },
  { name: "Emlak Konut GYO" },
  { name: "KİPTAŞ" },
  { name: "İstanbul Büyükşehir Belediyesi" },
  { name: "İLBANK" },
  { name: "Beyoğlu Belediyesi" },
  { name: "Zeytinburnu Belediyesi" },
  { name: "Bayrampaşa Belediyesi" },
  { name: "Çevre Bakanlığı" },
  { name: "Ankara Büyükşehir Belediyesi" },
];

export function MarqueeSection({ data }: MarqueeSectionProps) {
  const title = data?.referencesTitle || "Referanslarımız";
  const rawItems = data?.references?.length ? data.references : FALLBACK_ITEMS;

  // Triplicate: list plays 3× so -33.333% translateX creates a seamless loop
  const items = [...rawItems, ...rawItems, ...rawItems];

  return (
    <section
      className="relative overflow-hidden py-10 md:py-14 bg-white select-none"
      aria-hidden="true"
    >
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--color-border)] opacity-60" />

      {/* Label */}
      <div className="site-container mb-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--color-accent)]/50" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)] font-semibold">
            {title}
          </span>
        </div>
      </div>

      {/*
        Marquee track.
        - width: max-content  → track extends beyond viewport
        - animation inline    → immune to Tailwind layer ordering / purging
      */}
      <div
        className="flex items-center gap-6 md:gap-20 whitespace-nowrap"
        style={{ width: "max-content", animation: "marquee-scroll 50s linear infinite" }}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-6 md:gap-20 shrink-0">
            {item.logo?.asset ? (
              <div className="relative h-14 md:h-20 w-40 md:w-52 shrink-0">
                <SanityImage
                  image={item.logo}
                  fill
                  objectFit="contain"
                  noBlur
                  className="filter grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  sizes="208px"
                />
              </div>
            ) : (
              <span
                className="font-heading text-black/[0.12] leading-none hover:text-black/[0.25] transition-colors duration-500 select-none"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
              >
                {item.name}
              </span>
            )}
            {/* Diamond separator */}
            <span className="text-[var(--color-accent)]/40 text-xs select-none">◆</span>
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}

