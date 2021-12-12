import Grid from '@mui/material/Grid'
import PageTitle from 'components/PageTitle/PageTitle'
import LineChart from 'components/LineChart/LineChart'
import TxTable from 'components/TxTable/TxTable'
import PaymentForm from 'components/Payment/PaymentForm'

const Payments = (): JSX.Element => {
  return (
    <div>
      <PageTitle>pagos</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LineChart />
        </Grid>
        <Grid item sm={12} md={6}>
          <TxTable />
        </Grid>
        <Grid item sm={12} md={6}>
          <PaymentForm />
        </Grid>
      </Grid>
    </div>
  )
}

export default Payments

