import React from 'react'
import { useFormik } from 'formik'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { useChangeUserPassword } from 'lib/hooks/user'
import { passwordChangeValidationSchema, PasswordChangeValues } from 'lib/schemas'

interface Props {
  id: number
  email: string
  open: boolean
  handleClose: () => void
  handleSuccess: () => void
}

const OtherUserChange = ({ id, email, open, handleClose, handleSuccess }: Props): JSX.Element => {
  const ref = React.useRef(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useChangeUserPassword()

  const formik = useFormik({
    initialValues: { password: '', passwordConfirmation: '' },
    validationSchema: passwordChangeValidationSchema,
    onSubmit: ({ password }: PasswordChangeValues) => {
      ref.current = true
      mutation.mutate({ password, id })
    },
  })

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  if (mutation.isSuccess && ref.current) {
    ref.current = false
    setTimeout(() => {
      handleSuccess()
    }, 300)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Cambiar Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Cambiar password de {email} (ID: {id})
        </DialogContentText>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            id="password"
            name="password"
            label="Nueva Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mt: 4 }}
          />
          <TextField
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="Confirmar Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passwordConfirmation && !!formik.errors.passwordConfirmation}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
            sx={{ mt: 2 }}
          />

          {mutation.isError && (
            <Box mt={2}>
              <Alert severity="error">
                Error cambiando password.
              </Alert>
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={formik.submitForm}>Cambiar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OtherUserChange
