import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  groups: [
    { name: "general", title: "Genel Ayarlar" },
    { name: "contact", title: "İletişim ve Sosyal Medya" },
    { name: "seo", title: "SEO ve Analitik" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Site Adı", type: "string", group: "general", validation: (Rule) => Rule.required() }),
    defineField({ name: "siteTagline", title: "Slogan", type: "string", group: "general" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
      options: { hotspot: true },
      description: "Önerilen: 400x120px (Yatay) veya 200x200px (Kare). Şeffaf PNG veya SVG tercih edilmelidir.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternatif Metin",
          type: "string",
          description: "Görsel yüklenemediğinde görünecek olan yazı (Örn: Şirket Logo)",
        }),
      ],
    }),
    defineField({ name: "favicon", title: "Favicon", type: "image", group: "general", description: "512x512px kare görsel önerilir." }),
    defineField({ name: "defaultOgImage", title: "Varsayılan OG Görseli", type: "image", group: "seo", description: "Sosyal medya paylaşımları için. 1200x630px." }),
    defineField({
      name: "defaultSeo",
      title: "Varsayılan SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Başlık", type: "string", validation: (Rule) => Rule.max(60) }),
        defineField({ name: "metaDescription", title: "Meta Açıklama", type: "text", rows: 3, validation: (Rule) => Rule.max(160) }),
      ],
    }),
    defineField({
      name: "contactInfo",
      title: "İletişim Bilgileri",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "phone", title: "Telefon", type: "string" }),
        defineField({ name: "email", title: "E-posta", type: "string" }),
        defineField({ name: "address", title: "Adres", type: "text", rows: 3 }),
        defineField({
          name: "whatsappNumber",
          title: "WhatsApp Numarası",
          type: "string",
          description: "Başında + ile ülke kodu dahil. Örn: +905001234567",
        }),
        defineField({
          name: "mapIframe",
          title: "Harita iFrame Kodu",
          type: "text",
          rows: 4,
          description: "Google Maps > Paylaş > Haritayı göm > HTML kodunu buraya yapıştır.",
        }),
      ],
    }),
    defineField({ name: "socialLinks", title: "Sosyal Medya Hesapları", type: "array", group: "contact", of: [{ type: "socialLink" }] }),
    defineField({ name: "gaId", title: "Google Analytics ID", type: "string", group: "seo", description: "Örn: G-XXXXXXXXXX" }),
    defineField({ name: "gtmId", title: "Google Tag Manager ID", type: "string", group: "seo", description: "Örn: GTM-XXXXXXX" }),
    defineField({
      name: "googleSearchConsoleId",
      title: "Google Search Console Doğrulama Kodu",
      type: "string",
      group: "seo",
      description: "Search Console meta etiketi içerisindeki 'content' değerini buraya girin. Örn: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    }),
  ],
  preview: { select: { title: "siteName" } },
});
