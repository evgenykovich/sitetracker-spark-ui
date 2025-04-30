import type { ContractorStatus } from '../types'

export interface ContractorProfile {
  id?: string
  userId?: string
  company?: string
  phone?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt?: string
  updatedAt?: string
}

export interface Contractor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  status?: ContractorStatus
  specialties?: string[]
  contractorProfile?: ContractorProfile
  createdAt?: string
  updatedAt?: string
}

export interface ContractorForm {
  id: string
  name: string
  description?: string
  status: string
  createdAt: string
  assignedAt: string
}

export interface ContractorsServiceConfig {
  baseUrl: string
  getToken: () => string | null
}

export class ContractorsService {
  private readonly baseUrl: string
  private readonly getToken: () => string | null

  constructor(config: ContractorsServiceConfig) {
    this.baseUrl = config.baseUrl
    this.getToken = config.getToken
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  async getContractors(filters?: { name?: string }): Promise<Contractor[]> {
    // Build query parameters
    const params = new URLSearchParams()
    if (filters?.name) params.append('name', filters.name)

    const queryString = params.toString() ? `?${params.toString()}` : ''

    const response = await fetch(
      `${this.baseUrl}/api/contractors${queryString}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractors')
    }

    return response.json()
  }

  async getContractor(id: string): Promise<Contractor> {
    const response = await fetch(`${this.baseUrl}/api/contractors/${id}`, {
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractor')
    }

    return response.json()
  }

  async createContractor(data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    companyName?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    specialties?: string[]
  }): Promise<Contractor> {
    const response = await fetch(`${this.baseUrl}/api/contractors`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create contractor')
    }

    return response.json()
  }

  async updateContractor(
    id: string,
    data: Partial<Contractor>
  ): Promise<Contractor> {
    const response = await fetch(`${this.baseUrl}/api/contractors/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update contractor')
    }

    return response.json()
  }

  async deleteContractor(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/contractors/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete contractor')
    }
  }

  async getContractorForms(id: string): Promise<ContractorForm[]> {
    const response = await fetch(
      `${this.baseUrl}/api/contractors/${id}/forms`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch contractor forms')
    }

    return response.json()
  }

  async importContractors(file: File): Promise<{
    imported: number
    skipped: number
    errors: string[]
  }> {
    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Get authorization headers without Content-Type (browser will set it with boundary)
    const token = this.getToken()
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    // Make the request
    const response = await fetch(`${this.baseUrl}/api/contractors/import`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to import contractors')
    }

    return response.json()
  }
}
