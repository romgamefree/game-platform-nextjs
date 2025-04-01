import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getGameBySlug, getRelatedGames } from "@/lib/data"
import { GameEmbed } from "@/components/game-embed"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import { getSettings, getSetting } from "@/lib/settings"

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
          <h1 className="text-3xl font-bold mb-4">{game.title}</h1>

          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <GameEmbed embedUrl={game.embedUrl} title={game.title} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{game.category.name}</span>
            </div>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <h2>About this game</h2>
            <p>{game.description}</p>
            <h2>How to play</h2>
            <p>{game.instructions}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Related Games</h2>
          <div className="grid grid-cols-1 gap-4">
            {relatedGames.map((relatedGame) => (
              <GameCard key={relatedGame.id} game={relatedGame} variant="horizontal" />
            ))}
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

