import { Stack, Typography, useTheme } from '@mui/material'
import { useMemo } from 'react'

import { VerificationStatuses } from '@/api/verificator'

export default function VerificationStatusView({ status }: { status: VerificationStatuses }) {
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
    <Stack spacing={1} alignItems='center' textAlign='center'>
      <Typography variant='h2'>{icon}</Typography>
      <Typography variant='h6' color={palette.text.primary} mt={3}>
        {title}
      </Typography>
      <Typography variant='body3' color={palette.text.secondary}>
        {description}
      </Typography>
    </Stack>
  )
}
