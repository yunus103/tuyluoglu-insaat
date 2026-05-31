import { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { contactPageQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, contactPageJsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/utils";
import {
  RiPhoneLine, RiMailLine, RiMapPin2Line, RiTimeLine,
  RiInstagramLine, RiFacebookLine, RiLinkedinLine, RiYoutubeLine,
} from "react-icons/ri";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(contactPageQuery, {}, { next: { tags: ["contact"] } });
  return buildMetadata({
    title: data?.pageTitle || "İletişim",
    description: data?.pageSubtitle,
    canonicalPath: "/iletisim",
    pageSeo: data?.seo,
  });
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: RiInstagramLine,
  facebook:  RiFacebookLine,
  linkedin:  RiLinkedinLine,
  youtube:   RiYoutubeLine,
};

export default async function ContactPage() {
  const [data, layoutData] = await Promise.all([
    client.fetch(contactPageQuery, {}, { next: { tags: ["contact"] } }),
    client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } }),
  ]);

  const settings = layoutData?.settings;
  const socialLinks = settings?.socialLinks || [];
  const mapIframe   = settings?.contactInfo?.mapIframe;

  const siteBase = getSiteUrl();

  return (
    <>
      <JsonLd data={contactPageJsonLd(settings)} />
      <JsonLd
        data={breadcrumbJsonLd(siteBase, [
          { name: "İletişim", href: "/iletisim" },
        ])}
      />

      {/* ── PageHero ──────────────────────────────────────────────── */}
      <PageHero
        eyebrow="İletişim"
        title={data?.heroTitle || "İletişim"}
        subtitle={data?.heroSubtitle || "Projeniz hakkında konuşmak için bize ulaşın."}
        decorativeText="İletişim"
      />

      {/* ── İletişim Grid ─────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="site-container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Sol: Bilgiler */}
            <div className="lg:col-span-5 space-y-10">

              {/* Başlık */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="accent-line" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Bize Ulaşın</span>
                </div>
                <h2 className="font-heading text-[var(--color-black)] mb-4">
                  Projenizi Birlikte Hayata Geçirelim
                </h2>
                {data?.pageSubtitle && (
                  <p className="text-[var(--color-gray)] leading-relaxed text-sm">
                    {data.pageSubtitle}
                  </p>
                )}
              </div>

              {/* İletişim Kartları */}
              <div className="space-y-4">
                {settings?.contactInfo?.phone && (
                  <ContactCard
                    icon={RiPhoneLine}
                    label="Telefon"
                    value={settings.contactInfo.phone}
                    href={`tel:${settings.contactInfo.phone}`}
                  />
                )}
                {settings?.contactInfo?.email && (
                  <ContactCard
                    icon={RiMailLine}
                    label="E-Posta"
                    value={settings.contactInfo.email}
                    href={`mailto:${settings.contactInfo.email}`}
                  />
                )}
                {settings?.contactInfo?.address && (
                  <ContactCard
                    icon={RiMapPin2Line}
                    label="Adres"
                    value={settings.contactInfo.address}
                  />
                )}
                {data?.workingHours && (
                  <ContactCard
                    icon={RiTimeLine}
                    label="Çalışma Saatleri"
                    value={data.workingHours}
                  />
                )}
              </div>

              {/* Sosyal medya */}
              {socialLinks.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] mb-4">Sosyal Medya</p>
                  <div className="flex gap-3">
                    {socialLinks.map((s: any, i: number) => {
                      const Icon = PLATFORM_ICONS[s.platform?.toLowerCase()] || RiInstagramLine;
                      return (
                        <Link
                          key={i}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)] transition-colors duration-300"
                        >
                          <Icon size={17} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ: Harita */}
            <div className="lg:col-span-7">
              {mapIframe ? (
                <div
                  className="w-full overflow-hidden border border-[var(--color-border)]"
                  style={{ aspectRatio: "4/3", minHeight: 300 }}
                  dangerouslySetInnerHTML={{ __html: mapIframe }}
                />
              ) : (
                <div
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] text-sm"
                  style={{ aspectRatio: "4/3", minHeight: 300 }}
                >
                  <div className="text-center">
                    <RiMapPin2Line size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-xs">Harita Sanity → Site Ayarları → Harita Embed alanından yüklenebilir.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 p-5 border border-[var(--color-border)] group hover:border-[var(--color-accent)] transition-colors duration-300">
      <div className="w-10 h-10 flex items-center justify-center bg-[var(--color-accent-light)] shrink-0 group-hover:bg-[var(--color-accent)] transition-colors duration-300">
        <Icon size={18} className="text-[var(--color-accent-dark)] group-hover:text-white transition-colors duration-300" />
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">{label}</p>
        <p className="text-sm text-[var(--color-dark)] leading-snug">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <div>{content}</div>;
}
