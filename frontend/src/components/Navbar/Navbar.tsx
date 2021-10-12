import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import { AppBar, LogoWrapper } from './Navbar.styes'

interface Props {
  open: boolean;
  handleOpen: () => void;
  drawerWidth: number;
}

const Navbar = ({ open, handleOpen, drawerWidth }: Props): JSX.Element => {
  return (
    <AppBar position="fixed" open={open} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleOpen}
          edge="start"
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <LogoWrapper>
          <img src="/logo.png" alt="Undeux Logo" width="25" />
        </LogoWrapper>
        <Typography variant="h6" noWrap component="div">
          UNDEUX BACKOFFICE
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
