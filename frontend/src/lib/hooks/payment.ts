import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Payment } from '../schemas'
import { pay, fetchPayments, deletePayment } from 'api'

export function useMakePayment() {
  const queryClient = useQueryClient()
  return useMutation(pay, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments')
    },
  })
}

export function usePayments() {
  return useQuery<{payments: Payment[]}, Error>('payments', fetchPayments)
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  return useMutation(deletePayment, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments')
    },
  })
}

