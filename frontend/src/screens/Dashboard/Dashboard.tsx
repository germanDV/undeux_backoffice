import Balances from 'components/Balance/Balances'
import FX from 'components/FX/FX'
import Transactions from 'components/Transactions/Transactions'

const Dashboard = () => {
  return (
    <>
      <FX />
      <Balances />
      <Transactions />
    </>
  )
}

export default Dashboard
