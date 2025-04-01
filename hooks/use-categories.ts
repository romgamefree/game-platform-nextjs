import { useState, useEffect } from "react"
import type { Category } from "@/lib/types"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
} 