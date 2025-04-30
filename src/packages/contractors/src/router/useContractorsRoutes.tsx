import { Route } from 'react-router-dom'
import { ContractorsProvider } from '../context/ContractorsContext'
import type { ContractorsServiceConfig } from '../services/contractors'
import ContractorsList from '../routes/ContractorsList'
import ContractorNew from '../routes/ContractorNew'
import { lazy } from 'react'

// Lazy load the form-related pages
const FormsPage = lazy(() => import('../pages/forms/page'))
const FormCreate = lazy(() => import('../pages/forms/create/page'))
const FormBuilder = lazy(() => import('../pages/forms/builder/page'))
const FormDetails = lazy(() => import('../pages/forms/[formId]/page'))
const ContractorFormDetails = lazy(
  () => import('../pages/contractor-forms/[formId]/page')
)
const FormApprovalsPage = lazy(() => import('../pages/form-approvals/page'))

export interface ContractorsRoutesConfig {
  serviceConfig: ContractorsServiceConfig
  basePath?: string
  enabled?: boolean
}

export function useContractorsRoutes({
  serviceConfig,
  basePath = '/contractors',
  enabled = true,
}: ContractorsRoutesConfig) {
  if (!enabled) {
    return []
  }

  const withProvider = (element: React.ReactNode) => (
    <ContractorsProvider serviceConfig={serviceConfig}>
      {element}
    </ContractorsProvider>
  )

  return [
    // Contractors routes
    <Route
      key="contractors-list"
      path={basePath}
      element={withProvider(<ContractorsList />)}
    />,
    <Route
      key="contractors-new"
      path={`${basePath}/new`}
      element={withProvider(<ContractorNew />)}
    />,

    // Forms routes
    <Route
      key="forms-list"
      path="/forms"
      element={withProvider(<FormsPage />)}
    />,
    <Route
      key="forms-create"
      path="/forms/create"
      element={withProvider(<FormCreate />)}
    />,
    <Route
      key="forms-builder"
      path="/forms/builder"
      element={withProvider(<FormBuilder />)}
    />,
    <Route
      key="forms-details"
      path="/forms/:formId"
      element={withProvider(<FormDetails />)}
    />,

    // Form Approvals route
    <Route
      key="form-approvals"
      path="/form-approvals"
      element={withProvider(<FormApprovalsPage />)}
    />,

    // Contractor Forms routes
    <Route
      key="contractor-forms-details"
      path="/contractor-forms/:formId"
      element={withProvider(<ContractorFormDetails />)}
    />,
  ]
}
