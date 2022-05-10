import { useMemo, useState } from 'react'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useInvestments, useDeleteInvestment } from 'lib/hooks/investment'
import { useDividends, useDeleteDividend } from 'lib/hooks/dividend'
import { useGetAccountName } from 'lib/hooks/account'
import { useGetShareholderName } from 'lib/hooks/shareholder'
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
  {
    field: 'date',
    headerName: 'Fecha',
    width: 200,
    valueFormatter: displayDateGridCell,
  },
  { field: 'amount', headerName: 'Importe', width: 150, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 80, align: 'center' },
  { field: 'category', headerName: 'Tipo', width: 200, align: 'left' },
  { field: 'shareholder', headerName: 'Socio', width: 250, align: 'left' },
]

const EquityTable = (): JSX.Element | null => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const investmentsData = useInvestments()
  const dividendsData = useDividends()
  const getAccount = useGetAccountName()
  const getShareholderName = useGetShareholderName()
  const deleteInvestmentMutation = useDeleteInvestment()
  const deleteDividendMutation = useDeleteDividend()

  const rows = useMemo((): TableEntry[] => {
    let invs: TableEntry[] = []
    let divs: TableEntry[] = []

    if (investmentsData.data?.investments) {
      invs = investmentsData.data.investments.map((i) => ({
        id: `I:${i.id}`,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        category: 'INVERSION',
        shareholder: getShareholderName(i.shareholderId),
      }))
    }

    if (dividendsData.data?.dividends) {
      divs = dividendsData.data.dividends.map((i) => ({
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

  const handleDelete = (): void => {
    const selected = selectionModel[0] as string
    const [type, id] = selected.split(':') as [string, number]
    if (type === 'D') {
      deleteDividendMutation.mutate(id)
    } else {
      deleteInvestmentMutation.mutate(id)
    }
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
    <>
      <div style={{ height: 540 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onSelectionModelChange={handleSelectionChange}
          selectionModel={selectionModel}
        />
      </div>
      <LoadingButton
        type="submit"
        endIcon={<DeleteIcon />}
        loading={false}
        loadingPosition="end"
        variant="outlined"
        color="secondary"
        sx={{ mt: 1 }}
        onClick={handleDelete}
        disabled={selectionModel.length === 0}
      >
        Eliminar seleccionado
      </LoadingButton>
    </>
  )
}

export default EquityTable
