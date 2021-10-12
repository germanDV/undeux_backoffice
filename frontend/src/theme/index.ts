import { createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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

export default darkTheme
