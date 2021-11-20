import React, { ChangeEvent, useEffect } from 'react'
import { useFormik } from 'formik'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { registrationSchema, Registration, Roles } from 'lib/schemas'
import { useCreateUser } from 'lib/hooks/user'
import { tr } from 'lib/helpers'
import { Form, Separator } from 'ui/form.styles'

interface Props {
  open: boolean
  handleClose: () => void
  handleSuccess: (newUserId: number) => void
}

const NewUser = ({ open, handleClose, handleSuccess }: Props): JSX.Element => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useCreateUser()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      role: Roles.user,
    },
    validationSchema: registrationSchema,
    onSubmit: ({ name, email, password, role }: Registration) => {
      mutation.mutate({ name, email, password, role })
    },
  });

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const newId = mutation.data?.id || 0
  const { resetForm } = formik
  useEffect(() => {
    if (mutation.isSuccess) {
      handleSuccess(newId)
    }
    return () => resetForm()
  }, [mutation.isSuccess, newId, handleSuccess, resetForm])

  const handleRoleSwitch = (ev: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('role', ev.target.checked ? Roles.admin : Roles.user)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Crear Usuario</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Creación de nuevo usuario para acceder a la plataforma.
        </DialogContentText>
        <Form onSubmit={formik.handleSubmit}>
          <Separator />
          <TextField
            id="name"
            name="name"
            label="Nombre"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Separator />

          <TextField
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Separator />

          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Separator />

          <TextField
            id="passwordConfirmation"
            name="passwordConfirmation"
            label="Confirmación Password"
            type="password"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passwordConfirmation && !!formik.errors.passwordConfirmation}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
          />
          <Separator />

          <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
            <FormControlLabel
              label="Admin"
              control={(
                <Switch
                  color="secondary"
                  checked={formik.values.role === Roles.admin}
                  onChange={handleRoleSwitch}
                />
              )}
            />
          </FormGroup>
          <Separator times={2} />

          {mutation.isError && (
            <div>
              <Alert severity="error">
                {tr((mutation.error as Error).message)}
              </Alert>
              <Separator />
            </div>
          )}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={formik.submitForm}>Crear</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewUser
