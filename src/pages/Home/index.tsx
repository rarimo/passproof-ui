import { Box, Stack } from '@mui/material'
import { useState } from 'react'

import { useWeb3State } from '@/store/web3'

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
  const { isConnected } = useWeb3State()
  const [step, setStep] = useState<Steps>(isConnected ? Steps.VerifyProof : Steps.ConnectWallet)

  const renderStep = () => {
    switch (step) {
      case Steps.ConnectWallet:
        return <ConnectWalletStep onConnect={() => setStep(Steps.VerifyProof)} />
      case Steps.VerifyProof:
        return <QrCodeStep onVerify={() => setStep(Steps.MakeTransaction)} />
      case Steps.MakeTransaction:
        return <MakeTransactionStep onSuccess={() => setStep(Steps.Result)} />
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
