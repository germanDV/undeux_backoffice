import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Customer } from '../schemas'
import { fetchCustomers, fetchCustomer, createCustomer } from 'api'

export function useCustomers() {
  return useQuery<{customers: Customer[]}, Error>('customers', fetchCustomers)
}

export function useCustomer(id: number) {
  return useQuery<{customer: Customer}, Error>(['customer', id], () => fetchCustomer(id))
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers')
    },
  })
}

