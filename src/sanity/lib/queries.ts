import { groq } from "next-sanity";

// ─── Layout ────────────────────────────────────────────────────────────────────
// Her sayfada bir kez çekilir — header, footer, global ayarlar
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline,
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    socialLinks[] { platform, url },
    gaId, gtmId, googleSearchConsoleId
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } },
    footerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } }
  }
}`;

// ─── Ana Sayfa ─────────────────────────────────────────────────────────────────
export const homePageQuery = groq`*[_type == "homePage"][0] {
  // Hero
  heroVideoUrl,
  heroPosterImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  heroCtaLabel,
  heroCtaLink,

  // Hakkımızda
  aboutTitle, aboutText,
  aboutImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  stats[] { value, label },

  // Hizmetler
  servicesTitle,
  featuredServices[]->{
    _id, title, excerpt, serviceCategory, slug,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
  },
  insaatTabImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  mimarlikTabImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },

  // Neden Biz
  whyUsTitle,
  whyUsItems[] { title, description },

  // Projeler
  projectsTitle,

  // CTA
  ctaTitle, ctaSubtitle, ctaButtonLabel,

  seo,

  // İlgili içerikler — ayrı sorgu yerine burada çek
  "featuredProjects": select(
    defined(featuredProjects) && count(featuredProjects) > 0 => featuredProjects[]->{
      title, slug,
      mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
    },
    *[_type == "project"] | order(_createdAt desc)[0...3] {
      title, slug,
      mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
    }
  )
}`;

// ─── Hakkımızda Sayfası ────────────────────────────────────────────────────────
export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  heroTitle, heroSubtitle,
  pageTitle, pageSubtitle,
  storyTitle, body,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  stats[] { value, label },
  values[] { title, description },
  teamMembers[] {
    name, role, isFounder, shortBio,
    photo { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
  },
  seo
}`;

// ─── İletişim Sayfası ─────────────────────────────────────────────────────────
export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  heroTitle, heroSubtitle,
  pageTitle, pageSubtitle,
  formTitle, successMessage, workingHours,
  seo
}`;

// ─── Blog Sayfası ─────────────────────────────────────────────────────────────
export const blogPageQuery = groq`*[_type == "blogPage"][0] {
  heroTitle, heroSubtitle,
  pageTitle, pageSubtitle,
  ctaLabel, ctaLink, seo,
  featuredPost-> {
    title, slug, excerpt, publishedAt, category->{ title, slug },
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
  }
}`;

// ─── Hizmetler Sayfası ────────────────────────────────────────────────────────
export const servicesPageQuery = groq`*[_type == "servicesPage"][0] {
  heroTitle, heroSubtitle,
  pageTitle, pageSubtitle,
  ctaLabel, ctaLink, seo
}`;

// ─── Projeler Sayfası ─────────────────────────────────────────────────────────
export const projectsPageQuery = groq`*[_type == "projectsPage"][0] {
  heroTitle, heroSubtitle,
  pageTitle, pageSubtitle,
  ctaLabel, ctaLink, seo,
  "orderedProjects": projectsOrder[]->{
    _id, title, slug, category, location, period, status,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
  }
}`;

// ─── Blog ──────────────────────────────────────────────────────────────────────
export const blogListQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{ title, slug },
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, publishedAt, excerpt, category->{ _id, title, slug }, seoTags,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt, alignment, size, hotspot, crop
    }
  },
  seo
}`;

export const blogCategoriesQuery = groq`*[_type == "blogCategory"] | order(title asc) {
  _id, title, slug
}`;

export const blogListByCategorySlugQuery = groq`*[_type == "blogPost" && category->slug.current == $slug] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{ title, slug },
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const blogRelatedPostsQuery = groq`*[_type == "blogPost" && category._ref == $categoryId && _id != $currentPostId] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, category->{ title, slug },
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

// Sidebar sorguları
export const sidebarProjectsQuery = groq`*[_type == "project"] | order(_createdAt desc)[0...3] {
  _id, title, slug, location,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt }
}`;

export const sidebarServicesQuery = groq`*[_type == "service"] | order(_createdAt asc) {
  _id, title, slug, serviceCategory
}`;

// ─── Hizmetler ─────────────────────────────────────────────────────────────────
export const serviceListQuery = groq`*[_type == "service"] | order(_createdAt asc) {
  title, slug, excerpt, serviceCategory,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0] {
  title, slug, excerpt, serviceCategory,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  faq[] { question, answer },
  seo,
  "allServices": *[_type == "service"] | order(_createdAt asc) {
    title, slug, serviceCategory
  }
}`;

// ─── Projeler ──────────────────────────────────────────────────────────────────
export const projectListQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id, title, slug, category, location, period, status,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  title, slug, category, location, period, status,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  gallery[] {
    asset->{ _id, url, metadata { lqip, dimensions } },
    alt, hotspot, crop
  },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  seo
}`;

// Aynı kategoriden diğer projeler (detay sayfasında "Diğer Projeler")
export const relatedProjectsQuery = groq`*[_type == "project" && category == $category && slug.current != $slug] | order(_createdAt desc)[0...3] {
  title, slug, category, location, period, status,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

// ─── Yasal Sayfalar ────────────────────────────────────────────────────────────
export const legalPageBySlugQuery = groq`*[_type == "legalPage" && slug.current == $slug][0] {
  title, slug, body, _updatedAt, seo
}`;

// ─── Sitemap ───────────────────────────────────────────────────────────────────
export const allSlugsForSitemapQuery = groq`{
  "blogPosts": *[_type == "blogPost" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "projects":  *[_type == "project"  && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "services":  *[_type == "service"  && defined(slug.current)] { "slug": slug.current, _updatedAt }
}`;

// ─── Varsayılan SEO ────────────────────────────────────────────────────────────
export const defaultSeoQuery = groq`*[_type == "siteSettings"][0] {
  "title": defaultSeo.metaTitle,
  "description": defaultSeo.metaDescription,
  "ogImage": defaultOgImage,
  siteName,
  siteTagline,
  favicon { asset->{ _id, url } },
  googleSearchConsoleId
}`;
