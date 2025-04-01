import type { Metadata } from "next"
import { GameForm } from "@/components/admin/game-form"

export const metadata: Metadata = {
  title: "Create New Game",
  description: "Create a new game on GameHub",
}

export default function NewGamePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Game</h1>
      <GameForm />
    </div>
  )
} 