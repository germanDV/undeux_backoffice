import React, { useEffect, useState } from 'react'
import { User } from 'lib/models'
import { fetchUsers } from 'api'

const Users = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function loadUsers() {
      const [us, err] = await fetchUsers()
      if (!err) {
        setUsers(us)
      }
    }
    loadUsers()
  }, [])

  return (
    <div>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  )
}

export default Users
