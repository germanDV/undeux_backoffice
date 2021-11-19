import React, { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useSnackbar } from 'notistack'
import UserList from 'components/UserList/UserList'
import NewUser from 'components/UserList/NewUser'

const Users = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSuccess = useCallback((newUserId: number) => {
    setOpen(false)
    enqueueSnackbar(`Usuario ${newUserId} creado exitosamente.`, {
      variant: 'success',
    })
  }, [setOpen, enqueueSnackbar])

  return (
    <div>
      <UserList />
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Usuario
        </Fab>
      </Box>
      <NewUser 
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </div>
  )
}

export default Users
