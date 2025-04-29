import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import * as auth from '@/lib/auth'

export type UserRole = 'ADMIN' | 'USER' | 'CONTRACTOR'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isAdmin?: boolean
  isUser?: boolean
  isContractor?: boolean
}

interface JwtPayload {
  sub: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export function useAuth() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = auth.getToken()
    if (!token) {
      setLoading(false)
      navigate('/')
      return
    }

    try {
      // Decode the JWT token to get user info
      const decoded = jwtDecode<JwtPayload>(token)
      setUser({
        id: decoded.sub,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to decode token:', error)
      auth.removeToken()
      navigate('/')
      setLoading(false)
    }
  }, [navigate])

  const logout = () => {
    auth.removeToken()
    setUser(null)
    navigate('/')
  }

  return {
    user,
    loading,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
    isContractor: user?.role === 'CONTRACTOR',
  }
}
