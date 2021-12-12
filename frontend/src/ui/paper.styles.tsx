import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

export const PaperContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}))

