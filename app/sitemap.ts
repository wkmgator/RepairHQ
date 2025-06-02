import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://repairhq.io"

  // Core pages
  const corePages = ["", "pricing", "features", "about", "contact", "auth/signin", "auth/signup"]

  // Vertical pages
  const verticals = [
    "phone-repair",
    "auto-repair",
    "appliance-repair",
    "computer-repair",
    "jewelry-repair",
    "watch-repair",
  ]

  // Location pages
  const locations = ["new-york", "los-angeles", "chicago", "houston", "phoenix"]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add core pages
  corePages.forEach((page) => {
    sitemapEntries.push({
      url: `${baseUrl}/${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "" ? 1 : 0.8,
    })
  })

  // Add vertical pages
  verticals.forEach((vertical) => {
    sitemapEntries.push({
      url: `${baseUrl}/repair/${vertical}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  })

  // Add location pages
  locations.forEach((location) => {
    sitemapEntries.push({
      url: `${baseUrl}/locations/${location}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  })

  return sitemapEntries
}
