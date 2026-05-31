import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allSlugsForSitemapQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await client.fetch(allSlugsForSitemapQuery);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/hakkimizda`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/hizmetler`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projeler`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/blog`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/iletisim`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    // Blog yazıları — /[slug] altında (ön ek yok)
    ...(data?.blogPosts?.map((p: { slug: string; _updatedAt: string }) => ({
      url: `${base}/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || []),

    // Proje detay sayfaları
    ...(data?.projects?.map((p: { slug: string; _updatedAt: string }) => ({
      url: `${base}/projeler/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []),

    // Hizmet detay sayfaları
    ...(data?.services?.map((s: { slug: string; _updatedAt: string }) => ({
      url: `${base}/hizmetler/${s.slug}`,
      lastModified: s._updatedAt ? new Date(s._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
