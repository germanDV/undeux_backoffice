import React, { createRef, FC } from 'react'
import { SnackbarProvider, SnackbarKey } from 'notistack'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

const notistackRef = createRef<any>();

const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef.current.closeSnackbar(key);
}

const ToastProvider: FC = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      preventDuplicate
      ref={notistackRef}
      action={(key) => (
        <IconButton
          aria-label="delete"
          onClick={onClickDismiss(key)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
    )
}

export default ToastProvider
