import { useQuery } from 'react-query'
import { Account } from '../schemas'
import { fetchAccounts } from 'api'

export function useAccounts() {
  return useQuery<{accounts: Account[]}, Error>('accounts', fetchAccounts)
}
