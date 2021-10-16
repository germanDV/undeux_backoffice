import { styled } from '@mui/material/styles'
import MuiListItemButton from '@mui/material/ListItemButton'

export const ListItem = styled(MuiListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
  },
}))
