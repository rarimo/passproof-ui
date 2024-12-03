import { PROVIDERS } from '@distributedlab/w3p'

import { web3Store } from '@/store/web3'

export function isMetamaskInstalled() {
  return Boolean(window.ethereum) && web3Store.providerDetector?.getProvider(PROVIDERS.Metamask)
}
