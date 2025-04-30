import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/contexts/auth-context'
import { Toaster } from './components/ui/toaster'
import Home from './pages/Home'
import Dashboard from './pages/dashboard/page'
import Admin from './pages/admin/page'
import UserProfile from './pages/settings/profile/page'
import AccountSettings from './pages/settings/page'
import SalesforceIntegration from './pages/integrations/salesforce/page'
import { useContractorsRoutes } from '@site-tracker/contractors'
import AdminAppearance from './pages/admin/appearance/page'
import { getBaseUrl } from './lib/utils'
import { getToken } from './lib/auth'
import AdminPayments from './pages/admin/payments/page'
import AdminSystem from './pages/admin/system/page'
import AdminUsers from './pages/admin/users/page'
import AdminSettings from './pages/admin/settings/page'
import { AdminLayout } from './layouts/AdminLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// Feature flags could come from environment variables, config service, etc.
const FEATURES = {
  contractors: true,
}

// Configuration for feature-toggled modules
const moduleConfig = {
  contractors: {
    serviceConfig: {
      baseUrl: getBaseUrl(),
      getToken,
    },
    enabled: FEATURES.contractors,
  },
}

function App() {
  // Get the contractors routes based on configuration
  const contractorsRoutes = useContractorsRoutes(moduleConfig.contractors)

  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings">
                <Route index element={<AccountSettings />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>

              {/* Feature-toggled Contractors Module */}
              {contractorsRoutes}

              {/* Integrations */}
              <Route
                path="/integrations/salesforce"
                element={<SalesforceIntegration />}
              />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="appearance" element={<AdminAppearance />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="system" element={<AdminSystem />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
