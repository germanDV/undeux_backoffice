import client from './client'
import { PaymentSubmission } from 'lib/schemas'

export async function pay(payload: PaymentSubmission) {
  return client<{msg: string}>({
    method: 'POST',
    url: '/api/vendors/pay',
    data: payload,
  })
}

