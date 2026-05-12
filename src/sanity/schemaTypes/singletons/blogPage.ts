import { defineField, defineType } from "sanity";

export const blogPageType = defineType({
  name: "blogPage",
  title: "Blog Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "cta", title: "Alt Banner (CTA)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitle",    title: "Hero Başlığı",        type: "string", group: "hero", initialValue: "Blog" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   group: "hero", rows: 2, initialValue: "Sektörel haberler, proje güncellemeleri ve inşaat dünyasından yazılar." }),
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string", group: "seo" }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",      type: "text",   group: "seo", rows: 3 }),
    defineField({ name: "ctaLabel",     title: "CTA Buton Metni",          type: "string", group: "cta" }),
    defineField({ name: "ctaLink",      title: "CTA Buton Linki",          type: "string", group: "cta" }),
    defineField({ name: "seo",          title: "SEO",                      type: "seo",    group: "seo" }),
  ],
});
