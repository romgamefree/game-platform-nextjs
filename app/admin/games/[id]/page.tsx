import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { GameForm } from "@/components/admin/game-form"
import { getGameById } from "@/lib/data"

interface EditGamePageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "Edit Game",
  description: "Edit an existing game on GameHub",
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params
  const gameId = Number.parseInt(id)

  if (isNaN(gameId)) {
    notFound()
  }

  const game = await getGameById(gameId)

  if (!game) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Game</h1>
      <GameForm game={game} />
    </div>
  )
}

