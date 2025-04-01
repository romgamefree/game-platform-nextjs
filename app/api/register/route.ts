import { db } from "@/lib/db"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@example.com" },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      )
    }

    // Create admin user
    const hashedPassword = await hash("admin123", 10)
    await db.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json(
      { message: "Admin user created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    )
  }
} 