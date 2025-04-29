import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/contexts/auth-context'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminNavbar } from '@/components/admin/navbar'

export function AdminLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Protect admin routes
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      navigate('/')
    }
  }, [loading, user, navigate])

  if (loading || !user) {
    return null
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
