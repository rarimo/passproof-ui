import { Chain, CHAIN_TYPES, ChainId } from '@distributedlab/w3p'
import { utils } from 'ethers'

import { config } from '@/config'

export type NetworkName = 'mainnet' | 'testnet'

export interface NetworkConfig {
  chainId: number
  name: string
  networkName: NetworkName
  rpcUrl: string
  explorerUrl: string
}

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: 8453,
    name: 'Base Mainnet',
    networkName: 'mainnet',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
  testnet: {
    chainId: 8453,
    name: 'Base Mainnet',
    networkName: 'testnet',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
}

export const getNetworkByChainId = (chainId: ChainId): NetworkConfig | undefined => {
  return Object.values(networkConfigsMap).find(config => config.chainId === chainId)
}

export const connectorParametersMap = Object.values(networkConfigsMap).reduce(
  (acc, config) => {
    const token = {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    }

    acc[config.chainId] = {
      id: utils.hexlify(config.chainId),
      name: config.name,
      rpcUrl: config.rpcUrl,
      explorerUrl: config.explorerUrl,
      type: CHAIN_TYPES.EVM,
      token,
      icon: '',
    }
    return acc
  },
  {} as { [key: string]: Chain },
)

export const NETWORK_NAME: NetworkName = config.ENV === 'development' ? 'testnet' : 'mainnet'
