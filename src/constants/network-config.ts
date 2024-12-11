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
  erc1155EthAddress: string
}

export const networkConfigsMap: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    networkName: 'mainnet',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    explorerUrl: 'https://etherscan.io',
    // TODO: replace with the actual address
    erc1155EthAddress: '0x',
  },
  testnet: {
    chainId: 35443,
    name: 'Q Testnet',
    networkName: 'testnet',
    rpcUrl: 'https://rpc.qtestnet.org',
    explorerUrl: 'https://explorer.qtestnet.org',
    erc1155EthAddress: '0xb950ab58437ADc8b916fCFa570c42dA99D2fe0D5',
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
export const NETWORK_CONFIG: NetworkConfig = networkConfigsMap[NETWORK_NAME]
