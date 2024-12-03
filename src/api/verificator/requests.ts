import { api } from '@/api/clients'
import { ApiServicePaths } from '@/api/enums'

import {
  VerificationLinkRequest,
  VerificationLinkResponse,
  VerificationStatuses,
  VerifiedProofResponse,
} from './types'

export async function requestVerificationLink({
  id,
  event_id,
  uniqueness,
}: VerificationLinkRequest): Promise<VerificationLinkResponse> {
  const res = await api.post<VerificationLinkResponse>(
    `${ApiServicePaths.Verificator}/private/verification-link`,
    {
      body: {
        data: {
          id,
          type: 'user',
          attributes: { uniqueness, event_id },
        },
      },
    },
  )
  return res.data
}

export async function getUserVerificationStatus(id: string): Promise<VerificationStatuses> {
  const res = await api.get<{ status: VerificationStatuses }>(
    `${ApiServicePaths.Verificator}/private/verification-status/${id}`,
  )
  return res.data.status
}

export async function getVerifiedProof(userId: string): Promise<VerifiedProofResponse> {
  const res = await api.get<VerifiedProofResponse>(
    `${ApiServicePaths.Verificator}/private/proof/${userId}`,
  )
  return res.data
}
