import { PROVIDERS } from '@distributedlab/w3p'
import { Button, Link, List, Stack, Typography, useTheme } from '@mui/material'

import { isMetamaskInstalled } from '@/helpers/metamask'
import { useWeb3State, web3Store } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

import StepView from './StepView'

export default function ConnectWalletStep({ onConnect }: { onConnect: () => void }) {
  const { isConnected } = useWeb3State()
  const { palette } = useTheme()

  const connectWallet = async () => {
    if (!isConnected) {
      await web3Store.init(PROVIDERS.Metamask)
    }
    onConnect()
  }

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
        {isMetamaskInstalled() ? (
          <Button fullWidth startIcon={<UiIcon name='metamask' size={5} />} onClick={connectWallet}>
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
      </Stack>
    </StepView>
  )
}
