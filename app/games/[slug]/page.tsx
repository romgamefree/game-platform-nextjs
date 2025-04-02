import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getGameBySlug, getRelatedGames } from "@/lib/data"
import { GameEmbed } from "@/components/game-embed"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { Share, Maximize2 } from "lucide-react"
import { getSettings, getSetting } from "@/lib/settings"
import { FullscreenButton } from "../../components/fullscreen-button"
import { ShareButton } from "../../components/share-button"
import Link from "next/link"
import Image from "next/image"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const game = await getGameBySlug(resolvedParams.slug)
  const siteUrl = await getSetting("site.url") || "http://localhost:3000"

  if (!game) {
    return {
      title: "Game Not Found",
    }
  }

  // Use game's meta title/description if available, otherwise use the game title/description
  const title = game.metaTitle || game.title
  const description = game.metaDescription || game.description
  const canonicalUrl = `${siteUrl}/games/${game.slug}`

  return {
    title,
    description,
    keywords: game.keywords?.split(",").map((k) => k.trim()),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      images: [{ url: game.thumbnail }],
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [game.thumbnail],
    },
  }
}

export default async function GamePage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const game = await getGameBySlug(resolvedParams.slug)
  const siteUrl = await getSetting("site.url") || "http://localhost:3000"

  if (!game) {
    notFound()
  }

  const relatedGames = await getRelatedGames(game.id, game.categoryId)

  // Generate structured data for the game
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.description,
    "image": game.thumbnail,
    "url": `${siteUrl}/games/${game.slug}`,
    "genre": game.category.name,
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "GameHub"
    },
    "datePublished": game.createdAt,
    "dateModified": game.updatedAt,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": game.rating || "0",
      "ratingCount": game.ratingCount || "0"
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Game Embed */}
          <div className="space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <GameEmbed embedUrl={game.embedUrl} title={game.title} />
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex justify-between gap-2 mt-4 mb-8">
            <h1 className="text-2xl font-bold">{game.title}</h1>
            <div className="flex gap-2">
              <ShareButton 
                title={game.title}
                url={`${siteUrl}/games/${game.slug}`}
                image={game.thumbnail}
                description={game.description}
              />
              <FullscreenButton />
            </div>
          </div>

          {/* Horizontal Ad below game */}
          <div className="relative w-full h-[90px] bg-muted/50 rounded-lg mb-8">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
              Advertisement
            </div>
            <div className="w-full h-full flex items-center justify-center">
              {/* Google AdSense will be placed here */}
            </div>
          </div>

          {/* Game Info and Ads Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Info Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <a href="/" className="hover:text-primary">Home</a>
                    <span>•</span>
                    <a href={`/games?category=${game.category.id}`} className="hover:text-primary">{game.category.name}</a>
                    <span>•</span>
                    <span className="text-foreground">{game.title}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3">About this game</h2>
                  <p className="text-muted-foreground">{game.description}</p>
                </div>
              </div>

              <div className="prose max-w-none dark:prose-invert">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-3">How to play</h2>
                  <p className="text-muted-foreground">{game.instructions}</p>
                </div>
              </div>
            </div>

            {/* Right Ads Column */}
            <div className="space-y-8">
              {/* Small Ad */}
              <div className="relative aspect-[300/250] bg-muted/50 rounded-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                  Advertisement
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  {/* Google AdSense will be placed here */}
                </div>
              </div>

              {/* Large Ad */}
              <div className="relative aspect-[300/600] bg-muted/50 rounded-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                  Advertisement
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  {/* Google AdSense will be placed here */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            {/* Ad Banner */}
            <div className="relative aspect-[4/3] bg-muted/50 rounded-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground">
                Advertisement
              </div>
              <div className="w-full h-full flex items-center justify-center">
                {/* Google AdSense will be placed here */}
              </div>
            </div>

            {/* Related Games */}
            <div className="grid grid-cols-2 gap-4">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/games/${relatedGame.slug}`}
                  className="group relative aspect-video overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  <Image
                    src={relatedGame.thumbnail}
                    alt={relatedGame.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-sm font-medium text-white truncate">{relatedGame.title}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  )
}

