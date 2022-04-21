import { useQuery, useMutation, useQueryClient } from 'react-query'
import { FX } from '../schemas'
import { fetchFX, updateFX } from 'api'

const QUERY_KEY = 'fx'

export function useFX() {
  return useQuery<{fx: FX}>(QUERY_KEY, fetchFX)
}

export function useUpdateFX() {
  const queryClient = useQueryClient()
  return useMutation(updateFX, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}
