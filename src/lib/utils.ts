import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale = "tr-TR"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Trim and remove trailing slashes
  url = url.trim().replace(/\/+$/, "");
  
  // Ensure http or https prefix
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Determine if localhost to use http instead of https
    if (url.includes("localhost")) {
      url = `http://${url}`;
    } else {
      url = `https://${url}`;
    }
  }
  return url;
}
