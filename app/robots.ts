import type { MetadataRoute } from "next"
import { getSettings } from "@/lib/settings"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  const siteUrl = settings["site.url"] || "https://yourdomain.com"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

