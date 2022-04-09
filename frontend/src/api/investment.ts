import client from './client'
import { Investment, InvestmentSumbission } from 'lib/schemas'

export async function invest(payload: InvestmentSumbission) {
  return client<{msg: string}>({
    method: 'POST',
    url: '/api/cash/investments',
    data: payload,
  })
}

export async function fetchInvestments() {
  return client<{investments: Investment[]}>({
    method:'GET',
    url: '/api/cash/investments',
  })
}

export function deleteInvestment(id: number) {
  return client<{msg: string}>({
    method: 'DELETE',
    url: `/api/cash/investments/${id}`,
  })
}
