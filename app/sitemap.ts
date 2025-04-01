import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { getSettings } from "@/lib/settings"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const baseUrl = settings["site.url"] || "https://yourdomain.com"

  // Get all games
  const games = await db.game.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  // Get all categories
  const categories = await db.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]

  // Game pages
  const gamePages = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/games?category=${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...gamePages, ...categoryPages]
}

