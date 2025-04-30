import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  startTransition,
  useCallback,
  Suspense,
} from 'react'
import type { Contractor } from '../types'
import {
  ContractorsService,
  type ContractorsServiceConfig,
} from '../services/contractors'
import { Loader2 } from 'lucide-react'

interface ContractorsContextType {
  contractors: Contractor[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
  createContractor: (
    data: Parameters<ContractorsService['createContractor']>[0]
  ) => Promise<Contractor>
  updateContractor: (
    id: string,
    data: Partial<Contractor>
  ) => Promise<Contractor>
  deleteContractor: (id: string) => Promise<void>
  importContractors: (
    file: File
  ) => Promise<{ imported: number; skipped: number; errors: string[] }>
}

const ContractorsContext = createContext<ContractorsContextType | null>(null)

export interface ContractorsProviderProps {
  children: React.ReactNode
  serviceConfig: ContractorsServiceConfig
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function ContractorsProvider({
  children,
  serviceConfig,
}: ContractorsProviderProps) {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const service = useMemo(
    () => new ContractorsService(serviceConfig),
    [serviceConfig]
  )

  const fetchContractors = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await service.getContractors()
      startTransition(() => {
        setContractors(data)
        setIsInitialized(true)
      })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch contractors')
      )
    } finally {
      setIsLoading(false)
    }
  }, [service])

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const initialize = async () => {
      if (!isInitialized && mounted) {
        try {
          await fetchContractors()
        } catch (err) {
          console.error('Failed to initialize contractors:', err)
        }
      }
    }

    // Use requestAnimationFrame to ensure this runs after the initial render
    // and any route transitions
    const frameId = requestAnimationFrame(() => {
      timeoutId = setTimeout(initialize, 0)
    })

    return () => {
      mounted = false
      cancelAnimationFrame(frameId)
      clearTimeout(timeoutId)
    }
  }, [fetchContractors, isInitialized])

  const createContractor = useCallback(
    async (data: Parameters<ContractorsService['createContractor']>[0]) => {
      const newContractor = await service.createContractor(data)
      startTransition(() => {
        setContractors((prev) => [...prev, newContractor])
      })
      return newContractor
    },
    [service]
  )

  const updateContractor = useCallback(
    async (id: string, data: Partial<Contractor>) => {
      const updatedContractor = await service.updateContractor(id, data)
      startTransition(() => {
        setContractors((prev) =>
          prev.map((c) => (c.id === id ? updatedContractor : c))
        )
      })
      return updatedContractor
    },
    [service]
  )

  const deleteContractor = useCallback(
    async (id: string) => {
      await service.deleteContractor(id)
      startTransition(() => {
        setContractors((prev) => prev.filter((c) => c.id !== id))
      })
    },
    [service]
  )

  const importContractors = useCallback(
    async (file: File) => {
      const result = await service.importContractors(file)
      await fetchContractors()
      return result
    },
    [service, fetchContractors]
  )

  const value = useMemo(
    () => ({
      contractors,
      isLoading,
      error,
      refetch: fetchContractors,
      createContractor,
      updateContractor,
      deleteContractor,
      importContractors,
    }),
    [
      contractors,
      isLoading,
      error,
      fetchContractors,
      createContractor,
      updateContractor,
      deleteContractor,
      importContractors,
    ]
  )

  if (!isInitialized) {
    return <LoadingFallback />
  }

  return (
    <ContractorsContext.Provider value={value}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ContractorsContext.Provider>
  )
}

export function useContractors() {
  const context = useContext(ContractorsContext)
  if (!context) {
    throw new Error('useContractors must be used within a ContractorsProvider')
  }
  return context
}
