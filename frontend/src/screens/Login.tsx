import React from 'react'

interface Props {
  onLogin: () => void;
}

const Login = ({ onLogin }: Props): JSX.Element => {
  return (
    <div>
      <h1>Ingresar</h1>
      <button onClick={onLogin}>Log In</button>
    </div>
  )
}

export default Login
