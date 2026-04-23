import { defineField, defineType } from "sanity";

/**
 * İnşaat/mimarlık sektöründe yaygın kullanılan proje kategorileri.
 * Statik liste — CMS'ten yönetilmez, frontend'de filtreleme için kullanılır.
 */
const PROJECT_CATEGORIES = [
  { title: "Konut",              value: "konut" },
  { title: "Villa",              value: "villa" },
  { title: "Apartman",           value: "apartman" },
  { title: "Rezidans",           value: "rezidans" },
  { title: "Ticari",             value: "ticari" },
  { title: "Ofis",               value: "ofis" },
  { title: "Otel",               value: "otel" },
  { title: "Kentsel Dönüşüm",    value: "kentsel-donusum" },
  { title: "Kat Karşılığı",      value: "kat-karsiligi" },
  { title: "Mimarlık Projesi",   value: "mimarlik-projesi" },
  { title: "Restorasyon",        value: "restorasyon" },
  { title: "Endüstriyel",        value: "endustriyel" },
];

export const projectType = defineType({
  name: "project",
  title: "Proje",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: PROJECT_CATEGORIES,
        layout: "dropdown",
      },
      description: "Projeler sayfasında filtreleme için kullanılır.",
    }),
    defineField({
      name: "location",
      title: "Konum",
      type: "string",
      description: "Örn: İstanbul, Kadıköy",
    }),
    defineField({
      name: "year",
      title: "Yapım Yılı",
      type: "number",
      description: "Örn: 2023",
    }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Metni",
          type: "string",
          description: "Örn: İstanbul Kadıköy konut projesi dış cephe",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Fotoğraf Galerisi",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Metni",
              type: "string",
              description: "Fotoğrafın kısa açıklaması (SEO için önemli)",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: "Proje detay sayfasında lightbox ile gösterilecek fotoğraflar. Önerilen boyut: 1920×1280px.",
    }),
    defineField({
      name: "excerpt",
      title: "Kısa Açıklama",
      type: "text",
      rows: 3,
      description: "Projeler listesinde ve SEO için kullanılır. Maksimum 160 karakter.",
    }),
    defineField({
      name: "body",
      title: "Proje Detayı",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Metni",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alignment",
              title: "Hizalama",
              type: "string",
              options: {
                list: [
                  { title: "Sol", value: "left" },
                  { title: "Orta", value: "center" },
                  { title: "Sağ", value: "right" },
                  { title: "Tam Genişlik", value: "full" },
                ],
              },
              initialValue: "center",
            }),
          ],
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "mainImage",
    },
    prepare({ title, subtitle, media }) {
      const cat = PROJECT_CATEGORIES.find((c) => c.value === subtitle);
      return { title, subtitle: cat?.title || subtitle || "Kategori yok", media };
    },
  },
});
