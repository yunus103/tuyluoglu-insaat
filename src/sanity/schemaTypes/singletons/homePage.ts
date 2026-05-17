import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "about", title: "Hakkımızda" },
    { name: "services", title: "Hizmetler" },
    { name: "whyUs", title: "Neden Biz" },
    { name: "projects", title: "Projeler" },
    { name: "cta", title: "Alt Banner (CTA)" },
    { name: "seo", title: "SEO" },
  ],
  fields: [

    // ─── Hero ────────────────────────────────────────────────
    defineField({
      name: "heroVideoUrl",
      title: "Hero Video URL",
      type: "url",
      group: "hero",
      description: "CDN'deki video URL'si (Cloudinary, Bunny.net, S3 vb.). MP4 formatı önerilir.",
    }),
    defineField({
      name: "heroPosterImage",
      title: "Hero Poster / Fallback Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Metni", type: "string" }),
      ],
      description: "Video yüklenirken veya video yokken gösterilecek görsel. Önerilen: videonun ilk karesi. 1920×1080px.",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero Buton Metni",
      type: "string",
      group: "hero",
      initialValue: "Projelerimizi İnceleyin",
    }),
    defineField({
      name: "heroCtaLink",
      title: "Hero Buton Linki",
      type: "string",
      group: "hero",
      initialValue: "/projeler",
      description: "Örn: /projeler, /iletisim",
    }),

    // ─── Hakkımızda Section ───────────────────────────────────
    defineField({
      name: "aboutTitle",
      title: "Hakkımızda Başlık",
      type: "string",
      group: "about",
      initialValue: "1985'ten Beri Güven",
    }),
    defineField({
      name: "aboutText",
      title: "Hakkımızda Metin",
      type: "text",
      group: "about",
      rows: 4,
      initialValue: "Tüylüoğlu İnşaat olarak 1985'ten bu yana güvenli ve kaliteli yapılar inşa ediyoruz. Konut, ticari ve kentsel dönüşüm projelerinde edindiğimiz derin tecrübe ile her projeyi titizlikle teslim ediyoruz.",
    }),
    defineField({
      name: "aboutImage",
      title: "Hakkımızda Görseli",
      type: "image",
      group: "about",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),
    defineField({
      name: "stats",
      title: "İstatistikler",
      type: "array",
      group: "about",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Değer", type: "string", description: "Örn: 1985, 19+, %100" }),
            defineField({ name: "label", title: "Etiket", type: "string", description: "Örn: Kuruluş Yılı, Tamamlanan Proje" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      initialValue: [
        { value: "1985", label: "Kuruluş Yılı" },
        { value: "19+", label: "Tamamlanan Proje" },
        { value: "38+", label: "Yıllık Deneyim" },
        { value: "100%", label: "Zamanında Teslimat" },
      ],
    }),

    // ─── Hizmetler Section (ana sayfa) ────────────────────────
    defineField({
      name: "servicesTitle",
      title: "Hizmetler Bölüm Başlığı",
      type: "string",
      group: "services",
      initialValue: "Hizmetlerimiz",
    }),
    defineField({
      name: "featuredServices",
      title: "Öne Çıkan Hizmetler",
      type: "array",
      group: "services",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      description: "Ana sayfada gösterilecek hizmetleri seçin. Sıraya göre listelenir.",
    }),
    defineField({
      name: "insaatTabImage",
      title: "İnşaat Tab Görseli",
      type: "image",
      group: "services",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      description: "Hizmetler bölümünde İnşaat tabı açıkken sol panelde görünecek fotoğraf. Önerilen: dikey, 900×1100px.",
    }),
    defineField({
      name: "mimarlikTabImage",
      title: "Mimarlık Tab Görseli",
      type: "image",
      group: "services",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      description: "Hizmetler bölümünde Mimarlık tabı açıkken sol panelde görünecek fotoğraf. Önerilen: dikey, 900×1100px.",
    }),

    // ─── Neden Biz Section ────────────────────────────────────
    defineField({
      name: "whyUsTitle",
      title: "Neden Biz Başlık",
      type: "string",
      group: "whyUs",
      initialValue: "Neden Tüylüoğlu İnşaat?",
    }),
    defineField({
      name: "whyUsItems",
      title: "Neden Biz Maddeleri",
      type: "array",
      group: "whyUs",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Başlık", type: "string" }),
            defineField({ name: "description", title: "Açıklama", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
      initialValue: [
        { title: "Deneyim", description: "1985'ten bu yana inşaat ve mimarlık sektöründe kesintisiz faaliyet gösteriyoruz." },
        { title: "Kalite", description: "Her projede en yüksek kalite standartlarını ve malzeme seçimini uyguluyoruz." },
        { title: "Güven", description: "Zamanında teslimat ve şeffaf iletişim politikamızla müşteri memnuniyetini ön planda tutuyoruz." },
        { title: "Uzmanlık", description: "İnşaat ve mimarlık alanında uzman kadromuzla projelerin her aşamasını titizlikle yönetiyoruz." },
      ],
    }),

    // ─── Projeler Section (ana sayfa) ─────────────────────────
    defineField({
      name: "projectsTitle",
      title: "Projeler Bölüm Başlığı",
      type: "string",
      group: "projects",
      initialValue: "Projelerimiz",
    }),
    defineField({
      name: "featuredProjects",
      title: "Öne Çıkan Projeler",
      type: "array",
      group: "projects",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Ana sayfada gösterilecek projeleri seçin ve sürükleyerek sıralayın. Seçilmezse en son eklenen 3 proje otomatik gösterilir. (Arayüz tasarımı gereği tam 3 adet seçilmesi önerilir).",
    }),

    // ─── CTA Section ──────────────────────────────────────────
    defineField({
      name: "ctaTitle",
      title: "CTA Başlık",
      type: "string",
      group: "cta",
      initialValue: "Güvenli Yapılar, Sağlam Gelecekler",
    }),
    defineField({
      name: "ctaSubtitle",
      title: "CTA Alt Başlık",
      type: "string",
      group: "cta",
      initialValue: "Yılların Tecrübesiyle, Güvenli Yaşam Alanları İnşa Ediyoruz",
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "CTA Buton Metni",
      type: "string",
      group: "cta",
      initialValue: "İletişime Geçin",
    }),

    // ─── SEO ──────────────────────────────────────────────────
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
