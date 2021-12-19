import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Payment } from '../schemas'
import { pay, fetchPayments } from 'api'

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
