import { Button, Divider, Link, Stack, Typography, useTheme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { QRCode } from 'react-qrcode-logo'

import {
  deleteUser,
  getUserVerificationStatus,
  getVerifiedProof,
  requestVerificationLink,
  VerificationStatuses,
  ZKProof,
} from '@/api/verificator'
import LoadingWrapper from '@/common/LoadingWrapper'
import RarimeAppBadges from '@/common/RarimeAppBadges'
import { NETWORK_CONFIG } from '@/constants/network-config'
import { isMobile } from '@/helpers/device'
import { ErrorHandler } from '@/helpers/error-handler'
import { useLoading } from '@/hooks/loading'
import { useWeb3State } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

import StepView from './StepView'

interface Props {
  onVerify: (proof: ZKProof) => void
}

export default function QrCodeStep({ onVerify }: Props) {
  const { connectedAccountAddress } = useWeb3State()
  const { palette } = useTheme()

  const [isVerificationFailed, setIsVerificationFailed] = useState(false)

  const userId = useMemo(() => connectedAccountAddress.toLowerCase(), [connectedAccountAddress])

  const proofParamsLoader = useLoading('', async () => {
    const { get_proof_params } = await requestVerificationLink({
      id: userId,
      event_id: NETWORK_CONFIG.magicTokenId,
      uniqueness: true,
      expiration_lower_bound: true,
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
    if (isVerificationFailed) return

    try {
      const status = await getUserVerificationStatus(userId)
      if (status === VerificationStatuses.NotVerified) return

      const isFailed = [
        VerificationStatuses.FailedVerification,
        VerificationStatuses.UniquenessCheckFailed,
      ].includes(status)

      if (isFailed) {
        setIsVerificationFailed(true)
        return
      }

      const { proof } = await getVerifiedProof(userId)
      if (proof.pub_signals) {
        onVerify(proof)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function retryVerification() {
    try {
      setIsVerificationFailed(false)
      await deleteUser(userId)
      await proofParamsLoader.load()
    } catch (error) {
      ErrorHandler.process(error)
      setIsVerificationFailed(true)
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(checkVerificationProof, 5000)
    return () => window.clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StepView title='Step 2/3' subtitle='Scan QR code with RariMe app and generate proof'>
      {isVerificationFailed ? (
        <Stack spacing={6} alignItems='center'>
          <Stack
            alignItems='center'
            justifyContent='center'
            bgcolor={palette.error.lighter}
            p={4}
            borderRadius='50%'
          >
            <UiIcon name='warning' size={10} color={palette.error.main} />
          </Stack>
          <Stack spacing={1} textAlign='center'>
            <Typography variant='h6' color={palette.text.primary}>
              Verification failed
            </Typography>
            <Typography variant='body3' color={palette.text.secondary}>
              Please try again
            </Typography>
          </Stack>
          <Button fullWidth onClick={retryVerification}>
            Retry
          </Button>
        </Stack>
      ) : (
        <LoadingWrapper loader={proofParamsLoader}>
          <Stack spacing={4} alignItems='center'>
            <QRCode size={240} value={rariMeDeepLink} />
            {isMobile() && (
              <>
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
              </>
            )}
            <RarimeAppBadges />
            <Typography variant='body4' color={palette.text.secondary}>
              Waiting for verification...
            </Typography>
          </Stack>
        </LoadingWrapper>
      )}
    </StepView>
  )
}
