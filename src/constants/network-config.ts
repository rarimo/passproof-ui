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
  magicTokenId: string
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
    magicTokenId: '0',
  },
  testnet: {
    chainId: 11155111,
    name: 'Sepolia',
    networkName: 'testnet',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    erc1155EthAddress: '0x753Aa5820692A10f092D53C9D4f5B5c68B923175',
    magicTokenId: '272217765450477592751209076624575168512',
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
