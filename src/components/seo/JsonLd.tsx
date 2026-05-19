import { getSiteUrl } from "@/lib/utils";

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * LocalBusiness + ConstructionCompany JSON-LD
 */
export function organizationJsonLd(settings: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ConstructionCompany"],
    name: settings?.siteName,
    url: base,
    logo: `${base}/images/logo/tuyluoglu-logo.png`,
    priceRange: "₺₺₺",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Kadıköy",
        containedInPlace: { "@type": "City", name: "İstanbul" },
      },
      {
        "@type": "City",
        name: "İstanbul",
        containedInPlace: { "@type": "Country", name: "Türkiye" },
      }
    ],
    telephone: settings?.contactInfo?.phone || "0533 923 3753",
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.contactInfo?.address || "19 Mayıs Mah Gürsoylu Sk NO: 2/1",
      addressLocality: "Kadıköy",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    sameAs: settings?.socialLinks?.map((s: any) => s.url).filter(Boolean) || [],
  };
}

/**
 * Blog yazısı JSON-LD — URL /slug (ön ek yok)
 */
export function articleJsonLd(post: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    datePublished: post?.publishedAt,
    url: `${base}/${post?.slug?.current}`,
    ...(post?.mainImage?.asset?.url && { image: post.mainImage.asset.url }),
    ...(post?.excerpt && { description: post.excerpt }),
  };
}

/**
 * Hizmet sayfası JSON-LD (liste)
 */
export function serviceListJsonLd(settings: any, services: { title: string }[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
      url: base,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hizmetlerimiz",
      itemListElement: services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s.title },
      })),
    },
  };
}

// legacy alias
export const serviceJsonLd = serviceListJsonLd;

const CATEGORY_LABELS: Record<string, string> = {
  insaat:   "İnşaat",
  mimarlik: "Mimarlık",
};

/**
 * Tek hizmet sayfası JSON-LD — Service schema + areaServed (Kadıköy / İstanbul)
 */
export function singleServiceJsonLd(settings: any, service: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service?.title,
    description: service?.excerpt,
    url: `${base}/hizmetler/${service?.slug?.current}`,
    ...(service?.serviceCategory && { serviceType: CATEGORY_LABELS[service.serviceCategory] }),
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Kadıköy",
        containedInPlace: { "@type": "City", name: "İstanbul" },
      },
      {
        "@type": "City",
        name: "İstanbul",
        containedInPlace: { "@type": "Country", name: "Türkiye" },
      },
    ],
    provider: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
      url: base,
      ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kadıköy",
        addressRegion: "İstanbul",
        addressCountry: "TR",
        ...(settings?.contactInfo?.address && { streetAddress: settings.contactInfo.address }),
      },
    },
    ...(service?.mainImage?.asset?.url && { image: service.mainImage.asset.url }),
  };
}

/**
 * FAQPage JSON-LD — hizmet sayfası SSS bloğu için
 */
export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * BreadcrumbList JSON-LD
 * items: [{ name, href }] — Ana Sayfa otomatik başa eklenir
 */
export function breadcrumbJsonLd(base: string, items: { name: string; href: string }[]) {
  const allItems = [{ name: "Ana Sayfa", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.href === "/" ? "" : item.href}`,
    })),
  };
}

/**
 * Proje (CreativeWork) JSON-LD
 */
export function projectJsonLd(settings: any, project: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project?.title,
    description: project?.seo?.metaDescription || project?.title,
    url: `${base}/projeler/${project?.slug?.current}`,
    creator: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
    },
    ...(project?.period && { dateCreated: String(project.period) }),
    ...(project?.mainImage?.asset?.url && { image: project.mainImage.asset.url }),
  };
}

/**
 * Hakkımızda sayfası JSON-LD
 */
export function aboutPageJsonLd(settings: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${base}/hakkimizda`,
    name: `Hakkımızda | ${settings?.siteName ?? ""}`,
    description: settings?.siteTagline,
    publisher: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
    },
  };
}

/**
 * İletişim sayfası JSON-LD
 */
export function contactPageJsonLd(settings: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${base}/iletisim`,
    name: `İletişim | ${settings?.siteName ?? ""}`,
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
  };
}
