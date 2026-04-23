import Link from "next/link";
import Image from "next/image";
import {
  FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaTiktok, FaPinterest, FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiArrowRightUpLine } from "react-icons/ri";

type NavItem  = { label: string; href: string; openInNewTab?: boolean };
type SocialLink = { platform: string; url: string };

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
};

export function Footer({ settings, navigation }: { settings: any; navigation: any }) {
  const footerLinks: NavItem[]   = navigation?.footerLinks  || [];
  const socialLinks: SocialLink[] = (settings?.socialLinks  || []).filter((s: SocialLink) => s.url);
  const contact = settings?.contactInfo;
  const year    = new Date().getFullYear();

  return (
    <footer
      className="bg-[#0A0A0A] text-white"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="site-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

          {/* Brand column */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" aria-label="Ana Sayfa">
              <div className="relative h-10 w-40">
                <Image
                  src="/images/logo/tuyluoglu-logo.png"
                  alt={settings?.siteName || "Tüylüoğlu İnşaat"}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {settings?.siteTagline && (
              <p className="text-sm text-white/40 leading-relaxed max-w-[260px]">
                {settings.siteTagline}
              </p>
            )}

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social, i) => {
                  const Icon = SOCIAL_ICONS[social.platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="h-8 w-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          {footerLinks.length > 0 && (
            <div className="md:col-span-3 md:col-start-6">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">Sayfalar</p>
              <ul className="space-y-3">
                {footerLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href || "#"}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item.label}
                      {item.openInNewTab && (
                        <RiArrowRightUpLine size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div className="md:col-span-3 md:col-start-10">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-5">İletişim</p>
            <ul className="space-y-4">
              {contact?.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone}`}
                    className="group flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    <RiPhoneLine size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] opacity-70 group-hover:opacity-100" />
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="group flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    <RiMailLine size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] opacity-70 group-hover:opacity-100" />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-3 text-sm text-white/40">
                  <RiMapPinLine size={15} className="mt-0.5 shrink-0 text-[var(--color-accent)] opacity-70" />
                  <span className="leading-relaxed">{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="site-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {year} {settings?.siteName || "Tüylüoğlu İnşaat"}. Tüm hakları saklıdır.
          </p>
          {/* Tasarım & geliştirme linki buraya eklenecek */}
          <p className="text-xs text-white/20">
            Tasarım &amp; Geliştirme
          </p>
        </div>
      </div>
    </footer>
  );
}
