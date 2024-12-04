import { Box, Stack } from '@mui/material'
import { useState } from 'react'

import { ZKProof } from '@/api/verificator'
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
  const [step, setStep] = useState<Steps>(isAuthorized ? Steps.Result : Steps.ConnectWallet)
  const [proof, setProof] = useState<ZKProof | null>(null)

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

  return (
    <Stack justifyContent='center' alignItems='center' width='100wv' height='100vh'>
      <Box maxWidth={440} width='100%'>
        {renderStep()}
      </Box>
    </Stack>
  )
}
