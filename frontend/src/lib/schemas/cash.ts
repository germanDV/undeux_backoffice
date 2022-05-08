import { Collection } from './collection'
import { Payment } from './payment'
import { Investment } from './investment'
import { Dividend } from './dividend'

export type CashTxs = {
  collections: Collection[] | null
  payments: Payment[] | null
  investments: Investment[] | null
  dividends: Dividend[] | null
}
