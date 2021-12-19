import client from './client'
import { Account } from 'lib/schemas'

export async function fetchAccounts() {
  return client<{accounts: Account[]}>({
    method: 'GET',
    url: '/api/accounts',
  })
}
