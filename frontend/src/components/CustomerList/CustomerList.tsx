import { useCustomers } from 'lib/hooks/customer'
import CustomerListItem from './CustomerListItem'

const CustomerList = (): JSX.Element => {
  const { data, error, isError, isLoading } = useCustomers()

  if (isLoading) {
    return <p>Cargando clientes...</p>
  }

  if (isError && error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <>
      {(data?.customers || []).map((c) => (
        <CustomerListItem key={c.id} customer={c} />
      ))}
    </>
  )
}

export default CustomerList

