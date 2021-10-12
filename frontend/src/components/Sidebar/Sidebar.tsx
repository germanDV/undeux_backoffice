import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import AppsIcon from '@mui/icons-material/Apps'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import TimelineIcon from '@mui/icons-material/Timeline'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LogoutIcon from '@mui/icons-material/Logout'
import { Drawer, DrawerHeader } from './Sidebar.styles'

interface Props {
  open: boolean;
  drawerWidth: number;
  handleClose: () => void;
}

const Sidebar = ({ open, handleClose, drawerWidth }: Props): JSX.Element => {
  const history = useHistory()
  const { pathname } = useLocation()

  const navigate = (path: string) => {
    history.push(path)
  }

  return (
    <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="nav">
        <ListItemButton onClick={() => navigate("/")} selected={pathname === "/"}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/other")} selected={pathname === "/other"}>
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Otros" />
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav">
        <ListItemButton onClick={() => navigate("/users")} selected={pathname === "/users"}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>
        <ListItemButton onClick={() => alert('Logging out...')}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Salir" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

export default Sidebar
