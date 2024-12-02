import { EventEmitter } from '@distributedlab/tools'

import type { ToastPayload } from '@/contexts/toasts-manager'
import { BusEvents } from '@/enums/bus'

export type BusEventMap = {
  [BusEvents.success]: ToastPayload
  [BusEvents.error]: ToastPayload
  [BusEvents.warning]: ToastPayload
  [BusEvents.info]: ToastPayload
}

export const bus = new EventEmitter<BusEventMap>()
