import { useQuery } from 'react-query'
import { fetchUsers } from 'api'
import { User } from '../models'

export function useUsers() {
  return useQuery<{users: User[]}, Error>('users', fetchUsers)
}
