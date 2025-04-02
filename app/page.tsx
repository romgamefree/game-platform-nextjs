import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getGames, getCategories } from "@/lib/data"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ChevronRight,
  ChevronLeft,
  Users2,
  Swords,
  Flower,
  Car,
  Gamepad,
  CircleDot,
  Bike,
  SquareStack,
  MousePointer,
  Shirt,
  DoorOpen,
  Crosshair
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Game } from "@/lib/types"

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and play the best online games on GameHub",
}

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const params = await Promise.resolve(searchParams)
  const categoryId = params?.category ? Number.parseInt(params.category) : undefined

  const [
    sliderGames,
    featuredGames,
    newGames,
    topRatedGames,
    categories
  ] = await Promise.all([
    getGames({ limit: 40 }),
    getGames({ categoryId, featured: true, limit: 40 }),
    getGames({ categoryId, limit: 48 }),
    getGames({ categoryId, limit: 48 }),
    getCategories()
  ])

  // Get games for each category
  const categoryGames = await Promise.all(
    categories.slice(0, 12).map(category =>
      getGames({ categoryId: category.id, limit: 12 })
    )
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Main Game Slider */}
      <section className="containe mt-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Welcome to Discover Games</h2>
              <p className="text-sm text-muted-foreground">Explore our curated collection of the most exciting online games</p>
            </div>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-6 pb-4">
              {Array.from({ length: Math.ceil(sliderGames.length / 5) }).map((_, groupIndex) => {
                const startIndex = groupIndex * 5;
                const groupGames = sliderGames.slice(startIndex, startIndex + 5);
                const largeGame = groupGames[0];
                const smallGames = groupGames.slice(1, 5);

                return (
                  <div key={groupIndex} className="flex gap-4 shrink-0">
                    {/* Large game */}
                    <Link
                      href={`/games/${largeGame?.slug}`}
                      className="group relative w-[400px] aspect-square overflow-hidden rounded-lg 
                                transition-all duration-300 hover:shadow-lg"
                    >
                      <Image
                        src={largeGame?.thumbnail || ""}
                        alt={largeGame?.title || ""}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white">
                          {largeGame?.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs bg-primary/20 text-white px-2 py-0.5 rounded-full">Featured</span>
                          <span className="text-xs text-white/80">4.8 ★</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                    </Link>

                    {/* Grid of 4 small games */}
                    <div className="grid grid-cols-2 gap-4">
                      {smallGames.map((game) => (
                        <Link
                          key={game.id}
                          href={`/games/${game.slug}`}
                          className="group relative aspect-square w-[196px] overflow-hidden rounded-lg
                                    transition-all duration-300 hover:shadow-lg"
                        >
                          <Image
                            src={game.thumbnail}
                            alt={game.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-sm font-semibold text-white">{game.title}</h3>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[10px] bg-primary/20 text-white px-1.5 py-0.5 rounded-full">New</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Featured Games */}
      <section className="container">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">FEATURED</span>
                <h2 className="text-2xl font-bold">Featured Games</h2>
              </div>
              <p className="text-sm text-muted-foreground">Hand-picked games that you'll surely love</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/games?featured=true" className="gap-2">
                View more
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {featuredGames.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group relative w-[220px] h-[320px] shrink-0 overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/80">Action, Adventure</span>
                      <span className="h-1 w-1 rounded-full bg-white/80" />
                      <span className="text-xs text-white/80">4.5 ★</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white">
                        Free to Play
                      </div>
                      <div className="rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-xs">
                        Multiplayer
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-xl" />
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Top Rated Games */}
      <section className="container">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500/20 text-yellow-500 text-xs font-medium px-2.5 py-0.5 rounded-full">TRENDING</span>
                <h2 className="text-2xl font-bold">Most Popular</h2>
              </div>
              <p className="text-sm text-muted-foreground">Games that players can't stop talking about</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/games?sort=popular" className="gap-2">
                View more
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {topRatedGames.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group relative aspect-[16/9] w-[300px] shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div className="flex items-start gap-8">
          <div className="w-80 shrink-0 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-500 text-xs font-medium px-2.5 py-0.5 rounded-full">EXPLORE</span>
                <h2 className="text-2xl font-bold">Categories</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Find games by your favorite category. From action to puzzle, we've got you covered.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full group">
              <Link href="/games" className="flex items-center justify-between">
                <span>Browse all categories</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              {/* First row of categories */}
              <ScrollArea className="w-full">
                <div className="flex space-x-4 pb-4">
                  {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
                    <Link
                      key={category.id}
                      href={`/games?category=${category.id}`}
                      className="group flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-3 hover:bg-muted shrink-0 transition-colors"
                    >
                      <div className="relative aspect-square w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-0.5">
                        <div className="relative h-full w-full rounded-[inherit] overflow-hidden">
                          <Image
                            src={category.image || `/categories/${category.slug}.jpg`}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="text-center w-20">
                        <span className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{category.name}</span>
                        {category._count?.games && (
                          <p className="text-[10px] text-muted-foreground">
                            {category._count?.games} games
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hover:bg-muted" />
              </ScrollArea>

              {/* Second row of categories */}
              <ScrollArea className="w-full">
                <div className="flex space-x-4 pb-4">
                  {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
                    <Link
                      key={category.id}
                      href={`/games?category=${category.id}`}
                      className="group flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-3 hover:bg-muted shrink-0 transition-colors"
                    >
                      <div className="relative aspect-square w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-0.5">
                        <div className="relative h-full w-full rounded-[inherit] overflow-hidden">
                          <Image
                            src={category.image || `/categories/${category.slug}.jpg`}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="text-center w-20">
                        <span className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{category.name}</span>
                        {category._count?.games && (
                          <p className="text-[10px] text-muted-foreground">
                            {category._count?.games} games
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hover:bg-muted" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>

      {/* New Games */}
      <section className="container pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-green-500/20 text-green-500 text-xs font-medium px-2.5 py-0.5 rounded-full">NEW</span>
                <h2 className="text-2xl font-bold">Latest Games</h2>
              </div>
              <p className="text-sm text-muted-foreground">Fresh new games added to our collection</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/games?sort=newest" className="gap-2">
                View more
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {newGames.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group relative aspect-[16/9] w-[280px] shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Games by Categories */}
      {categories.slice(0, 12).map((category, index) => (
        <section key={category.id} className="container pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2.5 py-0.5 rounded-full uppercase",
                    index % 6 === 0 && "bg-blue-500/20 text-blue-500",
                    index % 6 === 1 && "bg-purple-500/20 text-purple-500",
                    index % 6 === 2 && "bg-green-500/20 text-green-500",
                    index % 6 === 3 && "bg-yellow-500/20 text-yellow-500",
                    index % 6 === 4 && "bg-red-500/20 text-red-500",
                    index % 6 === 5 && "bg-orange-500/20 text-orange-500",
                  )}>{category.name}</span>
                  <h2 className="text-2xl font-bold">{category.name} Games</h2>
                </div>
                <p className="text-sm text-muted-foreground">Best {category.name.toLowerCase()} games to play right now</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href={`/games?category=${category.id}`} className="gap-2">
                  View more
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ScrollArea className="w-full">
              <div className="flex space-x-4 pb-4">
                {categoryGames[index].map((game: Game) => (
                  <Link
                    key={game.id}
                    href={`/games/${game.slug}`}
                    className="group relative aspect-[16/9] w-[280px] shrink-0 overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
                  >
                    <Image
                      src={game.thumbnail}
                      alt={game.title}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-primary rounded-lg" />
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      ))}
    </div>
  )
}

