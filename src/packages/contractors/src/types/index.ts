export type ContractorStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING'

export interface Contractor {
  id: string
  name: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  updatedAt: Date
}

export interface ContractorFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  specialties: string[]
  status: ContractorStatus
}
