import { NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/lib/actions/users"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get("page") || "1")

  const result = await getUsers(page)
  return NextResponse.json(result)
} 