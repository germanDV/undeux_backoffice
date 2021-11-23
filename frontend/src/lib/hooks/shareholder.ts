import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Shareholder } from '../schemas'
import { fetchShareholders, fetchShareholder, createShareholder } from 'api'

export function useShareholders() {
  return useQuery<{shareholders: Shareholder[]}, Error>('shareholders', fetchShareholders)
}

export function useShareholder(id: number) {
  return useQuery<{shareholder: Shareholder}, Error>(['shareholder', id], () => fetchShareholder(id))
}

export function useCreateShareholder() {
  const queryClient = useQueryClient()
  return useMutation(createShareholder, {
    onSuccess: () => {
      queryClient.invalidateQueries('shareholders')
    },
  })
}

