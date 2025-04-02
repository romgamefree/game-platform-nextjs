import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Game } from "@/lib/types"

interface GameCardProps {
  game: Game
  variant?: "default" | "featured" | "slider" | "horizontal"
  className?: string
}

export function GameCard({ game, variant = "default", className }: GameCardProps) {
  const variants = {
    default: "aspect-[16/9] w-[280px]",
    featured: "w-[220px] h-[320px]",
    slider: "aspect-square w-[400px]",
    horizontal: "aspect-[16/9] w-[300px]"
  }

  return (
    <Link
      href={`/games/${game.slug}`}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-lg ring-offset-background transition-all duration-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-500",
        "hover:before:scale-105 before:border-2 before:border-transparent",
        "hover:before:border-[#4CAFFF] hover:before:shadow-[0_0_20px_rgba(76,175,255,0.7)] hover:before:animate-pulse",
        "before:bg-gradient-to-r before:from-transparent before:to-transparent",
        "hover:before:from-[#4CAFFF]/5 hover:before:to-[#9089FC]/5",
        variants[variant],
        className
      )}
    >
      <Image
        src={game.thumbnail}
        alt={game.title}
        fill
        loading="lazy"
        className="object-cover transition-all duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={cn(
          "font-semibold text-white",
          variant === "featured" ? "text-xl mb-2" : "text-lg"
        )}>
          {game.title}
        </h3>
        {variant === "featured" && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80">Action, Adventure</span>
              <span className="h-1 w-1 rounded-full bg-white/80" />
              <span className="text-xs text-white/80">4.5 ★</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white">
                Free to Play
              </div>
              <div className="rounded-full bg-[#4CAFFF]/20 text-[#4CAFFF] px-2.5 py-0.5 text-xs">
                Multiplayer
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  )
} 