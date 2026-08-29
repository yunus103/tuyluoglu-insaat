<div align="right">
  <a href="./README.md">
    <img src="https://img.shields.io/badge/English_EN-374151?style=for-the-badge" alt="English" />
  </a>
  <img src="https://img.shields.io/badge/Türkçe_TR-2563EB?style=for-the-badge" alt="Türkçe" />
</div>

# Tüylüoğlu Yaşar İnşaat & Mimarlık — Kurumsal Web Platformu

**Tüylüoğlu Yaşar İnşaat & Mimarlık** için özel olarak geliştirilmiş kurumsal web platformu. **Next.js 16 App Router** ve **Sanity Headless CMS** mimarisi üzerine inşa edilen platform; üst düzey editoryal yönetim, talep anında (on-demand) ISR önbellekleme ve inşaat/mimarlık sektörüne özel tasarım sistemi sunmaktadır.

---

## 🏛️ Mimari ve Teknoloji Yığını

| Katman | Teknoloji | Detay ve Kullanım Amacı |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React 19, Sunucu Bileşenleri (RSC), Dinamik Segmentler, Streaming |
| **Headless CMS** | Sanity v5 (`next-sanity`) | Gömülü Studio (`/studio`), özel panel yapısı, Singleton eklentileri |
| **Tasarım & Token'lar** | Tailwind CSS v4 | Özel tasarım token'ları, tipografi mimarisi (*Cormorant Garamond* & *DM Sans*) |
| **UI Bileşenleri** | shadcn/ui & `@base-ui/react` | Erişilebilir temel bileşenler, Sheet çekmeceleri, duyarlı modallar |
| **Animasyon & UX** | Framer Motion v12 | Kademeli (staggered) giriş animasyonları, akıcı geçişler, özel Lightbox modalı |
| **Önbellek & ISR** | Next.js Cache & Sanity Webhook | Etiket bazlı talep anında ISR (`revalidateTag`, `revalidatePath`), HMAC doğrulaması |
| **SEO & Schema** | Schema.org JSON-LD & Next Metadata | Dinamik metadata üretimi, OpenGraph kartları, dinamik XML Sitemap & Robots |
| **Doğrulama & Env** | Zod & `@t3-oss/env-nextjs` | Derleme ve çalışma zamanı (runtime) tip güvenli ortam değişkenleri |
| **İletişim & Entegrasyon** | Nodemailer & Bot Koruması | Honeypot spam korumalı, sunucu taraflı doğrulanmış iletişim uç noktası |

---

## 🧩 Temel Modüller ve Fonksiyonel Özellikler

- **Proje Portföy Vitrini**: Kategori filtreli, yüksek çözünürlüklü Lightbox galeriye sahip ve Sanity Studio üzerinden sıralaması manuel yönetilebilen dinamik mimarlık & inşaat proje kataloğu.
- **Hizmet Modülleri**: İnşaat ve mimarlık kategorilerine ayrılmış, zengin PortableText içerikli, dinamik SSS (FAQ) alanlarına ve ilgili proje yönlendirmelerine sahip hizmet sayfaları.
- **Editoryal Blog & Makale Merkezi**: Kategori bazlı filtreleme, tahmini okuma süresi, SEO etiketleri ve ilişkili yazı önerileri sunan kurumsal içerik platformu.
- **Gömülü Sanity Studio**: `/studio` yolunda çalışan, site ayarları, navigasyon ve sayfa içeriklerini yöneten kurumsal CMS paneli.
- **Canlı Önizleme (Draft Mode)**: Next.js Draft Mode ve Sanity token mekanizması ile henüz yayınlanmamış içerikleri anlık önizleme imkânı (`previewDrafts`).
- **Güvenli Talep & İletişim Formu**: Sunucu taraflı doğrulama, honeypot spam bot tuzağı ve SMTP üzerinden otomatik e-posta iletimi.

---

## 🗺️ Yönlendirme (Routing) ve URL Mimarisi

```
/                             # Dinamik Ana Sayfa (Hero, Öne Çıkanlar, Metrikler, Hizmetler, CTA)
├── /hakkimizda               # Kurumsal Hikaye, Ekip ve Temel Değerler
├── /hizmetler                # Hizmet Listesi
│   └── /hizmetler/[slug]     # Hizmet Detayı (RichText, SSS, İlgili Çözümler)
├── /projeler                 # Proje Portföyü ve Kategori Filtresi
│   └── /projeler/[slug]      # Proje Detayı (Teknik Özellikler, Galeri, Lightbox)
├── /blog                     # Blog / Haber Merkezi ve Kategori Filtresi
├── /[slug]                   # Yüksek Otoriteli Kök URL (Blog Makaleleri ve Yasal Sayfalar)
├── /iletisim                 # İletişim Formu, Şirket Bilgileri ve Harita Entegrasyonu
├── /studio/[[...tool]]       # Gömülü Sanity Studio Yönetim Paneli
└── /api                      # API Uç Noktaları (/revalidate, /draft, /contact)
```

