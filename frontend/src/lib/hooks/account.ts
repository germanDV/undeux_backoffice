import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { Account } from '../schemas'
import { fetchAccounts } from 'api'

const QUERY_KEY = 'accounts'

export function useAccounts() {
  return useQuery<{accounts: Account[]}, Error>(QUERY_KEY, fetchAccounts)
}

export function useGetAccountName() {
  const acctData = useAccounts()

  return useCallback((id: number): string => {
    if (!acctData.data?.accounts) return ''
    const acct = acctData.data.accounts.find(a => a.id === id)
    return acct ? acct.currency : ''
  }, [acctData.data?.accounts])
}
