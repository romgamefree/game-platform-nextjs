import type { Metadata } from "next"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentGames } from "@/components/admin/recent-games"
import { PopularCategories } from "@/components/admin/popular-categories"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for GameHub",
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard"
        description="Overview of your platform's performance"
      />
      
      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentGames />
        <PopularCategories />
      </div>
    </div>
  )
}

