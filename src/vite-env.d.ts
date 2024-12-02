/// <reference types="vite/client" />

import { Config } from './config'

interface ImportMetaEnv {
  VITE_ENV: Config['ENV']
  VITE_PORT: string
  VITE_APP_BUILD_VERSION: string

  VITE_API_URL: string
  VITE_APP_HOST_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
