"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { Game } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { createGame, updateGame } from "@/lib/actions"
import { useCategories } from "@/hooks/use-categories"
import React from "react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  instructions: z.string().optional(),
  thumbnail: z.string().url({
    message: "Please enter a valid URL for the thumbnail.",
  }),
  embedUrl: z.string().url({
    message: "Please enter a valid URL for the embed.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  structuredData: z.string().optional(),
})

interface GameFormProps {
  game?: Game
}

export function GameForm({ game }: GameFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { categories, loading } = useCategories()

  // Function to convert title to slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  // Generate default structured data for JSON-LD
  const generateStructuredData = (values: any) => {
    return JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: values.title,
        description: values.description,
        image: values.thumbnail,
        genre: categories.find((c) => c.id.toString() === values.categoryId)?.name || "",
        url: `https://yourdomain.com/games/${values.slug}`,
      },
      null,
      2,
    )
  }

  // Parse structured data if it exists
  const initialStructuredData = game?.structuredData ? JSON.stringify(game.structuredData, null, 2) : ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: game?.title || "",
      slug: game?.slug || "",
      description: game?.description || "",
      instructions: game?.instructions || "",
      thumbnail: game?.thumbnail || "",
      embedUrl: game?.embedUrl || "",
      categoryId: game?.categoryId ? String(game.categoryId) : "",
      published: game?.published || false,
      featured: game?.featured || false,
      // SEO fields
      metaTitle: game?.metaTitle || "",
      metaDescription: game?.metaDescription || "",
      keywords: game?.keywords || "",
      structuredData: initialStructuredData,
    },
  })

  // Watch title changes and update slug
  const title = form.watch("title")
  React.useEffect(() => {
    if (title) {
      form.setValue("slug", generateSlug(title))
    }
  }, [title, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const data = {
        ...values,
        categoryId: Number.parseInt(values.categoryId),
      }

      if (game) {
        await updateGame(game.id, data)
      } else {
        await createGame(data)
      }

      toast({
        title: game ? "Game updated" : "Game created",
        description: game ? "Your game has been updated." : "Your game has been created.",
      })

      router.push("/admin/games")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Game title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="game-title" 
                        {...field} 
                        readOnly // Make it read-only since it's auto-generated
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Automatically generated from title. Use lowercase letters, numbers, and hyphens only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="embedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embed URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/game" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Game description" className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How to play the game" className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Published</FormLabel>
                      <FormDescription className="text-xs">
                        Make the game visible to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Featured</FormLabel>
                      <FormDescription className="text-xs">
                        Show the game in featured section
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Custom title for SEO" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Leave empty to use the game title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="game, puzzle, action" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Comma-separated keywords for SEO</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Custom description for SEO"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Leave empty to use the game description
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="structuredData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structured Data (JSON-LD)</FormLabel>
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const values = form.getValues()
                        field.onChange(generateStructuredData(values))
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder='{"@context": "https://schema.org", "@type": "VideoGame", ...}'
                      className="min-h-[200px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    JSON-LD structured data for rich search results. Click Generate to create based on game data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : game ? "Update Game" : "Create Game"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/games")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

