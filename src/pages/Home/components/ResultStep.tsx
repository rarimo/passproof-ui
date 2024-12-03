import { EthereumProvider } from '@distributedlab/w3p'
import { Button, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'

import { useWeb3State } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

export default function ResultStep() {
  const { palette } = useTheme()
  const { provider } = useWeb3State()

  const addTokenToMetaMask = async () => {
    const ethereum = provider.rawProvider as EthereumProvider
    if (!ethereum) return

    await ethereum.request?.({
      method: 'wallet_watchAsset',
      params: {
        // @ts-expect-error - missing types
        type: 'ERC1155',
        options: {
          // TODO: replace with real address and token id
          address: '0x',
          tokenId: '2',
        },
      },
    })
  }

  return (
    <Paper
      component={Stack}
      spacing={6}
      maxWidth={640}
      width='100%'
      alignItems='center'
      textAlign='center'
    >
      <Stack spacing={1} maxWidth={280}>
        <Typography variant='h5'>Your ERC-1155</Typography>
        <Typography variant='body3' color={palette.text.secondary}>
          Your NFT has been successfully minted and sent to your wallet
        </Typography>
      </Stack>
      <UiIcon name='metamask' size={40} />
      <Divider flexItem />
      <Button
        fullWidth
        startIcon={<UiIcon name='metamask' size={5} />}
        onClick={addTokenToMetaMask}
      >
        Add to MetaMask
      </Button>
    </Paper>
  )
}
