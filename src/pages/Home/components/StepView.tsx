import { Paper, Stack, StackProps, Typography, useTheme } from '@mui/material'
import { ReactNode } from 'react'

export default function StepView({
  title,
  subtitle,
  children,
  ...rest
}: {
  title: string
  subtitle: string
  children: ReactNode
} & StackProps) {
  const { palette } = useTheme()

  return (
    <Paper component={Stack} spacing={8} maxWidth={640} width='100%' {...rest}>
      <Stack spacing={1}>
        <Typography variant='h6' color={palette.text.primary}>
          {title}
        </Typography>
        <Typography variant='body3' color={palette.text.secondary}>
          {subtitle}
        </Typography>
      </Stack>
      {children}
    </Paper>
  )
}
