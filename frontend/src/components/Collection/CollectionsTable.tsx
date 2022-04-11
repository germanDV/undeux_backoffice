import { FC, useState, useEffect, useMemo } from 'react'
import { useSnackbar } from 'notistack'
import { DataGrid, GridSelectionModel, GridColDef } from '@mui/x-data-grid'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { PaperContainer } from 'ui/paper.styles'
import { displayDateGridCell, formatAmount, sortByDateDesc } from 'lib/helpers'
import { useCollections, useDeleteCollection } from 'lib/hooks/collection'
import { useGetProjectName } from 'lib/hooks/project'
import { useGetCustomerName } from 'lib/hooks/customer'
import { useGetAccountName } from 'lib/hooks/account'

type TableEntry = {
  id: number
  date: string
  amount: string
  account: string
  project: string
  customer: string
  description: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50, align: 'center' },
  { field: 'date', headerName: 'Fecha', width: 80, valueFormatter: displayDateGridCell },
  { field: 'amount', headerName: 'Importe', width: 100, align: 'right' },
  { field: 'account', headerName: 'Cuenta', width: 80, align: 'center' },
  { field: 'project', headerName: 'Proyecto', width: 200 },
  { field: 'customer', headerName: 'Cliente', width: 150 },
  { field: 'description', headerName: 'Descripción', width: 400 },
]

const CollectionsTable: FC = () => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const collections = useCollections()
  const deleteCollectionMutation = useDeleteCollection()
  const { enqueueSnackbar } = useSnackbar()
  const getAccount = useGetAccountName()
  const getProjectName = useGetProjectName()
  const getCustomerName = useGetCustomerName()

  useEffect(() => {
    if (deleteCollectionMutation.isError) {
      enqueueSnackbar((deleteCollectionMutation.error as Error).message, { variant: 'error' })
    }
    if (deleteCollectionMutation.isSuccess) {
      enqueueSnackbar('Cobro eliminado exitosamente.', { variant: 'success' })
    }
  }, [
    deleteCollectionMutation.isError,
    deleteCollectionMutation.isSuccess,
    deleteCollectionMutation.error,
    enqueueSnackbar,
  ])

  const rows = useMemo((): TableEntry[] => {
    if (collections.data?.collections) {
      return sortByDateDesc(collections.data.collections.map(i => ({
        id: i.id,
        date: i.date,
        amount: formatAmount(i.amount),
        account: getAccount(i.accountId),
        project: getProjectName(i.projectId),
        customer: getCustomerName(i.customerId),
        description: i.description,
      })))
    }
    return []
  }, [
    getAccount,
    getCustomerName,
    getProjectName,
    collections.data?.collections,
  ])

  const handleSelectionChange = (newSelection: GridSelectionModel): void => {
    setSelectionModel(newSelection)
  }

  const handleDelete = (): void => {
    deleteCollectionMutation.mutate(selectionModel[0] as number)
  }

  if (collections.isLoading) {
    return <p>Cargando projectos...</p>
  }

  if (collections.isError && collections.error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{collections.error.message}</p>
      </div>
    )
  }

  if (!collections.data?.collections) {
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

export default CollectionsTable
