import React, { useState, ChangeEvent } from 'react'
import { useFormik, FormikHelpers } from 'formik'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { registrationValidationSchema, RegistrationValues } from 'lib/schemas'
import { Roles } from 'lib/models'
import { Container, FormWrapper, Form, Separator } from 'ui/form.styles'

// TODO: make an API endpoint for this
const register = (payload: RegistrationValues) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(payload)
      resolve('OK')
    }, 1500)
  })
}

const NewUser = (): JSX.Element => {
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: { email: '', password: '', name: '', role: Roles.user },
    validationSchema: registrationValidationSchema,
    onSubmit: (values: RegistrationValues, { setSubmitting }: FormikHelpers<RegistrationValues>) => {
      setError('')
      const { name, email, password, role } = values

      register({ name, email, password, role })
        .catch(() => setError('Error creando usuario.'))
        .finally(() => setSubmitting(false))
    },
  });

  const handleRoleSwitch = (ev: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('role', ev.target.checked ? Roles.admin : Roles.user)
  }

  return (
    <Container>
      <FormWrapper elevation={3}>
        <Form onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center">
            Crear Usuario
          </Typography>
          <Separator times={2} />

          <TextField
            id="name"
            name="name"
            label="Nombre"
            value={formik.values.name}
            onChange={formik.handleChange}
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
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
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

          <LoadingButton
            type="submit"
            endIcon={<AddCircleIcon />}
            loading={formik.isSubmitting}
            loadingPosition="end"
            variant="contained"
            color="primary"
            sx={{ height: 56 }}
          >
            Crear
          </LoadingButton>
          <Separator />

          {error && (
            <div>
              <Alert severity="error">{error}</Alert>
              <Separator />
            </div>
          )}
        </Form>
      </FormWrapper>
    </Container>
  )
}

export default NewUser
