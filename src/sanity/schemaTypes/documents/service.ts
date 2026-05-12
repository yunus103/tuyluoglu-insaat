import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Hizmet",
  type: "document",
  groups: [
    { name: "content",  title: "İçerik" },
    { name: "faq",     title: "SSS" },
    { name: "meta",    title: "Meta" },
    { name: "seo",     title: "SEO" },
  ],
  fields: [
    defineField({ name: "title",   title: "Başlık",        type: "string", group: "meta", validation: (Rule) => Rule.required() }),
    defineField({ name: "excerpt", title: "Kısa Açıklama", type: "text",   group: "meta", rows: 2, description: "Ana sayfada hizmet adının altında görünür. 1-2 cümle yeterli." }),
    defineField({
      name: "serviceCategory",
      title: "Hizmet Kategorisi",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "İnşaat", value: "insaat" },
          { title: "Mimarlık", value: "mimarlik" },
        ],
        layout: "radio",
      },
      initialValue: "insaat",
      description: "Ana sayfada hizmetlerin hangi tab altında gösterileceğini belirler.",
    }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "meta", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "İçerik (Uzun Yazı)",
      type: "array",
      group: "content",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "alignment",
              title: "Hizalama",
              type: "string",
              options: { list: [{ title: "Sol", value: "left" }, { title: "Orta", value: "center" }, { title: "Sağ", value: "right" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Boyut",
              type: "string",
              options: { 
                list: [
                  { title: "Çok Küçük (%25)", value: "25" },
                  { title: "Küçük (%33)", value: "33" },
                  { title: "Orta (%50)", value: "50" },
                  { title: "Geniş (%75)", value: "75" },
                  { title: "Tam Genişlik (%100)", value: "100" }
                ] 
              },
              initialValue: "100",
            }),
          ],
        },
        { type: "customHtml" },
      ],
    }),
    defineField({
      name: "features",
      title: "Öne Çıkan Özellikler (opsiyonel)",
      type: "array",
      group: "content",
      of: [{ type: "object", fields: [
        defineField({ name: "text", title: "Özellik", type: "string" }),
      ]}],
      description: "Hizmet detay sayfasında kullanılabilir. Ör: Proforma Hesaplama, Anahtar Teslim Hizmet",
    }),
    // ─── SSS ──────────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "Sıkça Sorulan Sorular (SSS)",
      type: "array",
      group: "faq",
      of: [{
        type: "object",
        preview: { select: { title: "question", subtitle: "answer" } },
        fields: [
          defineField({ name: "question", title: "Soru",  type: "string", validation: (Rule) => Rule.required() }),
          defineField({ name: "answer",   title: "Cevap", type: "text",   rows: 3, validation: (Rule) => Rule.required() }),
        ],
      }],
      description: "Hizmet sayfasında accordion olarak görünür, Google rich snippet (FAQPage) için de kullanılır.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
