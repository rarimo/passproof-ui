import { EthereumProvider } from '@distributedlab/w3p'
import { Box, Button, Divider, Paper, Stack, Typography, useTheme } from '@mui/material'

import LoadingWrapper from '@/common/LoadingWrapper'
import { NETWORK_CONFIG } from '@/constants/network-config'
import { MAGIC_TOKEN_ID, useErc1155Eth } from '@/hooks/erc-1155-eth'
import { LoadingStates, useLoading } from '@/hooks/loading'
import { useWeb3State } from '@/store/web3'
import UiIcon from '@/ui/UiIcon'

export default function ResultStep() {
  const { palette } = useTheme()
  const { provider } = useWeb3State()

  const { getUri } = useErc1155Eth()
  const imageLoader = useLoading(null, async () => {
    const uri = await getUri()
    if (!uri) return null

    const uriRes = await fetch(uri.replace('ipfs://', 'https://ipfs.io/'))
    const uriJson = await uriRes.json()
    return uriJson.image.replace('ipfs://', 'https://ipfs.io/')
  })

  const addTokenLoader = useLoading(
    false,
    async () => {
      await addTokenToMetaMask()
      return true
    },
    { loadOnMount: false },
  )

  const addTokenToMetaMask = async () => {
    const ethereum = provider.rawProvider as EthereumProvider
    if (!ethereum) return

    await ethereum.request?.({
      method: 'wallet_watchAsset',
      params: {
        // @ts-expect-error - missing types
        type: 'ERC1155',
        options: {
          address: NETWORK_CONFIG.erc1155EthAddress,
          tokenId: MAGIC_TOKEN_ID,
          image: imageLoader.data,
          name: 'ERC-1155 Token',
          symbol: 'ERC1155',
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
          Your Token has been successfully minted and sent to your wallet
        </Typography>
      </Stack>
      <LoadingWrapper loader={imageLoader}>
        <Box component='img' src={imageLoader.data} alt='ERC-1155 Token' width={160} height={160} />
        <Divider flexItem />
        <Button
          fullWidth
          startIcon={<UiIcon name='metamask' size={5} />}
          disabled={addTokenLoader.loadingState === LoadingStates.Loading || addTokenLoader.data}
          onClick={addTokenLoader.load}
        >
          {addTokenLoader.data
            ? 'Added to MetaMask'
            : addTokenLoader.loadingState === LoadingStates.Loading
              ? 'Adding...'
              : 'Add to MetaMask'}
        </Button>
      </LoadingWrapper>
    </Paper>
  )
}
