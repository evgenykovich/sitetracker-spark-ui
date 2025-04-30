import { useState } from 'react'
import { ContractorsList, ContractorsFilter } from '../components'
import { Loader2, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { useContractors } from '../context/ContractorsContext'

export function ContractorsListPage() {
  // Filter states
  const [name, setName] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { contractors, isLoading, error } = useContractors()

  // Apply client-side filters
  const filteredContractors = contractors.filter((contractor) => {
    // Name filter
    if (name) {
      const fullName =
        `${contractor.firstName} ${contractor.lastName}`.toLowerCase()
      const searchTerm = name.toLowerCase()
      if (
        !fullName.includes(searchTerm) &&
        !contractor.companyName?.toLowerCase().includes(searchTerm)
      ) {
        return false
      }
    }

    // Specialty filter
    if (specialtyFilter !== 'all' && contractor.specialties) {
      if (
        !contractor.specialties.some(
          (spec) => spec.toLowerCase() === specialtyFilter.toLowerCase()
        )
      ) {
        return false
      }
    }

    // Status filter
    if (statusFilter !== 'all' && contractor.status) {
      if (contractor.status.toUpperCase() !== statusFilter) {
        return false
      }
    }

    return true
  })

  const handleFilterChange = (
    filterType: 'name' | 'specialty' | 'status',
    value: string
  ) => {
    switch (filterType) {
      case 'name':
        setName(value)
        break
      case 'specialty':
        setSpecialtyFilter(value)
        break
      case 'status':
        setStatusFilter(value)
        break
    }
  }

  const clearFilters = () => {
    setName('')
    setSpecialtyFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="relative">
      <div className="relative z-10 flex flex-col space-y-6 p-6">
        <PageHeader
          title="Contractors"
          description="View and manage contractors for your projects."
          action={{
            label: 'Add Contractor',
            href: '/contractors/new',
            icon: UserPlus,
          }}
        />

        <ContractorsFilter
          name={name}
          specialty={specialtyFilter}
          status={statusFilter}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error.message}
          </div>
        ) : (
          <ContractorsList contractors={filteredContractors} />
        )}
      </div>
    </div>
  )
}
