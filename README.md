<div align="right">
  <img src="https://img.shields.io/badge/English_EN-2563EB?style=for-the-badge" alt="English" />
  <a href="./README.tr.md">
    <img src="https://img.shields.io/badge/Türkçe_TR-374151?style=for-the-badge" alt="Türkçe" />
  </a>
</div>

# Tüylüoğlu Yaşar İnşaat & Mimarlık — Enterprise Web Platform

An enterprise-grade, high-performance corporate web platform engineered for **Tüylüoğlu Yaşar İnşaat & Mimarlık**. Built on **Next.js 16 App Router** and **Sanity Headless CMS**, the platform delivers an editorial experience, on-demand ISR caching, and an architectural design system tailored for high-end construction and architectural showcases.

---

## 🏛️ Architecture & Tech Stack

| Layer | Technology | Details & Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React 19, Server Components (RSC), Dynamic Segments, Streaming |
| **Headless CMS** | Sanity v5 (`next-sanity`) | Embedded Studio (`/studio`), custom desk structure, Singleton plugins |
| **Styling & Tokens** | Tailwind CSS v4 | Custom design tokens, typography system (*Cormorant Garamond* & *DM Sans*) |
| **UI Components** | shadcn/ui & `@base-ui/react` | Accessible primitives, Sheet drawers, responsive modals |
| **Motion & UX** | Framer Motion v12 | Staggered entrance animations, smooth interactions, custom Lightbox modal |
| **Caching & ISR** | Next.js Cache & Sanity Webhooks | Tag-based on-demand ISR (`revalidateTag`, `revalidatePath`), HMAC verification |
| **SEO & Schema** | Schema.org JSON-LD & Next Metadata | Dynamic metadata builder, OpenGraph cards, dynamic XML Sitemap & Robots |
| **Validation & Env** | Zod & `@t3-oss/env-nextjs` | Strict runtime & build-time environment variable type-safety |
| **Communication** | Nodemailer & Bot Protection | Server-side validated contact endpoint with honeypot spam protection |

---

## 🧩 Core Modules & Functional Capabilities

- **Project Portfolio Showcase**: Multi-category architectural and construction project gallery with dynamic filtering, high-resolution media viewer, and manual curation via Sanity Studio.
- **Service Hub**: Categorized architectural and construction service landing pages with rich PortableText, contextual FAQ modules, and related project links.
- **Editorial Knowledge Hub**: Content marketing and blog system supporting category filtering, reading time estimates, SEO tags, and related post suggestions.
- **Embedded Sanity Studio**: Self-hosted CMS at `/studio` with customized singleton management for site settings, navigation, and page layouts.
- **Live Draft Mode Preview**: Real-time content preview via authenticated Next.js Draft Mode and Sanity tokenized preview client.
- **Secure Lead Capture**: Asynchronous contact forms with server-side validation, anti-spam honeypot traps, and automated email dispatch via SMTP.

---

## 🗺️ Routing Strategy & URL Architecture

```
/                             # Dynamic Landing Page (Hero, Highlights, Metrics, Services, CTA)
├── /hakkimizda               # Corporate Story, Team & Core Values
├── /hizmetler                # Service Index
│   └── /hizmetler/[slug]     # Service Detail (RichText, FAQ, Related Offerings)
├── /projeler                 # Project Portfolio & Category Filters
│   └── /projeler/[slug]      # Project Detail (Specs, High-Res Gallery, Lightbox)
├── /blog                     # Article Hub & Category Filter
├── /[slug]                   # High-Authority Root Slugs for Editorial Articles & Legal Pages
├── /iletisim                 # Contact Form, Corporate Details & Interactive Maps
├── /studio/[[...tool]]       # Embedded Sanity Management Studio
└── /api                      # API Endpoints (/revalidate, /draft, /contact)
```

---

## ⚡ Caching, On-Demand ISR & SEO Standards

### On-Demand Revalidation Flow
Content updates in Sanity trigger a secure webhook payload to `/api/revalidate`. Requests are validated cryptographically using `@sanity/webhook` HMAC SHA256 signatures before purging specific cache tags:

```typescript
// Tag-based cache invalidation mapping
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

### Search Engine Optimization (SEO)
- **JSON-LD Structured Data**: Automated generation of `Organization`, `Article`, `BreadcrumbList`, and `FAQPage` schemas for enhanced SERP rich snippets.
- **Dynamic Metadata**: Centralized `buildMetadata` helper handling canonical URLs, language alternates, and OpenGraph/Twitter media resolution.
- **Dynamic Sitemap**: Dynamic `sitemap.ts` querying Sanity slugs for instant indexation of newly published services, projects, and articles.

---

## 📁 Project Directory Structure

```
src/
├── app/
│   ├── (site)/               # Public-facing application routes & layouts
│   │   ├── page.tsx          # Homepage with dynamic Sanity sections
│   │   ├── [slug]/           # Dynamic root article / legal handler
│   │   ├── blog/             # Blog list and category filters
│   │   ├── hakkimizda/       # About page
│   │   ├── hizmetler/        # Services index & dynamic detail pages
│   │   ├── projeler/         # Projects showcase & dynamic detail pages
│   │   └── iletisim/         # Contact page
│   ├── api/
│   │   ├── contact/          # Lead form submission with honeypot protection
│   │   ├── draft/            # Draft Mode enable / disable endpoints
│   │   └── revalidate/       # HMAC-authenticated on-demand ISR webhook
│   ├── studio/               # Embedded Sanity Studio route
│   ├── layout.tsx            # Global root layout with theme & font providers
│   ├── sitemap.ts            # Dynamic XML Sitemap generator
│   └── robots.ts             # Search engine crawling rules
├── components/
│   ├── forms/                # ContactForm and form UI primitives
│   ├── home/                 # Hero, Services, Projects, WhyUs & Marquee sections
│   ├── layout/               # Header, Footer, HeaderSpacer & WhatsApp button
│   ├── projects/             # ProjectsGrid with category filter client component
│   ├── seo/                  # JsonLd component and Schema.org generators
│   └── ui/                   # SanityImage, RichText, Lightbox, FadeIn, AnimateGroup
├── lib/
│   ├── env.ts                # T3 Env & Zod runtime schema validation
│   ├── seo.ts                # Metadata builder and OpenGraph generators
│   └── utils.ts              # Class merging (`cn`), formatting helpers
└── sanity/
    ├── lib/                  # Sanity Client, Image URL builder & GROQ queries
    ├── plugins/              # Custom singleton plugins
    ├── schemaTypes/          # Document, singleton & object schemas
    └── structure.ts          # Studio panel navigation and grouping
```

---

## 🔒 Security & Engineering Standards

- **Strict Env Validation**: System environment variables are checked at runtime and build time using `@t3-oss/env-nextjs` and `zod` to prevent misconfigured deployments.
- **Zero Token Leakage**: Private Sanity tokens and SMTP credentials are strictly isolated to Server Components and Route Handlers.
- **HMAC Signature Verification**: ISR webhook endpoint rejects any payload missing valid Sanity cryptographic signatures.
- **Defensive API Architecture**: Contact endpoint implements payload validation, email sanitization, and honeypot traps to prevent automated abuse.
