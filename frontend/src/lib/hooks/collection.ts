import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Collection } from '../schemas'
import { collect, fetchCollections, deleteCollection } from 'api'

export function useMakeCollection() {
  const queryClient = useQueryClient()
  return useMutation(collect, {
    onSuccess: () => {
      queryClient.invalidateQueries('collections')
    },
  })
}

export function useCollections() {
  return useQuery<{collections: Collection[]}, Error>('collections', fetchCollections)
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation(deleteCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries('collections')
    },
  })
}

