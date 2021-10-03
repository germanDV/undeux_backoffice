import React, { FormEvent, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

const Login = (): JSX.Element => {
  const [status, setStatus] = useState('anonymous')

  const handleLogin = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const target = ev.target as EventTarget
      & {elements: {email: {value: string}; password: {value: string}}}

    const email = target.elements.email.value
    const password = target.elements.password.value

    try {
      const resp: AxiosResponse<{token: string}> = await axios.post('api/login', { email, password })
      setStatus(resp.data.token.substr(0, 8))
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  const handleForgot = () =>{
    alert('te dije que la anotes')
  }

  return (
    <form onSubmit={handleLogin} style={{ border: '1px solid black' }}>
      <h2>Login</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" placeholder="archu@undeux.construction" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" placeholder="****************" />
      </div>
      <button>Login</button>
      <br />
      <button onClick={handleForgot}>Recuperar password</button>
      <br />
      <p>Status: {status}</p>
    </form>
  )
}

export default Login
