import { FC, useCallback, useMemo, useState } from 'react'
import {DataGrid, GridColDef, GridSelectionModel} from '@mui/x-data-grid'
import { PaperContainer } from 'ui/paper.styles'
import { useInvestments } from 'lib/hooks/investment'
import { useAccounts } from 'lib/hooks/account'
import { useShareholders } from 'lib/hooks/shareholder'
import { formatDate, formatAmount } from 'lib/helpers'

type TableEntry = {
  id: number
  date: string
  amount: string
  account: string
  shareholder: string
  category: 'INVERSION' | 'DIVIDENDO'
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50, align: 'center' },
  { field: 'date', headerName: 'Fecha', width: 80, align: 'center' },
  { field: 'amount', headerName: 'Importe', width: 150, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 80, align: 'center' },
  { field: 'category', headerName: 'Tipo', width: 200, align: 'left' },
  { field: 'shareholder', headerName: 'Socio', width: 250, align: 'left' },
]

const EquityTable: FC = () => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const investmentsData = useInvestments()
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
   if (investmentsData.data?.investments)  {
     return investmentsData.data.investments.map(i => ({
       id: i.id,
       date: formatDate(i.date),
       amount: formatAmount(i.amount),
       account: getAccount(i.accountId),
       category: 'INVERSION',
       shareholder: getShareholderName(i.shareholderId),
     }))
   }
   return []
  }, [getShareholderName, getAccount, investmentsData.data?.investments])

  const handleSelectionChange = (newSelection: GridSelectionModel): void => {
    setSelectionModel(newSelection)
  }

  if (investmentsData.isLoading) {
    return <p>Cargando projectos...</p>
  }

  if (investmentsData.isError && investmentsData.error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{investmentsData.error.message}</p>
      </div>
    )
  }

  if (!investmentsData.data?.investments) {
    return null
  }

  return (
    <PaperContainer>
      <div style={{ width: '100%', height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onSelectionModelChange={handleSelectionChange}
          selectionModel={selectionModel}
        />
      </div>
    </PaperContainer>
  )
}

export default EquityTable
