import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryForm } from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/data"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Edit Category",
  description: "Edit category on GameHub",
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const parsedId = Number.parseInt(id);
  
  if (isNaN(parsedId)) {
    notFound()
  }

  const category = await getCategoryById(parsedId)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  )
} 