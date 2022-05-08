import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Collection } from '../schemas'
import { collect, fetchCollections, deleteCollection } from 'api'
import { QUERY_KEY as ACCTS_QUERY_KEY } from './account'

const QUERY_KEY = 'collections'

export function useMakeCollection() {
  const queryClient = useQueryClient()
  return useMutation(collect, {
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

export function useCollections() {
  return useQuery<{ collections: Collection[] }, Error>(
    QUERY_KEY,
    fetchCollections
  )
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation(deleteCollection, {
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
