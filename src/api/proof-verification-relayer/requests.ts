import { api } from '@/api/clients'
import { ApiServicePaths } from '@/api/enums'

import { SignedRootStateResponse } from './types'

export async function getSignedRootState(root: string): Promise<SignedRootStateResponse> {
  const res = await api.get<SignedRootStateResponse>(
    `${ApiServicePaths.ProofVerificationRelayer}/v1/state`,
    { query: { filter: { root } } },
  )
  return res.data
}
