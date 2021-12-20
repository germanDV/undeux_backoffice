import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useSnackbar } from 'notistack'
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { PaperContainer } from 'ui/paper.styles'
import { formatDate, formatAmount } from 'lib/helpers'
import { usePayments } from 'lib/hooks/payment'
import { useProjects } from 'lib/hooks/project'
import { useVendors } from 'lib/hooks/vendor'
import { useAccounts } from 'lib/hooks/account'
import { useDeletePayment } from 'lib/hooks/payment'

type TableEntry = {
  id: number
  date: string
  amount: string
  account: string
  project: string
  vendor: string
  description: string
}

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'date', headerName: 'Fecha', width: 80 },
  { field: 'amount', headerName: 'Importe', width: 100 },
  { field: 'account', headerName: 'Cuenta', width: 80 },
  { field: 'project', headerName: 'Proyecto', width: 250 },
  { field: 'vendor', headerName: 'Proveedor', width: 200 },
  { field: 'description', headerName: 'Descripción', width: 350 },
]

const PaymentsTable: FC = () => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const pmnts = usePayments()
  const projectsData = useProjects()
  const vendorsData = useVendors()
  const acctData = useAccounts()
  const deletePaymentMutation = useDeletePayment()
  const { enqueueSnackbar } = useSnackbar()

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

  const getProjectName = useCallback((id: number): string => {
    if (!projectsData.data?.projects) return ''
    const project = projectsData.data.projects.find(p => p.id === id)
    return project ? project.name : ''
  }, [projectsData.data?.projects])

  const getVendorName = useCallback((id: number): string => {
    if (!vendorsData.data?.vendors) return ''
    const vendor = vendorsData.data.vendors.find(v => v.id === id)
    return vendor ? vendor.name : ''
  }, [vendorsData.data?.vendors])

  const getAccount = useCallback((id: number): string => {
    if (!acctData.data?.accounts) return ''
    const acct = acctData.data.accounts.find(a => a.id === id)
    return acct ? acct.currency : ''
  }, [acctData.data?.accounts])

  const rows = useMemo((): TableEntry[] => {
    if (pmnts.data?.payments) {
      return pmnts.data.payments.map(i => ({
        id: i.id,
        date: formatDate(i.date),
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        project: getProjectName(i.projectId),
        vendor: getVendorName(i.vendorId),
        description: i.description,
      }))
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

