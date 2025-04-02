"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ScrollNavigationProps {
  scrollAmount?: number
  sectionId: string
}

export function ScrollNavigation({ scrollAmount = 300, sectionId }: ScrollNavigationProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const container = document.querySelector(`[data-section-id="${sectionId}"] [data-radix-scroll-area-viewport]`) as HTMLElement
      if (container) {
        const scrollLeft = container.scrollLeft
        const maxScroll = container.scrollWidth - container.clientWidth

        // Check if we can scroll in either direction
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < maxScroll)

        // Check if we're at the start or end
        setIsAtStart(scrollLeft <= 0)
        setIsAtEnd(Math.abs(scrollLeft - maxScroll) < 1)
      }
    }

    const container = document.querySelector(`[data-section-id="${sectionId}"] [data-radix-scroll-area-viewport]`)
    if (container) {
      container.addEventListener('scroll', checkScroll)
      // Initial check
      checkScroll()
      // Also check on window resize
      window.addEventListener('resize', checkScroll)

      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [sectionId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if the section is in viewport
      const section = document.querySelector(`[data-section-id="${sectionId}"]`)
      if (!section) return
      const rect = section.getBoundingClientRect()
      const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight

      if (!isInViewport) return

      if (e.key === 'ArrowLeft' && canScrollLeft && !isAtStart) {
        e.preventDefault()
        handleScroll('left')
      } else if (e.key === 'ArrowRight' && canScrollRight && !isAtEnd) {
        e.preventDefault()
        handleScroll('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sectionId, canScrollLeft, canScrollRight, isAtStart, isAtEnd])

  const handleScroll = (direction: "left" | "right") => {
    const container = document.querySelector(`[data-section-id="${sectionId}"] [data-radix-scroll-area-viewport]`)
    if (container) {
      container.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  // Don't render anything if we can't scroll in either direction
  if (!canScrollLeft && !canScrollRight) return null

  return (
    <div className="absolute inset-x-4 inset-y-0 pointer-events-none">
      {/* Only show left button if we're not at the start */}
      {canScrollLeft && !isAtStart && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/95 shadow-lg backdrop-blur-sm 
                           hover:bg-background/80 hover:scale-110 hover:shadow-xl
                           active:scale-95 transition-all duration-300 
                           border border-border/50 
                           focus-visible:ring-2 focus-visible:ring-primary
                           group"
                  onClick={() => handleScroll("left")}
                >
                  <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
                  <span className="sr-only">Scroll left</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Previous (←)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {/* Only show right button if we're not at the end */}
      {canScrollRight && !isAtEnd && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/95 shadow-lg backdrop-blur-sm 
                           hover:bg-background/80 hover:scale-110 hover:shadow-xl
                           active:scale-95 transition-all duration-300 
                           border border-border/50
                           focus-visible:ring-2 focus-visible:ring-primary
                           group"
                  onClick={() => handleScroll("right")}
                >
                  <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
                  <span className="sr-only">Scroll right</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Next (→)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
} 