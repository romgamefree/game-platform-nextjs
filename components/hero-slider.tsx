"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Game } from "@/lib/types"

interface HeroSliderProps {
  gameGroups: Game[][]
}

export function HeroSlider({ gameGroups }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % gameGroups.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + gameGroups.length) % gameGroups.length)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentGroup = gameGroups[currentSlide]
  if (!currentGroup?.length) return null

  const [mainGame, ...smallGames] = currentGroup

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="container relative py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Main Game */}
          <div className="md:col-span-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={mainGame.thumbnail}
                alt={mainGame.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{mainGame.title}</h3>
                <p className="text-white/80 line-clamp-2 mb-4">{mainGame.description}</p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href={`/games/${mainGame.slug}`}>
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Small Games Grid */}
          <div className="grid grid-cols-2 gap-4">
            {smallGames.map((game) => (
              <Link 
                key={game.id} 
                href={`/games/${game.slug}`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-sm font-semibold text-white">{game.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur hover:bg-background/80"
            onClick={() => {
              prevSlide()
              setIsAutoPlaying(false)
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/50 backdrop-blur hover:bg-background/80"
            onClick={() => {
              nextSlide()
              setIsAutoPlaying(false)
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {gameGroups.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentSlide === index ? "bg-primary w-4" : "bg-primary/20"
              )}
              onClick={() => {
                setCurrentSlide(index)
                setIsAutoPlaying(false)
              }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 