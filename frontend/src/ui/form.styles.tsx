import { styled } from '@mui/material/styles'
import MuiPaper from '@mui/material/Paper';

export const FullPageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  minWidth: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  minWidth: '100%',
  justifyContent: 'center',
}))

export const FormWrapper = styled(MuiPaper)(({ theme }) => ({
  width: '400px',
  padding: theme.spacing(6, 4),
}))

export const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}))

interface SeparatorProps {
  times?: number
}
export const Separator = styled('div')<SeparatorProps>(({ theme, times }) => ({
  height: times ? theme.spacing(2 * times) : theme.spacing(2)
}))
