import { FC } from 'react';
import TxTable from 'components/TxTable/TxTable'
import { usePayments } from 'lib/hooks/payment'

const PaymentsTable: FC = () => {
  const pmnts = usePayments()

  if (pmnts.isLoading) {
    return <p>Cargando projectos...</p>
  }

  if (pmnts.isError && pmnts.error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{pmnts.error.message}</p>
      </div>
    )
  }

  if (!pmnts.data?.payments) {
    return null
  }
  
  return <TxTable category="payments" rows={pmnts.data.payments} />
}

export default PaymentsTable

