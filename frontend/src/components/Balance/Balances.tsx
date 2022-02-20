import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { useAccounts } from 'lib/hooks/account'
import Balance from 'components/Balance/Balance'

const Balances = (): JSX.Element => {
  const theme = useTheme()
  const { data, isLoading, isError, error } = useAccounts()

  if (isError) {
    return <p>{error?.message}</p>
  }

  if (isLoading) {
    return <p>Cargando saldos...</p>
  }

  if (!data || data.accounts.length === 0) {
    return <p>No hay cuentas registradas.</p>
  }

  return (
    <Grid container spacing={theme.spacing(4)}>
      {data.accounts.map(a => <Balance key={a.id} account={a} />)}
    </Grid>
  )
}

export default Balances

