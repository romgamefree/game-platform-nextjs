export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  _count?: {
    games: number
  }
}

export interface Game {
  id: number
  title: string
  slug: string
  description: string
  instructions?: string
  thumbnail: string
  embedUrl: string
  published: boolean
  featured: boolean
  categoryId: number
  category: Category
  createdAt: string
  updatedAt: string
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  structuredData?: string
  // Rating fields
  rating?: number
  ratingCount?: number
}

export interface User {
  id: number
  name: string
  email: string
  role: "USER" | "ADMIN"
  createdAt: string
}

