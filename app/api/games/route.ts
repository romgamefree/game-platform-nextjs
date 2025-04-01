import { NextResponse } from "next/server"
import { getGames } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined
  const search = searchParams.get("search") || undefined
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10
  const featured = searchParams.get("featured") === "true"

  try {
    const games = await getGames({
      categoryId,
      search,
      page,
      limit,
      featured,
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
} 