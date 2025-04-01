import type { Metadata } from "next"
import { GamesList } from "@/components/admin/games-list"
import { GamesSearchWrapper } from "@/components/admin/games-search-wrapper"
import { GamesFilters } from "@/components/admin/games-filters"
import { getGames } from "@/lib/actions"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface GamesPageProps {
  searchParams: { 
    search?: string
    page?: string
    category?: string
    status?: string
    featured?: string
  }
}

export const metadata: Metadata = {
  title: "Games",
  description: "Manage games on GameHub",
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await Promise.resolve(searchParams)
  const page = Number(params.page) || 1
  const categoryId = params.category ? Number(params.category) : undefined
  
  const { games, total, totalPages } = await getGames({
    ...params,
    page,
    categoryId,
  })

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Games"
        description="Manage and organize your game collection"
      >
        <Button asChild>
          <Link href="/admin/games/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Link>
        </Button>
      </AdminHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <GamesSearchWrapper />
        <GamesFilters />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {games.length} of {total} games
        </div>
      </div>

      <GamesList games={games} page={page} totalPages={totalPages} />
    </div>
  )
}

