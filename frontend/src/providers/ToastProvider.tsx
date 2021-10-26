import React, { createRef, FC } from 'react'
import { SnackbarProvider, SnackbarKey } from 'notistack'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

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
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
    )
}

export default ToastProvider
