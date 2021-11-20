import React, { ReactElement } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useAuth } from 'lib/hooks/use-auth';
import { Roles } from 'lib/schemas'
import { ListItem } from './SidebarItem.styles'

interface Props {
  icon: ReactElement
  text: string
  to: string
  adminOnly?: boolean
}

const SidebarItem = ({ icon, text, to, adminOnly }: Props): JSX.Element | null => {
  const history = useHistory()
  const { pathname } = useLocation()
  const { user } = useAuth()

  if (adminOnly && user.role !== Roles.admin) {
    return null
  }

  return (
    <ListItem onClick={() => history.push(to)} selected={pathname === to}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  )
}

export default SidebarItem
