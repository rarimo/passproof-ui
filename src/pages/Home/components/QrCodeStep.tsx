import { Button, Divider, Link, Stack, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { QRCode } from 'react-qrcode-logo'

import { api } from '@/api/clients'
import { VerificationStatuses } from '@/api/verificator'
import LoadingWrapper from '@/common/LoadingWrapper'
import { sleep } from '@/helpers/promise'
import { useLoading } from '@/hooks/loading'

import StepView from './StepView'

interface Props {
  onVerify: () => void
}

export default function QrCodeStep({ onVerify }: Props) {
  const { palette } = useTheme()

  const deepLinkLoader = useLoading('', async () => {
    // TODO: Replace with actual deep link
    await sleep(2000)
    return `rarime://proof-request?proofRequestId=1`
  })

  async function checkVerificationStatus() {
    try {
      const { data } = await api.get<{
        id: string
        type: string
        status: VerificationStatuses
      }>('')

      if (data.status === VerificationStatuses.Verified) {
        onVerify()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(checkVerificationStatus, 10000)

    return () => {
      window.clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StepView title='Step 2/3' subtitle='Scan QR code with RariMe app and generate proof'>
      <LoadingWrapper loader={deepLinkLoader}>
        <Stack spacing={4} alignItems='center'>
          <QRCode size={240} value={deepLinkLoader.data} />
          <Stack direction='row' spacing={2} alignItems='center' width='100%'>
            <Divider sx={{ flex: 1 }} />
            <Typography variant='body3' color={palette.text.secondary}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>
          <Button component={Link} color='primary' href={deepLinkLoader.data} fullWidth>
            Open in RariMe app
          </Button>
          <Typography variant='body4' color={palette.text.secondary}>
            Waiting for verification...
          </Typography>
        </Stack>
      </LoadingWrapper>
    </StepView>
  )
}
