import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { useAccounts } from 'lib/hooks/account'

const Dashboard = () => {
  const theme = useTheme()
  const acctData = useAccounts()

  return (
    <>
      <Box my={theme.spacing(3)}>
        <Paper elevation={3}>
          <Box py={theme.spacing(2)} px={theme.spacing(4)}>
            {acctData.isLoading
              ? 'Loading'
              : acctData.isError
                ? acctData.error.message
                : acctData.data?.accounts.map(a => <p key={a.id}>{a.balance} ({a.currency})</p>)
            }
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default Dashboard
