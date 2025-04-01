"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { updateSettings } from "@/lib/actions"
import { DataPagination } from "@/components/ui/data-pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

const settingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  type: z.enum(["TEXT", "TEXTAREA", "COLOR", "IMAGE"]),
  description: z.string().optional(),
})

type Setting = z.infer<typeof settingSchema>

interface SettingsFormProps {
  initialSettings: Record<string, any>
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export function SettingsForm({ initialSettings, pagination }: SettingsFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null)
  const [settings, setSettings] = useState<Setting[]>(() => {
    return Object.entries(initialSettings).map(([key, value]) => ({
      key,
      value: String(value),
      type: key.includes("description") ? "TEXTAREA" : 
        key.includes("color") ? "COLOR" : 
        key.includes("image") ? "IMAGE" : "TEXT",
      description: getSettingDescription(key)
    }))
  })

  const form = useForm<Setting>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: "",
      value: "",
      type: "TEXT",
      description: ""
    }
  })

  function getSettingDescription(key: string): string {
    const descriptions: Record<string, string> = {
      "site.name": "The name of your website",
      "site.description": "A brief description of your website",
      "site.logo": "URL to your site logo",
      "site.themeColor": "The primary color for your site theme",
      "seo.defaultTitle": "The default title for pages without a specific title",
      "seo.defaultDescription": "The default meta description for pages without a specific description",
      "social.twitter": "Your Twitter profile URL",
      "social.facebook": "Your Facebook page URL"
    }
    return descriptions[key] || ""
  }

  async function onSubmit(values: Setting) {
    try {
      setIsLoading(true)
      await updateSettings({ [values.key]: { value: values.value, type: values.type } })
      setSettings(prev => {
        const index = prev.findIndex(s => s.key === values.key)
        if (index === -1) {
          return [...prev, values]
        }
        return prev.map(s => s.key === values.key ? values : s)
      })
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Setting updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(key: string) {
    try {
      setIsLoading(true)
      await updateSettings({ [key]: { value: "", type: "TEXT" } })
      setSettings(prev => prev.filter(s => s.key !== key))
      toast({
        title: "Success",
        description: "Setting deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit(setting: Setting) {
    setEditingSetting(setting)
    form.reset(setting)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSetting(null)
              form.reset()
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSetting ? 'Edit Setting' : 'Add New Setting'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="site.name" {...field} disabled={!!editingSetting} />
                      </FormControl>
                      <FormDescription>Unique identifier for the setting</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="TEXT">Text</option>
                          <option value="TEXTAREA">Textarea</option>
                          <option value="COLOR">Color</option>
                          <option value="IMAGE">Image</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        {form.watch("type") === "TEXTAREA" ? (
                          <Textarea {...field} />
                        ) : form.watch("type") === "COLOR" ? (
                          <div className="flex items-center gap-2">
                            <Input type="color" className="w-12 h-10 p-1" {...field} />
                            <Input value={field.value} onChange={field.onChange} className="flex-1" />
                          </div>
                        ) : (
                          <Input {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.key}>
              <TableCell className="font-medium">{setting.key}</TableCell>
              <TableCell>
                {setting.type === "COLOR" ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: setting.value }}
                    />
                    <span>{setting.value}</span>
                  </div>
                ) : setting.type === "IMAGE" ? (
                  <img src={setting.value} alt="Preview" className="w-8 h-8 object-contain" />
                ) : (
                  setting.value
                )}
              </TableCell>
              <TableCell>{setting.type}</TableCell>
              <TableCell>{setting.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(setting)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(setting.key)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => {
          router.push(`/admin/settings?page=${page}`)
        }}
      />
    </div>
  )
}

