import client from './client'
import { FX, FXSubmission } from 'lib/schemas'

export async function fetchFX() {
  return client<{fx: FX}>({
    method: 'GET',
    url: '/api/fx',
  })
}

export async function updateFX(payload: FXSubmission) {
  return client<{msg: string, currency: string}>({
    method: 'POST',
    url: '/api/fx',
    data: {
      currency: 'ARS',
      rate: payload.rate,
    },
  })
}
