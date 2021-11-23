import client from './client'
import { Customer } from 'lib/schemas'

export async function fetchCustomers() {
  return client<{customers: Customer[]}>({
    method: 'GET',
    url: '/api/customers',
  })
}

export async function fetchCustomer(id: number) {
  return client<{customer: Customer}>({
    method: 'GET',
    url: `/api/customers/${id}`,
  })
}

type Optional = { id: number; active: boolean }
export async function createCustomer(payload: Omit<Customer, keyof Optional>) {
  return client<{id: number}>({
    method: 'POST',
    url: '/api/customers',
    data: payload,
  })
}

