import { createTheme, Theme } from '@mui/material/styles'

function getTheme(mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#26a69a',
      },
      secondary: {
        main: '#f06292',
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          enableColorOnDark: false,
        },
      },
    },
  })
}

export default getTheme
