import { useQuery, useMutation, useQueryClient } from 'react-query'
import { fetchUsers, changeUserStatus, makeAdmin } from 'api'
import { User } from '../models'

export function useUsers() {
  return useQuery<{users: User[]}, Error>('users', fetchUsers)
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient()
  return useMutation(changeUserStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    },
  })
}

export function useMakeAdmin() {
  const queryClient = useQueryClient()
  return useMutation(makeAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    },
  })
}
