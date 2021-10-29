import React, { MouseEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAuth } from 'lib/hooks/use-auth'
import { LowEmphasisText } from './MyAccountMenu.styles'
import { useMode } from 'providers/MuiThemeProvider'

const MyAccountMenu = () => {
  const history = useHistory()
  const { logout, user } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const { toggle } = useMode()

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePasswordChange = () => {
    history.push('/my-account')
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box pl={2}>
          <LowEmphasisText>ID: #{user.id}</LowEmphasisText>
        </Box>
        <MenuItem onClick={handlePasswordChange}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cuenta</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Salir</ListItemText>
        </MenuItem>
        <MenuItem onClick={toggle}>
          <ListItemIcon>
            {theme.palette.mode === 'dark'
              ? <Brightness7Icon fontSize="small" />
              : <Brightness4Icon fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>
            Modo {theme.palette.mode === 'dark' ? 'claro' : 'oscuro'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MyAccountMenu
