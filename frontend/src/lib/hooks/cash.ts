import { useQuery } from 'react-query'
import { fetchAllCashTxs } from 'api'
import { CashTxs } from 'lib/schemas'

const QUERY_KEY = 'cash_all'

export function useCashTxs() {
  return useQuery<CashTxs, Error>(QUERY_KEY, fetchAllCashTxs)
}
