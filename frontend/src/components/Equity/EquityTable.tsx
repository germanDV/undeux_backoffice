import { FC, useCallback, useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { useInvestments } from 'lib/hooks/investment'
import { useDividends } from 'lib/hooks/dividend'
import { useAccounts } from 'lib/hooks/account'
import { useShareholders } from 'lib/hooks/shareholder'
import { formatAmount, displayDateGridCell, sortByDateDesc } from 'lib/helpers'

type TableEntry = {
  id: string
  date: string
  amount: string
  account: string
  shareholder: string
  category: 'INVERSION' | 'DIVIDENDO'
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50, align: 'center' },
  { field: 'date', headerName: 'Fecha', width: 200, valueFormatter: displayDateGridCell },
  { field: 'amount', headerName: 'Importe', width: 150, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 80, align: 'center' },
  { field: 'category', headerName: 'Tipo', width: 200, align: 'left' },
  { field: 'shareholder', headerName: 'Socio', width: 250, align: 'left' },
]

const EquityTable: FC = () => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const investmentsData = useInvestments()
  const dividendsData = useDividends()
  const acctData = useAccounts()
  const shareholdersData = useShareholders()

  const getShareholderName = useCallback((id:number): string => {
    if (!shareholdersData.data?.shareholders) return ''
    const sh = shareholdersData.data.shareholders.find(s => s.id === id)
    return sh ? sh.name : ''
  }, [shareholdersData.data?.shareholders])

  const getAccount = useCallback((id: number): string => {
    if (!acctData.data?.accounts) return ''
    const acct = acctData.data.accounts.find(a => a.id === id)
    return acct ? acct.currency : ''
  }, [acctData.data?.accounts])

  const rows = useMemo((): TableEntry[] => {
    let invs: TableEntry[] = []
    let divs: TableEntry[] = []

    if (investmentsData.data?.investments)  {
      invs = investmentsData.data.investments.map(i => ({
        id: `I:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'INVERSION',
        shareholder: getShareholderName(i.shareholderId),
      }))
    }

    if (dividendsData.data?.dividends)  {
      divs = dividendsData.data.dividends.map(i => ({
        id: `D:${i.id}`,
        date: i.date,
        amount: formatAmount(-i.amount),
        account: getAccount(i.accountId),
        category: 'DIVIDENDO',
        shareholder: getShareholderName(i.shareholderId),
      }))
    }

    return sortByDateDesc([...invs, ...divs])
  }, [
    getShareholderName,
    getAccount,
    investmentsData.data?.investments,
    dividendsData.data?.dividends,
  ])

  const handleSelectionChange = (newSelection: GridSelectionModel): void => {
    setSelectionModel(newSelection)
  }

  if (investmentsData.isLoading || dividendsData.isLoading) {
    return <p>Cargando inversiones y dividendos...</p>
  }

  if (investmentsData.isError || dividendsData.isError) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{investmentsData.error?.message}</p>
        <p>{dividendsData.error?.message}</p>
      </div>
    )
  }

  if (!investmentsData.data?.investments && !dividendsData.data?.dividends) {
    return null
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      onSelectionModelChange={handleSelectionChange}
      selectionModel={selectionModel}
    />
  )
}

export default EquityTable
