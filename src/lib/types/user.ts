export interface User {
  id: string
  email: string
  firstName: string
  lastName?: string
  role: 'USER' | 'ADMIN' | 'CONTRACTOR'
  createdAt: string
  updatedAt: string
}
