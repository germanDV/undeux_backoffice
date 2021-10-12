import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  const handleSend = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3_000)
  }

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<SendIcon />} onClick={() => alert('Enviando...')}>
          Enviar
        </Button>
        <LoadingButton
          onClick={handleSend}
          startIcon={<SendIcon />}
          loading={loading}
          loadingPosition="start"
          variant="contained"
          color="secondary"
        >
          Enviar (con loader)
        </LoadingButton>
      </Stack>
      <Box my={theme.spacing(3)}>
        <Paper elevation={3}>
          <Box py={theme.spacing(2)} px={theme.spacing(4)}>
            <Typography paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
              eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
              neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
              tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
              sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
              tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
              et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
              eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
              posuere sollicitudin aliquam ultrices sagittis orci a.
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Box my={theme.spacing(3)}>
        <Paper elevation={3}>
          <Box py={theme.spacing(2)} px={theme.spacing(4)}>
            <Typography paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
              eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
              neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
              tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
              sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
              tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
              et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
              eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
              posuere sollicitudin aliquam ultrices sagittis orci a.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Dashboard
