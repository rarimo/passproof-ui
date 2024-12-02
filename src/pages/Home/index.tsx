import { Box, Stack } from '@mui/material'

import ProofVerification from './components/ProofVerification'

export default function Home() {
  return (
    <Stack justifyContent='center' alignItems='center' width='100wv' height='100vh'>
      <Box maxWidth={440} width='100%'>
        <ProofVerification />
      </Box>
    </Stack>
  )
}
