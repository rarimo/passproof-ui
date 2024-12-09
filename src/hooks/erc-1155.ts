import { BigNumber, BigNumberish } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
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
            newRoot_: hexlify(BigInt(proof.pub_signals[11])),
            transitionTimestamp_: signedRootState.timestamp.toString(),
            proof: BigNumber.from(`0x${signedRootState.signature}`).add(27).toHexString(),
          },
          connectedAccountAddress,
          proof.pub_signals[13],
          {
            nullifier: proof.pub_signals[0],
            identityCreationTimestamp: proof.pub_signals[15],
            identityCounter: proof.pub_signals[18],
          },
          {
            a: [proof.proof.pi_a[0], proof.proof.pi_a[1]],
            b: [
              proof.proof.pi_b[1] as [BigNumberish, BigNumberish],
              proof.proof.pi_b[0] as [BigNumberish, BigNumberish],
            ],
            c: [proof.proof.pi_c[0], proof.proof.pi_c[1]],
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
