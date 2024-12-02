import { Button, List, Stack, Typography, useTheme } from '@mui/material'

import StepView from './StepView'

export default function IntroStep({ onStart }: { onStart: () => void }) {
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
        <Button onClick={onStart}>Connect Wallet</Button>
      </Stack>
    </StepView>
  )
}
