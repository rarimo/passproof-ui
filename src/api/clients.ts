import { JsonApiClient } from '@distributedlab/jac'

import { config } from '@/config'

export const api = new JsonApiClient({
  baseUrl: config.API_URL,
})

export function addAuthInterceptor(accessToken: string, onUnauthorized: () => void) {
  api.addInterceptor({
    request: async config => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      }
      return config
    },
    response: async response => {
      if (response.status === 401) {
        onUnauthorized()
      }
      return response
    },
  })
}

export function clearInterceptors() {
  api.clearInterceptors()
}
