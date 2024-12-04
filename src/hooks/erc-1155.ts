import { BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'

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

  const mintWithRootTransition = useCallback(
    (proof: ZKProof) => {
      if (!contractInstance) throw new ReferenceError('Contract instance is not initialized')

      return provider.signAndSendTx?.({
        to: address,
        data: contractInterface.encodeFunctionData('mintWithSimpleRootTransition', [
          {
            newRoot_: 'pubSig11', // TODO
            transitionTimestamp_: '<be_timestamp>', // TODO
            proof: '<be_signature>', // TODO
          },
          connectedAccountAddress,
          'pubSig13', // TODO
          {
            nullifier: 'pubSig0', // TODO
            identityCreationTimestamp: 'BigNumber', // TODO
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
    mintWithRootTransition,
  }
}
