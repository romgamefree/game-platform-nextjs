import type { Metadata } from "next"
import { CategoryForm } from "@/components/admin/category-form"

export const metadata: Metadata = {
  title: "Create New Category",
  description: "Create a new category on GameHub",
}

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Category</h1>
      <CategoryForm />
    </div>
  )
} 