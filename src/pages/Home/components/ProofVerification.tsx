import { JsonApiClient } from '@distributedlab/jac'
import { PROVIDERS } from '@distributedlab/w3p'
import { useEffect, useState } from 'react'

import { config } from '@/config'
import { useWeb3State, web3Store } from '@/store/web3'

import { VerificationStatuses } from '../enums/verification-statuses'
import IntroStep from './IntroStep'
import QrCodeStep from './QrCodeStep'
import VerificationStatusStep from './VerificationStatusStep'

const apiClient = new JsonApiClient({
  baseUrl: config.API_URL,
})

enum ProofSteps {
  Intro,
  QrCode,
  VerificationStatus,
}

export default function ProofVerification() {
  const { isConnected } = useWeb3State()

  const [verificationCheckEndpoint, setVerificationCheckEndpoint] = useState('')
  const [deepLink, setDeepLink] = useState('')
  const [step, setStep] = useState<ProofSteps>(isConnected ? ProofSteps.QrCode : ProofSteps.Intro)
  const [intervalId, setIntervalId] = useState<number>(-1)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatuses>(
    VerificationStatuses.NotVerified,
  )

  async function checkVerificationStatus() {
    try {
      const { data } = await apiClient.get<{
        id: string
        type: string
        status: VerificationStatuses
      }>(verificationCheckEndpoint)

      if (data.status !== VerificationStatuses.NotVerified) {
        setVerificationStatus(data.status)
        setStep(ProofSteps.VerificationStatus)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    if (!isConnected) {
      await web3Store.init(PROVIDERS.Metamask)
    }
    setStep(ProofSteps.QrCode)
  }

  useEffect(() => {
    if (step === ProofSteps.QrCode) {
      const intervalId = window.setInterval(checkVerificationStatus, 10000)
      setIntervalId(intervalId)
    } else {
      window.clearInterval(intervalId)
      setIntervalId(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  switch (step) {
    case ProofSteps.Intro:
      return <IntroStep onStart={connectWallet} />
    case ProofSteps.QrCode:
      return <QrCodeStep deepLink={deepLink} />
    case ProofSteps.VerificationStatus:
      return (
        <VerificationStatusStep
          status={verificationStatus}
          onRetry={() => {
            setVerificationStatus(VerificationStatuses.NotVerified)
            setVerificationCheckEndpoint('')
            setDeepLink('')
            setStep(ProofSteps.Intro)
          }}
        />
      )
  }
}
