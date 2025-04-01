import type { Metadata } from "next"
import { getGames } from "@/lib/data"
import { GameCard } from "@/components/game-card"
import { CategoryFilter } from "@/components/category-filter"

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
  const limit = 12

  const games = await getGames({
    categoryId,
    page,
    limit,
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Games</h1>

      <div className="mb-6">
        <CategoryFilter />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games found. Try a different category.</p>
        </div>
      )}

      {/* Pagination would go here */}
    </div>
  )
}

