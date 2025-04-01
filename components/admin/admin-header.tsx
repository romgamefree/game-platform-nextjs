import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function AdminHeader({ title, description, children, className }: AdminHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between space-y-2", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
} 