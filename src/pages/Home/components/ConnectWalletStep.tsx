import { PROVIDERS } from '@distributedlab/w3p'
import { Button, Link, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

import { getAuthChallenge } from '@/api/auth'
import { ErrorHandler } from '@/helpers/error-handler'
import { isMetamaskInstalled } from '@/helpers/metamask'
import { authStore } from '@/store/auth'
import { web3Store } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

import StepView from './StepView'

export default function ConnectWalletStep({ onConnect }: { onConnect: () => void }) {
  const { palette } = useTheme()
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      await web3Store.init(PROVIDERS.Metamask)

      const challenge = await getAuthChallenge(web3Store.connectedAccountAddress)
      const signature = await web3Store.provider.signMessage(challenge)

      await authStore.signIn(web3Store.connectedAccountAddress, signature)
      onConnect()
    } catch (error) {
      ErrorHandler.process(error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <StepView title='Prove your uniqueness' subtitle='' spacing={6}>
      <Stack spacing={2}>
        <Typography variant='body3' color={palette.text.primary}>
          To repel bots, we need to make sure that you are a <strong>real and unique human</strong>!
        </Typography>
        <Typography variant='body3' color={palette.text.primary}>
          To do this, we&apos;ll request a <strong>zero-knowledge proof</strong> of passport powered
          by <strong>Rarimo</strong>&apos;s.{' '}
        </Typography>
        <Typography variant='body3' color={palette.text.primary}>
          <strong>No personal info</strong> will leave your mobile device in the process.
        </Typography>
        <Typography variant='body3' color={palette.text.primary}>
          To get started, share your wallet address:
        </Typography>
      </Stack>
      {isMetamaskInstalled() ? (
        <Button
          fullWidth
          startIcon={<UiIcon name='metamask' size={5} />}
          disabled={isConnecting}
          onClick={connectWallet}
        >
          Connect MetaMask
        </Button>
      ) : (
        <Button
          component={Link}
          href='https://metamask.io'
          target='_blank'
          rel='noreferrer'
          fullWidth
          startIcon={<UiIcon name='metamask' size={5} />}
        >
          Install MetaMask
        </Button>
      )}
    </StepView>
  )
}
