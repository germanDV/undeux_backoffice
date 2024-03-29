import { useMemo, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { usePayments } from 'lib/hooks/payment'
import { useGetVendorName } from 'lib/hooks/vendor'
import { useGetProjectName } from 'lib/hooks/project'
import { Payment } from 'lib/schemas'
import { formatDate, sortByDateAsc } from 'lib/helpers'
import LineChart from 'components/LineChart/LineChart'

type ChartEntry = {
  id: number
  date: string
  amount: number
  project: number | string
  vendor: number | string
}

const PaymentCharts = () => {
  const theme = useTheme()
  const { data } = usePayments()
  const getProjectName = useGetProjectName()
  const getVendorName = useGetVendorName()

  const splitByCurrency = useCallback((data: Payment[], currency: 'ARS' | 'USD'): ChartEntry[] => {
    const entries: ChartEntry[] = []

    sortByDateAsc(data).forEach(i => {
      const entry = {
        id: i.id,
        date: formatDate(i.date),
        project: getProjectName(i.projectId),
        vendor: getVendorName(i.vendorId),
        amount: i.amount,
      }

      if (
        (i.accountId === 1 && currency === 'ARS')
        || (i.accountId === 2 && currency === 'USD')
      ) {
        entries.push(entry)
      }
    })

    return entries
  }, [getVendorName, getProjectName])

  const usdData = useMemo(() => {
    return splitByCurrency(data?.payments || [], 'USD')
  }, [data?.payments, splitByCurrency])

  const arsData = useMemo(() => {
    return splitByCurrency(data?.payments || [], 'ARS')
  }, [data?.payments, splitByCurrency])

  if (!data?.payments) return null

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <LineChart
          data={arsData}
          x="date"
          y="amount"
          color={theme.palette.secondary.main}
          legend="ARS"
          category="payment"
        />
      </Grid>
      <Grid item xs={12}>
        <LineChart
          data={usdData}
          x="date"
          y="amount"
          color={theme.palette.primary.main}
          legend="USD"
          category="payment"
        />
      </Grid>
    </Grid>
  )
}

export default PaymentCharts
