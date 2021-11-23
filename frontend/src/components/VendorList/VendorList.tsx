import React from 'react'
import { useVendors } from 'lib/hooks/vendor'
import VendorListItem from './VendorListItem'

const VendorList = (): JSX.Element => {
  const { data, error, isError, isLoading } = useVendors()

  if (isLoading) {
    return <p>Cargando proveedores...</p>
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
      {(data?.vendors || []).map((v) => (
        <VendorListItem key={v.id} vendor={v} />
      ))}
    </>
  )
}

export default VendorList

