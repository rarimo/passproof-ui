import { Button, Stack, Typography, useTheme } from '@mui/material'

import { ZKProof } from '@/api/verificator'
import DotsLoader from '@/common/DotsLoader'
import LoadingWrapper from '@/common/LoadingWrapper'
import { sleep } from '@/helpers/promise'
import { useLoading } from '@/hooks/loading'
import UiIcon from '@/ui/UiIcon'

import StepView from './StepView'

interface Props {
  proof: ZKProof | null
  onSuccess: (tokenId: string) => void
}

export default function MakeTransactionStep({ proof, onSuccess }: Props) {
  const { palette } = useTheme()
  const txLoader = useLoading(null, submitTransaction, { loadOnMount: false })

  async function submitTransaction() {
    if (!proof) throw new Error('Proof is not provided')

    // Simulate transaction sending
    await sleep(5000)
    onSuccess(proof.pub_signals[0].toString())
  }

  return (
    <StepView title='Step 3/3' subtitle='Submit your proof to the network'>
      <LoadingWrapper
        loader={txLoader}
        slots={{
          loading: (
            <Stack spacing={6} alignItems='center'>
              <Stack
                alignItems='center'
                justifyContent='center'
                bgcolor={palette.warning.lighter}
                width={72}
                height={72}
                borderRadius='50%'
              >
                <DotsLoader size={2.5} color={palette.warning.main} />
              </Stack>
              <Stack spacing={1} textAlign='center'>
                <Typography variant='h6' color={palette.text.primary}>
                  Sending transaction
                </Typography>
                <Typography variant='body3' color={palette.text.secondary}>
                  Transaction is being processed
                </Typography>
              </Stack>
            </Stack>
          ),
          error: (
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
                  Transaction failed
                </Typography>
                <Typography variant='body3' color={palette.text.secondary}>
                  Please try again
                </Typography>
              </Stack>
              <Button fullWidth onClick={txLoader.load}>
                Retry
              </Button>
            </Stack>
          ),
        }}
      >
        <Stack spacing={6}>
          <Typography variant='body3'>
            Send your verification proof to the network to get ERC-1155 token
          </Typography>
          <Button color='primary' fullWidth onClick={txLoader.load}>
            Send Transaction
          </Button>
        </Stack>
      </LoadingWrapper>
    </StepView>
  )
}
