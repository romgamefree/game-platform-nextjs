import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getGames, getCategories } from "@/lib/data"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "@/components/category-filter"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Gamepad2, Users, Trophy, Star, Sparkles, ArrowRight, Puzzle, Sword, Brain, Play, Heart, Clock, History, Zap, Gift } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and play the best online games on GameHub",
}

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; error?: string }
}) {
  const params = await Promise.resolve(searchParams)
  const categoryId = params?.category ? Number.parseInt(params.category) : undefined
  const featuredGames = await getGames({ categoryId, featured: true, limit: 6 })
  const popularGames = await getGames({ categoryId, limit: 4 })
  const newGames = await getGames({ categoryId, limit: 4 })
  const recentlyPlayed = await getGames({ categoryId, limit: 4 })

  return (
    <div className="space-y-16">
      {/* Display access denied message if redirected from admin area */}
      {params?.error === "access_denied" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin area. Please contact an administrator if you believe this is a mistake.
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section with Game Preview */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-12 md:py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <Badge variant="secondary" className="mb-4 animate-fade-in w-fit">
                <Sparkles className="mr-2 h-4 w-4" />
                Featured Game
              </Badge>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 animate-fade-in-up">
                Play the Best Online Games
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
                Discover and play hundreds of free online games. No downloads, just fun!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-400">
                <Button asChild size="lg" className="h-12 px-8 group">
                  <Link href="/games">
                    Play Now
                    <Play className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8">
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden group">
              <Image
                src="/game-preview.jpg"
                alt="Featured Game Preview"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">Subway Surfers</h3>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Play className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>98%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>1.2M plays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trending Now</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/games">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-4">
            {popularGames.map((game) => (
              <div key={game.id} className="w-[300px]">
                <GameCard game={game} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Recently Played Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Recently Played</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/games">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentlyPlayed.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="container">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured Games</h2>
            <p className="text-muted-foreground mt-2">Check out our handpicked selection of amazing games</p>
          </div>
          <CategoryFilter />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/games">
              View All Games
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* New Games Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-500" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">New Games</h2>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/games">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newGames.map((game) => (
            <div key={game.id} className="relative">
              <Badge className="absolute top-2 right-2 z-10 bg-green-500 hover:bg-green-600">
                <Gift className="h-3 w-3 mr-1" />
                New
              </Badge>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Popular Categories</h2>
            <p className="text-muted-foreground mt-2">Explore games by category</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/games">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src="/categories/action.jpg"
                  alt="Action Games"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sword className="h-5 w-5 text-white" />
                    <CardTitle className="text-white">Action Games</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Fast-paced games with exciting gameplay</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src="/categories/puzzle.jpg"
                  alt="Puzzle Games"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Puzzle className="h-5 w-5 text-white" />
                    <CardTitle className="text-white">Puzzle Games</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Challenge your mind with brain teasers</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src="/categories/strategy.jpg"
                  alt="Strategy Games"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-white" />
                    <CardTitle className="text-white">Strategy Games</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Think and plan your way to victory</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src="/categories/racing.jpg"
                  alt="Racing Games"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-white" />
                    <CardTitle className="text-white">Racing Games</CardTitle>
                  </div>
                  <CardDescription className="text-white/80">Speed and adrenaline in every race</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}

