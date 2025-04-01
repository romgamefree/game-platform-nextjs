import { getUsers } from "@/lib/actions/users"
import { UsersForm } from "@/components/admin/users-form"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const { data: users = [], pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  } } = await getUsers(page)

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Users"
        description="Manage your users and their permissions"
      />
      <UsersForm initialUsers={users} pagination={pagination} />
    </div>
  )
} 