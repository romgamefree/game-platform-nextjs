"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Game } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { deleteGame } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { DataPagination } from "@/components/ui/data-pagination"

interface GamesListProps {
  games: Game[]
  page: number
  totalPages: number
}

export function GamesList({ games, page, totalPages }: GamesListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      await deleteGame(id)
      toast({
        title: "Game deleted",
        description: "The game has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the game. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{game.title}</TableCell>
              <TableCell>{game.category.name}</TableCell>
              <TableCell>
                <Badge variant={game.published ? "default" : "secondary"}>
                  {game.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={game.featured ? "outline" : "secondary"}>
                  {game.featured ? "Featured" : "Not Featured"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(game.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/games/${game.slug}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/games/${game.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the game.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(game.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          window.location.href = `/admin/games?page=${newPage}`
        }}
      />
    </div>
  )
}

