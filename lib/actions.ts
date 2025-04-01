"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { hash } from "bcrypt"
import type { Game, Category } from "@/lib/types"
import { slugify } from "@/lib/utils"

interface RegisterUserData {
  name: string
  email: string
  password: string
}

export async function registerUser(data: RegisterUserData) {
  const { name, email, password } = data

  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("Email already in use")
  }

  const hashedPassword = await hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return { success: true }
}

interface GameFormData {
  title: string
  slug: string
  description: string
  instructions?: string
  thumbnail: string
  embedUrl: string
  categoryId: number
  published: boolean
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  structuredData?: string
}

export async function createGame(data: GameFormData) {
  // Parse JSON if structuredData is provided as a string
  const structuredData = data.structuredData
    ? typeof data.structuredData === "string"
      ? JSON.parse(data.structuredData)
      : data.structuredData
    : undefined

  await db.game.create({
    data: {
      ...data,
      structuredData,
    },
  })

  revalidatePath("/admin/games")
  revalidatePath("/games")
  redirect("/admin/games")
}

export async function updateGame(id: number, data: GameFormData) {
  // Parse JSON if structuredData is provided as a string
  const structuredData = data.structuredData
    ? typeof data.structuredData === "string"
      ? JSON.parse(data.structuredData)
      : data.structuredData
    : undefined

  await db.game.update({
    where: { id },
    data: {
      ...data,
      structuredData,
    },
  })

  revalidatePath("/admin/games")
  revalidatePath(`/games/${data.slug}`)
  revalidatePath("/games")
  redirect("/admin/games")
}

export async function deleteGame(id: number) {
  await db.game.delete({
    where: { id },
  })

  revalidatePath("/admin/games")
  revalidatePath("/games")
}

interface CategoryFormData {
  name: string
  slug: string
  description?: string
  // SEO fields
  metaTitle?: string
  metaDescription?: string
}

export async function createCategory(data: CategoryFormData) {
  await db.category.create({
    data,
  })

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(id: number, data: CategoryFormData) {
  await db.category.update({
    where: { id },
    data,
  })

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function deleteCategory(id: number) {
  await db.category.delete({
    where: { id },
  })

  revalidatePath("/admin/categories")
}

export async function updateSettings(settings: Record<string, { value: string; type?: string }>) {
  // Process each setting
  const updates = Object.entries(settings).map(([key, { value, type = "TEXT" }]) => {
    return db.setting.upsert({
      where: { key },
      update: { value, type: type as any },
      create: { key, value, type: type as any },
    })
  })

  // Execute all updates in parallel
  await Promise.all(updates)

  // Revalidate paths that might use settings
  revalidatePath("/")
  revalidatePath("/admin/settings")
}

export async function getGames({ 
  categoryId,
  search,
  page = 1, 
  limit = 10,
  orderBy = "createdAt",
  orderDir = "desc",
  status,
  featured
}: {
  categoryId?: number
  search?: string
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: "asc" | "desc"
  status?: string
  featured?: string
} = {}) {
  try {
    const skip = (page - 1) * limit

    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      }),
      ...(status === "published" && { published: true }),
      ...(status === "draft" && { published: false }),
      ...(featured === "true" && { featured: true }),
      ...(featured === "false" && { featured: false })
    }

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        include: {
          category: true
        },
        skip,
        take: limit,
        orderBy: { [orderBy]: orderDir }
      }),
      db.game.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      games,
      total,
      page,
      totalPages,
      limit
    }
  } catch (error) {
    console.error("Error getting games:", error)
    throw error
  }
}

