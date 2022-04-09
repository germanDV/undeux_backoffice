import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Shareholder } from '../schemas'
import { fetchShareholders, fetchShareholder, createShareholder } from 'api'

const QUERY_KEY = 'shareholders'

export function useShareholders() {
  return useQuery<{shareholders: Shareholder[]}, Error>(QUERY_KEY, fetchShareholders)
}

export function useShareholder(id: number) {
  return useQuery<{shareholder: Shareholder}, Error>([QUERY_KEY, id], () => fetchShareholder(id))
}

export function useCreateShareholder() {
  const queryClient = useQueryClient()
  return useMutation(createShareholder, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

