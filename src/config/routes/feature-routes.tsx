import { RouteObject } from 'react-router-dom'
import { contractorsRoutes } from '@site-tracker/contractors'

export const getFeatureRoutes = (): RouteObject[] => {
  const routes: RouteObject[] = []

  if (import.meta.env.VITE_ENABLE_CONTRACTORS === 'true') {
    routes.push(...contractorsRoutes)
  }

  return routes
}
