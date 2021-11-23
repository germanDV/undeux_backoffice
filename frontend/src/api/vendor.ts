import client from './client'
import { Vendor } from 'lib/schemas'

export async function fetchVendors() {
  return client<{vendors: Vendor[]}>({
    method: 'GET',
    url: '/api/vendors',
  })
}

export async function fetchVendor(id: number) {
  return client<{vendor: Vendor}>({
    method: 'GET',
    url: `/api/vendors/${id}`,
  })
}

type Optional = { id: number; active: boolean }
export async function createVendor(payload: Omit<Vendor, keyof Optional>) {
  return client<{id: number}>({
    method: 'POST',
    url: '/api/vendors',
    data: payload,
  })
}

