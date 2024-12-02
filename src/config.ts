import packageJson from '../package.json'

export type Config = {
  ENV: 'development' | 'production'
  BUILD_VERSION: string

  API_URL: string
  APP_HOST_URL: string

  APP_STORE_APP_LINK: string
  GOOGLE_PLAY_APP_LINK: string
}

export const config: Config = {
  ENV: import.meta.env.VITE_ENV,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  APP_HOST_URL: import.meta.env.VITE_APP_HOST_URL,
  API_URL: import.meta.env.VITE_API_URL,

  APP_STORE_APP_LINK: 'https://apps.apple.com/app/rarime/id6503300598',
  GOOGLE_PLAY_APP_LINK: 'https://play.google.com/store/apps/details?id=com.rarilabs.rarime',
}
