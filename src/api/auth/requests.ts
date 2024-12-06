import { api } from '@/api/clients'
import { ApiServicePaths } from '@/api/enums'

import { AuthTokensGroup } from './types'

export async function authorizeUser(address: string, signature: string): Promise<AuthTokensGroup> {
  const { data } = await api.post<AuthTokensGroup>(`${ApiServicePaths.Auth}/v1/authorize`, {
    body: {
      data: {
        id: address,
        type: 'authorize',
        attributes: { signature },
      },
    },
  })

  return data
}

export async function refreshJwt(): Promise<AuthTokensGroup> {
  const { data } = await api.get<AuthTokensGroup>(`${ApiServicePaths.Auth}/v1/refresh`)
  return data
}

export async function getAuthChallenge(address: string): Promise<string> {
  const { data } = await api.get<{ challenge: string }>(
    `${ApiServicePaths.Auth}/v1/authorize/${address}/challenge`,
  )
  return data.challenge
}
