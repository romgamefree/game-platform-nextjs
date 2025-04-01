"use client"

import { useEffect, useState } from "react"
import { GamePixItem } from "@/types/gamepix"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Search, Download, Check, Zap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { importGameFromGamePix, checkGameExists } from "@/lib/actions"
import { toast } from "sonner"

type SortOption = "quality" | "pubdate"

export function GamePixCrawler() {
  const [games, setGames] = useState<GamePixItem[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState<string | null>(null)
  const [autoImporting, setAutoImporting] = useState(false)
  const [importedGames, setImportedGames] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<SortOption>("quality")
  const [totalPages, setTotalPages] = useState(1)

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://feeds.gamepix.com/v2/json?page=${page}&pagination=24&order=${sort}`
      )
      const data = await response.json()
      
      // Check which games already exist in our database
      const newGames = []
      for (const game of data.items) {
        const exists = await checkGameExists(game.title)
        if (!exists) {
          newGames.push(game)
        }
      }
      
      setGames(newGames)
      
      // If no new games found, try next page
      if (newGames.length === 0 && page < data.last_page) {
        setPage(p => p + 1)
        return
      }
      
      // Calculate total pages from last_page_url
      const lastPageMatch = data.last_page_url.match(/page=(\d+)/)
      setTotalPages(lastPageMatch ? parseInt(lastPageMatch[1]) : 1)
    } catch (error) {
      console.error("Error fetching games:", error)
      toast.error("Failed to fetch games")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [page, sort])

  const handleImport = async (game: GamePixItem) => {
    try {
      setImporting(game.id)
      await importGameFromGamePix({
        title: game.title,
        description: game.description,
        thumbnail: game.banner_image,
        url: game.url,
        category: game.category,
        published: true,
      })
      setImportedGames(prev => new Set([...prev, game.id]))
      setGames(prev => prev.filter(g => g.id !== game.id))
      toast.success("Game imported successfully")
    } catch (error) {
      console.error("Error importing game:", error)
      toast.error("Failed to import game")
    } finally {
      setImporting(null)
    }
  }

  const handleAutoImport = async () => {
    try {
      setAutoImporting(true)
      const gamesToImport = [...games]
      let successCount = 0
      let errorCount = 0

      for (const game of gamesToImport) {
        try {
          await importGameFromGamePix({
            title: game.title,
            description: game.description,
            thumbnail: game.banner_image,
            url: game.url,
            category: game.category,
            published: true,
          })
          setImportedGames(prev => new Set([...prev, game.id]))
          setGames(prev => prev.filter(g => g.id !== game.id))
          successCount++
        } catch (error) {
          console.error(`Error importing game ${game.title}:`, error)
          errorCount++
        }
      }

      toast.success(`Imported ${successCount} games${errorCount > 0 ? `, ${errorCount} failed` : ''}`)
    } catch (error) {
      console.error("Error during auto import:", error)
      toast.error("Failed to auto import games")
    } finally {
      setAutoImporting(false)
    }
  }

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase()) ||
    game.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <Select value={sort} onValueChange={(value: SortOption) => setSort(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality">Quality Score</SelectItem>
            <SelectItem value="pubdate">Last Published</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="default"
          onClick={handleAutoImport}
          disabled={autoImporting || filteredGames.length === 0}
        >
          {autoImporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Auto Import ({filteredGames.length})
        </Button>
        <Button asChild>
          <a href="/admin/games/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </a>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Card key={game.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1 text-base">{game.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {game.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-video relative mb-3">
                    <img
                      src={game.banner_image}
                      alt={game.title}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Score: {(game.quality_score * 100).toFixed(1)}%</span>
                    <span>{new Date(game.date_published).toLocaleDateString()}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handleImport(game)}
                    disabled={importing === game.id}
                  >
                    {importing === game.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Import Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
} 