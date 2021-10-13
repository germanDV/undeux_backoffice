import React, { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import LoginIcon from '@mui/icons-material/Login'
import { Container, FormWrapper, Form, Separator } from './Login.styles'

const Login = (): JSX.Element => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const handleLogin = (ev: FormEvent) => {
    ev.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      history.push('/')
    }, 2000)
  }

  return (
    <Container>
      <FormWrapper elevation={3}>
        <Form onSubmit={handleLogin}>
          <Typography variant="h4" align="center">
            Ingresar
          </Typography>
          <Separator times={2} />

          <TextField
            id="email"
            label="Email"
            error={true}
            helperText="Error message"
          />
          <Separator />

          <TextField
            id="password"
            label="Password"
            type="password"
          />
          <Separator times={2} />

          <LoadingButton
            type="submit"
            endIcon={<LoginIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            color="primary"
            sx={{ height: 56 }}
          >
            Ingresar
          </LoadingButton>
          <Separator />

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
