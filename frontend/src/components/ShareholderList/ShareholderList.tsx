import React from 'react'
import { useShareholders } from 'lib/hooks/shareholder'
import ShareholderListItem from './ShareholderListItem'

const ShareholderList = (): JSX.Element => {
  const { data, error, isError, isLoading } = useShareholders()

  if (isLoading) {
    return <p>Cargando socios...</p>
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
      {(data?.shareholders || []).map((sh) => (
        <ShareholderListItem key={sh.id} shareholder={sh} />
      ))}
    </>
  )
}

export default ShareholderList

