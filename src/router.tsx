import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },

  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: '/create/anamnesis',
        lazy: async () => ({
          Component: (await import('@/pages/anamnesis')).default,
        }),
      },
      {
        path: '/edit/anamnesis/:id',
        lazy: async () => {
          const { default: Anamnesis } = await import('@/pages/anamnesis')
          return {
            Component: (props: any) => <Anamnesis {...props} type='edit' />,
          }
        },
      },

      {
        path: '/view/anamnesis/:id',
        lazy: async () => {
          const { default: Anamnesis } = await import('@/pages/anamnesis')
          return {
            Component: (props: any) => <Anamnesis {...props} type='view' />,
          }
        },
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
