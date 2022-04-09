import client from './client'
import { Dividend, DividendSubmission } from 'lib/schemas'

export async function payDividend(payload: DividendSubmission) {
  return client<{msg: string}>({
    method: 'POST',
    url: '/api/cash/dividends',
    data: payload,
  })
}

export async function fetchDividends() {
  return client<{dividends: Dividend[]}>({
    method: 'GET',
    url: '/api/cash/dividends',
  })
}

export async function deleteDividend(id: number) {
  return client<{msg: string}>({
    method: 'DELETE',
    url: `/api/cash/dividends/${id}`,
  })
}
