import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { qp } from 'lib/helpers'
import UserList from 'components/UserList/UserList'

const Users = (): JSX.Element => {
  const { search } = useLocation()
  const { enqueueSnackbar } = useSnackbar()

  const { newuser } = qp(search)
  if (newuser) {
    enqueueSnackbar(`Usuario ${newuser} creado exitosamente.`, {
      variant: 'success',
    })
  }

  return <UserList />
}

export default Users
