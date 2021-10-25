import React from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { useUsers } from 'lib/hooks/user'
import UserListItem from './UserListItem'

const UserList = (): JSX.Element => {
  const history = useHistory()
  const { data, error, isError, isLoading } = useUsers()

  if (isLoading) {
    return <p>Cargando usuarios...</p>
  }

  if (isError && error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div>
      {(data?.users || []).map((user) => <UserListItem key={user.id} user={user} />)}
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => history.push('/new-user')}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Usuario
        </Fab>
      </Box>
    </div>
  )
}

export default UserList
