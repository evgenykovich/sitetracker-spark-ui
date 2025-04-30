import { getBaseUrl } from '@/lib/utils'
import { getToken } from '@/lib/auth'

export interface FormField {
  label: string
  type: string
  required: boolean
  order?: number
}

export interface CreateFormDto {
  title: string
  description: string
  formItems: FormField[]
}

export interface Form extends CreateFormDto {
  id: string
  createdAt: string
  updatedAt: string
}

class FormsService {
  private baseUrl = `${getBaseUrl()}/api/forms`

  async create(data: CreateFormDto): Promise<Form> {
    const formItemsWithOrder = data.formItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        ...data,
        formItems: formItemsWithOrder,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to create form')
    }

    return response.json()
  }

  async getAll(): Promise<Form[]> {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch forms')
    }

    return response.json()
  }

  async getById(id: string): Promise<Form> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch form')
    }

    return response.json()
  }
}

export default new FormsService()
