"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine, RiPhoneLine, RiMailLine, RiMapPinLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
  subLinks?: NavItem[];
};

function resolveHref(item: NavItem): string {
  return item.href || "#";
}

export function Header({ settings, navigation }: { settings: any; navigation: any }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links: NavItem[] = navigation?.headerLinks || [];

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled && !drawerOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Split links left / right around centered logo
  const mid = Math.ceil(links.length / 2);
  const leftLinks = links.slice(0, mid);
  const rightLinks = links.slice(mid);

  const isActive = (item: NavItem) => {
    const href = resolveHref(item);
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500",
          isTransparent ? "bg-transparent" : "bg-[#0A0A0A]"
        )}
      >
        {/* Divider — visible only in solid state */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500",
            isTransparent ? "opacity-0" : "opacity-100 bg-white/10"
          )}
        />

        <div className="site-container">
          <div className="relative flex h-20 items-center justify-between md:justify-center">

            {/* ── Desktop: Left Nav ───────────────────────────── */}
            <nav className="hidden md:flex items-center gap-8 flex-1 justify-end pr-10">
              {leftLinks.map((item, i) => (
                <DesktopNavItem
                  key={i}
                  item={item}
                  active={isActive(item)}
                  isTransparent={isTransparent}
                />
              ))}
            </nav>

            {/* ── Logo (centered) ──────────────────────────────── */}
            <Link href="/" className="flex-shrink-0 md:mx-10" aria-label="Ana Sayfa">
              <div className="relative h-10 w-36 md:h-14 md:w-56">
                <Image
                  src="/images/logo/tuyluoglu-logo.png"
                  alt={settings?.siteName || "Tüylüoğlu İnşaat"}
                  fill
                  className="object-contain object-center"
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop: Right Nav ──────────────────────────── */}
            <nav className="hidden md:flex items-center gap-8 flex-1 pl-10">
              {rightLinks.map((item, i) => (
                <DesktopNavItem
                  key={i}
                  item={item}
                  active={isActive(item)}
                  isTransparent={isTransparent}
                />
              ))}
            </nav>

            {/* ── Mobile: Hamburger ───────────────────────────── */}
            <button
              className="md:hidden ml-auto p-2 text-white transition-opacity hover:opacity-70"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menüyü aç"
            >
              <RiMenu3Line size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[48] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel — tam ekran */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-0 z-[49] bg-[#0A0A0A] flex flex-col md:hidden"
            >
              {/* Drawer top */}
              <div className="flex items-center justify-between px-6 py-5">
                <div className="relative h-8 w-32">
                  <Image
                    src="/images/logo/tuyluoglu-logo.png"
                    alt={settings?.siteName || "Logo"}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-white/50 hover:text-white transition-colors p-1.5"
                  aria-label="Menüyü kapat"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>

              {/* Nav links — centered */}
              <nav className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-8 gap-1">
                {links.map((item, i) => {
                  const href = resolveHref(item);
                  const active = isActive(item);

                  // /iletisim → CTA butonu
                  if (href === "/iletisim" || href.includes("iletisim")) {
                    return (
                      <div key={i} className="w-full max-w-xs mt-6">
                        <Link
                          href={href}
                          className="block w-full text-center py-4 px-6 border border-[var(--color-accent)] text-[var(--color-accent)] font-body text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
                        >
                          {item.label}
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div key={i} className="w-full">
                      <Link
                        href={href}
                        target={item.openInNewTab ? "_blank" : undefined}
                        className={cn(
                          "block text-center py-3.5 font-heading text-3xl transition-colors",
                          active
                            ? "text-[var(--color-accent)]"
                            : "text-white/70 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                      {item.subLinks && item.subLinks.length > 0 && (
                        <div className="flex flex-col items-center gap-1 pb-2">
                          {item.subLinks.map((sub, j) => (
                            <Link
                              key={j}
                              href={resolveHref(sub)}
                              className="text-sm text-white/35 hover:text-white/60 transition-colors py-1"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Contact info */}
              {settings?.contactInfo && (
                <div className="px-6 py-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">İletişim</p>
                  {settings.contactInfo.phone && (
                    <a
                      href={`tel:${settings.contactInfo.phone}`}
                      className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <RiPhoneLine size={14} />
                      <span>{settings.contactInfo.phone}</span>
                    </a>
                  )}
                  {settings.contactInfo.email && (
                    <a
                      href={`mailto:${settings.contactInfo.email}`}
                      className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <RiMailLine size={14} />
                      <span>{settings.contactInfo.email}</span>
                    </a>
                  )}
                  {settings.contactInfo.address && (
                    <div className="flex items-start gap-3 text-sm text-white/50">
                      <RiMapPinLine size={14} className="mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{settings.contactInfo.address}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Desktop Nav Item ──────────────────────────────────────────── */
function DesktopNavItem({
  item,
  active,
  isTransparent,
}: {
  item: NavItem;
  active: boolean;
  isTransparent: boolean;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isSubActive = item.subLinks?.some((sub) => pathname === resolveHref(sub));
  const reallyActive = active || isSubActive;

  const baseLinkCls = cn(
    "text-[13px] tracking-[0.04em] uppercase transition-colors duration-200",
    isTransparent
      ? reallyActive ? "text-white font-medium" : "text-white/65 hover:text-white"
      : reallyActive ? "text-[var(--color-accent)]" : "text-white/65 hover:text-white"
  );

  if (!item.subLinks || item.subLinks.length === 0) {
    return (
      <Link
        href={resolveHref(item)}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        className={baseLinkCls}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={resolveHref(item)}
        className={cn(baseLinkCls, "flex items-center gap-1")}
      >
        {item.label}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <RiArrowDownSLine size={14} />
        </motion.span>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 min-w-[180px]"
          >
            <div className="bg-[#111111] border border-white/10 rounded-lg p-1.5 shadow-2xl">
              {item.subLinks.map((sub, j) => {
                const subActive = pathname === resolveHref(sub);
                return (
                  <Link
                    key={j}
                    href={resolveHref(sub)}
                    target={sub.openInNewTab ? "_blank" : undefined}
                    className={cn(
                      "block px-4 py-2.5 text-[13px] rounded-md transition-colors",
                      subActive
                        ? "text-[var(--color-accent)] bg-white/5"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
