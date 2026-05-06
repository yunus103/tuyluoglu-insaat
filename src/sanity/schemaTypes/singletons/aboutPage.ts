import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  fields: [
    // ─── PageHero ────────────────────────────────────────────
    defineField({ name: "heroTitle",    title: "Hero Başlığı",     type: "string", initialValue: "1985'ten Beri Güven" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text", rows: 2, initialValue: "Dört nesil boyunca sürdürülen mimarlık ve inşaat uzmanlığı." }),

    // ─── Legacy (SEO fallback) ────────────────────────────────
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string", initialValue: "Hakkımızda | Tüylüoğlu İnşaat", description: "Tarayıcı sekmesi ve arama sonuçları için." }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",     type: "text",   rows: 2 }),

    // ─── Hikaye Section ───────────────────────────────────────
    defineField({ name: "storyTitle", title: "Hikaye Başlığı", type: "string", initialValue: "Köklü Bir Miras" }),
    defineField({ name: "body",       title: "Hikaye İçeriği", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "mainImage", title: "Hikaye Görseli", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),

    // ─── İstatistikler ────────────────────────────────────────
    defineField({
      name: "stats", title: "İstatistikler", type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "value", title: "Değer", type: "string", description: "Ör: 38+" }),
        defineField({ name: "label", title: "Etiket", type: "string", description: "Ör: Yıllık Deneyim" }),
      ]}],
    }),

    // ─── Değerlerimiz ─────────────────────────────────────────
    defineField({
      name: "values", title: "Değerlerimiz", type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "title",       title: "Başlık",      type: "string" }),
        defineField({ name: "description", title: "Açıklama",    type: "text", rows: 2 }),
      ]}],
      description: "Maksimum 4 madde önerilir.",
    }),

    // ─── Ekip ─────────────────────────────────────────────────
    defineField({
      name: "teamMembers", title: "Ekip / Kadro", type: "array",
      of: [{ type: "object", fields: [
        defineField({ name: "name",   title: "Ad Soyad", type: "string" }),
        defineField({ name: "role",   title: "Unvan / Pozisyon", type: "string" }),
        defineField({
          name: "photo", title: "Fotoğraf", type: "image", options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
          description: "Önerilen: kare veya dikey, 600×750px.",
        }),
      ]}],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
