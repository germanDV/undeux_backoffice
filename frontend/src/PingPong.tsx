import React, { useState } from 'react'
import axios from 'axios'

const PingPong = (): JSX.Element => {
  const [ret, setRet] = useState('Pending')

  const handlePing = async () => {
    try {
      const resp = await axios.get<string>('api/ping')
      setRet(resp.data)
    } catch (e) {
      console.error(e)
      setRet('Error')
    }
  }

  return (
    <div>
      <h2>Ping - {ret}</h2>
      <button onClick={handlePing}>ping server</button>
    </div>
  )
}

export default PingPong
