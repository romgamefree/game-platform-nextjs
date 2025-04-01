"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getGames } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"
import { Game } from "@prisma/client"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Game[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchGames = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      try {
        const { games } = await getGames({ search: query, limit: 5 })
        setResults(games)
      } catch (error) {
        console.error("Error searching games:", error)
        setResults([])
      }
    }

    const debounce = setTimeout(searchGames, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/games?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="Search games..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-hidden rounded-md border bg-background shadow-lg">
          <ScrollArea className="h-full">
            <div className="p-2">
              {results.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={game.thumbnail}
                      alt={game.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{game.title}</div>
                    <div className="text-sm text-muted-foreground">{game.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
} 