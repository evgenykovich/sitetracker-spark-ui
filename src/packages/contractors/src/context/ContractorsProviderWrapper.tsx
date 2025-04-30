import { ReactNode, useMemo, Suspense } from 'react'
import { ContractorsProvider } from './ContractorsContext'
import { ContractorsServiceConfig } from '../services/contractors'
import { Loader2 } from 'lucide-react'

interface ContractorsProviderWrapperProps {
  children: ReactNode
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function ContractorsProviderWrapper({
  children,
}: ContractorsProviderWrapperProps) {
  const serviceConfig = useMemo<ContractorsServiceConfig>(
    () => ({
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      getToken: () => localStorage.getItem('token'),
    }),
    []
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContractorsProvider serviceConfig={serviceConfig}>
        {children}
      </ContractorsProvider>
    </Suspense>
  )
}
