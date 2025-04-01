import type { Metadata } from "next"
import { getSettings } from "@/lib/settings"
import { SettingsForm } from "@/components/admin/settings-form"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Site Settings",
  description: "Manage site settings",
}

interface SettingsPageProps {
  searchParams: { page?: string }
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams
  const page = Number(params?.page) || 1
  const { data: settings = [], pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  } } = await getSettings(page)

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Site Settings"
        description="Manage your site settings and configurations"
      />
      <SettingsForm initialSettings={settings} pagination={pagination} />
    </div>
  )
}


