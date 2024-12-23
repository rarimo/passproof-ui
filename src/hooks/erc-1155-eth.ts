import { BigNumber } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
import { useCallback, useMemo } from 'react'

import { SignedRootStateResponse } from '@/api/proof-verification-relayer'
import { ZKProof } from '@/api/verificator'
import { NETWORK_CONFIG } from '@/constants/network-config'
import { useWeb3State } from '@/store/web3'
import { ERC1155ETH__factory } from '@/types/contracts'

export function useErc1155Eth(address = NETWORK_CONFIG.erc1155EthAddress) {
  const { provider, contractConnector, connectedAccountAddress } = useWeb3State()
  const contractInterface = useMemo(() => ERC1155ETH__factory.createInterface(), [])

  const contractInstance = useMemo(() => {
    if (!address || !contractConnector) return null
    return ERC1155ETH__factory.connect(address, contractConnector)
  }, [contractConnector, address])

  const getTokenBalance = useCallback(async () => {
    if (!contractInstance) return null

    return contractInstance.balanceOf(connectedAccountAddress, NETWORK_CONFIG.magicTokenId)
  }, [contractInstance, connectedAccountAddress])

  const getUri = useCallback(async () => {
    if (!contractInstance) return null

    return contractInstance.uri(NETWORK_CONFIG.magicTokenId)
  }, [contractInstance])

  const mintWithSimpleRootTransition = useCallback(
    async (proof: ZKProof, signedRootState: SignedRootStateResponse) => {
      if (!contractInstance) throw new ReferenceError('Contract instance is not initialized')

      return provider.signAndSendTx?.({
        to: address,
        data: contractInterface.encodeFunctionData('mintWithSimpleRootTransition', [
          {
            newRoot: hexlify(BigInt(proof.pub_signals[11])),
            transitionTimestamp: signedRootState.timestamp.toString(),
            proof: BigNumber.from(`0x${signedRootState.signature}`).add(27).toHexString(),
          },
          NETWORK_CONFIG.magicTokenId,
          connectedAccountAddress,
          proof.pub_signals[13],
          {
            nullifier: proof.pub_signals[0],
            identityCreationTimestamp: proof.pub_signals[15],
            identityCounter: BigInt(proof.pub_signals[17]) - 1n,
          },
          {
            a: [proof.proof.pi_a[0], proof.proof.pi_a[1]],
            b: [
              [proof.proof.pi_b[0][1], proof.proof.pi_b[0][0]],
              [proof.proof.pi_b[1][1], proof.proof.pi_b[1][0]],
            ],
            c: [proof.proof.pi_c[0], proof.proof.pi_c[1]],
          },
        ]),
      })
    },
    [contractInstance, contractInterface, provider, address, connectedAccountAddress],
  )

  return {
    getTokenBalance,
    getUri,
    mintWithSimpleRootTransition,
  }
}
