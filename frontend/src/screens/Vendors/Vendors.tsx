import React, { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import VendorList from 'components/VendorList/VendorList'
import NewVendor from 'components/VendorList/NewVendor'
import PageTitle from 'components/PageTitle/PageTitle'

const Vendors = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSuccess = useCallback((id: number) => {
    setOpen(false)
    enqueueSnackbar(`Proveedor ${id} creado exitosamente.`, {
      variant: 'success',
    })
  }, [setOpen, enqueueSnackbar])

  return (
    <div>
      <PageTitle>proveedores</PageTitle>
      <VendorList />
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Proveedor
        </Fab>
      </Box>
      <NewVendor
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </div>
  )
}

export default Vendors

