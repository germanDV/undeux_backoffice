import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const LowEmphasisText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary
}))
