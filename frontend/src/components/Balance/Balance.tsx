import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { Account } from 'lib/schemas'
import { formatAmount } from 'lib/helpers'
import { useFX } from 'lib/hooks/fx'

interface Props {
  account: Account
}

const Balance = ({ account }: Props): JSX.Element => {
  const theme = useTheme()
  const fxData = useFX()

  const toUSD = () => {
    if (fxData.isSuccess && account?.balance) {
      const { rate } = fxData.data.fx
      return formatAmount(Math.round(account?.balance / rate))
    }
  }

  return (
    <Grid item xs={12} md={6}>
      <Paper elevation={3}>
        <Box py={theme.spacing(2)} px={theme.spacing(4)}>
          <Typography variant="h4" sx={{ color: theme.palette.secondary.main }}>
            {account.currency.toUpperCase()}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {account.description}
          </Typography>
          <Typography variant="h3" align="right">
            {formatAmount(account.balance || 0)}
            {account.balance && account.currency.toUpperCase() === 'ARS' ? (
              <Typography
                component="span"
                variant="h4"
                sx={{ color: theme.palette.text.disabled, ml: 2 }}
              >
                (USD {toUSD()})
              </Typography>
            ) : null}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Balance
