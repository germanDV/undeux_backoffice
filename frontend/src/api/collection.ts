import client from './client'
import { Collection, CollectionSubmission } from 'lib/schemas'

export async function collect(payload: CollectionSubmission) {
  return client<{msg: string}>({
    method: 'POST',
    url: '/api/cash/collections',
    data: payload,
  })
}

export async function fetchCollections() {
  return client<{collections: Collection[]}>({
    method: 'GET',
    url: '/api/cash/collections',
  })
}

export async function deleteCollection(id: number) {
  return client<{msg: string}>({
    method: 'DELETE',
    url: `/api/cash/collections/${id}`,
  })
}

