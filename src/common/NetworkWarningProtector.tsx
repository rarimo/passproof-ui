import { Button, Dialog, Stack, Typography, useTheme } from '@mui/material'
import { PropsWithChildren, useCallback } from 'react'

import { NETWORK_CONFIG } from '@/constants/network-config'
import { ErrorHandler } from '@/helpers/error-handler'
import { useWeb3State, web3Store } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

type Props = {
  title?: string
  desc?: string
} & PropsWithChildren

export default function NetworkWarningProtector({ title, desc, children }: Props) {
  const { palette } = useTheme()
  const { isCorrectNetwork, isConnected } = useWeb3State()

  const switchNetwork = useCallback(async () => {
    try {
      await web3Store.safeSwitchNetwork(NETWORK_CONFIG.chainId)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [])

  if (!isConnected || isCorrectNetwork) {
    return children
  }

  return (
    <Dialog
      open={isConnected && !isCorrectNetwork}
      PaperProps={{
        noValidate: true,
        position: 'relative',
        sx: { width: 440 },
      }}
    >
      <Stack alignItems='center' spacing={6} p={8} textAlign='center'>
        <Stack
          alignItems='center'
          justifyContent='center'
          bgcolor={palette.error.lighter}
          p={4}
          borderRadius='50%'
        >
          <UiIcon name='warning' size={10} color={palette.error.main} />
        </Stack>

        <Stack spacing={2} alignItems='center'>
          <Typography variant='subtitle2'>{title || 'Invalid network'}</Typography>
          <Typography variant='body3' color={palette.text.secondary} maxWidth={360}>
            {desc || `Please switch to the ${NETWORK_CONFIG.name} network to continue.`}
          </Typography>
        </Stack>

        <Button type='submit' fullWidth onClick={switchNetwork}>
          {`Switch to ${NETWORK_CONFIG.name}`}
        </Button>
      </Stack>
    </Dialog>
  )
}
