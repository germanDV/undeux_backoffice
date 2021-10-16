import React from 'react'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import AppsIcon from '@mui/icons-material/Apps'
import TimelineIcon from '@mui/icons-material/Timeline'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { Drawer, DrawerHeader } from './Sidebar.styles'
import SidebarItem from './SidebarItem'
import LogoutItem from './LogoutItem'

interface Props {
  open: boolean
  drawerWidth: number
  handleClose: () => void
}

const Sidebar = ({ open, handleClose, drawerWidth }: Props): JSX.Element => {
  return (
    <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="nav">
        <SidebarItem icon={<AppsIcon />} text="Inicio" to="/" />
        <SidebarItem icon={<TimelineIcon />} text="Otros" to="/other" />
        <SidebarItem icon={<PeopleAltIcon />} text="Usuarios" to="/users" adminOnly />
        <LogoutItem />
      </List>
    </Drawer>
  )
}

export default Sidebar
