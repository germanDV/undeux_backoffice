import { useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import { useCashTxs } from 'lib/hooks/cash'
import { useGetAccountName } from 'lib/hooks/account'
import { useGetProjectName } from 'lib/hooks/project'
import { useGetVendorName } from 'lib/hooks/vendor'
import { useGetCustomerName } from 'lib/hooks/customer'
import { useGetShareholderName } from 'lib/hooks/shareholder'
import { formatAmount, displayDateGridCell, sortByDateDesc } from 'lib/helpers'

type TableEntry = {
  category: 'INV.' | 'DIV.' | 'PAGO' | 'COBRO'
  id: string
  date: string
  amount: string
  account: string
  project: string
  party: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, align: 'center' },
  { field: 'category', headerName: 'Tipo', width: 150, align: 'left' },
  {
    field: 'date',
    headerName: 'Fecha',
    width: 150,
    valueFormatter: displayDateGridCell,
  },
  { field: 'amount', headerName: 'Importe', width: 150, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 100, align: 'center' },
  { field: 'project', headerName: 'Proyecto', width: 250 },
  { field: 'party', headerName: 'Party', width: 250 },
]

const Transactions = (): JSX.Element => {
  const theme = useTheme()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const txs = useCashTxs()
  const getAccount = useGetAccountName()
  const getProject = useGetProjectName()
  const getVendor = useGetVendorName()
  const getCustomer = useGetCustomerName()
  const getShareholder = useGetShareholderName()

  const rows = useMemo((): TableEntry[] => {
    let pays: TableEntry[] = []
    let cols: TableEntry[] = []
    let invs: TableEntry[] = []
    let divs: TableEntry[] = []

    if (txs.data?.payments) {
      pays = txs.data.payments.map((i) => ({
        id: `P:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'PAGO',
        project: getProject(i.projectId),
        party: getVendor(i.vendorId),
      }))
    }

    if (txs.data?.collections) {
      cols = txs.data.collections.map((i) => ({
        id: `C:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'COBRO',
        project: getProject(i.projectId),
        party: getCustomer(i.customerId),
      }))
    }

    if (txs.data?.investments) {
      invs = txs.data.investments.map((i) => ({
        id: `I:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'INV.',
        project: 'n/a',
        party: getShareholder(i.shareholderId),
      }))
    }

    if (txs.data?.dividends) {
      divs = txs.data.dividends.map((i) => ({
        id: `D:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'DIV.',
        project: 'n/a',
        party: getShareholder(i.shareholderId),
      }))
    }

    return sortByDateDesc([...pays, ...cols, ...invs, ...divs])
  }, [
    txs.data?.payments,
    txs.data?.collections,
    txs.data?.investments,
    txs.data?.dividends,
    getAccount,
    getProject,
    getVendor,
    getCustomer,
    getShareholder,
  ])

  const handleSelectionChange = (newSelection: GridSelectionModel): void => {
    setSelectionModel(newSelection)
  }

  if (txs.isLoading) {
    return <p>Cargando transacciones...</p>
  }

  if (txs.isError) {
    return <p>{txs.error.message}</p>
  }

  return (
    <section>
      <Paper elevation={3} sx={{ p: theme.spacing(2), my: theme.spacing(2) }}>
        <div style={{ height: 700 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            onSelectionModelChange={handleSelectionChange}
            selectionModel={selectionModel}
          />
        </div>
      </Paper>
    </section>
  )
}

export default Transactions
