import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Investment } from '../schemas'
import { invest, fetchInvestments, deleteInvestment } from 'api'
import { QUERY_KEY as ACCTS_QUERY_KEY } from './account'

const QUERY_KEY = 'investments'

export function useMakeInvestment() {
  const queryClient = useQueryClient()
  return useMutation(invest, {
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

export function useInvestments() {
  return useQuery<{ investments: Investment[] }, Error>(
    QUERY_KEY,
    fetchInvestments
  )
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()
  return useMutation(deleteInvestment, {
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
