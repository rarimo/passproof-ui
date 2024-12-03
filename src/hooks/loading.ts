import { useEffect, useState } from 'react'

import { ErrorHandler } from '@/helpers/error-handler'

export enum LoadingStates {
  Loading,
  Error,
  Loaded,
}

interface UseLoadingOptions<A> {
  loadOnMount?: boolean
  loadArgs?: A[]
  silent?: boolean
}

export interface UseLoadingResult<T> {
  data: T
  loadingState: LoadingStates
  load: () => Promise<void>
  reset: () => void
}

export function useLoading<T, A>(
  initialData: T,
  loadFn: () => Promise<T>,
  options?: UseLoadingOptions<A>,
): UseLoadingResult<T> {
  const { loadArgs = [], loadOnMount = true, silent = false } = options ?? {}

  const [loadingState, setLoadingState] = useState<LoadingStates>(
    loadOnMount ? LoadingStates.Loading : LoadingStates.Loaded,
  )
  const [data, setData] = useState(initialData)

  const load = async () => {
    try {
      reset()
      setLoadingState(LoadingStates.Loading)
      setData(await loadFn())
      setLoadingState(LoadingStates.Loaded)
    } catch (e) {
      setLoadingState(LoadingStates.Error)
      handleError(e)
    }
  }

  const reset = () => {
    setLoadingState(LoadingStates.Loaded)
    setData(initialData)
  }

  const handleError = (e: unknown) => {
    if (silent) {
      ErrorHandler.processWithoutFeedback(e)
    } else {
      ErrorHandler.process(e)
    }
  }

  useEffect(() => {
    if (loadOnMount) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, loadArgs ?? [])

  return { data, loadingState, load, reset }
}
