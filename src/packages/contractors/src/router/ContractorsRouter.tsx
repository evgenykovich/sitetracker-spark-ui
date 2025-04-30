import { Route } from 'react-router-dom'
import { ContractorsProvider } from '../context/ContractorsContext'
import type { ContractorsServiceConfig } from '../services/contractors'
import ContractorsList from '../routes/ContractorsList'
import ContractorNew from '../routes/ContractorNew'
import { Fragment } from 'react'

export interface ContractorsRouterProps {
  serviceConfig: ContractorsServiceConfig
  basePath?: string
  enabled?: boolean
}

export function ContractorsRouter({
  serviceConfig,
  basePath = '/contractors',
  enabled = true,
}: ContractorsRouterProps) {
  if (!enabled) {
    return null
  }

  return (
    <Fragment>
      <Route
        path={basePath}
        element={
          <ContractorsProvider serviceConfig={serviceConfig}>
            <ContractorsList />
          </ContractorsProvider>
        }
      />
      <Route
        path={`${basePath}/new`}
        element={
          <ContractorsProvider serviceConfig={serviceConfig}>
            <ContractorNew />
          </ContractorsProvider>
        }
      />
    </Fragment>
  )
}
