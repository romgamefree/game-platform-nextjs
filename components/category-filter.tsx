"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCategories } from "@/hooks/use-categories"

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { categories, loading } = useCategories()

  useEffect(() => {
    const categoryId = searchParams.get("category")
    if (categoryId) {
      setValue(categoryId)
    }
  }, [searchParams])

  if (loading) {
    return <Button variant="outline" className="w-[200px] justify-between">Loading...</Button>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? categories.find((category) => category.id.toString() === value)?.name : "Filter by category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue("")
                  setOpen(false)

                  const params = new URLSearchParams(searchParams)
                  params.delete("category")
                  params.delete("page")
                  router.push(`?${params.toString()}`)
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
                All Categories
              </CommandItem>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => {
                    setValue(category.id.toString())
                    setOpen(false)

                    const params = new URLSearchParams(searchParams)
                    params.set("category", category.id.toString())
                    params.delete("page")
                    router.push(`?${params.toString()}`)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === category.id.toString() ? "opacity-100" : "opacity-0")}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

