"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["ADMIN", "USER"]),
})

const ITEMS_PER_PAGE = 10

export async function createUser(data: z.infer<typeof userSchema>) {
  try {
    const validatedData = userSchema.parse(data)
    
    if (!validatedData.password) {
      return { success: false, error: "Password is required for new users" }
    }

    const hashedPassword = await hash(validatedData.password, 10)
    
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
    })

    revalidatePath("/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(data: z.infer<typeof userSchema>) {
  try {
    const validatedData = userSchema.parse(data)
    
    if (!validatedData.id) {
      return { success: false, error: "User ID is required" }
    }

    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    }

    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 10)
    }

    const user = await db.user.update({
      where: { id: validatedData.id },
      data: updateData,
    })

    revalidatePath("/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: number) {
  try {
    await db.user.delete({
      where: { id },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function getUsers(page: number = 1) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE
    
    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
    ])

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    return { 
      success: true, 
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: ITEMS_PER_PAGE
      }
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
} 