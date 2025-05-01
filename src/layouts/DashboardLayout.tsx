import { useState, useEffect } from 'react'
import { Sidebar } from '../components/dashboard/sidebar'
import { Header } from '../components/dashboard/header'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'
import { Outlet } from 'react-router-dom'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export function DashboardLayout() {
  const { user, isAdmin } = useAuth()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop)

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsSidebarOpen(isDesktop)
  }, [isDesktop])

  if (!user) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full transform transition-transform duration-200 ease-in-out',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
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
          // Only apply left padding on desktop
          'md:pl-64',
          !isSidebarOpen && 'md:pl-16',
          // Remove mobile padding since sidebar will be hidden
          'pl-0'
        )}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="w-full px-4 md:px-6">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-fit py-4 md:py-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
