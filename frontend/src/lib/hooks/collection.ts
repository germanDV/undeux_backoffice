import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Collection } from '../schemas'
import { collect, fetchCollections, deleteCollection } from 'api'

const QUERY_KEY = 'collections'

export function useMakeCollection() {
  const queryClient = useQueryClient()
  return useMutation(collect, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useCollections() {
  return useQuery<{collections: Collection[]}, Error>(QUERY_KEY, fetchCollections)
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation(deleteCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

