"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createUser, updateUser, deleteUser } from "@/lib/actions/users"
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

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["ADMIN", "USER"]),
})

type User = z.infer<typeof userSchema>

interface UsersFormProps {
  initialUsers: User[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export function UsersForm({ initialUsers, pagination: initialPagination }: UsersFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage)
  const [pagination, setPagination] = useState(initialPagination)

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER"
    }
  })

  async function onSubmit(values: User) {
    setIsLoading(true)

    try {
      if (editingUser) {
        // Update existing user
        const result = await updateUser({ ...values, id: editingUser.id })
        
        if (result.success && result.data) {
          const updatedUsers = users.map(user => 
            user.id === editingUser.id ? {
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              role: result.data.role,
            } : user
          )
          setUsers(updatedUsers)
          
          toast({
            title: "User updated",
            description: "User has been updated successfully.",
          })
        } else {
          throw new Error(result.error)
        }
      } else {
        // Add new user
        const result = await createUser(values)
        
        if (result.success && result.data) {
          const newUser = {
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            role: result.data.role,
          }
          setUsers([...users, newUser])
          
          toast({
            title: "User created",
            description: "New user has been created successfully.",
          })
        } else {
          throw new Error(result.error)
        }
      }
      setIsDialogOpen(false)
      form.reset()
      setEditingUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: number) {
    setIsLoading(true)

    try {
      const result = await deleteUser(id)
      
      if (result.success) {
        const updatedUsers = users.filter(user => user.id !== id)
        setUsers(updatedUsers)
        
        toast({
          title: "User deleted",
          description: "User has been deleted successfully.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit(user: User) {
    setEditingUser(user)
    form.reset(user)
    setIsDialogOpen(true)
  }

  async function handlePageChange(page: number) {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users?page=${page}`)
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
        setPagination(data.pagination)
        setCurrentPage(page)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} users
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUser(null)
              form.reset()
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        {editingUser ? "Leave blank to keep current password" : "Password must be at least 6 characters"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id!)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DataPagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
} 