import { RouteObject } from 'react-router-dom'
import { ContractorsListPage, ContractorNewPage } from './pages'

export const contractorsRoutes: RouteObject[] = [
  {
    path: '/contractors',
    children: [
      { index: true, element: <ContractorsListPage /> },
      { path: 'new', element: <ContractorNewPage /> },
    ],
  },
]
