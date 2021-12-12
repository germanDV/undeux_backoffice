import { useMutation, useQueryClient } from 'react-query'
import { pay } from 'api'

export function useMakePayment() {
  const queryClient = useQueryClient()
  return useMutation(pay, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments')
    },
  })
}

