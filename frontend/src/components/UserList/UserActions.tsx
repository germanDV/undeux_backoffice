import { useState } from 'react'
import { useSnackbar } from 'notistack'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import UpgradeIcon from '@mui/icons-material/Upgrade'
import PasswordIcon from '@mui/icons-material/Password'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import { useChangeUserStatus, useMakeAdmin } from 'lib/hooks/user'
import OtherUserChange from '../PasswordChange/OtherUserChange'

interface Props {
  userId: number
  email: string
  isAdmin: boolean
  active: boolean
}

const UserActions = ({ userId, email, isAdmin, active }: Props): JSX.Element | null => {
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const userStatusMutation = useChangeUserStatus()
  const makeAdminMutation = useMakeAdmin()

  const makeAdmin = () => {
    makeAdminMutation.mutate(userId)
  }

  const deactivate = () => {
    userStatusMutation.mutate({ userId, active: false })
  }

  const activate = () => {
    userStatusMutation.mutate({ userId, active: true })
  }

  const onPasswordChange = () => {
    setOpen(false)
    setTimeout(() => {
      enqueueSnackbar('Password actualizada.', {
        variant: 'success',
      })
    }, 500)
  }

  if (isAdmin) return null

  if (userStatusMutation.isError) {
    enqueueSnackbar(`Error actualizando usuario ${userId}`, {
      variant: 'error',
    })
  }

  if (makeAdminMutation.isError) {
    enqueueSnackbar('Error convirtiendo usuario a `admin`.', {
      variant: 'error',
    })
  }

  return (
    <Stack direction="row" spacing={.5}>
      <Tooltip title="Cambiar password" arrow>
        <IconButton onClick={() => setOpen(true)}>
          <PasswordIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Convertir en administrador" arrow>
        <IconButton onClick={makeAdmin}>
          {makeAdminMutation.isLoading
            ? <CircularProgress color="secondary" size={25} />
            : <UpgradeIcon />
          }
        </IconButton>
      </Tooltip>
      {active
        ? (
          <Tooltip title="Desactivar usuario" arrow>
            <IconButton onClick={deactivate}>
              {userStatusMutation.isLoading
                ? <CircularProgress color="secondary" size={25} />
                : <RemoveCircleOutlineIcon />
              }
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Reactivar usuario" arrow>
            <IconButton onClick={activate}>
              {userStatusMutation.isLoading
                ? <CircularProgress color="secondary" size={25} />
                : <AddCircleOutlineIcon />
              }
            </IconButton>
          </Tooltip>
        )
      }
      <OtherUserChange
        id={userId}
        email={email}
        open={open}
        handleClose={() => setOpen(false)}
        handleSuccess={onPasswordChange}
      />
    </Stack>
  )
}

export default UserActions
