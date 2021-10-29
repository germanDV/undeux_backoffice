import React, { FC, createContext, useState, useMemo, useContext } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import getTheme from 'ui/theme'

// Load Roboto font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const ColorModeContext = createContext({ toggle: () => {} })
ColorModeContext.displayName = 'ColorModeContext'

const MuiThemeProvider: FC = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')

  const modeToggler = useMemo(() => ({
    toggle: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }), [])

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={modeToggler}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default MuiThemeProvider

export function useMode() {
  const ctx = useContext(ColorModeContext)
  if (ctx === undefined) {
    throw new Error('useMode must be used within a ColorModeContext provider.')
  }
  return ctx
}
