import { JsonApiClient } from '@distributedlab/jac'
import { Box, Button, Divider, Link, List, Paper, Stack, Typography, useTheme } from '@mui/material'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { QRCode } from 'react-qrcode-logo'

import { config } from '@/config'

const apiClient = new JsonApiClient({
  baseUrl: config.API_URL,
})

enum DemoSteps {
  Intro,
  QrCode,
  VerificationStatus,
}

enum VerificationStatuses {
  NotVerified = 'not_verified',
  Verified = 'verified',
  FailedVerification = 'failed_verification',
  UniquenessCheckFailed = 'uniqueness_check_failed',
}

export default function Home() {
  return (
    <Stack justifyContent='center' alignItems='center' width='100wv' height='100vh'>
      <Box maxWidth={440} width='100%'>
        <ProofVerification />
      </Box>
    </Stack>
  )
}

function ProofVerification() {
  const [verificationCheckEndpoint, setVerificationCheckEndpoint] = useState('')
  const [deepLink, setDeepLink] = useState('')
  const [step, setStep] = useState<DemoSteps>(DemoSteps.Intro)
  const [intervalId, setIntervalId] = useState<number>(-1)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatuses>(
    VerificationStatuses.NotVerified,
  )

  useEffect(() => {
    if (step === DemoSteps.QrCode) {
      const intervalId = window.setInterval(checkVerificationStatus, 10000)
      setIntervalId(intervalId)
    } else {
      window.clearInterval(intervalId)
      setIntervalId(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  async function checkVerificationStatus() {
    try {
      const { data } = await apiClient.get<{
        id: string
        type: string
        status: VerificationStatuses
      }>(verificationCheckEndpoint)

      if (data.status !== VerificationStatuses.NotVerified) {
        setVerificationStatus(data.status)
        setStep(DemoSteps.VerificationStatus)
      }
    } catch (error) {
      console.error(error)
    }
  }

  switch (step) {
    case DemoSteps.Intro:
      return <IntroStep onStart={() => setStep(DemoSteps.QrCode)} />
    case DemoSteps.QrCode:
      return <QrCodeStep deepLink={deepLink} />
    case DemoSteps.VerificationStatus:
      return (
        <VerificationStatusStep
          status={verificationStatus}
          onRetry={() => {
            setVerificationStatus(VerificationStatuses.NotVerified)
            setVerificationCheckEndpoint('')
            setDeepLink('')
            setStep(DemoSteps.Intro)
          }}
        />
      )
  }
}

function StepView({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  const { palette } = useTheme()

  return (
    <Paper component={Stack} spacing={8} maxWidth={640} width='100%'>
      <Stack spacing={1}>
        <Typography variant='h6' color={palette.text.primary}>
          {title}
        </Typography>
        <Typography variant='body3' color={palette.text.secondary}>
          {subtitle}
        </Typography>
      </Stack>
      {children}
    </Paper>
  )
}

function IntroStep({ onStart }: { onStart: () => void }) {
  const { palette } = useTheme()

  return (
    <StepView title='RariMe Proof Requests' subtitle='Request Proof of Passport'>
      <Stack spacing={8}>
        <Stack spacing={1}>
          <Typography variant='body3' color={palette.text.primary}>
            The system contains the following components:
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            <Typography variant='body3' color={palette.text.primary} component='li'>
              <strong>3rd Party Mobile Apps and Backend:</strong> external system that integrates
              the Proof of Passport
            </Typography>
            <Typography variant='body3' color={palette.text.primary} component='li'>
              <strong>RariMe App:</strong> mobile app that generates the proofs
            </Typography>
            <Typography variant='body3' color={palette.text.primary} component='li'>
              <strong>Verificator-svc:</strong> a service that incapsulates ZK proof verification.
              Self-hosted by the 3rd party.
            </Typography>
          </List>
        </Stack>
        <Stack spacing={2}>
          <Button onClick={onStart}>Start Demo</Button>
          <Button
            color='secondary'
            component={Link}
            href='https://rarimo.notion.site/Requesting-ZK-Passport-proofs-dc43d1102e104d008e0d1c7db5326286?pvs=25'
            target='_blank'
          >
            Read documentation
          </Button>
        </Stack>
      </Stack>
    </StepView>
  )
}

function QrCodeStep({ deepLink }: { deepLink: string }) {
  const { palette } = useTheme()

  return (
    <StepView title='Step 2/3' subtitle='Scan QR code with RariMe app and generate proof'>
      <Stack spacing={4} alignItems='center'>
        <QRCode size={240} value={deepLink} />
        <Stack direction='row' spacing={2} alignItems='center' width='100%'>
          <Divider sx={{ flex: 1 }} />
          <Typography variant='body3' color={palette.text.secondary}>
            OR
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
        <Button component={Link} color='primary' href={deepLink} fullWidth>
          Open in RariMe app
        </Button>
        <Typography variant='body4' color={palette.text.secondary}>
          Waiting for verification...
        </Typography>
      </Stack>
    </StepView>
  )
}

function VerificationStatusStep({
  status,
  onRetry,
}: {
  status: VerificationStatuses
  onRetry: () => void
}) {
  const { palette } = useTheme()

  const icon = useMemo(() => {
    switch (status) {
      case VerificationStatuses.Verified:
        return '✅'
      case VerificationStatuses.UniquenessCheckFailed:
      case VerificationStatuses.FailedVerification:
        return '❌'
      default:
        return '⏳'
    }
  }, [status])

  const title = useMemo(() => {
    switch (status) {
      case VerificationStatuses.Verified:
        return 'Verified'
      case VerificationStatuses.UniquenessCheckFailed:
        return 'Uniqueness Check Failed'
      case VerificationStatuses.FailedVerification:
        return 'Failed Verification'
      default:
        return 'Waiting For Verification...'
    }
  }, [status])

  const description = useMemo(() => {
    switch (status) {
      case VerificationStatuses.Verified:
        return 'The proof is successfully verified'
      case VerificationStatuses.UniquenessCheckFailed:
        return 'The proof is valid, but the identity is not unique'
      case VerificationStatuses.FailedVerification:
        return 'The proof is invalid, verification failed'
      default:
        return 'The proof is being verified'
    }
  }, [status])

  return (
    <StepView title='Step 3/3' subtitle='Check the verification status'>
      <Stack spacing={6}>
        <Stack spacing={1} alignItems='center' textAlign='center'>
          <Typography variant='h2'>{icon}</Typography>
          <Typography variant='h6' color={palette.text.primary} mt={3}>
            {title}
          </Typography>
          <Typography variant='body3' color={palette.text.secondary}>
            {description}
          </Typography>
        </Stack>
        <Button onClick={onRetry} fullWidth sx={{ mt: 2 }}>
          Restart Demo
        </Button>
      </Stack>
    </StepView>
  )
}
