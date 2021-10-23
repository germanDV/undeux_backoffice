import React from 'react'
import { useUsers } from 'lib/hooks/user'
import UserListItem from './UserListItem'

const UserList = (): JSX.Element => {
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
    </div>
  )
}

export default UserList
