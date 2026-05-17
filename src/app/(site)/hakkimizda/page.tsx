import { Metadata } from "next";
import { SanityImage } from "@/components/ui/SanityImage";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { PageHero } from "@/components/ui/PageHero";
import { RichText } from "@/components/ui/RichText";
import { JsonLd, aboutPageJsonLd } from "@/components/seo/JsonLd";
import { RiArrowRightLine, RiCheckLine } from "react-icons/ri";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(aboutPageQuery, {}, { next: { tags: ["about"] } });
  return buildMetadata({
    title: data?.pageTitle || "Hakkımızda",
    description: data?.pageSubtitle,
    canonicalPath: "/hakkimizda",
    pageSeo: data?.seo,
  });
}

const FALLBACK_STATS = [
  { value: "1985", label: "Kuruluş Yılı" },
  { value: "40+",  label: "Yıllık Deneyim" },
  { value: "150+", label: "Tamamlanan Proje" },
  { value: "100%", label: "Müşteri Memnuniyeti" },
];

const FALLBACK_VALUES = [
  { title: "Kalite",      description: "Her projede en yüksek malzeme ve işçilik standartlarını uyguluyoruz." },
  { title: "Güven",       description: "Şeffaf iletişim ve zamanında teslimat politikamızla güven tesis ediyoruz." },
  { title: "Uzmanlık",    description: "Dört on yılı aşkın sektörel bilgi birikimimizle projelerinizi yönetiyoruz." },
  { title: "Sürdürülebilirlik", description: "Uzun ömürlü yapılar inşa ederek gelecek nesillere değer bırakıyoruz." },
];

const FALLBACK_TEAM = [
  { name: "Yaşar Tüylüoğlu",   role: "Kurucu & Yönetim Kurulu Başkanı", photo: null },
  { name: "Murat Tüylüoğlu",   role: "Genel Müdür",                       photo: null },
  { name: "Elif Tüylüoğlu",    role: "Mimarlık Direktörü",                photo: null },
];

