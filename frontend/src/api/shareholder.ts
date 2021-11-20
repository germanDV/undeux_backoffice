import client from './client'
import { Shareholder } from 'lib/schemas'

export async function fetchShareholders() {
  return client<{shareholders: Shareholder[]}>({
    method: 'GET',
    url: '/api/shareholders',
  })
}

export async function fetchShareholder(id: number) {
  return client<{shareholder: Shareholder}>({
    method: 'GET',
    url: `/api/shareholders/${id}`,
  })
}

export async function createShareholder(payload: Omit<Shareholder, 'id'>) {
  return client<{id: number}>({
    method: 'POST',
    url: '/api/shareholders',
    data: payload,
  })
}

