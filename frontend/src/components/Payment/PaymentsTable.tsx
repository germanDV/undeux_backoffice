import { FC, useState, useEffect, useMemo } from 'react'
import { useSnackbar } from 'notistack'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { PaperContainer } from 'ui/paper.styles'
import { formatAmount, displayDateGridCell, sortByDateDesc } from 'lib/helpers'
import { usePayments, useDeletePayment } from 'lib/hooks/payment'
import { useGetProjectName } from 'lib/hooks/project'
import { useGetVendorName } from 'lib/hooks/vendor'
import { useGetAccountName } from 'lib/hooks/account'

type TableEntry = {
  id: number
  date: string
  amount: string
  account: string
  project: string
  vendor: string
  description: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50, align: 'center' },
  { field: 'date', headerName: 'Fecha', width: 80, valueFormatter: displayDateGridCell },
  { field: 'amount', headerName: 'Importe', width: 100, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 80, align: 'center' },
  { field: 'project', headerName: 'Proyecto', width: 200 },
  { field: 'vendor', headerName: 'Proveedor', width: 150 },
  { field: 'description', headerName: 'Descripción', width: 400 },
]

const PaymentsTable: FC = () => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const pmnts = usePayments()
  const deletePaymentMutation = useDeletePayment()
  const { enqueueSnackbar } = useSnackbar()
  const getAccount = useGetAccountName()
  const getProjectName = useGetProjectName()
  const getVendorName = useGetVendorName()

  useEffect(() => {
    if (deletePaymentMutation.isError) {
      enqueueSnackbar((deletePaymentMutation.error as Error).message, { variant: 'error' })
    }
    if (deletePaymentMutation.isSuccess) {
      enqueueSnackbar('Pago eliminado exitosamente.', { variant: 'success' })
    }
  }, [
    deletePaymentMutation.isError,
    deletePaymentMutation.isSuccess,
    deletePaymentMutation.error,
    enqueueSnackbar,
  ])

  const rows = useMemo((): TableEntry[] => {
    if (pmnts.data?.payments) {
      return sortByDateDesc(pmnts.data.payments.map(i => ({
        id: i.id,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        project: getProjectName(i.projectId),
        vendor: getVendorName(i.vendorId),
        description: i.description,
      })))
    }
    return []
  }, [getAccount, getVendorName, getProjectName, pmnts.data?.payments])

  const handleSelectionChange = (newSelection: GridSelectionModel): void => {
    setSelectionModel(newSelection)
  }

  const handleDelete = (): void => {
    deletePaymentMutation.mutate(selectionModel[0] as number)
  }

  if (pmnts.isLoading) {
    return <p>Cargando projectos...</p>
  }

  if (pmnts.isError && pmnts.error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{pmnts.error.message}</p>
      </div>
    )
  }

  if (!pmnts.data?.payments) {
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
    </PaperContainer>
  )
}

export default PaymentsTable
