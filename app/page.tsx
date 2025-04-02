import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getGames, getCategories } from "@/lib/data"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ScrollNavigation } from "@/components/scroll-navigation"
import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Game } from "@/lib/types"
import { useRef } from "react"

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
          <div className="relative" data-section-id="discover-games">
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
              <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
            </ScrollArea>
            <ScrollNavigation sectionId="discover-games" />
          </div>
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
          <div className="relative" data-section-id="featured-games">
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
              <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
            </ScrollArea>
            <ScrollNavigation sectionId="featured-games" />
          </div>
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
          <div className="relative" data-section-id="top-rated-games">
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
              <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
            </ScrollArea>
            <ScrollNavigation sectionId="top-rated-games" />
          </div>
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
              <div className="relative" data-section-id="categories-row-1">
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
                  <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
                </ScrollArea>
                <ScrollNavigation sectionId="categories-row-1" />
              </div>

              {/* Second row of categories */}
              <div className="relative" data-section-id="categories-row-2">
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
                  <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
                </ScrollArea>
                <ScrollNavigation sectionId="categories-row-2" />
              </div>
            </div>
          </div>
        </div>
        <ScrollNavigation />
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
          <div className="relative" data-section-id="new-games">
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
              <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
            </ScrollArea>
            <ScrollNavigation sectionId="new-games" />
          </div>
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
            <div className="relative" data-section-id={`category-${category.id}-games`}>
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
                <ScrollBar orientation="horizontal" className="opacity-0 hover:opacity-100 transition-opacity" />
              </ScrollArea>
              <ScrollNavigation sectionId={`category-${category.id}-games`} />
            </div>
          </div>
        </section>
      ))}

      {/* About this site */}
      <section className="container py-16 border-t">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">ABOUT</span>
                <h2 className="text-2xl font-bold">About Game Platform</h2>
              </div>
              <p className="text-muted-foreground">Your ultimate destination for online gaming entertainment</p>
            </div>
            <div className="prose prose-gray dark:prose-invert">
              <p>
                Welcome to Game Platform, where gaming meets community. We curate and deliver the best online games,
                ensuring you have access to quality entertainment right from your browser.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-8">
                <div className="flex gap-3 items-start">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Free to Play</h3>
                    <p className="text-sm text-muted-foreground">All games are free to play, no hidden costs</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Multiplayer Support</h3>
                    <p className="text-sm text-muted-foreground">Play with friends or make new ones</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Safe & Secure</h3>
                    <p className="text-sm text-muted-foreground">Family-friendly content, secure platform</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Regular Updates</h3>
                    <p className="text-sm text-muted-foreground">New games added frequently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            <Image
              src="/hero-image.jpg"
              alt="Gaming illustration"
              fill
              className="object-cover mix-blend-overlay opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold">1000+</h3>
                <p className="text-muted-foreground">Games Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container py-16 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-2 text-center mb-8">
            <div className="flex items-center justify-center gap-2">
              <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">FAQ</span>
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <p className="text-muted-foreground">Got questions? We've got answers!</p>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is it really free to play?</h3>
              <p className="text-muted-foreground">Yes! All games on our platform are completely free to play. We believe in providing quality entertainment without any cost barriers.</p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
              <p className="text-muted-foreground">While you can play most games without an account, creating one allows you to save your progress, compete on leaderboards, and interact with other players.</p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">What devices are supported?</h3>
              <p className="text-muted-foreground">Our games are playable on any device with a modern web browser. Most games are optimized for both desktop and mobile play.</p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">How often are new games added?</h3>
              <p className="text-muted-foreground">We add new games weekly to keep the content fresh and exciting. Check the "New Games" section regularly for the latest additions.</p>
            </div>
            <div className="bg-card rounded-lg p-6">
              <h3 className="font-semibold mb-2">Is the platform safe for children?</h3>
              <p className="text-muted-foreground">Yes, we carefully curate our content to ensure it's family-friendly. Parents can also enable additional controls through account settings.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Still have questions?</p>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/contact" className="gap-2">
                Contact Support
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

