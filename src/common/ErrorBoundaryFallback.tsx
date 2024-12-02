import { Button, Stack, Typography, useTheme } from '@mui/material'

export default function ErrorBoundaryFallback({ onReset }: { onReset: () => void }) {
  const { palette } = useTheme()

  return (
    <Stack
      spacing={2}
      alignItems='center'
      justifyContent='center'
      maxWidth={420}
      mx='auto'
      px={4}
      height='100%'
      flex={1}
      textAlign='center'
    >
      <Typography variant='h5' mt={4}>
        Something went wrong
      </Typography>
      <Typography variant='body3' color={palette.text.secondary}>
        Please try again
      </Typography>
      <Button size='medium' sx={{ mt: 2 }} onClick={onReset}>
        Reload
      </Button>
    </Stack>
  )
}
