import React from 'react'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import PasswordIcon from '@mui/icons-material/Password'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

interface Props {
  userId: number
  isAdmin: boolean
  active: boolean
}

const UserActions = ({ userId, isAdmin, active }: Props): JSX.Element | null => {
  if (isAdmin) return null

  const changePassword = () => {
    alert(`Mostrar formulario para cambiar password del usuario ${userId}`)
  }

  const makeAdmin = () => {
    alert(`Convertir al usuario ${userId} en admin`)
  }

  const deactivate = () => {
    alert(`Desactivar usuario ${userId}`)
  }

  const activate = () => {
    alert(`Reactivar usuario ${userId}`)
  }

  return (
    <Stack direction="row" spacing={.5}>
      <IconButton title="Cambiar password" onClick={changePassword}>
        <PasswordIcon />
      </IconButton>
      <IconButton title="Hacer administrador" onClick={makeAdmin}>
        <UpgradeIcon />
      </IconButton>
      {active
        ? (
          <IconButton title="Desactivar usuario" onClick={deactivate}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton title="Reactivar usuario" onClick={activate}>
            <AddCircleOutlineIcon />
          </IconButton>
        )
      }
    </Stack>
  )
}

export default UserActions
