import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'

import { ToastsManager } from '@/contexts'
import { ErrorHandler } from '@/helpers/error-handler'
import { createRouter } from '@/router'
import { createTheme } from '@/theme'

import ErrorBoundaryFallback from './common/ErrorBoundaryFallback'
import NetworkWarningProtector from './common/NetworkWarningProtector'
import { useSystemPaletteMode } from './hooks/system-palette-mode'
import { useViewportSizes } from './hooks/viewport'
import { web3Store } from './store/web3'

const router = createRouter()

const App = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(false)
  const paletteMode = useSystemPaletteMode()

  useViewportSizes()

  const init = useCallback(async () => {
    try {
      await web3Store.init()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    setIsAppInitialized(true)
  }, [])

  const theme = useMemo(() => createTheme(paletteMode), [paletteMode])

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastsManager>
        <div className='App' key='app_main'>
          {isAppInitialized ? (
            <ErrorBoundary
              FallbackComponent={({ resetErrorBoundary }) => (
                <ErrorBoundaryFallback onReset={resetErrorBoundary} />
              )}
              onReset={() => window.location.reload()}
            >
              <NetworkWarningProtector>
                <RouterProvider router={router} />
              </NetworkWarningProtector>
            </ErrorBoundary>
          ) : (
            <CircularProgress color='secondary' sx={{ m: 'auto' }} />
          )}
        </div>
      </ToastsManager>
    </ThemeProvider>
  )
}

export default memo(App)
