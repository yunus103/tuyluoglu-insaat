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
    areaServed: { "@type": "Country", name: "Türkiye" },
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    ...(settings?.contactInfo?.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.contactInfo.address,
        addressCountry: "TR",
      },
    }),
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

/**
 * Tek hizmet sayfası JSON-LD
 */
export function singleServiceJsonLd(settings: any, service: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service?.title,
    description: service?.excerpt,
    url: `${base}/hizmetler/${service?.slug?.current}`,
    provider: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
      url: base,
    },
    ...(service?.mainImage?.asset?.url && { image: service.mainImage.asset.url }),
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
    description: project?.excerpt,
    url: `${base}/projeler/${project?.slug?.current}`,
    creator: {
      "@type": "ConstructionCompany",
      name: settings?.siteName,
    },
    ...(project?.year && { dateCreated: String(project.year) }),
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
