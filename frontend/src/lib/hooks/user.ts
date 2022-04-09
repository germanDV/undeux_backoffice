import { useQuery, useMutation, useQueryClient } from 'react-query'
import { User } from '../schemas'
import {
  fetchUsers,
  changeUserStatus,
  makeAdmin,
  register,
  changeUserPassword,
  changeMyPassword,
} from 'api'

const QUERY_KEY = 'users'

export function useUsers() {
  return useQuery<{users: User[]}, Error>(QUERY_KEY, fetchUsers)
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient()
  return useMutation(changeUserStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useMakeAdmin() {
  const queryClient = useQueryClient()
  return useMutation(makeAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation(register, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useChangeUserPassword() {
  return useMutation(changeUserPassword)
}

export function useChangeMyPassword() {
  return useMutation(changeMyPassword)
}
