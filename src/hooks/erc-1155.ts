import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

import { SignedRootStateResponse } from '@/api/proof-verification-relayer'
import { ZKProof } from '@/api/verificator'
import { NETWORK_CONFIG } from '@/constants/network-config'
import { useWeb3State } from '@/store/web3'
import { ERC1155ETH__factory } from '@/types/contracts'

export function useErc1155(address = NETWORK_CONFIG.erc1155Address) {
  const { provider, contractConnector, connectedAccountAddress } = useWeb3State()
  const contractInterface = useMemo(() => ERC1155ETH__factory.createInterface(), [])

  const contractInstance = useMemo(() => {
    if (!address || !contractConnector) return null
    return ERC1155ETH__factory.connect(address, contractConnector)
  }, [contractConnector, address])

  const mintWithSimpleRootTransition = useCallback(
    (proof: ZKProof, signedRootState: SignedRootStateResponse) => {
      if (!contractInstance) throw new ReferenceError('Contract instance is not initialized')

      return provider.signAndSendTx?.({
        to: address,
        data: contractInterface.encodeFunctionData('mintWithSimpleRootTransition', [
          {
            newRoot_: proof.pub_signals[11],
            transitionTimestamp_: signedRootState.timestamp,
            proof: signedRootState.signature,
          },
          connectedAccountAddress,
          proof.pub_signals[13],
          {
            nullifier: proof.pub_signals[0],
            identityCreationTimestamp: proof.pub_signals[15],
          },
          {
            a: proof.proof.pi_a as [BigNumberish, BigNumberish],
            b: proof.proof.pi_b as [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
            c: proof.proof.pi_c as [BigNumberish, BigNumberish],
          },
        ]),
      })
    },
    [contractInstance, contractInterface, provider, address, connectedAccountAddress],
  )

  return {
    mintWithSimpleRootTransition,
  }
}
