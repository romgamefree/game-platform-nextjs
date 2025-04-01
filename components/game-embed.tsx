"use client"

import { useState, useEffect } from "react"

interface GameEmbedProps {
  embedUrl: string
  title: string
}

export function GameEmbed({ embedUrl, title }: GameEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

