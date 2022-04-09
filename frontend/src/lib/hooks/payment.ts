import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Payment } from '../schemas'
import { pay, fetchPayments, deletePayment } from 'api'

const QUERY_KEY = 'payments'

export function useMakePayment() {
  const queryClient = useQueryClient()
  return useMutation(pay, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function usePayments() {
  return useQuery<{payments: Payment[]}, Error>(QUERY_KEY, fetchPayments)
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  return useMutation(deletePayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

