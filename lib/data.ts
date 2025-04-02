import { db } from "@/lib/db"
import type { Game, Category } from "@/lib/types"

interface GetGamesOptions {
  categoryId?: number
  search?: string
  page?: number
  limit?: number
  featured?: boolean
}

export async function getGames({
  categoryId,
  search,
  page = 1,
  limit = 10,
  featured = false,
}: GetGamesOptions = {}): Promise<Game[]> {
  const skip = (page - 1) * limit

  const games = await db.game.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { title: { contains: search } } : {}),
      ...(featured ? { featured: true } : {}),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  })

  return games as unknown as Game[]
}

export async function getGameById(id: number): Promise<Game | null> {
  const game = await db.game.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  return game as unknown as Game
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const game = await db.game.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  return game as unknown as Game
}

export async function getRelatedGames(gameId: number, categoryId: number): Promise<Game[]> {
  const games = await db.game.findMany({
    where: {
      id: { not: gameId },
      categoryId,
      published: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 18,
  })

  return games as unknown as Game[]
}

export async function getCategories(): Promise<Category[]> {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  })

  return categories as unknown as Category[]
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const category = await db.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          games: true,
        },
      },
    },
  })

  return category as unknown as Category
}

