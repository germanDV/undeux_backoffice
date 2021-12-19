import client from './client'
import { Payment, PaymentSubmission } from 'lib/schemas'

export async function pay(payload: PaymentSubmission) {
  return client<{msg: string}>({
    method: 'POST',
    url: '/api/cash/payments',
    data: payload,
  })
}

export async function fetchPayments() {
  return client<{payments: Payment[]}>({
    method: 'GET',
    url: '/api/cash/payments',
  })
}

export async function deletePayment(id: number) {
  return client<{msg: string}>({
    method: 'DELETE',
    url: `/api/cash/payments/${id}`,
  })
}

