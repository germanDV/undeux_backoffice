import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Customer } from '../schemas'
import { fetchCustomers, fetchCustomer, createCustomer } from 'api'

const QUERY_KEY = 'customers'

export function useCustomers() {
  return useQuery<{customers: Customer[]}, Error>(QUERY_KEY, fetchCustomers)
}

export function useCustomer(id: number) {
  return useQuery<{customer: Customer}, Error>([QUERY_KEY, id], () => fetchCustomer(id))
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useGetCustomerName() {
  const customersData = useCustomers()

  return useCallback((id: number): string => {
    if (!customersData.data?.customers) return ''
    const customer = customersData.data.customers.find(c => c.id === id)
    return customer ? customer.name : ''
  }, [customersData.data?.customers])
}
