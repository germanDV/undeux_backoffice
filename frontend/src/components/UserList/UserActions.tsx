import React from 'react'
import { useChangeUserStatus, useMakeAdmin } from 'lib/hooks/user'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import PasswordIcon from '@mui/icons-material/Password'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CircularProgress from '@mui/material/CircularProgress'

interface Props {
  userId: number
  isAdmin: boolean
  active: boolean
}

const UserActions = ({ userId, isAdmin, active }: Props): JSX.Element | null => {
  const userStatusMutation = useChangeUserStatus()
  const makeAdminMutation = useMakeAdmin()

  const changePassword = () => {
    alert(`Mostrar formulario para cambiar password del usuario ${userId}`)
  }

  const makeAdmin = () => {
    makeAdminMutation.mutate(userId)
  }

  const deactivate = () => {
    userStatusMutation.mutate({ userId, active: false })
  }

  const activate = () => {
    userStatusMutation.mutate({ userId, active: true })
  }

  if (isAdmin) return null

  // TODO: show these in a notification
  if (userStatusMutation.isError) console.log(userStatusMutation.error)
  if (makeAdminMutation.isError) console.log(makeAdminMutation.error)

  return (
    <Stack direction="row" spacing={.5}>
      <IconButton title="Cambiar password" onClick={changePassword}>
        <PasswordIcon />
      </IconButton>
      <IconButton title="Hacer administrador" onClick={makeAdmin}>
        {makeAdminMutation.isLoading
          ? <CircularProgress color="secondary" size={25} />
          : <UpgradeIcon />
        }
      </IconButton>
      {active
        ? (
          <IconButton title="Desactivar usuario" onClick={deactivate}>
            {userStatusMutation.isLoading
              ? <CircularProgress color="secondary" size={25} />
              : <RemoveCircleOutlineIcon />
            }
          </IconButton>
        ) : (
          <IconButton title="Reactivar usuario" onClick={activate}>
            {userStatusMutation.isLoading
              ? <CircularProgress color="secondary" size={25} />
              : <AddCircleOutlineIcon />
            }
          </IconButton>
        )
      }
    </Stack>
  )
}

export default UserActions
