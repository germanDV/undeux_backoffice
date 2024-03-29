import Grid from '@mui/material/Grid'
import PageTitle from 'components/PageTitle/PageTitle'
import PaymentCharts from 'components/Payment/PaymentCharts'
import PaymentsTable from 'components/Payment/PaymentsTable'
import PaymentForm from 'components/Payment/PaymentForm'

const Payments = (): JSX.Element => {
  return (
    <div>
      <PageTitle>pagos</PageTitle>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PaymentCharts />
        </Grid>
        <Grid item sm={12} md={8}>
          <PaymentsTable />
        </Grid>
        <Grid item sm={12} md={4}>
          <PaymentForm />
        </Grid>
      </Grid>
    </div>
  )
}

export default Payments

