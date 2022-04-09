import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Dividend } from '../schemas'
import { payDividend, fetchDividends, deleteDividend } from 'api'

const QUERY_KEY = 'dividends'

export function usePayDividend() {
  const queryClient = useQueryClient()
  return useMutation(payDividend, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useDividends() {
  return useQuery<{dividends: Dividend[]}, Error>(QUERY_KEY, fetchDividends)
}

export function useDeleteDividend() {
  const queryClient = useQueryClient()
  return useMutation(deleteDividend, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}
