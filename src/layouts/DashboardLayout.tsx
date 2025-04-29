import { ReactNode, useState } from 'react'
import { Sidebar } from '../components/dashboard/sidebar'
import { Header } from '../components/dashboard/header'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  if (!user) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-full">
        <Sidebar
          isAdmin={isAdmin}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'min-h-screen transition-all duration-200',
          isSidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="w-full p-6">{children}</main>
      </div>
    </div>
  )
}
