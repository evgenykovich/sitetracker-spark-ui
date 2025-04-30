import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Contractor } from '../types'
import {
  ContractorsService,
  type ContractorsServiceConfig,
} from '../services/contractors'

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

export function ContractorsProvider({
  children,
  serviceConfig,
}: ContractorsProviderProps) {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const service = new ContractorsService(serviceConfig)

  const fetchContractors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await service.getContractors()
      setContractors(data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch contractors')
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContractors()
  }, []) // Fetch on mount

  const createContractor = async (
    data: Parameters<ContractorsService['createContractor']>[0]
  ) => {
    const newContractor = await service.createContractor(data)
    setContractors((prev) => [...prev, newContractor])
    return newContractor
  }

  const updateContractor = async (id: string, data: Partial<Contractor>) => {
    const updatedContractor = await service.updateContractor(id, data)
    setContractors((prev) =>
      prev.map((c) => (c.id === id ? updatedContractor : c))
    )
    return updatedContractor
  }

  const deleteContractor = async (id: string) => {
    await service.deleteContractor(id)
    setContractors((prev) => prev.filter((c) => c.id !== id))
  }

  const importContractors = async (file: File) => {
    const result = await service.importContractors(file)
    // Refresh the list after import
    await fetchContractors()
    return result
  }

  return (
    <ContractorsContext.Provider
      value={{
        contractors,
        isLoading,
        error,
        refetch: fetchContractors,
        createContractor,
        updateContractor,
        deleteContractor,
        importContractors,
      }}
    >
      {children}
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
