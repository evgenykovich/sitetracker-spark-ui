import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/contexts/auth-context'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ConnectSalesforce } from '@/components/integrations/connect-salesforce'

export default function SalesforcePage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [navigate, user, loading])

  if (loading || !user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Salesforce Integration
          </h1>
          <p className="text-muted-foreground">
            Connect and manage your Salesforce organization
          </p>
        </div>

        <ConnectSalesforce />
      </div>
    </DashboardLayout>
  )
}
