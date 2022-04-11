import { useMemo, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { useCollections } from 'lib/hooks/collection'
import { useGetCustomerName } from 'lib/hooks/customer'
import { useGetProjectName } from 'lib/hooks/project'
import { Collection } from 'lib/schemas'
import { formatDate, sortByDateAsc } from 'lib/helpers'
import LineChart from 'components/LineChart/LineChart'


type ChartEntry = {
  id: number
  date: string
  amount: number
  project: number | string
  customer: number | string
}

const CollectionCharts = () => {
  const theme = useTheme()
  const { data } = useCollections()
  const getProjectName = useGetProjectName()
  const getCustomerName = useGetCustomerName()

  const splitByCurrency = useCallback((data: Collection[], currency: 'ARS' | 'USD'): ChartEntry[] => {
    const entries: ChartEntry[] = []

    sortByDateAsc(data).forEach(i => {
      const entry = {
        id: i.id,
        date: formatDate(i.date),
        project: getProjectName(i.projectId),
        customer: getCustomerName(i.customerId),
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
  }, [getCustomerName, getProjectName])

  const usdData = useMemo(() => {
    return splitByCurrency(data?.collections || [], 'USD')
  }, [data?.collections, splitByCurrency])

  const arsData = useMemo(() => {
    return splitByCurrency(data?.collections || [], 'ARS')
  }, [data?.collections, splitByCurrency])

  if (!data?.collections) return null

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <LineChart
          data={arsData}
          x="date"
          y="amount"
          color={theme.palette.secondary.main}
          legend="ARS"
          category="collection"
        />
      </Grid>
      <Grid item xs={12}>
        <LineChart
          data={usdData}
          x="date"
          y="amount"
          color={theme.palette.primary.main}
          legend="USD"
          category="collection"
        />
      </Grid>
    </Grid>
  )
}

export default CollectionCharts

