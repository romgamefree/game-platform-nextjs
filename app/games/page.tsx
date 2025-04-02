import type { Metadata } from "next"
import { getPaginatedGames } from "@/lib/actions"
import { CategoryFilter } from "@/components/category-filter"
import { GamesPagination } from "@/components/games-pagination"
import type { Game } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Browse Games",
  description: "Browse our collection of free online games",
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string }
}) {
  const params = await Promise.resolve(searchParams)
  const categoryId = params?.category ? Number.parseInt(params.category) : undefined
  const page = params?.page ? Number.parseInt(params.page) : 1
  const limit = 15

  const { games, total, totalPages } = await getPaginatedGames({
    categoryId,
    page,
    limit,
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Browse Games</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {games.length} of {total} games
          </div>
          <CategoryFilter />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {games.map((game: Game) => (
          <Link 
            key={game.id} 
            href={`/games/${game.slug}`}
            className="group relative aspect-video overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src={game.thumbnail}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <h3 className="text-sm font-medium text-white truncate">{game.title}</h3>
            </div>
            <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
          </Link>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games found. Try a different category.</p>
        </div>
      )}

      <GamesPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

