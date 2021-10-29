import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { useChangeMyPassword } from 'lib/hooks/user'
import { myPasswordValidationSchema, MyPasswordValues } from 'lib/schemas'
import { Form, Separator } from 'ui/form.styles'
import { translateErr } from 'lib/helpers'

interface Props {
  open: boolean
  handleClose: () => void
  handleSuccess: () => void
}

const OtherUserChange = ({ open, handleClose, handleSuccess }: Props): JSX.Element => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useChangeMyPassword()

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', newPasswordConfirmation: '' },
    validationSchema: myPasswordValidationSchema,
    onSubmit: ({ oldPassword, newPassword }: MyPasswordValues) => {
      mutation.mutate({ oldPassword, newPassword })
    },
  });

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const { resetForm } = formik
  useEffect(() => {
    if (mutation.isSuccess) {
      handleSuccess()
    }
    return () => resetForm()
  }, [mutation.isSuccess, handleSuccess, resetForm])

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Cambiar Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Elegí una password segura y no repitas passwords anteriores.
        </DialogContentText>
        <Form onSubmit={formik.handleSubmit}>
          <Separator />
          <TextField
            id="oldPassword"
            name="oldPassword"
            label="Password actual"
            type="password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.oldPassword && !!formik.errors.oldPassword}
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <Separator />
          <TextField
            id="newPassword"
            name="newPassword"
            label="Nueva password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && !!formik.errors.newPassword}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <Separator />
          <TextField
            id="newPasswordConfirmation"
            name="newPasswordConfirmation"
            label="Confirmación de nueva password"
            type="password"
            value={formik.values.newPasswordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPasswordConfirmation && !!formik.errors.newPasswordConfirmation}
            helperText={formik.touched.newPasswordConfirmation && formik.errors.newPasswordConfirmation}
          />
          <Separator times={2} />
          {mutation.isError && (
            <div>
              <Alert severity="error">{translateErr(mutation.error as Error)}</Alert>
              <Separator />
            </div>
          )}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={formik.submitForm}>Cambiar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OtherUserChange