export default async function AboutPage() {
  const [data, layoutData] = await Promise.all([
    client.fetch(aboutPageQuery, {}, { next: { tags: ["about"] } }),
    client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } }),
  ]);

  const stats  = data?.stats?.length  ? data.stats  : FALLBACK_STATS;
  const values = data?.values?.length ? data.values : FALLBACK_VALUES;
  const team   = data?.teamMembers?.length ? data.teamMembers : FALLBACK_TEAM;


  return (
    <>
      <JsonLd data={aboutPageJsonLd(layoutData?.settings)} />

      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Hakkımızda"
        title={data?.heroTitle || "1985'ten Beri Güven"}
        subtitle={data?.heroSubtitle || "Dört nesil boyunca sürdürülen mimarlık ve inşaat uzmanlığı."}
        decorativeText="Güven"
      />

      {/* ── Hikaye Section ───────────────────────────────────────── */}
      <section className="bg-white overflow-hidden">
        <div className="site-container py-20 md:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center">

            {/* Görsel — sol */}
            <div className="lg:col-span-5 relative corner-accent">
              <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[620px] overflow-hidden bg-[var(--color-surface)]">
                {data?.mainImage?.asset ? (
                  <SanityImage
                    image={data.mainImage}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-muted)]">
                    <span className="text-5xl opacity-20 font-heading italic">TİY</span>
                    <span className="text-xs mt-3 tracking-widest uppercase opacity-40">Görsel Eklenecek</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metin — sağ */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8">
                <span className="accent-line" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  {data?.storyTitle || "Köklü Bir Miras"}
                </span>
              </div>

              <h2 className="font-heading text-[var(--color-black)] mb-6">
                {data?.storyTitle || "Köklü Bir Miras"}
              </h2>

              <div className="relative pl-5 border-l-2 border-[var(--color-accent)] mb-10">
                {data?.body ? (
                  <div className="prose prose-neutral max-w-none text-[var(--color-gray)] leading-relaxed">
                    <RichText value={data.body} />
                  </div>
                ) : (
                  <p className="text-[var(--color-gray)] leading-relaxed text-base">
                    Tüylüoğlu İnşaat, 1985 yılında temelleri atılan ve bugün dört on yıla yayılan
                    deneyimiyle Türkiye'nin önde gelen inşaat ve mimarlık firmalarından biridir.
                    Konut, ticari yapılar ve kentsel dönüşüm projelerinde gösterdiğimiz özenle
                    binlerce aileye güvenli ve estetik mekanlar sunduk.
                  </p>
                )}
              </div>

              <Link
                href="/projeler"
                className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] border-b border-[var(--color-border)] pb-1 hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 self-start"
              >
                Projelerimizi İncele
                <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── İstatistikler ─────────────────────────────────────────── */}
      <section className="bg-[var(--color-black)]">
        <div className="site-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="px-6 py-10 md:py-14 text-center">
                <div
                  className="font-heading text-[var(--color-accent)] mb-2 leading-none"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Değerlerimiz ──────────────────────────────────────────── */}
      <section className="bg-[#F4F4F2] texture-blueprint">
        <div className="site-container py-20 md:py-28">
          <div className="text-center mb-14 md:mb-18">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 bg-[var(--color-accent)]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">Felsefemiz</span>
              <span className="h-px w-10 bg-[var(--color-accent)]" />
            </div>
            <h2 className="font-heading text-[var(--color-black)]">Değerlerimiz</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {values.map((val: any, i: number) => (
              <div
                key={i}
                className="bg-white p-8 group hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-8 h-0.5 bg-[var(--color-accent)] mb-6 group-hover:w-14 transition-all duration-400" />
                <h3 className="font-heading text-[var(--color-black)] text-2xl mb-3">{val.title}</h3>
                <p className="text-sm text-[var(--color-gray)] leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ekip ──────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-20 md:py-28">
          {/* Başlık */}
          <div className="flex items-end justify-between mb-12 md:mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="accent-line" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Kadromuz</span>
              </div>
              <h2 className="font-heading text-[var(--color-black)]">Ekibimiz</h2>
            </div>
            <Link
              href="/iletisim"
              className="group hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[var(--color-dark)] border-b border-[var(--color-border)] pb-1 hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300 shrink-0"
            >
              İletişime Geç
              <RiArrowRightLine size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {(() => {
            // Kurucuyu bul — isFounder=true olan önce gelir, yoksa ilk eleman
            const founder = team.find((m: any) => m.isFounder) ?? team[0];
            const others  = team.filter((m: any) => m !== founder);

            return (
              <>
                {/* ── Kurucu Spotlight ──────────────────────── */}
                {founder && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-12 md:mb-14 border border-[var(--color-border)]">
                    {/* Fotoğraf */}
                    <div className="lg:col-span-4 relative aspect-[4/5] lg:aspect-auto lg:h-[480px] bg-[var(--color-surface)] overflow-hidden">
                      {founder?.photo?.asset ? (
                        <SanityImage
                          image={founder.photo}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="font-heading italic text-[var(--color-muted)] opacity-20 select-none"
                            style={{ fontSize: "8rem" }}
                          >
                            {founder.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      {/* Accent overlay bottom stripe */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent)]" />
                    </div>

                    {/* Metin */}
                    <div className="lg:col-span-8 flex flex-col justify-center px-8 md:px-12 py-10 md:py-14 bg-white">
                      {/* "Kurucu" rozeti */}
                      <span className="inline-flex items-center gap-2 mb-6 self-start">
                        <span className="w-5 h-px bg-[var(--color-accent)]" />
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent)]">
                          Firma Sahibi
                        </span>
                      </span>

                      <h3 className="font-heading text-[var(--color-black)] text-3xl md:text-4xl leading-tight mb-2">
                        {founder.name}
                      </h3>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
                        {founder.role}
                      </p>

                      {founder.shortBio && (
                        <p className="text-[var(--color-gray)] leading-relaxed text-base max-w-lg border-l-2 border-[var(--color-accent)] pl-5">
                          {founder.shortBio}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Diğer Ekip Üyeleri — Compact List ──── */}
                {others.length > 0 && (
                  <div className="divide-y divide-[var(--color-border)]">
                    {others.map((member: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-5 group hover:bg-[var(--color-surface)] transition-colors duration-200 px-1"
                      >
                        <div className="flex items-center gap-4">
                          {/* Monogram dot */}
                          <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[11px] font-heading text-[var(--color-muted)] shrink-0 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                            {member.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") || "?"}
                          </span>
                          <span className="font-heading text-[var(--color-black)] text-lg leading-tight">
                            {member.name}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)] text-right ml-4">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-accent-darker)]">
        <div className="site-container py-14 md:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2">Birlikte çalışalım</p>
            <h3 className="font-heading text-white text-3xl md:text-4xl">Projenizi Konuşalım</h3>
          </div>
          <Link
            href="/iletisim"
            className="shrink-0 inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[var(--color-accent-darker)] transition-all duration-300"
          >
            İletişime Geç
            <RiArrowRightLine size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
