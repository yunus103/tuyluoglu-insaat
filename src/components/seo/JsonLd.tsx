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
 * İnşaat firmaları için Google'ın önerdiği schema tiplerini kullanır.
 */
export function organizationJsonLd(settings: any) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ConstructionCompany"],
    name: settings?.siteName,
    url: base,
    logo: `${base}/images/logo/logo.png`,
    priceRange: "₺₺₺",
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
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
 * Blog yazısı JSON-LD
 */
export function articleJsonLd(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    datePublished: post?.publishedAt,
    url: `${getSiteUrl()}/blog/${post?.slug?.current}`,
    ...(post?.mainImage?.asset?.url && {
      image: post.mainImage.asset.url,
    }),
  };
}

/**
 * Hizmet sayfası JSON-LD
 */
export function serviceJsonLd(settings: any, services: { title: string }[]) {
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
        itemOffered: {
          "@type": "Service",
          name: s.title,
        },
      })),
    },
  };
}
