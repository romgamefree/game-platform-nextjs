"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { DataPagination } from "@/components/ui/data-pagination"

interface GamesPaginationProps {
  currentPage: number
  totalPages: number
}

export function GamesPagination({ currentPage, totalPages }: GamesPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="mt-8">
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
} 