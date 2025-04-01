import type { Metadata } from "next"
import Link from "next/link"
import { getCategories } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { CategoriesList } from "@/components/admin/categories-list"
import { Plus } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Manage Categories",
  description: "Manage game categories on GameHub",
}

interface CategoriesPageProps {
  searchParams: { page?: string }
}

export default async function ManageCategoriesPage({ searchParams }: CategoriesPageProps) {
  const { categories = [], total = 0, totalPages = 1, page = 1 } = await getCategories(searchParams)

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categories"
        description="Organize games into categories"
      >
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </AdminHeader>

      <CategoriesList 
        categories={categories} 
        page={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  )
}

