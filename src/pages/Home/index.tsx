import { Box, CircularProgress, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

import { ZKProof } from '@/api/verificator'
import { useErc1155Eth } from '@/hooks/erc-1155-eth'
import { LoadingStates, useLoading } from '@/hooks/loading'
import { useAuthState } from '@/store/auth'

import ConnectWalletStep from './components/ConnectWalletStep'
import MakeTransactionStep from './components/MakeTransactionStep'
import QrCodeStep from './components/QrCodeStep'
import ResultStep from './components/ResultStep'

enum Steps {
  ConnectWallet,
  VerifyProof,
  MakeTransaction,
  Result,
}

export default function Home() {
  const { isAuthorized } = useAuthState()
  const { getTokenBalance } = useErc1155Eth()

  const [step, setStep] = useState<Steps>(isAuthorized ? Steps.VerifyProof : Steps.ConnectWallet)
  const [proof, setProof] = useState<ZKProof | null>(null)

  const balanceLoader = useLoading(null, getTokenBalance, {
    loadOnMount: isAuthorized,
    loadArgs: [isAuthorized],
  })

  const renderStep = () => {
    switch (step) {
      case Steps.ConnectWallet:
        return <ConnectWalletStep onConnect={() => setStep(Steps.VerifyProof)} />
      case Steps.VerifyProof:
        return (
          <QrCodeStep
            onVerify={proof => {
              setProof(proof)
              setStep(Steps.MakeTransaction)
            }}
          />
        )
      case Steps.MakeTransaction:
        return <MakeTransactionStep proof={proof} onSuccess={() => setStep(Steps.Result)} />
      case Steps.Result:
        return <ResultStep />
    }
  }

  useEffect(() => {
    if (!isAuthorized) return

    if (balanceLoader.loadingState === LoadingStates.Loaded && !balanceLoader.data?.isZero()) {
      setStep(Steps.Result)
    }
  }, [balanceLoader.loadingState, balanceLoader.data, isAuthorized])

  return (
    <Stack justifyContent='center' alignItems='center' width='100wv' height='100vh'>
      {balanceLoader.loadingState === LoadingStates.Loading ? (
        <CircularProgress sx={{ mx: 'auto', my: 12 }} />
      ) : (
        <Box maxWidth={440} width='100%'>
          {renderStep()}
        </Box>
      )}
    </Stack>
  )
}
