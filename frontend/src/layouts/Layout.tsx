import React, { FC, useState, useLayoutEffect } from 'react'
import Box from '@mui/material/Box'
import Navbar from 'components/Navbar/Navbar'
import Sidebar from 'components/Sidebar/Sidebar'
import { DrawerHeader } from 'components/Sidebar/Sidebar.styles'

const DRAWER_WIDTH = 240;

const Layout: FC = ({ children }) => {
  const [open, setOpen] = useState(false);

  // TODO: do this with theme breakpoints and an event listener
  useLayoutEffect(() => {
    if (window.innerWidth > 900) {
      setOpen(true)
    }
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar open={open} handleOpen={() => setOpen(true)} drawerWidth={DRAWER_WIDTH} />
      <Sidebar open={open} handleClose={() => setOpen(false)} drawerWidth={DRAWER_WIDTH} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  )
}

export default Layout
