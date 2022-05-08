import client from './client'
import { CashTxs } from 'lib/schemas'

export async function fetchAllCashTxs() {
  return client<CashTxs>({
    method: 'GET',
    url: '/api/cash/all',
  })
}
