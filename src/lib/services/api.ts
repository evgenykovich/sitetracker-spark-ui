import { APP_CONFIG } from '@/config/app.config'
import { getToken } from '@/lib/auth'

interface ApiOptions {
  baseUrl?: string
  headers?: Record<string, string>
}

interface ApiError extends Error {
  status?: number
  data?: unknown
}

export class ApiService {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(options: ApiOptions = {}) {
    this.baseUrl = options.baseUrl || APP_CONFIG.api.baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = getToken()
    return {
      ...this.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error: ApiError = new Error('API request failed')
      error.status = response.status
      try {
        error.data = await response.json()
      } catch {
        error.data = await response.text()
      }
      throw error
    }

    try {
      return await response.json()
    } catch {
      return await response.text()
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
    })

    return this.handleResponse(response)
  }

  async post<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse(response)
  }

  async put<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    return this.handleResponse(response)
  }
}

export const api = new ApiService()
export default api
