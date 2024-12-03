import { Button, Stack, Typography } from '@mui/material'

import LoadingWrapper from '@/common/LoadingWrapper'
import { sleep } from '@/helpers/promise'
import { useLoading } from '@/hooks/loading'

import StepView from './StepView'

interface Props {
  onSuccess: () => void
}

export default function MakeTransactionStep({ onSuccess }: Props) {
  const txLoader = useLoading(null, submitTransaction, { loadOnMount: false })

  async function submitTransaction() {
    await sleep(5000)
    onSuccess()
  }

  return (
    <StepView title='Step 3/3' subtitle='Submit your proof to the network'>
      <LoadingWrapper loader={txLoader}>
        <Stack spacing={6}>
          <Typography variant='body3'>
            Transaction is being sent to the network and will be confirmed shortly.
          </Typography>
          <Button color='primary' fullWidth onClick={txLoader.load}>
            Send Transaction
          </Button>
        </Stack>
      </LoadingWrapper>
    </StepView>
  )
}
