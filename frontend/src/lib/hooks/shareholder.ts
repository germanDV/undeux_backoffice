import { useQuery } from 'react-query'
import { Shareholder } from '../models'
import { fetchShareholders, fetchShareholder } from 'api'

export function useShareholders() {
  return useQuery<{shareholders: Shareholder[]}, Error>('shareholders', fetchShareholders)
}

export function useShareholder(id: number) {
  return useQuery<{shareholder: Shareholder}, Error>(['shareholder', id], () => fetchShareholder(id))
}

