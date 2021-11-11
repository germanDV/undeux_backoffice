import React from 'react'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
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
    <div>
      {(data?.shareholders || []).map((sh) => <ShareholderListItem key={sh.id} shareholder={sh} />)}
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => alert('Rederigir a página con formulario o abrir modal?')}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Socio
        </Fab>
      </Box>
    </div>
  )
}

export default ShareholderList

