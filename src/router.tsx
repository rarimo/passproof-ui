import { createHashRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums/routes'
import Home from '@/pages/Home'

import ErrorBoundaryFallback from './common/ErrorBoundaryFallback'

export const createRouter = () => {
  return createHashRouter([
    {
      path: RoutePaths.Home,
      element: <Outlet />,
      ErrorBoundary: () => <ErrorBoundaryFallback onReset={() => window.location.reload()} />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate replace to={RoutePaths.Home} />,
    },
  ])
}
