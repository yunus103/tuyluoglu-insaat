import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "İletişim Sayfası",
  type: "document",
  fields: [
    defineField({ name: "heroTitle",    title: "Hero Başlığı",        type: "string", initialValue: "İletişim" }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Açıklaması", type: "text",   rows: 2, initialValue: "Projeniz hakkında konuşmak için bize ulaşın." }),
    defineField({ name: "pageTitle",    title: "SEO Sayfa Başlığı (meta)", type: "string" }),
    defineField({ name: "pageSubtitle", title: "Giriş Metni",              type: "text", rows: 3 }),
    defineField({ name: "formTitle",    title: "Form Başlığı",             type: "string", initialValue: "Bize Ulaşın" }),
    defineField({
      name: "successMessage", title: "Form Başarı Mesajı", type: "text", rows: 2,
      initialValue: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
    }),
    defineField({ name: "workingHours", title: "Çalışma Saatleri", type: "string", description: "Ör: Pzt–Cum 08:00–18:00", initialValue: "Pzt – Cum: 08:00 – 18:00" }),
    defineField({ name: "seo",          title: "SEO",              type: "seo" }),
  ],
});
