import { useState, useEffect } from "react"
import type { Game } from "@/lib/types"

interface UseGamesOptions {
  categoryId?: number
  search?: string
  page?: number
  limit?: number
  featured?: boolean
}

export function useGames(options: UseGamesOptions = {}) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (options.categoryId) params.append("category", options.categoryId.toString())
        if (options.search) params.append("search", options.search)
        if (options.page) params.append("page", options.page.toString())
        if (options.limit) params.append("limit", options.limit.toString())
        if (options.featured) params.append("featured", "true")

        const response = await fetch(`/api/games?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch games")
        
        const data = await response.json()
        setGames(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [options.categoryId, options.search, options.page, options.limit, options.featured])

  return { games, loading, error }
} 