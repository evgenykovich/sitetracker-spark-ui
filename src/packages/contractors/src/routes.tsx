import { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { ContractorsProviderWrapper } from './context/ContractorsProviderWrapper'

// Lazy load all pages
const ContractorsListPage = lazy(() => import('./pages/contractors/page'))
const ContractorNewPage = lazy(() => import('./pages/contractors/new/page'))
const FormsPage = lazy(() => import('./pages/forms/page'))
const FormBuilderPage = lazy(() => import('./pages/forms/builder/page'))
const FormCreatePage = lazy(() => import('./pages/forms/create/page'))
const FormDetailsPage = lazy(() => import('./pages/forms/[formId]/page'))
const FormApprovalsPage = lazy(() => import('./pages/form-approvals/page'))
const ContractorFormsPage = lazy(
  () => import('./pages/contractor-forms/[formId]/page')
)

export const contractorsRoutes: RouteObject[] = [
  {
    path: '/contractors',
    element: (
      <ContractorsProviderWrapper>
        <ContractorsListPage />
      </ContractorsProviderWrapper>
    ),
    children: [
      {
        path: 'new',
        element: <ContractorNewPage />,
      },
    ],
  },
  {
    path: '/forms',
    element: (
      <ContractorsProviderWrapper>
        <FormsPage />
      </ContractorsProviderWrapper>
    ),
    children: [
      {
        path: 'create',
        element: <FormCreatePage />,
      },
      {
        path: 'builder',
        element: <FormBuilderPage />,
      },
      {
        path: ':formId',
        element: <FormDetailsPage />,
      },
    ],
  },
  {
    path: '/form-approvals',
    element: (
      <ContractorsProviderWrapper>
        <FormApprovalsPage />
      </ContractorsProviderWrapper>
    ),
  },
  {
    path: '/contractor-forms/:formId',
    element: (
      <ContractorsProviderWrapper>
        <ContractorFormsPage />
      </ContractorsProviderWrapper>
    ),
  },
]
