"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Gamepad2, LayoutDashboard, LogOut, Settings, Tag, Users, Download } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Games",
      href: "/admin/games",
      icon: Gamepad2,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      name: "Crawler",
      href: "/admin/crawler",
      icon: Download,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart,
    },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background md:static md:w-56">
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-semibold">GameHub Admin</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground">© GameHub Admin</span>
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </aside>
  )
}

