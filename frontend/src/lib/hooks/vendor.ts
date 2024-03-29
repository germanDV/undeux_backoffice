import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Vendor } from '../schemas'
import { fetchVendors, fetchVendor, createVendor } from 'api'

const QUERY_KEY = 'vendors'

export function useVendors() {
  return useQuery<{vendors: Vendor[]}, Error>(QUERY_KEY, fetchVendors)
}

export function useVendor(id: number) {
  return useQuery<{vendor: Vendor}, Error>([QUERY_KEY, id], () => fetchVendor(id))
}

export function useCreateVendor() {
  const queryClient = useQueryClient()
  return useMutation(createVendor, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useGetVendorName() {
  const vendorsData = useVendors()

  return useCallback((id: number): string => {
    if (!vendorsData.data?.vendors) return ''
    const vendor = vendorsData.data.vendors.find(v => v.id === id)
    return vendor ? vendor.name : ''
  }, [vendorsData.data?.vendors])

}
