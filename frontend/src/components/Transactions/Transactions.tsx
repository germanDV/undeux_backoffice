import { useCashTxs } from 'lib/hooks/cash'

const Transactions = (): JSX.Element => {
  const txs = useCashTxs()

  if (txs.isLoading) {
    return <p>Cargando transacciones...</p>
  }

  if (txs.isError) {
    return <p>{txs.error.message}</p>
  }

  return (
    <div>
      <h2>Transacciones</h2>
      <pre>{JSON.stringify(txs.data, null, 2)}</pre>
    </div>
  )
}

export default Transactions
