import React, { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import CustomerList from 'components/CustomerList/CustomerList'
import NewCustomer from 'components/CustomerList/NewCustomer'

const Customers = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSuccess = useCallback((id: number) => {
    setOpen(false)
    enqueueSnackbar(`Cliente ${id} creado exitosamente.`, {
      variant: 'success',
    })
  }, [setOpen, enqueueSnackbar])

  return (
    <div>
      <CustomerList />
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Cliente
        </Fab>
      </Box>
      <NewCustomer
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </div>
  )
}

export default Customers

