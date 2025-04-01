"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/hooks/use-categories"

export function GamesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { categories, loading } = useCategories()

  const currentCategory = searchParams.get("category") || "all"
  const currentStatus = searchParams.get("status") || "all"
  const currentFeatured = searchParams.get("featured") || "all"

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/games?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={currentCategory} onValueChange={(value) => handleFilterChange("category", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {loading ? (
            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
          ) : (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Select value={currentStatus} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentFeatured} onValueChange={(value) => handleFilterChange("featured", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Featured Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Games</SelectItem>
          <SelectItem value="true">Featured</SelectItem>
          <SelectItem value="false">Not Featured</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 