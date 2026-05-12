import { defineField, defineType } from "sanity";

export const servicesPageType = defineType({
  name: "servicesPage",
  title: "Hizmetler Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "cta", title: "Alt Banner (CTA)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitle",    title: "Hero Başlığı",        type: "string", group: "hero", initialValue: "Hizmetlerimiz" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   group: "hero", rows: 2, initialValue: "İnşaat ve mimarlık alanında kapsamlı çözümler sunuyoruz." }),
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string", group: "seo" }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",      type: "text",   group: "seo", rows: 3 }),
    defineField({ name: "ctaLabel",     title: "CTA Buton Metni",          type: "string", group: "cta", description: "Boş bırakılırsa CTA butonu gizlenir" }),
    defineField({ name: "ctaLink",      title: "CTA Buton Linki",          type: "string", group: "cta" }),
    defineField({ name: "seo",          title: "SEO",                      type: "seo",    group: "seo" }),
  ],
});
