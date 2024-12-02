import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums/routes'
import Home from '@/pages/Home'

import ErrorBoundaryFallback from './common/ErrorBoundaryFallback'

export const createRouter = () => {
  return createBrowserRouter([
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
