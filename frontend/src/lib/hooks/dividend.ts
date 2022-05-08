import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Dividend } from '../schemas'
import { payDividend, fetchDividends, deleteDividend } from 'api'
import { QUERY_KEY as ACCTS_QUERY_KEY } from './account'

const QUERY_KEY = 'dividends'

export function usePayDividend() {
  const queryClient = useQueryClient()
  return useMutation(payDividend, {
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

export function useDividends() {
  return useQuery<{ dividends: Dividend[] }, Error>(QUERY_KEY, fetchDividends)
}

export function useDeleteDividend() {
  const queryClient = useQueryClient()
  return useMutation(deleteDividend, {
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
