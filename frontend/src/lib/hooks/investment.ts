import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Investment } from '../schemas'
import { invest, fetchInvestments, deleteInvestment } from 'api'

const QUERY_KEY = 'investments'

export function useMakeInvestment() {
  const queryClient = useQueryClient()
  return useMutation(invest, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useInvestments() {
  return useQuery<{investments: Investment[]}, Error>(QUERY_KEY, fetchInvestments)
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()
  return useMutation(deleteInvestment, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}
