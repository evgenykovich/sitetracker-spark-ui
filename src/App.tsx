import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/contexts/auth-context'
import { Toaster } from './components/ui/toaster'
import Home from './pages/Home'
import Dashboard from './pages/dashboard/page'
import Admin from './pages/admin/page'
import UserProfile from './pages/settings/profile/page'
import AccountSettings from './pages/settings/page'
import Forms from './pages/forms/page'
import SalesforceIntegration from './pages/integrations/salesforce/page'
import FormId from './pages/forms/[formId]/page'
import CreateForm from './pages/forms/create/page'
import ContractorsList from './pages/contractors/page'
import ContractorNew from './pages/contractors/new/page'
import AdminAppearance from './pages/admin/appearance/page'
import AdminPayments from './pages/admin/payments/page'
import AdminSystem from './pages/admin/system/page'
import AdminUsers from './pages/admin/users/page'
import AdminSettings from './pages/admin/settings/page'
import { AdminLayout } from './layouts/AdminLayout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/forms/create" element={<CreateForm />} />
            <Route path="/forms/:formId" element={<FormId />} />
            <Route path="/settings">
              <Route index element={<AccountSettings />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            <Route path="/contractors">
              <Route index element={<ContractorsList />} />
              <Route path="new" element={<ContractorNew />} />
            </Route>
            <Route
              path="/integrations/salesforce"
              element={<SalesforceIntegration />}
            />

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
