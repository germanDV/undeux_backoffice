import { useQuery, useMutation, useQueryClient } from 'react-query'
import { User } from '../models'
import {
  fetchUsers,
  changeUserStatus,
  makeAdmin,
  register,
  changeUserPassword,
  changeMyPassword,
} from 'api'

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

export function useCreateUser() {
  return useMutation(register)
}

export function useChangeUserPassword() {
  return useMutation(changeUserPassword)
}

export function useChangeMyPassword() {
  return useMutation(changeMyPassword)
}
