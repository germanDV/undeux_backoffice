import React, { useState } from 'react'
import { useFormik, FormikHelpers } from 'formik'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import LoginIcon from '@mui/icons-material/Login'
import Alert from '@mui/material/Alert'
import { loginValidationSchema, LoginValues } from 'lib/schemas'
import { useAuth } from 'lib/hooks/use-auth'
import { Container, FormWrapper, Form, Separator } from './Login.styles'

const Login = (): JSX.Element => {
  const [error, setError] = useState('')
  const { login } = useAuth()

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: (values: LoginValues, { setSubmitting }: FormikHelpers<LoginValues>) => {
      setError('')
      login(values.email, values.password)
        .catch(() => setError('Password y/o email incorrecto.'))
        .finally(() => setSubmitting(false))
    },
  });

  return (
    <Container>
      <FormWrapper elevation={3}>
        <Form onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center">
            Ingresar
          </Typography>
          <Separator times={2} />

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
          <Separator times={2} />

          <LoadingButton
            type="submit"
            endIcon={<LoginIcon />}
            loading={formik.isSubmitting}
            loadingPosition="end"
            variant="contained"
            color="primary"
            sx={{ height: 56 }}
          >
            Ingresar
          </LoadingButton>
          <Separator />

          {error && (
            <div>
              <Alert severity="error">{error}</Alert>
              <Separator />
            </div>
          )}

          <Typography variant="caption" align="center">
            Olvidaste tu contraseña o no tenés una cuenta?
          </Typography>
          <Typography variant="caption" align="center">
            Contactá a un administrador.
          </Typography>
        </Form>
      </FormWrapper>
    </Container>
  )
}

export default Login