"use client"

import { useEffect, useState } from "react"
import { Game } from "@/lib/types"
import { getDashboardData } from "@/lib/actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

export function RecentGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { recentGames } = await getDashboardData()
        setGames(recentGames)
      } catch (error) {
        console.error("Error fetching recent games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Games</h3>
        </div>
        <div className="p-0">
          <div className="p-4 text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Games</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No games found.
                </TableCell>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>{game.category?.name}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(game.createdAt), { addSuffix: true })}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 