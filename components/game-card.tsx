import Link from "next/link"
import Image from "next/image"
import type { Game } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  game: Game
  variant?: "default" | "horizontal"
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  if (variant === "horizontal") {
    return (
      <Card className="overflow-hidden">
        <Link href={`/games/${game.slug}`} className="flex h-full">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image src={game.thumbnail || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div>
              <h3 className="font-semibold line-clamp-1">{game.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{game.description}</p>
            </div>
            <Badge variant="outline" className="w-fit">
              {game.category.name}
            </Badge>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/games/${game.slug}`}>
        <div className="relative aspect-video">
          <Image
            src={game.thumbnail || "/placeholder.svg"}
            alt={game.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{game.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{game.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Badge variant="outline">{game.category.name}</Badge>
        </CardFooter>
      </Link>
    </Card>
  )
}

