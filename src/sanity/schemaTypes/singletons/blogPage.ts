import { defineField, defineType } from "sanity";

export const blogPageType = defineType({
  name: "blogPage",
  title: "Blog Sayfası",
  type: "document",
  fields: [
    defineField({ name: "heroTitle",    title: "Hero Başlığı",        type: "string", initialValue: "Blog" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   rows: 2, initialValue: "Sektörel haberler, proje güncellemeleri ve inşaat dünyasından yazılar." }),
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string" }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",      type: "text", rows: 3 }),
    defineField({ name: "ctaLabel",     title: "CTA Buton Metni",          type: "string" }),
    defineField({ name: "ctaLink",      title: "CTA Buton Linki",          type: "string" }),
    defineField({ name: "seo",          title: "SEO",                      type: "seo" }),
  ],
});
