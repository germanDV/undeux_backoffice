import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Payment } from '../schemas'
import { pay, fetchPayments, deletePayment } from 'api'
import { QUERY_KEY as ACCTS_QUERY_KEY } from './account'

const QUERY_KEY = 'payments'

export function useMakePayment() {
  const queryClient = useQueryClient()
  return useMutation(pay, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          // Invalidate this key and also the 'accounts' one.
          const key = Array.isArray(query.queryKey)
            ? query.queryKey[0]
            : query.queryKey
          return [QUERY_KEY, ACCTS_QUERY_KEY].includes(key)
        },
      })
    },
  })
}

export function usePayments() {
  return useQuery<{ payments: Payment[] }, Error>(QUERY_KEY, fetchPayments)
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  return useMutation(deletePayment, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          // Invalidate this key and also the 'accounts' one.
          const key = Array.isArray(query.queryKey)
            ? query.queryKey[0]
            : query.queryKey
          return [QUERY_KEY, ACCTS_QUERY_KEY].includes(key)
        },
      })
    },
  })
}
