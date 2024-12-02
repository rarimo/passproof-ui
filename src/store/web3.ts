import {
  type ChainId,
  CoinbaseProvider,
  createProvider,
  errors,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  ProviderProxyConstructor,
  PROVIDERS,
} from '@distributedlab/w3p'
import { providers } from 'ethers'
import { ref } from 'valtio'

import {
  connectorParametersMap,
  getNetworkByChainId,
  NETWORK_NAME,
  networkConfigsMap,
} from '@/constants/network-config'
import { sleep } from '@/helpers/promise'
import { createStore } from '@/helpers/store'

export type SupportedProviders = PROVIDERS

type Web3Store = {
  provider: Provider
  connectedAccountAddress: string
  providerDetector: ProviderDetector<SupportedProviders> | undefined
  providerType: SupportedProviders | undefined
  providerChainId: ChainId | undefined
  balance: string
}

const providerDetector = new ProviderDetector<SupportedProviders>()

const PROVIDERS_PROXIES: { [key in SupportedProviders]?: ProviderProxyConstructor } = {
  [PROVIDERS.Metamask]: MetamaskProvider,
  [PROVIDERS.Coinbase]: CoinbaseProvider,
}

Provider.setChainsDetails(connectorParametersMap)

export const [web3Store, useWeb3State] = createStore(
  'web3',
  {
    provider: {} as Provider,
    connectedAccountAddress: '',
    providerDetector: undefined,
    providerType: undefined,
    providerChainId: undefined,
    balance: '0',
  } as Web3Store,
  state => ({
    get isCorrectNetwork(): boolean {
      const correctNetwork = networkConfigsMap[NETWORK_NAME]

      return Boolean(String(state.provider?.chainId) === String(correctNetwork.chainId))
    },

    get isConnected(): boolean {
      return Boolean(state.provider?.isConnected)
    },

    get address(): string | undefined {
      return state.provider?.address
    },

    get contractConnector(): providers.Web3Provider | undefined {
      if (!state.provider?.rawProvider) return undefined

      return new providers.Web3Provider(
        state.provider.rawProvider as providers.ExternalProvider,
        'any',
      )
    },

    get rawProviderSigner(): providers.JsonRpcSigner | undefined {
      if (!state.provider?.rawProvider) return undefined

      return new providers.Web3Provider(
        state.provider.rawProvider as providers.ExternalProvider,
        'any',
      ).getSigner()
    },
  }),
  state => ({
    init: async (_providerType?: SupportedProviders) => {
      let providerType = _providerType

      if (!providerType) {
        providerType = state.providerType
      }

      await providerDetector.init()

      state.providerDetector = ref(providerDetector)

      if (!providerType) return

      if (!(providerType in PROVIDERS_PROXIES)) throw new TypeError('Provider not supported')

      const providerProxy = PROVIDERS_PROXIES[providerType]!

      state.provider?.clearHandlers?.()

      /**
       * because of proxy aint works with private fields in objects, we should use `valtio ref`,
       * and to keep valtio proxy "rolling" - we should update state ref property,
       * e.g. onAccountChanged or onChainChanged, ...etc
       */
      const initiatedProvider = await createProvider(providerProxy, {
        providerDetector,
        listeners: {
          onChainChanged: e => {
            state.providerChainId = e?.chainId
            web3Store.init(providerType)
          },
          onAccountChanged: () => {
            if (state.connectedAccountAddress) {
              web3Store.disconnect()
              window.location.reload()
            } else {
              state.connectedAccountAddress = state.provider?.address || ''
            }
          },
          onDisconnect: () => {
            web3Store.disconnect()
            window.location.reload()
          },
        },
      })

      // TODO: fix global rerenders

      state.provider = ref(initiatedProvider)

      state.providerType = providerType
      state.providerChainId = initiatedProvider.chainId
      state.connectedAccountAddress = initiatedProvider.address || ''

      await state.provider.connect()

      // hotfix injected provider listeners updating provider proxy object
      await sleep(300)
    },

    setBalance(balance: string) {
      state.balance = balance
    },

    safeSwitchNetwork: async (chainId: ChainId) => {
      if (!state.provider?.address) {
        return
      }

      try {
        await web3Store.provider?.switchChain(chainId)
      } catch (error) {
        if (
          error instanceof errors.ProviderInternalError ||
          error instanceof errors.ProviderChainNotFoundError
        ) {
          const chainDetails = Provider.chainsDetails?.[chainId]

          if (!chainDetails) {
            throw error
          }

          await web3Store.provider?.addChain(chainDetails)

          return
        }

        throw error
      }
    },

    disconnect: async () => {
      await state.provider?.disconnect?.()

      state.providerType = undefined
      state.provider = {} as Provider
      state.connectedAccountAddress = ''
    },

    getNetworkConfig: () => {
      if (!state.provider?.chainId) return networkConfigsMap[NETWORK_NAME]

      const networkName = getNetworkByChainId(state.provider?.chainId)

      return networkName || networkConfigsMap[NETWORK_NAME]
    },
  }),
  {
    persistProperties: ['providerType', 'providerChainId'],
  },
)
