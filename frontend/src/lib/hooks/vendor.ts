import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Vendor } from '../schemas'
import { fetchVendors, fetchVendor, createVendor } from 'api'

export function useVendors() {
  return useQuery<{vendors: Vendor[]}, Error>('vendors', fetchVendors)
}

export function useVendor(id: number) {
  return useQuery<{vendor: Vendor}, Error>(['vendor', id], () => fetchVendor(id))
}

export function useCreateVendor() {
  const queryClient = useQueryClient()
  return useMutation(createVendor, {
    onSuccess: () => {
      queryClient.invalidateQueries('vendors')
    },
  })
}