---

## ⚡ Önbellekleme, Anlık ISR ve SEO Standartları

### Talep Anında Yenileme (On-Demand ISR) Akışı
Sanity üzerinde yapılan her içerik güncellemesi, `/api/revalidate` uç noktasına güvenli bir webhook gönderir. İstekler `@sanity/webhook` paketi ile HMAC SHA256 imza kontrolünden geçtikten sonra yalnızca ilgili önbellek etiketleri temizlenir:

```typescript
// Etiket bazlı önbellek geçersiz kılma haritası
const tagMap: Record<string, string[]> = {
  siteSettings: ["layout"],
  navigation:   ["layout"],
  homePage:     ["home"],
  aboutPage:    ["about"],
  contactPage:  ["contact"],
  blogPost:     ["blog"],
  service:      ["services"],
  project:      ["projects"],
  legalPage:    ["legal"],
  faq:          ["faq"],
};
```

### Arama Motoru Optimizasyonu (SEO)
- **JSON-LD Yapılandırılmış Veri**: Arama motoru zengin sonuçları (rich snippets) için `Organization`, `Article`, `BreadcrumbList` ve `FAQPage` şemalarının dinamik üretimi.
- **Dinamik Metadata Mimarisi**: Canonical URL, dil etiketleri ve OpenGraph/Twitter kartlarını yöneten merkezi `buildMetadata` yapısı.
- **Dinamik Sitemap**: Yeni eklenen hizmet, proje ve makaleleri anında dizine ekleten dinamik `sitemap.ts` altyapısı.

---

## 📁 Proje Dizin Yapısı

```
src/
├── app/
│   ├── (site)/               # Ziyaretçilere açık sayfa rotaları ve düzenleri
│   │   ├── page.tsx          # Sanity bağlantılı dinamik ana sayfa
│   │   ├── [slug]/           # Kök URL makale ve yasal sayfa işleyicisi
│   │   ├── blog/             # Blog listesi ve kategori filtreleme
│   │   ├── hakkimizda/       # Hakkımızda kurumsal sayfası
│   │   ├── hizmetler/        # Hizmetler dizini ve dinamik detay sayfaları
│   │   ├── projeler/         # Projeler vitrini ve dinamik detay sayfaları
│   │   └── iletisim/         # İletişim sayfası
│   ├── api/
│   │   ├── contact/          # Honeypot korumalı iletişim formu uç noktası
│   │   ├── draft/            # Draft Mode aktifleştirme / devre dışı bırakma
│   │   └── revalidate/       # HMAC doğrulamalı anlık ISR webhook'u
│   ├── studio/               # Gömülü Sanity Studio rotası
│   ├── layout.tsx            # Global kök layout (Tema & Font sağlayıcıları)
│   ├── sitemap.ts            # Dinamik XML Sitemap üreticisi
│   └── robots.ts             # Arama motoru tarama kuralları
├── components/
│   ├── forms/                # ContactForm ve form UI bileşenleri
│   ├── home/                 # Hero, Services, Projects, WhyUs & Marquee bölümleri
│   ├── layout/               # Header, Footer, HeaderSpacer & WhatsApp butonu
│   ├── projects/             # Kategori filtreli ProjectsGrid istemci bileşeni
│   ├── seo/                  # JsonLd bileşeni ve Schema.org oluşturucuları
│   └── ui/                   # SanityImage, RichText, Lightbox, FadeIn, AnimateGroup
├── lib/
│   ├── env.ts                # T3 Env & Zod çalışma zamanı şema doğrulaması
│   ├── seo.ts                # Metadata oluşturucu ve OpenGraph yardımcıları
│   └── utils.ts              # Sınıf birleştirme (`cn`), tarih biçimlendirme
└── sanity/
    ├── lib/                  # Sanity Client, Image URL oluşturucu & GROQ sorguları
    ├── plugins/              # Özel singleton eklentileri
    ├── schemaTypes/          # Doküman, singleton ve obje şemaları
    └── structure.ts          # Studio sol panel hiyerarşisi ve gruplandırması
```

---

## 🔒 Güvenlik ve Mühendislik Standartları

- **Tip Güvenli Ortam Değişkenleri**: Sistem ortam değişkenleri, derleme ve çalışma anında `@t3-oss/env-nextjs` ve `zod` ile doğrulanarak hatalı yapılandırmalar engellenir.
- **Sıfır Token Sızıntısı**: Gizli Sanity API token'ları ve SMTP kimlik bilgileri sadece sunucu tarafında (RSC ve API Route) tutulur, istemciye sızdırılmaz.
- **HMAC İmza Doğrulaması**: ISR webhook uç noktası, geçerli kriptografik imza içermeyen yetkisiz istekleri reddeder.
- **Savunmacı API Mimarisi**: İletişim API rotası, otomatik bot saldırılarına karşı honeypot tuzağı, veri temizleme ve girdi doğrulama mekanizmaları barındırır.
