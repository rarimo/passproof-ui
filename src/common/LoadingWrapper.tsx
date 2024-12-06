import { CircularProgress } from '@mui/material'
import { isEmpty } from 'lodash'
import { PropsWithChildren, ReactNode } from 'react'

import { LoadingStates, UseLoadingResult } from '@/hooks/loading'

import ErrorView from './ErrorView'
import NoDataView from './NoDataView'

interface Props<T> extends PropsWithChildren {
  loader: UseLoadingResult<T>
  slots?: {
    loading?: ReactNode
    error?: ReactNode
    empty?: ReactNode
  }
}

export default function LoadingWrapper<T>({ loader, slots, children }: Props<T>) {
  switch (loader.loadingState) {
    case LoadingStates.Loading:
      return slots?.loading ?? <CircularProgress sx={{ mx: 'auto', my: 12 }} />
    case LoadingStates.Error:
      return slots?.error ?? <ErrorView />
    case LoadingStates.Loaded:
      return children
    default:
      return isEmpty(loader.data) ? slots?.empty ?? <NoDataView /> : children
  }
}
