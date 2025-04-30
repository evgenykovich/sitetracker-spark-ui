import { Route } from 'react-router-dom'
import { ContractorsProvider } from '../context/ContractorsContext'
import type { ContractorsServiceConfig } from '../services/contractors'
import ContractorsList from '../routes/ContractorsList'
import ContractorNew from '../routes/ContractorNew'

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

  return [
    <Route
      key="contractors-list"
      path={basePath}
      element={
        <ContractorsProvider serviceConfig={serviceConfig}>
          <ContractorsList />
        </ContractorsProvider>
      }
    />,
    <Route
      key="contractors-new"
      path={`${basePath}/new`}
      element={
        <ContractorsProvider serviceConfig={serviceConfig}>
          <ContractorNew />
        </ContractorsProvider>
      }
    />,
  ]
}
