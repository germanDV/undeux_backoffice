import React, { FC, createContext, useState, useMemo, useContext } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import getTheme from 'ui/theme'
import { LS_MODE_KEY } from 'lib/config'

// Load Roboto font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

type ColorMode = 'light' | 'dark'

const ColorModeContext = createContext({ toggle: () => {} })
ColorModeContext.displayName = 'ColorModeContext'

const MuiThemeProvider: FC = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>((): ColorMode => {
    const lsMode = localStorage.getItem(LS_MODE_KEY)
    if (!lsMode || !['light', 'dark'].includes(lsMode)) {
      return 'dark'
    }
    return lsMode as ColorMode
  })

  const modeToggler = useMemo(() => ({
    toggle: () => setMode((prev) => {
      const newMode = prev === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem(LS_MODE_KEY, newMode)
      return newMode
    })
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
