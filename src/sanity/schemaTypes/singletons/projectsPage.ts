import { defineField, defineType } from "sanity";

export const projectsPageType = defineType({
  name: "projectsPage",
  title: "Projeler Sayfası",
  type: "document",
  fields: [
    defineField({ name: "heroTitle",    title: "Hero Başlığı",        type: "string", initialValue: "Projelerimiz" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   rows: 2, initialValue: "Tamamladığımız ve devam eden projelerimize göz atın." }),
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string" }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",      type: "text", rows: 3 }),
    defineField({ name: "ctaLabel",     title: "CTA Buton Metni",          type: "string", description: "Boş bırakılırsa CTA butonu gizlenir" }),
    defineField({ name: "ctaLink",      title: "CTA Buton Linki",          type: "string" }),
    defineField({ name: "seo",          title: "SEO",                      type: "seo" }),
  ],
});
