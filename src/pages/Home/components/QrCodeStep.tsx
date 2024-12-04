import { Button, Divider, Link, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { QRCode } from 'react-qrcode-logo'

import { getVerifiedProof, requestVerificationLink, ZKProof } from '@/api/verificator'
import LoadingWrapper from '@/common/LoadingWrapper'
import { useLoading } from '@/hooks/loading'
import { useWeb3State } from '@/store/web3'

import StepView from './StepView'

interface Props {
  onVerify: (proof: ZKProof) => void
}

export default function QrCodeStep({ onVerify }: Props) {
  const { connectedAccountAddress } = useWeb3State()
  const { palette } = useTheme()

  const proofParamsLoader = useLoading('', async () => {
    const { get_proof_params } = await requestVerificationLink({
      id: connectedAccountAddress,
      event_id: '0x0',
      uniqueness: true,
    })

    return get_proof_params
  })

  const rariMeDeepLink = useMemo(() => {
    const deepLinkUrl = new URL('rarime://external')
    deepLinkUrl.searchParams.append('type', 'proof-request')
    deepLinkUrl.searchParams.append('proof_params_url', proofParamsLoader.data)

    return deepLinkUrl.toString()
  }, [proofParamsLoader.data])

  async function checkVerificationProof() {
    try {
      const { proof } = await getVerifiedProof(connectedAccountAddress)
      onVerify(proof)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(checkVerificationProof, 10000)
    return () => window.clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StepView title='Step 2/3' subtitle='Scan QR code with RariMe app and generate proof'>
      <LoadingWrapper loader={proofParamsLoader}>
        <Stack spacing={4} alignItems='center'>
          <QRCode size={240} value={rariMeDeepLink} />
          <Stack direction='row' spacing={2} alignItems='center' width='100%'>
            <Divider sx={{ flex: 1 }} />
            <Typography variant='body3' color={palette.text.secondary}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>
          <Button component={Link} color='primary' href={rariMeDeepLink} fullWidth>
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
