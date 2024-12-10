import { authorizeUser } from '@/api/auth'
import { addAuthInterceptor, api } from '@/api/clients'
import { parseJwt } from '@/helpers/jwt'
import { createStore } from '@/helpers/store'

const [authStore, useAuthState] = createStore(
  'auth',
  { accessToken: '' },

  state => ({
    get isAuthorized() {
      return Boolean(state.accessToken)
    },
  }),

  state => ({
    async signIn(addr: string, signature: string) {
      const { access_token } = await authorizeUser(addr, signature)
      state.accessToken = access_token.token
      addAuthInterceptor(state.accessToken, () => this.signOut())
    },

    signOut() {
      this.reset()
      window.location.reload()
    },

    verifyToken(address: string) {
      const parsedJwt = parseJwt(state.accessToken)
      const isJwtValid =
        parsedJwt &&
        parsedJwt.exp > Date.now() / 1000 &&
        parsedJwt.sub.toLowerCase() === address.toLowerCase()

      if (isJwtValid) {
        addAuthInterceptor(state.accessToken, () => this.signOut())
        return
      }

      this.reset()
    },

    reset() {
      state.accessToken = ''
      api.clearInterceptors()
    },
  }),
)

export { authStore, useAuthState }