export async function getCategories(searchParams: { page?: string }) {
  const params = await Promise.resolve(searchParams)
  const page = Number(params.page) || 1
  const limit = 10
  const skip = (page - 1) * limit

  const [categories, total] = await Promise.all([
    db.category.findMany({
      orderBy: {
        name: 'asc'
      },
      skip,
      take: limit,
    }),
    db.category.count()
  ])

  return {
    categories: categories as unknown as Category[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getDashboardData() {
  const [
    totalGames,
    totalUsers,
    totalCategories,
    recentGames,
    categoriesWithCount
  ] = await Promise.all([
    db.game.count(),
    db.user.count(),
    db.category.count(),
    db.game.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    }),
    db.category.findMany({
      include: {
        _count: {
          select: {
            games: true
          }
        }
      },
      orderBy: {
        games: {
          _count: 'desc'
        }
      },
      take: 5
    })
  ])

  return {
    stats: {
      totalGames,
      totalUsers,
      totalCategories,
      totalPlays: 0 // TODO: Implement play tracking
    },
    recentGames: recentGames as unknown as Game[],
    popularCategories: categoriesWithCount.map((category: Category & { _count: { games: number } }) => ({
      ...category,
      gamesCount: category._count.games
    })) as unknown as (Category & { gamesCount: number })[]
  }
}

interface GamePixImportData {
  title: string
  description: string
  thumbnail: string
  url: string
  category: string
  published: boolean
}

export async function importGameFromGamePix(data: GamePixImportData) {
  try {
    // First, find or create the category
    const category = await db.category.upsert({
      where: { slug: data.category.toLowerCase() },
      update: {},
      create: {
        name: data.category,
        slug: data.category.toLowerCase(),
      },
    })

    // Check if game already exists
    const existingGame = await db.game.findFirst({
      where: {
        OR: [
          { title: data.title },
          { slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
        ]
      }
    })

    if (existingGame) {
      // Update existing game
      await db.game.update({
        where: { id: existingGame.id },
        data: {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          embedUrl: data.url,
          categoryId: category.id,
          published: data.published,
        },
      })
    } else {
      // Create new game
      await db.game.create({
        data: {
          title: data.title,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          thumbnail: data.thumbnail,
          embedUrl: data.url,
          categoryId: category.id,
          published: data.published,
        },
      })
    }

    revalidatePath("/admin/games")
    revalidatePath("/games")
    return { success: true }
  } catch (error) {
    console.error("Error importing game:", error)
    throw error
  }
}

export async function checkGameExists(title: string) {
  const existingGame = await db.game.findFirst({
    where: {
      OR: [
        { title },
        { slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ]
    }
  })
  return !!existingGame
}

export async function importGameFromGameMonetize(data: {
  title: string
  description: string
  thumbnail: string
  url: string
  category: string
  published: boolean
}) {
  try {
    const slug = slugify(data.title)
    const existingGame = await db.game.findFirst({
      where: {
        OR: [
          { title: data.title },
          { slug }
        ]
      }
    })

    // Find or create category
    const category = await db.category.upsert({
      where: { slug: slugify(data.category) },
      update: {},
      create: {
        name: data.category,
        slug: slugify(data.category),
      },
    })

    if (existingGame) {
      // Update existing game
      await db.game.update({
        where: { id: existingGame.id },
        data: {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          embedUrl: data.url,
          category: {
            connect: { id: category.id }
          },
          published: data.published,
        }
      })
      revalidatePath("/admin/games")
      revalidatePath("/games")
      return { success: true, message: "Game updated successfully" }
    }

    // Create new game
    await db.game.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        thumbnail: data.thumbnail,
        embedUrl: data.url,
        category: {
          connect: { id: category.id }
        },
        published: data.published,
      }
    })
    revalidatePath("/admin/games")
    revalidatePath("/games")
    return { success: true, message: "Game imported successfully" }
  } catch (error) {
    console.error("Error importing game:", error)
    return { success: false, message: "Failed to import game" }
  }
}

export async function checkGamesExist(titles: string[]) {
  try {
    const games = await db.game.findMany({
      where: {
        OR: [
          { title: { in: titles } },
          { slug: { in: titles.map(title => slugify(title)) } }
        ]
      },
      select: {
        title: true,
        slug: true
      }
    })

    const existingTitles = new Set(games.map((game: { title: string; slug: string }) => game.title))
    const existingSlugs = new Set(games.map((game: { title: string; slug: string }) => game.slug))

    return titles.map(title => {
      const slug = slugify(title)
      return existingTitles.has(title) || existingSlugs.has(slug)
    })
  } catch (error) {
    console.error("Error checking games:", error)
    return titles.map(() => false)
  }
}

