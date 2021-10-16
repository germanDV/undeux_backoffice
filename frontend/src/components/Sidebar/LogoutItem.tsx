import React from 'react'
import { ListItem } from './SidebarItem.styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from 'lib/hooks/use-auth'

const LogoutItem = (): JSX.Element => {
  const { logout } = useAuth()

  return (
    <ListItem onClick={() => logout()}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Salir" />
    </ListItem>
  )
}

export default LogoutItem
