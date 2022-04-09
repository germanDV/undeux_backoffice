import { useQuery } from 'react-query'
import { Account } from '../schemas'
import { fetchAccounts } from 'api'

const QUERY_KEY = 'accounts'

export function useAccounts() {
  return useQuery<{accounts: Account[]}, Error>(QUERY_KEY, fetchAccounts)
}
