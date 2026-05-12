import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "story", title: "Hikayemiz" },
    { name: "stats", title: "İstatistikler" },
    { name: "values", title: "Değerlerimiz" },
    { name: "team", title: "Ekibimiz" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ─── PageHero ────────────────────────────────────────────
    defineField({ name: "heroTitle",    title: "Hero Başlığı",     type: "string", group: "hero", initialValue: "1985'ten Beri Güven" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   group: "hero", rows: 2, initialValue: "Dört nesil boyunca sürdürülen mimarlık ve inşaat uzmanlığı." }),

    // ─── Legacy (SEO fallback) ────────────────────────────────
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string", group: "seo", initialValue: "Hakkımızda | Tüylüoğlu İnşaat", description: "Tarayıcı sekmesi ve arama sonuçları için." }),
    defineField({ name: "pageSubtitle", title: "SEO Meta Açıklaması",     type: "text",   group: "seo", rows: 2 }),

    // ─── Hikaye Section ───────────────────────────────────────
    defineField({ name: "storyTitle", title: "Hikaye Başlığı", type: "string", group: "story", initialValue: "Köklü Bir Miras" }),
    defineField({ name: "body",       title: "Hikaye İçeriği", type: "array",  group: "story", of: [{ type: "block" }] }),
    defineField({
      name: "mainImage", title: "Hikaye Görseli", type: "image", group: "story", options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),

    // ─── İstatistikler ────────────────────────────────────────
    defineField({
      name: "stats", title: "İstatistikler", type: "array", group: "stats",
      of: [{ type: "object", fields: [
        defineField({ name: "value", title: "Değer", type: "string", description: "Ör: 38+" }),
        defineField({ name: "label", title: "Etiket", type: "string", description: "Ör: Yıllık Deneyim" }),
      ]}],
    }),

    // ─── Değerlerimiz ─────────────────────────────────────────
    defineField({
      name: "values", title: "Değerlerimiz", type: "array", group: "values",
      of: [{ type: "object", fields: [
        defineField({ name: "title",       title: "Başlık",      type: "string" }),
        defineField({ name: "description", title: "Açıklama",    type: "text", rows: 2 }),
      ]}],
      description: "Maksimum 4 madde önerilir.",
    }),

    // ─── Ekip ─────────────────────────────────────────────────
    defineField({
      name: "teamMembers", title: "Ekip / Kadro", type: "array", group: "team",
      description: "İlk sıradaki kişi firma sahibi olarak büyük spotlightta gösterilir. Diğerleri sadece isim + unvan olarak listelenir.",
      of: [{ type: "object", fields: [
        defineField({ name: "name",   title: "Ad Soyad", type: "string" }),
        defineField({ name: "role",   title: "Unvan / Pozisyon", type: "string" }),
        defineField({
          name: "isFounder", title: "Firma Sahibi / Kurucu mu?", type: "boolean",
          description: "Evet ise bu kişi büyük fotoğraflı spotlight alanında gösterilir.",
          initialValue: false,
        }),
        defineField({
          name: "shortBio", title: "Kısa Biyografi (opsiyonel)", type: "text", rows: 2,
          description: "Sadece firma sahibi için gösterilir. Kısa bir tanıtım cümlesi.",
        }),
        defineField({
          name: "photo", title: "Fotoğraf", type: "image", options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
          description: "Önerilen: kare veya dikey, 600×750px. Sadece firma sahibi için kullanılır.",
        }),
      ]}],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
